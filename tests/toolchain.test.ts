import { describe, expect, it } from 'vitest'

describe('toolchain', () => {
  it('runs in a jsdom environment', () => {
    expect(typeof document).toBe('object')
    expect(document.createElement('div')).toBeInstanceOf(HTMLElement)
  })

  it('exposes import.meta.env.BASE_URL', () => {
    expect(typeof import.meta.env.BASE_URL).toBe('string')
  })
})
