import type { Exercise, Group } from './types'

/**
 * Registered groups, in display order.
 *
 * Adding a group is three files: append a Group here, then add its text block
 * to BOTH src/i18n/en.ts and src/i18n/tr.ts. The compiler enforces en -> tr
 * parity only; a group registered here but missing from en.ts is caught by
 * tests/i18n/dictionary.test.ts, not by tsc.
 * Media for six further groups is already on disk under public/media/.
 */
export const groups: readonly Group[] = [
  {
    id: 'warm-up',
    order: 0,
    label: '0',
    mediaDir: '0-warm-up-and-postural-exercises',
    exercises: [
      { id: 'knee-side-drops', video: '1-knee-side-drops.mp4' },
      { id: 'supine-straight-leg-circle', video: '2-supine-straight-leg-circle.mp4' },
      { id: 'bodyweight-glute-bridge', video: '3-bodyweight-glute-bridge.mp4' },
      { id: 'scapular-retraction', video: '4-scapular-retraction.mp4' },
      { id: 'thoracic-extension', video: '5-thoracic-extension.mp4' },
      { id: 'elbow-thoracic-rotation', video: '6-elbow-thoracic-rotation.mp4' },
      { id: 'prone-swimmer', video: '7-prone-swimmer.mp4' },
      { id: 'prone-w', video: '8-prone-w.mp4' },
    ],
  },
]

export function findGroup(id: string): Group | undefined {
  return groups.find((group: Group): boolean => group.id === id)
}

export function findExercise(
  group: Group,
  exerciseId: string,
): Exercise | undefined {
  return group.exercises.find(
    (exercise: Exercise): boolean => exercise.id === exerciseId,
  )
}
