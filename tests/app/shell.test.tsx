import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderAt } from '../helpers/render'
import { STORAGE_KEY } from '../../src/i18n/storage'

describe('application shell', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('shows the app title in the nav', () => {
    renderAt('/')
    expect(
      screen.getByRole('link', { name: /TRAINING PLAN/i }),
    ).toBeInTheDocument()
  })

  it('offers both languages', () => {
    renderAt('/')
    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'TR' })).toBeInTheDocument()
  })

  it('marks the active language with aria-current', () => {
    renderAt('/')
    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute(
      'aria-current',
      'true',
    )
    expect(screen.getByRole('button', { name: 'TR' })).not.toHaveAttribute(
      'aria-current',
    )
  })

  it('switches the interface to Turkish and persists it', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.click(screen.getByRole('button', { name: 'TR' }))
    expect(
      screen.getByRole('link', { name: /ANTRENMAN PLANI/i }),
    ).toBeInTheDocument()
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('tr')
  })

  it('renders the M stripe as decoration, hidden from assistive tech', () => {
    renderAt('/')
    const stripes: HTMLElement[] = screen.getAllByTestId('m-stripe')
    expect(stripes.length).toBeGreaterThan(0)
    expect(stripes[0]).toHaveAttribute('aria-hidden', 'true')
  })
})
