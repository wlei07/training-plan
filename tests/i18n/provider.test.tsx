import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { LanguageProvider, useLanguage, useT } from '../../src/i18n'
import { STORAGE_KEY } from '../../src/i18n/storage'

function Probe() {
  const t = useT()
  const { language, setLanguage } = useLanguage()
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <span data-testid="title">{t.ui.appTitle}</span>
      <button onClick={() => setLanguage('tr')}>to turkish</button>
    </div>
  )
}

describe('LanguageProvider', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.lang = ''
  })

  it('starts in English', () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    )
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
    expect(screen.getByTestId('title')).toHaveTextContent('TRAINING PLAN')
  })

  it('switches the active dictionary and persists the choice', async () => {
    const user = userEvent.setup()
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'to turkish' }))
    expect(screen.getByTestId('lang')).toHaveTextContent('tr')
    expect(screen.getByTestId('title')).toHaveTextContent('ANTRENMAN PLANI')
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('tr')
  })

  it('restores a stored preference on mount', () => {
    window.localStorage.setItem(STORAGE_KEY, 'tr')
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    )
    expect(screen.getByTestId('title')).toHaveTextContent('ANTRENMAN PLANI')
  })

  it('keeps the html lang attribute in sync', async () => {
    const user = userEvent.setup()
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>,
    )
    expect(document.documentElement.lang).toBe('en')
    await user.click(screen.getByRole('button', { name: 'to turkish' }))
    expect(document.documentElement.lang).toBe('tr')
  })
})
