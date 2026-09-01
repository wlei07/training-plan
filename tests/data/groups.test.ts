import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { findExercise, findGroup, groups } from '../../src/data/groups'
import type { Exercise, Group } from '../../src/data/types'

describe('groups data', () => {
  it('registers the warm-up group first', () => {
    expect(groups.length).toBeGreaterThanOrEqual(1)
    expect(groups[0].id).toBe('warm-up')
    expect(groups[0].mediaDir).toBe('0-warm-up-and-postural-exercises')
  })

  it('lists the eight warm-up exercises in training order', () => {
    expect(groups[0].exercises.map((e: Exercise) => e.id)).toEqual([
      'knee-side-drops',
      'supine-straight-leg-circle',
      'bodyweight-glute-bridge',
      'scapular-retraction',
      'thoracic-extension',
      'elbow-thoracic-rotation',
      'prone-swimmer',
      'prone-w',
    ])
  })

  it('uses unique exercise ids within every group', () => {
    for (const group of groups) {
      const ids: string[] = group.exercises.map((e: Exercise) => e.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it('uses unique group ids', () => {
    const ids: string[] = groups.map((g: Group) => g.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('points every exercise at a video file that exists on disk', () => {
    for (const group of groups) {
      for (const exercise of group.exercises) {
        const path: string = join(
          process.cwd(),
          'public/media',
          group.mediaDir,
          exercise.video,
        )
        expect(existsSync(path), `missing video: ${path}`).toBe(true)
      }
    }
  })

  it('ships a poster image beside every exercise video', () => {
    // The poster is what the exercise page paints before playback: iOS decodes
    // no frame from preload alone, so without the image the player is black.
    for (const group of groups) {
      for (const exercise of group.exercises) {
        const path: string = join(
          process.cwd(),
          'public/media',
          group.mediaDir,
          exercise.video.replace(/\.mp4$/, '.jpg'),
        )
        expect(existsSync(path), `missing poster: ${path}`).toBe(true)
      }
    }
  })

  it('finds a group by id and returns undefined for an unknown id', () => {
    expect(findGroup('warm-up')?.id).toBe('warm-up')
    expect(findGroup('nope')).toBeUndefined()
  })

  it('finds an exercise within a group and returns undefined for an unknown id', () => {
    const group: Group = groups[0]
    expect(findExercise(group, 'prone-w')?.video).toBe('8-prone-w.mp4')
    expect(findExercise(group, 'nope')).toBeUndefined()
  })
})
