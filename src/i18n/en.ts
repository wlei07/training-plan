export interface ExerciseText {
  /** Movement name. Kept in its common gym form, which is English even in Turkish. */
  name: string
  /**
   * Prescribed repetitions, e.g. '20 reps' or '15 right / 15 left'.
   *
   * A held stretch is one repetition, so the stretching groups carry '1' here
   * and put the hold time in `duration`.
   */
  reps: string
  /** Hold time, e.g. '30 seconds'. Used by the stretching groups. */
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
 * typing the VALUES as ExerciseText (so the optional duration/sets/rest/note
 * fields are accessible on every exercise, not just the ones that populate
 * them).
 *
 * Without this, `Dictionary = typeof en` would infer a group's exercises as
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
    'upper-push': {
      title: 'UPPER BODY PUSH WORKOUT',
      subtitle: 'Chest, shoulders and triceps.',
      exercises: defineExercises({
        'flat-bench-barbell-press': {
          name: 'FLAT BENCH BARBELL PRESS',
          reps: '6 reps',
          sets: '3 sets (last set rest/pause system)',
          rest: '75–90 sec.',
          note: 'Rest/Pause System: On the last set, perform 6 reps, rest for 10–12 seconds, push for 3–4 more reps with the same weight, rest for another 15 seconds, push for 2–3 more reps with the same weight, and finish the set.',
        },
        'standing-military-press': {
          name: 'STANDING MILITARY PRESS',
          reps: '8 reps',
          sets: '3 sets',
          rest: '60–75 sec.',
          note: 'Tempo = 3/2/1/2: Lower the bar to chin level over 3 seconds, pause at chin level for 2 seconds, press up controlled yet explosively in 1 second, hold overhead for 2 seconds, and repeat.',
        },
        'incline-bench-dumbbell-fly': {
          name: 'INCLINE BENCH DUMBBELL FLY',
          reps: '8–10 rep range',
          sets: '3 sets',
          rest: '60–75 sec.',
          note: 'Tempo = 2/3/1/2: Lower/open the dumbbells to the sides over 2 seconds, hold for 3 seconds at the peak chest stretch, close in a controlled 1 second, and squeeze your chest muscles hard for 2 seconds at the top.',
        },
        'incline-bench-one-arm-lateral-raise': {
          name: 'INCLINE BENCH ONE ARM LATERAL RAISE',
          reps: '10–12 rep range',
          sets: '3 sets per arm',
          rest: '45–60 sec.',
        },
        'barbell-skull-crushers': {
          name: 'BARBELL SKULL CRUSHERS',
          reps: '8 reps',
          sets: '3 sets (last set rest/pause system)',
          rest: '60–75 sec.',
          note: 'Rest/Pause System: the same system as the bench press.',
        },
        'single-arm-rope-pushdown': {
          name: 'SINGLE ARM ROPE PUSHDOWN',
          reps: '8 reps',
          sets: '3 sets (last set 8-10-12 drop set)',
          rest: '60–75 sec.',
          note: '8-10-12 Drop Set: On the last set, complete 8 reps, reduce the weight by 30–35% and push for 10 more reps, then reduce the weight by another 30–35% and push for 12 more reps before switching to the other arm.',
        },
      }),
    },
    'upper-pull': {
      title: 'UPPER BODY PULL WORKOUT',
      subtitle: 'Back and biceps.',
      exercises: defineExercises({
        'one-arm-dumbbell-row': {
          name: 'ONE ARM DUMBBELL ROW',
          reps: '6 reps',
          sets: '3 sets (last set rest/pause system)',
          rest: '75–90 sec.',
          note: 'Rest/Pause System: On the last set, after 6 reps put the dumbbell down, rest for 10–12 seconds, then push for 3–4 more reps with the same dumbbell, put it down once more, rest for 15 seconds, push for 2–3 more reps with the same dumbbell, and switch to the other arm.',
        },
        'incline-bench-barbell-high-row': {
          name: 'INCLINE BENCH BARBELL HIGH ROW',
          reps: '8–10 rep range',
          sets: '3 sets',
          rest: '60–75 sec.',
          note: 'On every set, pull the bar toward your chest and squeeze your shoulder blades together.',
        },
        'barbell-pullover-for-lats': {
          name: 'BARBELL PULLOVER FOR LATS',
          reps: '10–12 rep range',
          sets: '3 sets',
          rest: '60 sec.',
          note: 'Tempo = 2/2/2/1: Lower the bar overhead over 2 seconds, hold for 2 seconds at the point of full muscle stretch, pull the bar back to chest level over 2 seconds, pause for 1 second, and repeat.',
        },
        'bent-over-reverse-fly': {
          name: 'BENT OVER REVERSE FLY',
          reps: '12–15 rep range',
          sets: '3 sets',
          rest: '45 sec.',
        },
        'concentration-curl': {
          name: 'CONCENTRATION CURL',
          reps: '8 reps',
          sets: '3 sets (last set 8-10-12 drop set)',
          rest: '60–75 sec.',
          note: '8-10-12 Drop Set: On the last set, after 8 reps reduce the dumbbell weight by 30–35% and do 10 more reps, then without resting reduce the weight by another 30–35% and do 12 more reps before switching to the other arm.',
        },
        'incline-bench-hammer-curl': {
          name: 'INCLINE BENCH HAMMER CURL',
          reps: '8–10 rep range',
          sets: '3 sets',
          rest: '60 sec.',
        },
      }),
    },
    'upper-push-stretch': {
      title: 'UPPER BODY PUSH — POST-WORKOUT STRETCHING',
      subtitle: 'Do these after the push workout.',
      exercises: defineExercises({
        'knee-hug-stretch': {
          name: 'KNEE HUG STRETCH',
          reps: '1',
          duration: '30 seconds',
        },
        'standing-wall-chest-stretch': {
          name: 'STANDING WALL CHEST STRETCH',
          reps: '1',
          duration: '30 seconds (each side)',
        },
        'kneeling-minor-chest-stretch': {
          name: 'KNEELING MINOR CHEST STRETCH',
          reps: '1',
          duration: '30 seconds (each side)',
        },
        'standing-both-arm-shoulder-stretch': {
          name: 'STANDING BOTH ARM SHOULDER STRETCH',
          reps: '1',
          duration: '30 seconds',
        },
        'standing-one-arm-shoulder-stretch': {
          name: 'STANDING ONE ARM SHOULDER STRETCH',
          reps: '1',
          duration: '30 seconds (each side)',
        },
        'wall-thoracic-extension-stretch': {
          name: 'WALL THORACIC EXTENSION STRETCH',
          reps: '1',
          duration: '30 seconds',
        },
        'wall-triceps-stretch': {
          name: 'WALL TRICEPS STRETCH',
          reps: '1',
          duration: '30 seconds (each side)',
        },
        'cobra-pose': {
          name: 'COBRA POSE',
          reps: '1',
          duration: '30 seconds',
        },
      }),
    },
    'upper-pull-stretch': {
      title: 'UPPER BODY PULL — POST-WORKOUT STRETCHING',
      subtitle: 'Do these after the pull workout.',
      exercises: defineExercises({
        'knee-hug-stretch': {
          name: 'KNEE HUG STRETCH',
          reps: '1',
          duration: '30 seconds',
        },
        'kneeling-lat-stretch': {
          name: 'KNEELING LAT STRETCH',
          reps: '1',
          duration: '30 seconds (each side)',
        },
        'cat-pose-stretch': {
          name: 'CAT POSE STRETCH',
          reps: '1',
          duration: '30 seconds',
        },
        'thread-the-needle-stretch': {
          name: 'THREAD THE NEEDLE STRETCH',
          reps: '1',
          duration: '30 seconds (each side)',
        },
        'wall-thoracic-extension-stretch': {
          name: 'WALL THORACIC EXTENSION STRETCH',
          reps: '1',
          duration: '30 seconds',
        },
        'standing-wall-biceps-stretch': {
          name: 'STANDING WALL BICEPS STRETCH',
          reps: '1',
          duration: '30 seconds (each side)',
        },
        'kneeling-biceps-stretch': {
          name: 'KNEELING BICEPS STRETCH',
          reps: '1',
          duration: '30 seconds',
        },
        'cobra-pose': {
          name: 'COBRA POSE',
          reps: '1',
          duration: '30 seconds',
        },
      }),
    },
    'lower-body': {
      title: 'LOWER BODY WORKOUT',
      subtitle: 'Glutes, quads, hamstrings and calves.',
      exercises: defineExercises({
        'barbell-hip-thrust': {
          name: 'BARBELL HIP THRUST',
          reps: '6 reps',
          sets: '3 sets (last set rest/pause system)',
          rest: '90 sec.',
          note: 'Rest/Pause System: On the last set, after 6 reps sit down on the floor and rest for 10–12 seconds, push for 3–4 more reps with the same weight, then rest for another 15 seconds and push for 2–3 more reps with the same weight to finish.',
        },
        'smith-machine-bulgarian-squat': {
          name: 'SMITH MACHINE BULGARIAN SQUAT',
          reps: '8 reps',
          sets: '3 sets',
          rest: '75–90 sec.',
        },
        'dumbbell-walking-lunge': {
          name: 'DUMBBELL WALKING LUNGE',
          reps: '20 steps',
          sets: '3 sets',
          rest: '60 sec.',
        },
        'leg-curl-single-leg': {
          name: 'LEG CURL (SINGLE LEG)',
          reps: '8 reps',
          sets: '3 sets (last set 8-10-12 drop set)',
          rest: '60 sec.',
          note: '8-10-12 Drop Set: On the last set, after 8 reps reduce the weight by 30–35% and do 10 more reps, then without resting reduce the weight by another 30–35% and push for 12 more reps before switching to the other leg.',
        },
        'smith-machine-calf-raise': {
          name: 'SMITH MACHINE CALF RAISE',
          reps: '10–15 rep range',
          sets: '3 sets',
          rest: '45 sec.',
        },
      }),
    },
    'lower-body-stretch': {
      title: 'LOWER BODY — POST-WORKOUT STRETCHING',
      subtitle: 'Do these after the lower body workout.',
      exercises: defineExercises({
        'childs-pose': {
          name: "CHILD'S POSE",
          reps: '1',
          duration: '30 seconds',
        },
        'cobra-pose': {
          name: 'COBRA POSE',
          reps: '1',
          duration: '30 seconds',
        },
        '90-90-hip-flexor-stretch': {
          name: '90-90 HIP FLEXOR STRETCH',
          reps: '1',
          duration: '30 seconds (each side)',
        },
        'pigeon-pose': {
          name: 'PIGEON POSE',
          reps: '1',
          duration: '30 seconds (each side)',
        },
        'figure-4-stretch': {
          name: 'FIGURE 4 STRETCH',
          reps: '1',
          duration: '30 seconds (each side)',
        },
        'supine-hamstring-stretch': {
          name: 'SUPINE HAMSTRING STRETCH',
          reps: '1',
          duration: '30 seconds (each side)',
        },
        'side-lying-quad-stretch': {
          name: 'SIDE LYING QUAD STRETCH',
          reps: '1',
          duration: '30 seconds (each side)',
        },
        'wall-calf-stretch': {
          name: 'WALL CALF STRETCH',
          reps: '1',
          duration: '30 seconds (each side)',
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
