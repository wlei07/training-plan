export type Language = 'en' | 'tr'

export const LANGUAGES: readonly Language[] = ['en', 'tr']

export const DEFAULT_LANGUAGE: Language = 'en'

export const STORAGE_KEY = 'training-plan.lang'

function isLanguage(value: string | null): value is Language {
  return value !== null && (LANGUAGES as readonly string[]).includes(value)
}

export function loadLanguage(): Language {
  try {
    const stored: string | null = window.localStorage.getItem(STORAGE_KEY)
    return isLanguage(stored) ? stored : DEFAULT_LANGUAGE
  } catch {
    return DEFAULT_LANGUAGE
  }
}

export function saveLanguage(language: Language): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, language)
  } catch {
    // Preference is a convenience; a storage failure must not break the app.
  }
}
