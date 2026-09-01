import { render, type RenderResult } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../../src/App'
import { LanguageProvider } from '../../src/i18n'
import type { Language } from '../../src/i18n'

export function renderAt(
  path: string,
  options: { language?: Language } = {},
): RenderResult {
  return render(
    <LanguageProvider initial={options.language ?? 'en'}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </LanguageProvider>,
  )
}
