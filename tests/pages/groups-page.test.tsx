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

  it('shows the exercise count', () => {
    renderAt('/')
    expect(screen.getByText('8 exercises')).toBeInTheDocument()
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
    expect(
      screen.getByText('ISINMA VE POSTÜR EGZERSİZLERİ'),
    ).toBeInTheDocument()
    expect(screen.getByText('8 egzersiz')).toBeInTheDocument()
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
