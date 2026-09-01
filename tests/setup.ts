import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

/**
 * jsdom does not implement window.scrollTo — calling it logs a
 * "Not implemented" error and does nothing. ExercisePage resets the scroll
 * position on every exercise change, so stub it with a spy that tests can
 * assert against.
 */
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
})
