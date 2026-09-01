import { Link } from 'react-router-dom'
import type { Group } from '../data/types'
import { useT } from '../i18n'
import { groupText, type GroupText } from '../i18n/lookup'
import styles from './GroupCard.module.css'

interface GroupCardProps {
  group: Group
}

export function GroupCard({ group }: GroupCardProps) {
  const t = useT()
  const text: GroupText | undefined = groupText(t, group.id)

  // Renders inside a list, so an untranslated group is skipped rather than
  // crashing the page. tests/i18n/dictionary.test.ts is what guarantees this
  // never happens in a shipped build: it fails if a registered group has no
  // text block in either locale.
  if (!text) {
    return null
  }

  return (
    <Link
      to={`/g/${group.id}`}
      className={styles.card}
      data-testid="group-card"
    >
      <span className={styles.index}>{group.label}</span>
      <h3 className={styles.title} data-testid="group-card-title">
        {text.title}
      </h3>
      <p className={styles.subtitle}>{text.subtitle}</p>
      <p className={styles.count}>{t.ui.exerciseCount(group.exercises.length)}</p>
    </Link>
  )
}
