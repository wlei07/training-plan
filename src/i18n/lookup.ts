import type { Dictionary, ExerciseText } from './en'

/** Structural view of one group's text: exercises keyed by plain string. */
export interface GroupText {
  title: string
  subtitle: string
  exercises: Record<string, ExerciseText>
}

/**
 * Reads one group's text block, or undefined if the group has no locale entry.
 *
 * This is the only cast in the codebase between the literal-keyed Dictionary
 * (derived via `typeof en`) and the plain `string` ids in src/data. It must
 * live here and nowhere else: casting with `keyof typeof t.groups` at a call
 * site collapses to `never` the moment a second group exists, because `keyof`
 * over a union is the intersection of its members' keys.
 */
export function groupText(t: Dictionary, groupId: string): GroupText | undefined {
  return (t.groups as Record<string, GroupText>)[groupId]
}

/** Reads one exercise's text, or undefined if the group or exercise is missing. */
export function exerciseText(
  t: Dictionary,
  groupId: string,
  exerciseId: string,
): ExerciseText | undefined {
  return groupText(t, groupId)?.exercises[exerciseId]
}
