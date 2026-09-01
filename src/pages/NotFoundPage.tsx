import { Link } from 'react-router-dom'
import { useT } from '../i18n'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  const t = useT()

  return (
    <section data-testid="not-found-page">
      <h1 className={styles.title}>{t.ui.notFoundTitle}</h1>
      <p>{t.ui.notFoundBody}</p>
      <Link to="/">{t.ui.home}</Link>
    </section>
  )
}
