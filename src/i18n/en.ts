export interface ExerciseText {
  /** Movement name. Kept in its common gym form, which is English even in Turkish. */
  name: string
  /** Prescribed volume, e.g. '20 reps' or '15 right / 15 left'. */
  reps: string
  /** Hold time, e.g. '30 seconds'. Used by the stretching groups, which
   * prescribe a duration instead of (or alongside) a set count. */
  duration?: string
  /** Set count, used by the workout groups. */
  sets?: string
  /** Rest between sets, used by the workout groups. */
  rest?: string
  /** Tempo / rest-pause / drop-set explanation, used by the workout groups. */
  note?: string
}

/**
 * Keeps the exercise KEYS literal (so tr.ts must match them exactly) while
 * typing the VALUES as ExerciseText (so the optional sets/rest/note fields are
 * accessible on every exercise, not just the ones that populate them).
 *
 * Without this, `Dictionary = typeof en` would infer group 0's exercises as
 * `{ name: string; reps: string }` and ExercisePage's `text.sets` would not
 * compile.
 */
function defineExercises<K extends string>(
  map: Record<K, ExerciseText>,
): Record<K, ExerciseText> {
  return map
}

export const en = {
  ui: {
    appTitle: 'TRAINING PLAN',
    tagline: 'Personal training programme',
    groupsHeading: 'GROUPS',
    exercisesHeading: 'EXERCISES',
    allGroups: 'ALL GROUPS',
    backToGroup: 'BACK TO GROUP',
    home: 'HOME',
    previous: 'PREVIOUS',
    next: 'NEXT',
    repsLabel: 'REPS',
    durationLabel: 'DURATION',
    setsLabel: 'SETS',
    restLabel: 'REST',
    noteLabel: 'NOTE',
    languageLabel: 'Language',
    notFoundTitle: 'NOT FOUND',
    notFoundBody: 'That page does not exist.',
    videoUnsupported: 'Your browser cannot play this video.',
    exerciseCount: (count: number): string => `${count} exercises`,
    exercisePosition: (index: number, total: number): string =>
      `${index} / ${total}`,
  },
  groups: {
    'warm-up': {
      title: 'WARM-UP & POSTURAL EXERCISES',
      subtitle: 'Do these before every session.',
      exercises: defineExercises({
        'knee-side-drops': {
          name: 'KNEE SIDE DROPS',
          reps: '20 reps',
        },
        'supine-straight-leg-circle': {
          name: 'SUPINE STRAIGHT LEG CIRCLE',
          reps: '15 right / 15 left',
        },
        'bodyweight-glute-bridge': {
          name: 'BODYWEIGHT GLUTE BRIDGE',
          reps: '15 reps, 2 sets',
        },
        'scapular-retraction': {
          name: 'SCAPULAR RETRACTION',
          reps: '15 reps',
        },
        'thoracic-extension': {
          name: 'THORACIC EXTENSION',
          reps: '10 reps, 2 sets',
        },
        'elbow-thoracic-rotation': {
          name: 'ELBOW THORACIC ROTATION',
          reps: '10 right / 10 left, 2 sets each',
        },
        'prone-swimmer': {
          name: 'PRONE SWIMMER',
          reps: '10 reps, 2 sets',
        },
        'prone-w': {
          name: 'PRONE W',
          reps: '15 reps, 2 sets',
        },
      }),
    },
  },
}

/**
 * The dictionary contract, derived from English.
 *
 * Because this is `typeof en` rather than a hand-written interface, adding a
 * group or exercise to en.ts makes tr.ts a type error until it is translated.
 */
export type Dictionary = typeof en
