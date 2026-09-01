import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderAt } from '../helpers/render'
import { groups } from '../../src/data/groups'
import { en } from '../../src/i18n/en'
import type { Group } from '../../src/data/types'

describe('groups page', () => {
  it('shows the app title as the page headline', () => {
    renderAt('/')
    expect(
      screen.getByRole('heading', { level: 1, name: 'TRAINING PLAN' }),
    ).toBeInTheDocument()
  })

  it('renders one card per registered group', () => {
    renderAt('/')
    expect(screen.getAllByTestId('group-card')).toHaveLength(groups.length)
  })

  it('shows the localised group title and links to the group', () => {
    renderAt('/')
    const link: HTMLElement = screen.getByRole('link', {
      name: /WARM-UP & POSTURAL EXERCISES/i,
    })
    expect(link).toHaveAttribute('href', '/g/warm-up')
  })

  it('shows each card its own exercise count', () => {
    renderAt('/')
    // Scoped per card, because several groups share a count (four have 8).
    for (const group of groups) {
      const card: HTMLElement = screen
        .getByText(en.groups[group.id as keyof typeof en.groups].title)
        .closest('[data-testid="group-card"]') as HTMLElement
      expect(card, `no card for ${group.id}`).not.toBeNull()
      expect(card).toHaveTextContent(`${group.exercises.length} exercises`)
    }
  })

  it('shows the group subtitle', () => {
    renderAt('/')
    expect(screen.getByText('Do these before every session.')).toBeInTheDocument()
  })

  it('renders in Turkish', () => {
    renderAt('/', { language: 'tr' })
    expect(
      screen.getByRole('heading', { level: 1, name: 'ANTRENMAN PLANI' }),
    ).toBeInTheDocument()
    const card: HTMLElement = screen
      .getByText('ISINMA VE POSTÜR EGZERSİZLERİ')
      .closest('[data-testid="group-card"]') as HTMLElement
    expect(card).not.toBeNull()
    expect(card).toHaveTextContent('8 egzersiz')
  })

  it('orders cards by the group order field', () => {
    renderAt('/')
    const rendered: string[] = screen
      .getAllByTestId('group-card-title')
      .map((node: HTMLElement): string => node.textContent ?? '')
    const expected: string[] = [...groups]
      .sort((a: Group, b: Group): number => a.order - b.order)
      .map(
        (group: Group): string =>
          en.groups[group.id as keyof typeof en.groups].title,
      )
    expect(rendered).toEqual(expected)
  })
})
