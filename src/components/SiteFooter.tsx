import { useT } from '../i18n'
import styles from './SiteFooter.module.css'

export function SiteFooter() {
  const t = useT()

  // Only the app title. The tagline belongs to the hero on the groups page;
  // repeating it here would make it ambiguous to query in tests.
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.line}>{t.ui.appTitle}</p>
      </div>
    </footer>
  )
}
