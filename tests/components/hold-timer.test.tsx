import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { HoldTimer, type HoldTimerLabels } from '../../src/components/HoldTimer'
import type { Beeper } from '../../src/lib/beep'

const labels: HoldTimerLabels = {
  title: 'HOLD TIMER',
  start: 'START',
  pause: 'PAUSE',
  reset: 'RESET',
  add: 'ADD 10 SECONDS',
  subtract: 'SUBTRACT 10 SECONDS',
}

function fakeBeeper(): Beeper & { plays: number; primes: number } {
  return {
    plays: 0,
    primes: 0,
    prime(): void {
      this.primes += 1
    },
    play(): void {
      this.plays += 1
    },
  }
}

function remaining(): string {
  return screen.getByTestId('hold-timer-remaining').textContent ?? ''
}

/** Drives the countdown's interval without waiting in real time. */
function tick(ms: number): void {
  act((): void => {
    vi.advanceTimersByTime(ms)
  })
}

function press(name: string): void {
  fireEvent.click(screen.getByRole('button', { name }))
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('hold timer', () => {
  it('starts at the exercise hold time', () => {
    render(<HoldTimer seconds={30} labels={labels} />)
    expect(remaining()).toBe('0:30')
  })

  it('counts down once started', () => {
    render(<HoldTimer seconds={30} labels={labels} />)

    press('START')
    tick(3000)

    expect(remaining()).toBe('0:27')
  })

  it('holds the clock still until started', () => {
    render(<HoldTimer seconds={30} labels={labels} />)

    tick(5000)

    expect(remaining()).toBe('0:30')
  })

  it('freezes the clock when paused', () => {
    render(<HoldTimer seconds={30} labels={labels} />)

    press('START')
    tick(4000)
    press('PAUSE')
    tick(10000)

    expect(remaining()).toBe('0:26')
  })

  it('restores the hold time on reset', () => {
    render(<HoldTimer seconds={30} labels={labels} />)

    press('START')
    tick(8000)
    press('RESET')

    expect(remaining()).toBe('0:30')
    expect(screen.getByRole('button', { name: 'START' })).toBeInTheDocument()
  })

  it('beeps once when the countdown reaches zero', () => {
    const beeper = fakeBeeper()
    render(<HoldTimer seconds={30} labels={labels} beeper={beeper} />)

    press('START')
    tick(29000)
    expect(beeper.plays).toBe(0)

    tick(1000)
    expect(remaining()).toBe('0:00')
    expect(beeper.plays).toBe(1)
  })

  it('stops itself at zero rather than running negative', () => {
    const beeper = fakeBeeper()
    render(<HoldTimer seconds={30} labels={labels} beeper={beeper} />)

    press('START')
    tick(60000)

    expect(remaining()).toBe('0:00')
    expect(beeper.plays).toBe(1)
    expect(screen.getByRole('button', { name: 'START' })).toBeInTheDocument()
  })

  it('opens the audio context on the start tap', () => {
    // iOS plays nothing from a context opened outside a user gesture, and the
    // gesture is long gone by the time the countdown ends.
    const beeper = fakeBeeper()
    render(<HoldTimer seconds={30} labels={labels} beeper={beeper} />)

    press('START')

    expect(beeper.primes).toBe(1)
  })

  it('restarts from the hold time after finishing', () => {
    render(<HoldTimer seconds={30} labels={labels} />)

    press('START')
    tick(30000)
    press('START')
    tick(2000)

    expect(remaining()).toBe('0:28')
  })

  it('adjusts the hold time in ten-second steps while stopped', () => {
    render(<HoldTimer seconds={30} labels={labels} />)

    press('ADD 10 SECONDS')
    expect(remaining()).toBe('0:40')

    press('SUBTRACT 10 SECONDS')
    press('SUBTRACT 10 SECONDS')
    expect(remaining()).toBe('0:20')
  })

  it('counts down from an adjusted hold time', () => {
    render(<HoldTimer seconds={30} labels={labels} />)

    press('ADD 10 SECONDS')
    press('START')
    tick(5000)

    expect(remaining()).toBe('0:35')
  })

  it('resets to the adjusted hold time, not the exercise default', () => {
    render(<HoldTimer seconds={30} labels={labels} />)

    press('ADD 10 SECONDS')
    press('START')
    tick(5000)
    press('RESET')

    expect(remaining()).toBe('0:40')
  })

  it('refuses to drop below ten seconds', () => {
    render(<HoldTimer seconds={30} labels={labels} />)

    const down: HTMLElement = screen.getByRole('button', {
      name: 'SUBTRACT 10 SECONDS',
    })
    fireEvent.click(down)
    fireEvent.click(down)
    fireEvent.click(down)
    fireEvent.click(down)

    expect(remaining()).toBe('0:10')
    expect(down).toBeDisabled()
  })

  it('refuses to climb past three minutes', () => {
    render(<HoldTimer seconds={30} labels={labels} />)

    const up: HTMLElement = screen.getByRole('button', {
      name: 'ADD 10 SECONDS',
    })
    for (let click: number = 0; click < 20; click += 1) {
      fireEvent.click(up)
    }

    expect(remaining()).toBe('3:00')
    expect(up).toBeDisabled()
  })

  it('locks the adjustment buttons while running', () => {
    render(<HoldTimer seconds={30} labels={labels} />)

    press('START')

    expect(screen.getByRole('button', { name: 'ADD 10 SECONDS' })).toBeDisabled()
    expect(
      screen.getByRole('button', { name: 'SUBTRACT 10 SECONDS' }),
    ).toBeDisabled()
  })

  it('pads seconds under ten so the display never jumps width', () => {
    render(<HoldTimer seconds={30} labels={labels} />)

    press('START')
    tick(25000)

    expect(remaining()).toBe('0:05')
  })
})
