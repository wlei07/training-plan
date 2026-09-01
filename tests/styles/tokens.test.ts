import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const css: string = readFileSync(
  join(process.cwd(), 'src/styles/tokens.css'),
  'utf-8',
)

const REQUIRED_TOKENS: readonly string[] = [
  '--color-canvas',
  '--color-surface-soft',
  '--color-surface-card',
  '--color-surface-elevated',
  '--color-hairline',
  '--color-ink',
  '--color-body',
  '--color-body-strong',
  '--color-muted',
  '--color-m-blue-light',
  '--color-m-blue-dark',
  '--color-m-red',
  '--space-xxs',
  '--space-xs',
  '--space-sm',
  '--space-md',
  '--space-lg',
  '--space-xl',
  '--space-xxl',
  '--space-section',
  '--radius-none',
  '--radius-full',
  '--font-display',
  '--weight-display',
  '--weight-body',
  '--tracking-label',
  '--size-display-xl',
  '--size-display-lg',
  '--size-display-md',
  '--size-display-sm',
  '--size-title-lg',
  '--size-label',
  '--size-body-md',
  '--max-content',
  '--m-stripe',
]

// Exact values from the DESIGN-bmw-m.md front-matter.
const EXACT_VALUES: Readonly<Record<string, string>> = {
  '--color-canvas': '#000000',
  '--color-surface-card': '#1a1a1a',
  '--color-hairline': '#3c3c3c',
  '--color-ink': '#ffffff',
  '--color-body': '#bbbbbb',
  '--color-m-blue-light': '#0066b1',
  '--color-m-blue-dark': '#1c69d4',
  '--color-m-red': '#e22718',
  '--space-section': '96px',
  '--radius-none': '0px',
  '--weight-display': '700',
  '--weight-body': '300',
  '--tracking-label': '1.5px',
}

describe('design tokens', () => {
  it.each(REQUIRED_TOKENS)('defines %s', (token: string) => {
    expect(css).toContain(`${token}:`)
  })

  it.each(Object.entries(EXACT_VALUES))(
    '%s matches the design document',
    (token: string, value: string) => {
      expect(css).toMatch(
        new RegExp(`${token}\\s*:\\s*${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*;`),
      )
    },
  )

  it('scales the hero headline down on mobile', () => {
    // The base value must be the desktop 80px ...
    expect(css).toMatch(/:root\s*\{[^}]*--size-display-xl:\s*80px\s*;/)

    // ... and the mobile block must actually override it to 48px, not merely
    // exist. Asserting the string 'max-width: 767px' appears somewhere proved
    // nothing about what the block contains.
    const mobile: RegExpMatchArray | null = css.match(
      /@media\s*\(max-width:\s*767px\)\s*\{\s*:root\s*\{([^}]*)\}/,
    )
    expect(mobile, 'no @media (max-width: 767px) :root block in tokens.css').not
      .toBeNull()
    expect(mobile?.[1]).toMatch(/--size-display-xl:\s*48px\s*;/)
  })
})
