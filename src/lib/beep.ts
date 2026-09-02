const TONE_HZ: number = 880
const TONE_SECONDS: number = 0.15
const GAP_SECONDS: number = 0.1
const TONE_COUNT: number = 3
const PEAK_GAIN: number = 0.2

type AudioContextCtor = new () => AudioContext

export interface Beeper {
  /**
   * Opens the audio context while a user gesture is still on the stack. iOS
   * hands back a context that plays nothing until a gesture resumes it, and the
   * gesture is long gone by the time a countdown reaches zero.
   */
  prime(): void
  /** Sounds the end-of-countdown signal. */
  play(): void
}

function audioContextCtor(): AudioContextCtor | undefined {
  // Older WebKit only exposes the prefixed constructor.
  const scope: typeof window & { webkitAudioContext?: AudioContextCtor } = window
  return scope.AudioContext ?? scope.webkitAudioContext
}

/**
 * A three-tone chime built from oscillators, so there is no audio file to ship
 * and nothing to fetch before it can sound. Where Web Audio is missing the
 * beeper degrades to silence rather than throwing — the countdown itself still
 * works.
 */
export function createBeeper(): Beeper {
  let context: AudioContext | null = null

  function open(): AudioContext | null {
    if (!context) {
      const Ctor: AudioContextCtor | undefined = audioContextCtor()
      if (!Ctor) {
        return null
      }
      context = new Ctor()
    }
    if (context.state === 'suspended') {
      void context.resume()
    }
    return context
  }

  return {
    prime(): void {
      open()
    },

    play(): void {
      const audio: AudioContext | null = open()
      if (!audio) {
        return
      }
      for (let index: number = 0; index < TONE_COUNT; index += 1) {
        const startAt: number =
          audio.currentTime + index * (TONE_SECONDS + GAP_SECONDS)
        const gain: GainNode = audio.createGain()
        gain.gain.setValueAtTime(PEAK_GAIN, startAt)
        gain.connect(audio.destination)

        const tone: OscillatorNode = audio.createOscillator()
        tone.type = 'sine'
        tone.frequency.setValueAtTime(TONE_HZ, startAt)
        tone.connect(gain)
        tone.start(startAt)
        tone.stop(startAt + TONE_SECONDS)
      }
    },
  }
}
