import { describe, expect, it } from 'vitest'
import { neighbours } from '../../src/lib/navigation'

interface Item {
  id: string
}

const items: readonly Item[] = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]

describe('neighbours', () => {
  it('returns null for an id that is not in the list', () => {
    expect(neighbours(items, 'zzz')).toBeNull()
  })

  it('has no previous at the start', () => {
    expect(neighbours(items, 'a')).toEqual({
      index: 0,
      previous: null,
      next: { id: 'b' },
    })
  })

  it('has both neighbours in the middle', () => {
    expect(neighbours(items, 'b')).toEqual({
      index: 1,
      previous: { id: 'a' },
      next: { id: 'c' },
    })
  })

  it('has no next at the end', () => {
    expect(neighbours(items, 'c')).toEqual({
      index: 2,
      previous: { id: 'b' },
      next: null,
    })
  })

  it('handles a single-item list', () => {
    expect(neighbours([{ id: 'only' }], 'only')).toEqual({
      index: 0,
      previous: null,
      next: null,
    })
  })

  it('handles an empty list', () => {
    expect(neighbours([], 'anything')).toBeNull()
  })
})
