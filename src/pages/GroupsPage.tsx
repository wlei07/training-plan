import { GroupCard } from '../components/GroupCard'
import { MStripe } from '../components/MStripe'
import { groups } from '../data/groups'
import type { Group } from '../data/types'
import { useT } from '../i18n'
import styles from './GroupsPage.module.css'

export function GroupsPage() {
  const t = useT()
  const ordered: Group[] = [...groups].sort(
    (a: Group, b: Group): number => a.order - b.order,
  )

  return (
    <section data-testid="groups-page">
      <div className={styles.hero}>
        <h1>{t.ui.appTitle}</h1>
        <p className={styles.tagline}>{t.ui.tagline}</p>
      </div>
      <MStripe className={styles.divider} />
      <h2 className={styles.heading}>{t.ui.groupsHeading}</h2>
      <div className={styles.grid}>
        {ordered.map((group: Group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </section>
  )
}
