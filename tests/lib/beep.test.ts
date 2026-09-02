import { afterEach, describe, expect, it, vi } from 'vitest'
import { createBeeper, type Beeper } from '../../src/lib/beep'

interface StartedTone {
  frequency: number
  start: number
  stop: number
}

/**
 * jsdom implements no Web Audio at all, so the real AudioContext cannot be
 * exercised here. This stand-in records what the module asked the audio
 * hardware to do, which is the behaviour worth asserting: how many tones, at
 * what pitch, and spaced how far apart.
 */
class FakeAudioContext {
  static instances: FakeAudioContext[] = []

  currentTime: number = 0
  state: string = 'suspended'
  resumed: number = 0
  tones: StartedTone[] = []
  destination: object = { id: 'destination' }

  constructor() {
    FakeAudioContext.instances.push(this)
  }

  resume(): Promise<void> {
    this.state = 'running'
    this.resumed += 1
    return Promise.resolve()
  }

  createGain(): object {
    return {
      connect: (): void => {},
      gain: { setValueAtTime: (): void => {} },
    }
  }

  createOscillator(): object {
    const tone: StartedTone = { frequency: 0, start: 0, stop: 0 }
    return {
      type: '',
      frequency: {
        setValueAtTime: (value: number): void => {
          tone.frequency = value
        },
      },
      connect: (): void => {},
      start: (at: number): void => {
        tone.start = at
        this.tones.push(tone)
      },
      stop: (at: number): void => {
        tone.stop = at
      },
    }
  }
}

function installFakeAudio(): void {
  FakeAudioContext.instances = []
  vi.stubGlobal('AudioContext', FakeAudioContext)
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('beep', () => {
  it('plays three short tones', () => {
    installFakeAudio()

    createBeeper().play()

    const context: FakeAudioContext = FakeAudioContext.instances[0]
    expect(context.tones).toHaveLength(3)
    for (const tone of context.tones) {
      expect(tone.frequency).toBe(880)
      expect(tone.stop - tone.start).toBeCloseTo(0.15)
    }
  })

  it('spaces the tones apart instead of stacking them', () => {
    installFakeAudio()

    createBeeper().play()

    const starts: number[] = FakeAudioContext.instances[0].tones.map(
      (tone: StartedTone) => tone.start,
    )
    expect(starts[1]).toBeGreaterThan(starts[0])
    expect(starts[2]).toBeGreaterThan(starts[1])
  })

  it('reuses one audio context across beeps', () => {
    installFakeAudio()

    const beeper: Beeper = createBeeper()
    beeper.prime()
    beeper.play()
    beeper.play()

    expect(FakeAudioContext.instances).toHaveLength(1)
  })

  it('resumes a context the browser left suspended', () => {
    // Safari hands back a suspended context until a user gesture resumes it,
    // and a suspended context plays nothing.
    installFakeAudio()

    createBeeper().prime()

    expect(FakeAudioContext.instances[0].state).toBe('running')
  })

  it('stays silent instead of throwing where Web Audio is missing', () => {
    vi.stubGlobal('AudioContext', undefined)

    const beeper: Beeper = createBeeper()

    expect(() => {
      beeper.prime()
      beeper.play()
    }).not.toThrow()
  })
})
