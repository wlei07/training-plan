import { Link } from 'react-router-dom'
import type { Exercise, Group } from '../data/types'
import { useT, type ExerciseText } from '../i18n'
import { exerciseText } from '../i18n/lookup'
import styles from './ExerciseRow.module.css'

interface ExerciseRowProps {
  group: Group
  exercise: Exercise
  /** 1-based position within the group. */
  position: number
}

export function ExerciseRow({ group, exercise, position }: ExerciseRowProps) {
  const t = useT()
  const text: ExerciseText | undefined = exerciseText(t, group.id, exercise.id)

  // Renders inside a list, so an untranslated exercise is skipped rather than
  // crashing the page. tests/i18n/dictionary.test.ts is what guarantees this
  // never happens in a shipped build: it fails if a registered exercise has no
  // text block in either locale.
  if (!text) {
    return null
  }

  return (
    <Link
      to={`/g/${group.id}/e/${exercise.id}`}
      className={styles.row}
      data-testid="exercise-row"
    >
      <span className={styles.number} data-testid="exercise-row-number">
        {String(position).padStart(2, '0')}
      </span>
      <span className={styles.name} data-testid="exercise-row-name">
        {text.name}
      </span>
      {/* A held stretch carries reps '1' and the hold time in `duration`.
          '30 seconds' is what you scan a routine for; '1' is noise. */}
      <span className={styles.reps}>{text.duration ?? text.reps}</span>
      <span className={styles.chevron} aria-hidden="true">
        &rarr;
      </span>
    </Link>
  )
}
