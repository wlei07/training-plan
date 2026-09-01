import { useParams } from 'react-router-dom'
import { BackLink } from '../components/BackLink'
import { ExerciseRow } from '../components/ExerciseRow'
import { MStripe } from '../components/MStripe'
import { findGroup } from '../data/groups'
import type { Exercise, Group } from '../data/types'
import { useT } from '../i18n'
import { groupText, type GroupText } from '../i18n/lookup'
import { NotFoundPage } from './NotFoundPage'
import styles from './GroupPage.module.css'

export function GroupPage() {
  const { groupId } = useParams<{ groupId: string }>()
  const t = useT()
  const group: Group | undefined = groupId ? findGroup(groupId) : undefined
  const text: GroupText | undefined = group
    ? groupText(t, group.id)
    : undefined

  if (!group || !text) {
    return <NotFoundPage />
  }

  return (
    <section data-testid="group-page">
      <BackLink to="/" label={t.ui.allGroups} />
      <div className={styles.header}>
        <h1>{text.title}</h1>
        <p className={styles.subtitle}>{text.subtitle}</p>
      </div>
      <MStripe className={styles.divider} />
      <h2 className={styles.heading}>{t.ui.exercisesHeading}</h2>
      <div className={styles.list}>
        {group.exercises.map((exercise: Exercise, index: number) => (
          <ExerciseRow
            key={exercise.id}
            group={group}
            exercise={exercise}
            position={index + 1}
          />
        ))}
      </div>
    </section>
  )
}
