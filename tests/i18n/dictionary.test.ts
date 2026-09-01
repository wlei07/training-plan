import { describe, expect, it } from 'vitest'
import { groups } from '../../src/data/groups'
import { en } from '../../src/i18n/en'
import { tr } from '../../src/i18n/tr'
import type { Exercise, Group } from '../../src/data/types'

function keyPaths(value: unknown, prefix: string = ''): string[] {
  if (typeof value !== 'object' || value === null) {
    return [prefix]
  }
  return Object.entries(value as Record<string, unknown>).flatMap(
    ([key, child]: [string, unknown]): string[] =>
      keyPaths(child, prefix ? `${prefix}.${key}` : key),
  )
}

describe('dictionaries', () => {
  it('gives Turkish exactly the same keys as English', () => {
    expect(keyPaths(tr).sort()).toEqual(keyPaths(en).sort())
  })

  it('covers every registered group', () => {
    for (const group of groups) {
      expect(Object.keys(en.groups)).toContain(group.id)
      expect(Object.keys(tr.groups)).toContain(group.id)
    }
  })

  it('covers every registered exercise in both languages', () => {
    for (const group of groups as Group[]) {
      const enGroup = en.groups[group.id as keyof typeof en.groups]
      const trGroup = tr.groups[group.id as keyof typeof tr.groups]
      for (const exercise of group.exercises as Exercise[]) {
        expect(
          Object.keys(enGroup.exercises),
          `en missing ${group.id}/${exercise.id}`,
        ).toContain(exercise.id)
        expect(
          Object.keys(trGroup.exercises),
          `tr missing ${group.id}/${exercise.id}`,
        ).toContain(exercise.id)
      }
    }
  })

  it('has no group or exercise text that is not backed by real data', () => {
    const groupIds: string[] = groups.map((g: Group) => g.id)
    expect(Object.keys(en.groups).sort()).toEqual([...groupIds].sort())
    for (const group of groups as Group[]) {
      const exerciseIds: string[] = group.exercises.map((e: Exercise) => e.id)
      const textIds: string[] = Object.keys(
        en.groups[group.id as keyof typeof en.groups].exercises,
      )
      expect(textIds.sort()).toEqual([...exerciseIds].sort())
    }
  })

  it('actually translates the reps, not just copies them', () => {
    expect(en.groups['warm-up'].exercises['knee-side-drops'].reps).toBe('20 reps')
    expect(tr.groups['warm-up'].exercises['knee-side-drops'].reps).toBe(
      '20 tekrar',
    )
  })

  it('translates the UI chrome', () => {
    expect(en.ui.appTitle).toBe('TRAINING PLAN')
    expect(tr.ui.appTitle).toBe('ANTRENMAN PLANI')
    expect(en.ui.repsLabel).not.toBe(tr.ui.repsLabel)
  })

  it('formats counted strings in both languages', () => {
    expect(en.ui.exerciseCount(8)).toBe('8 exercises')
    expect(tr.ui.exerciseCount(8)).toBe('8 egzersiz')
  })
})
