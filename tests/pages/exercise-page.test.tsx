import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderAt } from '../helpers/render'

describe('exercise page', () => {
  it('shows the exercise name as the headline', () => {
    renderAt('/g/warm-up/e/knee-side-drops')
    expect(
      screen.getByRole('heading', { level: 1, name: 'KNEE SIDE DROPS' }),
    ).toBeInTheDocument()
  })

  it('shows the reps in a labelled spec cell', () => {
    renderAt('/g/warm-up/e/knee-side-drops')
    expect(screen.getByText('REPS')).toBeInTheDocument()
    expect(screen.getByText('20 reps')).toBeInTheDocument()
  })

  it('renders a video pointing at the right file', () => {
    renderAt('/g/warm-up/e/knee-side-drops')
    const video: HTMLVideoElement = screen.getByTestId(
      'exercise-video',
    ) as HTMLVideoElement
    expect(video.getAttribute('src')).toBe(
      `${import.meta.env.BASE_URL}media/0-warm-up-and-postural-exercises/1-knee-side-drops.mp4`,
    )
  })

  it('gives the video controls and defers loading the file', () => {
    renderAt('/g/warm-up/e/knee-side-drops')
    const video: HTMLElement = screen.getByTestId('exercise-video')
    expect(video).toHaveAttribute('controls')
    expect(video).toHaveAttribute('playsinline')
    // The poster carries the still frame, so no part of the video needs
    // fetching until the user actually taps play.
    expect(video).toHaveAttribute('preload', 'none')
  })

  it('shows the poster frame before playback', () => {
    renderAt('/g/warm-up/e/knee-side-drops')
    expect(screen.getByTestId('exercise-video')).toHaveAttribute(
      'poster',
      `${import.meta.env.BASE_URL}media/0-warm-up-and-postural-exercises/1-knee-side-drops.jpg`,
    )
  })

  it('shows the position within the group', () => {
    renderAt('/g/warm-up/e/bodyweight-glute-bridge')
    expect(screen.getByText('3 / 8')).toBeInTheDocument()
  })

  it('offers a link back to the group', () => {
    renderAt('/g/warm-up/e/knee-side-drops')
    expect(screen.getByRole('link', { name: 'BACK TO GROUP' })).toHaveAttribute(
      'href',
      '/g/warm-up',
    )
  })

  it('hides previous on the first exercise', () => {
    renderAt('/g/warm-up/e/knee-side-drops')
    expect(screen.queryByRole('link', { name: /PREVIOUS/ })).toBeNull()
    expect(screen.getByRole('link', { name: /NEXT/ })).toHaveAttribute(
      'href',
      '/g/warm-up/e/supine-straight-leg-circle',
    )
  })

  it('hides next on the last exercise', () => {
    renderAt('/g/warm-up/e/prone-w')
    expect(screen.queryByRole('link', { name: /NEXT/ })).toBeNull()
    expect(screen.getByRole('link', { name: /PREVIOUS/ })).toHaveAttribute(
      'href',
      '/g/warm-up/e/prone-swimmer',
    )
  })

  it('offers both directions in the middle', () => {
    renderAt('/g/warm-up/e/thoracic-extension')
    expect(screen.getByRole('link', { name: /PREVIOUS/ })).toHaveAttribute(
      'href',
      '/g/warm-up/e/scapular-retraction',
    )
    expect(screen.getByRole('link', { name: /NEXT/ })).toHaveAttribute(
      'href',
      '/g/warm-up/e/elbow-thoracic-rotation',
    )
  })

  it('renders in Turkish', () => {
    renderAt('/g/warm-up/e/knee-side-drops', { language: 'tr' })
    expect(screen.getByText('TEKRAR')).toBeInTheDocument()
    expect(screen.getByText('20 tekrar')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'GRUBA DÖN' })).toBeInTheDocument()
  })

  it('resets the scroll position when an exercise is shown', () => {
    // The nav sits below a video up to 78vh tall, so stepping to the next
    // exercise must return the user to the top of the new page.
    vi.mocked(window.scrollTo).mockClear()
    renderAt('/g/warm-up/e/thoracic-extension')
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('mounts a fresh video element when stepping to the next exercise', async () => {
    // PREVIOUS/NEXT stay on the same route, so React would otherwise reuse the
    // same <video> node and only swap its src. WebKit (every iOS browser) keeps
    // the old playback state on a reused element: its controls still show PAUSE
    // for a video that is not playing. A new element per source cannot.
    renderAt('/g/warm-up/e/knee-side-drops')
    const first: HTMLVideoElement = screen.getByTestId(
      'exercise-video',
    ) as HTMLVideoElement

    await userEvent.click(screen.getByRole('link', { name: /NEXT/ }))

    const second: HTMLVideoElement = screen.getByTestId(
      'exercise-video',
    ) as HTMLVideoElement
    expect(second.getAttribute('src')).toBe(
      `${import.meta.env.BASE_URL}media/0-warm-up-and-postural-exercises/2-supine-straight-leg-circle.mp4`,
    )
    expect(second).not.toBe(first)
  })

  it('renders not-found for an unknown exercise', () => {
    renderAt('/g/warm-up/e/does-not-exist')
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument()
  })

  it('renders not-found for an unknown group', () => {
    renderAt('/g/nope/e/knee-side-drops')
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument()
  })
})
