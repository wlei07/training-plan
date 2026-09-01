import { Link } from 'react-router-dom'
import { useT } from '../i18n'
import { LanguageSwitch } from './LanguageSwitch'
import { MStripe } from './MStripe'
import styles from './TopNav.module.css'

export function TopNav() {
  const t = useT()

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link to="/" className={styles.brand}>
          {t.ui.appTitle}
        </Link>
        <LanguageSwitch />
      </div>
      <MStripe />
    </header>
  )
}
