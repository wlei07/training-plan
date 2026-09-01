import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { en, type Dictionary } from './en'
import { tr } from './tr'
import { loadLanguage, saveLanguage, type Language } from './storage'

export type { Dictionary } from './en'
export type { ExerciseText } from './en'
export { LANGUAGES, type Language } from './storage'

const dictionaries: Readonly<Record<Language, Dictionary>> = { en, tr }

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: Dictionary
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

interface LanguageProviderProps {
  children: ReactNode
  /** Overrides the stored preference. Used by tests. */
  initial?: Language
}

export function LanguageProvider({ children, initial }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(
    (): Language => initial ?? loadLanguage(),
  )

  useEffect((): void => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = useCallback((next: Language): void => {
    setLanguageState(next)
    saveLanguage(next)
  }, [])

  const value: LanguageContextValue = useMemo(
    (): LanguageContextValue => ({
      language,
      setLanguage,
      t: dictionaries[language],
    }),
    [language, setLanguage],
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

function useLanguageContext(): LanguageContextValue {
  const context: LanguageContextValue | null = useContext(LanguageContext)
  if (context === null) {
    throw new Error('useT / useLanguage must be used inside a LanguageProvider')
  }
  return context
}

/** The active dictionary. */
export function useT(): Dictionary {
  return useLanguageContext().t
}

export function useLanguage(): {
  language: Language
  setLanguage: (language: Language) => void
} {
  const { language, setLanguage } = useLanguageContext()
  return { language, setLanguage }
}
