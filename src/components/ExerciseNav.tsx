import { Link } from 'react-router-dom'
import type { Exercise, Group } from '../data/types'
import { useT } from '../i18n'
import styles from './ExerciseNav.module.css'

interface ExerciseNavProps {
  group: Group
  previous: Exercise | null
  next: Exercise | null
}

export function ExerciseNav({ group, previous, next }: ExerciseNavProps) {
  const t = useT()

  return (
    <nav className={styles.nav}>
      {previous ? (
        <Link to={`/g/${group.id}/e/${previous.id}`} className={styles.link}>
          <span aria-hidden="true">&larr;</span> {t.ui.previous}
        </Link>
      ) : null}
      {next ? (
        <Link
          to={`/g/${group.id}/e/${next.id}`}
          className={`${styles.link} ${styles.next}`}
        >
          {t.ui.next} <span aria-hidden="true">&rarr;</span>
        </Link>
      ) : null}
    </nav>
  )
}
