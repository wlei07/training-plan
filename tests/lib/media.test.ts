import { describe, expect, it } from 'vitest'
import { groups } from '../../src/data/groups'
import { mediaUrl } from '../../src/lib/media'
import type { Exercise, Group } from '../../src/data/types'

describe('mediaUrl', () => {
  it('composes a URL from the base path, group media dir, and filename', () => {
    const group: Group = groups[0]
    const exercise: Exercise = group.exercises[0]
    expect(mediaUrl(group, exercise)).toBe(
      `${import.meta.env.BASE_URL}media/0-warm-up-and-postural-exercises/1-knee-side-drops.mp4`,
    )
  })

  it('never produces a double slash', () => {
    for (const group of groups) {
      for (const exercise of group.exercises) {
        expect(mediaUrl(group, exercise)).not.toMatch(/[^:]\/\//)
      }
    }
  })
})
