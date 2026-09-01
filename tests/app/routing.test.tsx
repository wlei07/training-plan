import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderAt } from '../helpers/render'

describe('routing', () => {
  it('renders the groups page at the root', () => {
    renderAt('/')
    expect(screen.getByTestId('groups-page')).toBeInTheDocument()
  })

  it('renders the group page at /g/:groupId', () => {
    renderAt('/g/warm-up')
    expect(screen.getByTestId('group-page')).toBeInTheDocument()
  })

  it('renders the exercise page at /g/:groupId/e/:exerciseId', () => {
    renderAt('/g/warm-up/e/knee-side-drops')
    expect(screen.getByTestId('exercise-page')).toBeInTheDocument()
  })

  it('renders not-found for an unknown path', () => {
    renderAt('/nonsense')
    expect(screen.getByText('NOT FOUND')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'HOME' })).toBeInTheDocument()
  })

  it('renders not-found in Turkish', () => {
    renderAt('/nonsense', { language: 'tr' })
    expect(screen.getByText('BULUNAMADI')).toBeInTheDocument()
  })
})
