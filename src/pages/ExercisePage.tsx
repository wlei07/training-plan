import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BackLink } from '../components/BackLink'
import { ExerciseNav } from '../components/ExerciseNav'
import { MStripe } from '../components/MStripe'
import { SpecCell } from '../components/SpecCell'
import { VideoPlayer } from '../components/VideoPlayer'
import { findGroup } from '../data/groups'
import type { Exercise, Group } from '../data/types'
import { useT, type ExerciseText } from '../i18n'
import { exerciseText } from '../i18n/lookup'
import { mediaUrl, posterUrl } from '../lib/media'
import { neighbours, type Neighbours } from '../lib/navigation'
import { NotFoundPage } from './NotFoundPage'
import styles from './ExercisePage.module.css'

export function ExercisePage() {
  const { groupId, exerciseId } = useParams<{
    groupId: string
    exerciseId: string
  }>()
  const t = useT()

  const group: Group | undefined = groupId ? findGroup(groupId) : undefined
  const position: Neighbours<Exercise> | null =
    group && exerciseId ? neighbours(group.exercises, exerciseId) : null
  const exercise: Exercise | undefined =
    group && position ? group.exercises[position.index] : undefined
  const text: ExerciseText | undefined =
    group && exercise ? exerciseText(t, group.id, exercise.id) : undefined

  // PREVIOUS/NEXT keep the user on the same route with a different exercise, so
  // React Router does not reset the scroll position. The nav sits below a video
  // that can be 78vh tall, which would otherwise land every step mid-page.
  useEffect((): void => {
    window.scrollTo(0, 0)
  }, [exerciseId])

  if (!group || !position || !exercise || !text) {
    return <NotFoundPage />
  }

  return (
    <section data-testid="exercise-page">
      <BackLink to={`/g/${group.id}`} label={t.ui.backToGroup} />
      <div className={styles.header}>
        <p className={styles.position}>
          {t.ui.exercisePosition(position.index + 1, group.exercises.length)}
        </p>
        <h1>{text.name}</h1>
      </div>
      <MStripe className={styles.divider} />
      <VideoPlayer
        src={mediaUrl(group, exercise)}
        poster={posterUrl(group, exercise)}
        title={text.name}
        unsupportedMessage={t.ui.videoUnsupported}
      />
      <div className={styles.specs}>
        <SpecCell label={t.ui.repsLabel} value={text.reps} />
        {text.duration ? (
          <SpecCell label={t.ui.durationLabel} value={text.duration} />
        ) : null}
        {text.sets ? <SpecCell label={t.ui.setsLabel} value={text.sets} /> : null}
        {text.rest ? <SpecCell label={t.ui.restLabel} value={text.rest} /> : null}
      </div>
      {text.note ? (
        <div className={styles.note}>
          <p className={styles.noteLabel}>{t.ui.noteLabel}</p>
          <p className={styles.noteBody}>{text.note}</p>
        </div>
      ) : null}
      <ExerciseNav
        group={group}
        previous={position.previous}
        next={position.next}
      />
    </section>
  )
}
