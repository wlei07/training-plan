import { beforeEach, describe, expect, it, vi } from 'vitest'
import { STORAGE_KEY, loadLanguage, saveLanguage } from '../../src/i18n/storage'

describe('language storage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  it('defaults to English when nothing is stored', () => {
    expect(loadLanguage()).toBe('en')
  })

  it('restores a stored Turkish preference', () => {
    window.localStorage.setItem(STORAGE_KEY, 'tr')
    expect(loadLanguage()).toBe('tr')
  })

  it('falls back to English for an unrecognised stored value', () => {
    window.localStorage.setItem(STORAGE_KEY, 'klingon')
    expect(loadLanguage()).toBe('en')
  })

  it('persists a language', () => {
    saveLanguage('tr')
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('tr')
  })

  it('survives localStorage throwing', () => {
    vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('denied')
    })
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('denied')
    })
    expect(loadLanguage()).toBe('en')
    expect(() => saveLanguage('tr')).not.toThrow()
  })
})
