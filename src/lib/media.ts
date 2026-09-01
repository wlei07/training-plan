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

/**
 * Absolute URL for an exercise's poster image: the video's first frame, kept
 * beside it as a .jpg by `npm run posters`.
 *
 * Derived from the video filename rather than stored on Exercise, so adding a
 * group stays the three-file edit the README documents.
 */
export function posterUrl(group: Group, exercise: Exercise): string {
  return mediaUrl(group, exercise).replace(/\.mp4$/, '.jpg')
}
