import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderAt } from '../helpers/render'

describe('group page', () => {
  it('shows the localised group title as the headline', () => {
    renderAt('/g/warm-up')
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'WARM-UP & POSTURAL EXERCISES',
      }),
    ).toBeInTheDocument()
  })

  it('lists all eight exercises in training order', () => {
    renderAt('/g/warm-up')
    const names: string[] = screen
      .getAllByTestId('exercise-row-name')
      .map((node: HTMLElement): string => node.textContent ?? '')
    expect(names).toEqual([
      'KNEE SIDE DROPS',
      'SUPINE STRAIGHT LEG CIRCLE',
      'BODYWEIGHT GLUTE BRIDGE',
      'SCAPULAR RETRACTION',
      'THORACIC EXTENSION',
      'ELBOW THORACIC ROTATION',
      'PRONE SWIMMER',
      'PRONE W',
    ])
  })

  it('shows the reps for each exercise', () => {
    renderAt('/g/warm-up')
    expect(screen.getByText('20 reps')).toBeInTheDocument()
    expect(screen.getByText('15 right / 15 left')).toBeInTheDocument()
    expect(screen.getByText('10 right / 10 left, 2 sets each')).toBeInTheDocument()
  })

  it('numbers the rows from one', () => {
    renderAt('/g/warm-up')
    const numbers: string[] = screen
      .getAllByTestId('exercise-row-number')
      .map((node: HTMLElement): string => node.textContent ?? '')
    expect(numbers).toEqual(['01', '02', '03', '04', '05', '06', '07', '08'])
  })

  it('links each row to the exercise page', () => {
    renderAt('/g/warm-up')
    expect(
      screen.getByRole('link', { name: /KNEE SIDE DROPS/i }),
    ).toHaveAttribute('href', '/g/warm-up/e/knee-side-drops')
  })

  it('offers a way back to the group list', () => {
    renderAt('/g/warm-up')
    expect(screen.getByRole('link', { name: 'ALL GROUPS' })).toHaveAttribute(
      'href',
      '/',
    )
  })

  it('loads no video elements while browsing the list', () => {
    const { container } = renderAt('/g/warm-up')
    expect(container.querySelectorAll('video')).toHaveLength(0)
  })

  it('renders in Turkish', () => {
    renderAt('/g/warm-up', { language: 'tr' })
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'ISINMA VE POSTÜR EGZERSİZLERİ',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('20 tekrar')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'TÜM GRUPLAR' })).toBeInTheDocument()
  })

  it('renders not-found for an unknown group', () => {
    renderAt('/g/does-not-exist')
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument()
  })
})
