import { describe, expect, it } from 'vitest'
import { en } from '../../src/i18n/en'
import { exerciseText, groupText, type GroupText } from '../../src/i18n/lookup'
import type { ExerciseText } from '../../src/i18n/en'

describe('dictionary lookup', () => {
  it('reads a known group', () => {
    const text: GroupText | undefined = groupText(en, 'warm-up')
    expect(text?.title).toBe('WARM-UP & POSTURAL EXERCISES')
    expect(text?.subtitle).toBe('Do these before every session.')
  })

  it('returns undefined for an unknown group id', () => {
    expect(groupText(en, 'no-such-group')).toBeUndefined()
  })

  it('reads a known exercise', () => {
    const text: ExerciseText | undefined = exerciseText(
      en,
      'warm-up',
      'knee-side-drops',
    )
    expect(text?.name).toBe('KNEE SIDE DROPS')
    expect(text?.reps).toBe('20 reps')
  })

  it('returns undefined for an unknown exercise in a known group', () => {
    expect(exerciseText(en, 'warm-up', 'no-such-exercise')).toBeUndefined()
  })

  it('returns undefined, without throwing, for an unknown group id', () => {
    expect(() => exerciseText(en, 'no-such-group', 'knee-side-drops')).not.toThrow()
    expect(exerciseText(en, 'no-such-group', 'knee-side-drops')).toBeUndefined()
  })
})
