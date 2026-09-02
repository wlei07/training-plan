import type { Exercise, Group } from './types'

/**
 * Registered groups, in display order.
 *
 * Adding a group is three files: append a Group here, then add its text block
 * to BOTH src/i18n/en.ts and src/i18n/tr.ts. The compiler enforces en -> tr
 * parity; a group added here but missing from en.ts is caught by
 * tests/i18n/dictionary.test.ts, and a wrong video filename by
 * tests/data/groups.test.ts.
 *
 * `label` carries the author's own group numbering (0, 1a, 1b, 2a, 2b, 3a, 3b),
 * which pairs each workout with its post-workout stretching routine:
 * 1a -> 2a, 1b -> 2b, 3a -> 3b. `order` is the sort key.
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
  {
    id: 'upper-push',
    order: 1,
    label: '1a',
    mediaDir: '1a-upper-body-push-workout',
    exercises: [
      { id: 'flat-bench-barbell-press', video: '1-flat-bench-barbell-press.mp4' },
      { id: 'standing-military-press', video: '2-standing-military-press.mp4' },
      { id: 'incline-bench-dumbbell-fly', video: '3-incline-bench-dumbbell-fly.mp4' },
      {
        id: 'incline-bench-one-arm-lateral-raise',
        video: '4-incline-bench-one-arm-lateral-raise.mp4',
      },
      { id: 'barbell-skull-crushers', video: '5-barbell-skull-crushers.mp4' },
      { id: 'single-arm-rope-pushdown', video: '6-single-arm-rope-pushdown.mp4' },
    ],
  },
  {
    id: 'upper-pull',
    order: 2,
    label: '1b',
    mediaDir: '1b-upper-body-pull-workout',
    exercises: [
      { id: 'one-arm-dumbbell-row', video: '1-one-arm-dumbbell-row.mp4' },
      {
        id: 'incline-bench-barbell-high-row',
        video: '2-incline-bench-barbell-high-row.mp4',
      },
      { id: 'barbell-pullover-for-lats', video: '3-barbell-pullover-for-lats.mp4' },
      { id: 'bent-over-reverse-fly', video: '4-bent-over-reverse-fly.mp4' },
      { id: 'concentration-curl', video: '5-concentration-curl.mp4' },
      { id: 'incline-bench-hammer-curl', video: '6-incline-bench-hammer-curl.mp4' },
    ],
  },
  {
    id: 'upper-push-stretch',
    order: 3,
    label: '2a',
    mediaDir: '2a-upper-body-push-workout-stretching',
    exercises: [
      {
        id: 'knee-hug-stretch',
        video: '1-knee-hug-stretch.mp4',
        holdSeconds: 30,
      },
      {
        id: 'standing-wall-chest-stretch',
        video: '2-standing-wall-chest-stretch.mp4',
        holdSeconds: 30,
      },
      {
        id: 'kneeling-minor-chest-stretch',
        video: '3-kneeling-minor-chest-stretch.mp4',
        holdSeconds: 30,
      },
      {
        id: 'standing-both-arm-shoulder-stretch',
        video: '4-standing-both-arm-shoulder-stretch.mp4',
        holdSeconds: 30,
      },
      {
        id: 'standing-one-arm-shoulder-stretch',
        video: '5-standing-one-arm-shoulder-stretch.mp4',
        holdSeconds: 30,
      },
      {
        id: 'wall-thoracic-extension-stretch',
        video: '6-wall-thoracic-extension-stretch.mp4',
        holdSeconds: 30,
      },
      {
        id: 'wall-triceps-stretch',
        video: '7-wall-triceps-stretch.mp4',
        holdSeconds: 30,
      },
      {
        id: 'cobra-pose',
        video: '8-cobra-pose.mp4',
        holdSeconds: 30,
      },
    ],
  },
  {
    id: 'upper-pull-stretch',
    order: 4,
    label: '2b',
    mediaDir: '2b-upper-body-pull-workout-stretching',
    exercises: [
      {
        id: 'knee-hug-stretch',
        video: '1-knee-hug-stretch.mp4',
        holdSeconds: 30,
      },
      {
        id: 'kneeling-lat-stretch',
        video: '2-kneeling-lat-stretch.mp4',
        holdSeconds: 30,
      },
      {
        id: 'cat-pose-stretch',
        video: '3-cat-pose-stretch.mp4',
        holdSeconds: 30,
      },
      {
        id: 'thread-the-needle-stretch',
        video: '4-thread-the-needle-stretch.mp4',
        holdSeconds: 30,
      },
      {
        id: 'wall-thoracic-extension-stretch',
        video: '5-wall-thoracic-extension-stretch.mp4',
        holdSeconds: 30,
      },
      {
        id: 'standing-wall-biceps-stretch',
        video: '6-standing-wall-biceps-stretch.mp4',
        holdSeconds: 30,
      },
      {
        id: 'kneeling-biceps-stretch',
        video: '7-kneeling-biceps-stretch.mp4',
        holdSeconds: 30,
      },
      {
        id: 'cobra-pose',
        video: '8-cobra-pose.mp4',
        holdSeconds: 30,
      },
    ],
  },
  {
    id: 'lower-body',
    order: 5,
    label: '3a',
    mediaDir: '3a-lower-body-workout',
    exercises: [
      { id: 'barbell-hip-thrust', video: '1-barbell-hip-thrust.mp4' },
      {
        id: 'smith-machine-bulgarian-squat',
        video: '2-smith-machine-bulgarian-squat.mp4',
      },
      { id: 'dumbbell-walking-lunge', video: '3-dumbbell-walking-lunge.mp4' },
      { id: 'leg-curl-single-leg', video: '4-leg-curl-single-leg.mp4' },
      { id: 'smith-machine-calf-raise', video: '5-smith-machine-calf-raise.mp4' },
    ],
  },
  {
    id: 'lower-body-stretch',
    order: 6,
    label: '3b',
    mediaDir: '3b-lower-body-stretching',
    exercises: [
      {
        id: 'childs-pose',
        video: '1-childs-pose.mp4',
        holdSeconds: 30,
      },
      {
        id: 'cobra-pose',
        video: '2-cobra-pose.mp4',
        holdSeconds: 30,
      },
      {
        id: '90-90-hip-flexor-stretch',
        video: '3-90-90-hip-flexor-stretch.mp4',
        holdSeconds: 30,
      },
      {
        id: 'pigeon-pose',
        video: '4-pigeon-pose.mp4',
        holdSeconds: 30,
      },
      {
        id: 'figure-4-stretch',
        video: '5-figure-4-stretch.mp4',
        holdSeconds: 30,
      },
      {
        id: 'supine-hamstring-stretch',
        video: '6-supine-hamstring-stretch.mp4',
        holdSeconds: 30,
      },
      {
        id: 'side-lying-quad-stretch',
        video: '7-side-lying-quad-stretch.mp4',
        holdSeconds: 30,
      },
      {
        id: 'wall-calf-stretch',
        video: '8-wall-calf-stretch.mp4',
        holdSeconds: 30,
      },
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
