import type { Exercise, Group } from '../data/types'

/**
 * Absolute URL for an exercise video.
 *
 * import.meta.env.BASE_URL always ends in '/', and is '/' under Vitest but
 * '/training-plan/' in a production build — which is why no component may
 * hard-code a media path.
 */
export function mediaUrl(group: Group, exercise: Exercise): string {
  return `${import.meta.env.BASE_URL}media/${group.mediaDir}/${exercise.video}`
}
