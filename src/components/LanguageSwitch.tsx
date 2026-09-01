import { LANGUAGES, useLanguage, useT, type Language } from '../i18n'
import styles from './LanguageSwitch.module.css'

const LABELS: Readonly<Record<Language, string>> = { en: 'EN', tr: 'TR' }

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage()
  const t = useT()

  return (
    <div className={styles.switch} role="group" aria-label={t.ui.languageLabel}>
      {LANGUAGES.map((candidate: Language) => {
        const isActive: boolean = candidate === language
        return (
          <button
            key={candidate}
            type="button"
            className={isActive ? `${styles.option} ${styles.active}` : styles.option}
            aria-current={isActive ? 'true' : undefined}
            onClick={() => setLanguage(candidate)}
          >
            {LABELS[candidate]}
          </button>
        )
      })}
    </div>
  )
}
