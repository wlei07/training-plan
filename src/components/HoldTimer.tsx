import { useEffect, useRef, useState } from 'react'
import { createBeeper, type Beeper } from '../lib/beep'
import styles from './HoldTimer.module.css'

export interface HoldTimerLabels {
  title: string
  start: string
  pause: string
  reset: string
  /** Accessible name for the +10s button. */
  add: string
  /** Accessible name for the -10s button. */
  subtract: string
}

interface HoldTimerProps {
  /** Starting value, from the exercise's prescribed hold time. */
  seconds: number
  labels: HoldTimerLabels
  /** Injection seam for tests; production uses a Web Audio beeper. */
  beeper?: Beeper
}

const STEP_SECONDS: number = 10
const MIN_SECONDS: number = 10
const MAX_SECONDS: number = 180

function clock(seconds: number): string {
  const minutes: number = Math.floor(seconds / 60)
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`
}

/**
 * Countdown for a held stretch. The exercise's prescribed hold time is the
 * starting value; +/-10s adjusts it for anyone who wants a longer or shorter
 * hold, and the adjusted value — not the prescription — is what RESET returns
 * to. A stretch prescribed "each side" is one run of the timer per side.
 */
export function HoldTimer({ seconds, labels, beeper }: HoldTimerProps) {
  const [target, setTarget] = useState<number>(seconds)
  const [remaining, setRemaining] = useState<number>(seconds)
  const [running, setRunning] = useState<boolean>(false)

  // One beeper per mounted timer, built lazily so the AudioContext is only
  // constructed where the component is actually used.
  const owned = useRef<Beeper | null>(null)
  if (!beeper && !owned.current) {
    owned.current = createBeeper()
  }
  const sound: Beeper = beeper ?? (owned.current as Beeper)

  useEffect((): (() => void) | void => {
    if (!running) {
      return
    }
    const id: number = window.setInterval((): void => {
      setRemaining((left: number): number => (left > 0 ? left - 1 : 0))
    }, 1000)
    return (): void => window.clearInterval(id)
  }, [running])

  useEffect((): void => {
    if (running && remaining === 0) {
      setRunning(false)
      sound.play()
    }
  }, [running, remaining, sound])

  function toggle(): void {
    if (running) {
      setRunning(false)
      return
    }
    // The tap itself is the gesture iOS requires before any audio can play.
    sound.prime()
    if (remaining === 0) {
      setRemaining(target)
    }
    setRunning(true)
  }

  function reset(): void {
    setRunning(false)
    setRemaining(target)
  }

  function adjust(delta: number): void {
    const next: number = Math.min(
      MAX_SECONDS,
      Math.max(MIN_SECONDS, target + delta),
    )
    setTarget(next)
    setRemaining(next)
  }

  return (
    <section className={styles.timer} data-testid="hold-timer">
      <p className={styles.title}>{labels.title}</p>
      <p className={styles.remaining} role="timer" data-testid="hold-timer-remaining">
        {clock(remaining)}
      </p>
      <div className={styles.controls}>
        <button type="button" className={styles.primary} onClick={toggle}>
          {running ? labels.pause : labels.start}
        </button>
        <button type="button" className={styles.secondary} onClick={reset}>
          {labels.reset}
        </button>
        <button
          type="button"
          className={styles.step}
          aria-label={labels.subtract}
          disabled={running || target <= MIN_SECONDS}
          onClick={(): void => adjust(-STEP_SECONDS)}
        >
          &minus;10
        </button>
        <button
          type="button"
          className={styles.step}
          aria-label={labels.add}
          disabled={running || target >= MAX_SECONDS}
          onClick={(): void => adjust(STEP_SECONDS)}
        >
          +10
        </button>
      </div>
    </section>
  )
}
