export interface Exercise {
  /** Stable slug used in URLs and as the i18n key. */
  readonly id: string
  /** Filename only, relative to the group's media directory. */
  readonly video: string
  /**
   * Hold time in seconds, present on the stretching groups only. It is the
   * countdown timer's starting value, and its presence is what decides whether
   * the exercise page shows a timer at all. The localised `duration` copy in
   * the dictionaries says the same thing in words; tests/data/groups.test.ts
   * keeps the two in step.
   */
  readonly holdSeconds?: number
}

export interface Group {
  /** Stable slug used in URLs and as the i18n key. */
  readonly id: string
  /** Display order, ascending. Sort key only, never displayed. */
  readonly order: number
  /**
   * Human-facing group label, matching the leading token of `mediaDir`:
   * '0', '1a', '1b', '2a', '2b', '3', '4'. A string because the real labels
   * are not all numbers — '1a' and '1b' share the numeric position 1.
   */
  readonly label: string
  /** Directory name under `public/media/`. */
  readonly mediaDir: string
  readonly exercises: readonly Exercise[]
}
