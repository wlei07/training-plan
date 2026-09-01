# Training Plan SPA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a React + TypeScript single-page application that presents the training plan as groups → exercises → exercise detail (name, reps, video), in English and Turkish, styled per the BMW M design system.

**Architecture:** Vite-built SPA. Structure (group ids, exercise ids, video filenames) lives in `src/data/groups.ts`; every user-visible string lives in `src/i18n/en.ts` and `src/i18n/tr.ts` keyed by those ids, with `tr` typed as `typeof en` so a missing translation is a compile error. Three routes under a `HashRouter` (GitHub Pages has no server-side rewrite). Videos are plain static files under `public/media/`, already in place.

**Tech Stack:** React 19, TypeScript 5.8 (strict), Vite 6, react-router-dom 7, Vitest 3 + @testing-library/react + jsdom, CSS Modules with design tokens as CSS custom properties.

**Spec:** `docs/superpowers/specs/2026-08-31-training-plan-design.md`

## Already Done — Do Not Redo

Spec §4 (repository layout) and §3.1 (email extraction) are **complete on disk**
before this plan starts. `public/media/` holds 49 videos across 7 group folders,
`content/` holds the reps text in English plus the Turkish originals, and the
six original numbered source folders have been removed. No task in this plan
moves, renames, or deletes media. Task 3's test asserts the group 0 files are
where it expects them, which is the check that this precondition still holds.

## Global Constraints

- **Language default is English.** Turkish is opt-in, persisted to `localStorage` under the key `training-plan.lang`. An absent or unrecognised stored value falls back to `en`.
- **Never use `var`** — this is a repo-wide owner rule. Use `const`/`let` with explicit types where inference is not obvious.
- **`tr` must be typed `Dictionary`** (= `typeof en`). Never widen it to `Record<string, unknown>` or add runtime English fallbacks — the compile error IS the guard.
- **Only group 0 (`warm-up`) is registered** in `src/data/groups.ts`. The other six groups' media and English text are on disk but out of scope.
- **Border radius is 0 everywhere** except circular icon buttons (`--radius-full`). No drop shadows anywhere.
- **The M tricolor** (`#0066b1 → #1c69d4 → #e22718`) is a 4px divider and the active-language marker only. Never a button fill, never a background.
- **No inline hex colours in components.** Every colour, space, and size comes from a `var(--token)` defined in `src/styles/tokens.css`.
- **Display type is UPPERCASE at weight 700; body type is weight 300.** Never bold body text.
- **`base: '/training-plan/'`** in `vite.config.ts`. All media URLs must be composed through `mediaUrl()` so they work at both the dev sub-path and on GitHub Pages.
- **Commit policy — IMPORTANT.** The repository owner's standing rule is that no agent runs `git init`, `git add`, `git commit`, `git push`, or `gh repo create` without an explicit request in the moment. This plan therefore has **no commit steps**. Each task ends with a verification step instead. Leave all work in the working tree; the owner commits.

---

### Task 1: Toolchain scaffold

Creates the Vite + React + TS + Vitest project around the existing `public/`, `content/`, and `docs/` directories. `npm create vite` is deliberately NOT used — it prompts interactively when the directory is non-empty, which it is.

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `.gitignore`, `src/vite-env.d.ts`, `src/main.tsx`, `src/App.tsx`
- Test: `tests/setup.ts`, `tests/toolchain.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `npm test` runs Vitest in a jsdom environment against `tests/**/*.test.{ts,tsx}`; `npm run build` type-checks then builds. A placeholder `App` component exporting `default function App(): JSX.Element`.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "training-plan",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.6.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/node": "^26.4.0",
    "@types/react": "^19.1.0",
    "@types/react-dom": "^19.1.0",
    "@vitejs/plugin-react": "^4.4.0",
    "jsdom": "^26.1.0",
    "typescript": "^5.8.0",
    "vite": "^6.3.0",
    "vitest": "^3.1.0"
  }
}
```

- [ ] **Step 2: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noEmit": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "types": ["vitest/globals", "@testing-library/jest-dom", "node"]
  },
  "include": ["src", "tests", "vite.config.ts"]
}
```

- [ ] **Step 3: Write `vite.config.ts`**

`base` matches the GitHub Pages project-site path from the start, so the dev server exercises the same sub-path as production.

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/training-plan/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
})
```

- [ ] **Step 4: Write `index.html`**

Inter is loaded at 300/400/700 — the substitute `DESIGN-bmw-m.md` itself names for BMW Type Next Latin.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Training Plan</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Write `.gitignore`**

```
node_modules/
dist/
coverage/
*.local
.DS_Store
```

- [ ] **Step 6: Write `src/vite-env.d.ts`**

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 7: Write placeholder `src/App.tsx`**

Replaced wholesale in Task 5. It exists now only so the toolchain has something to compile.

```tsx
export default function App() {
  return <h1>TRAINING PLAN</h1>
}
```

- [ ] **Step 8: Write `src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const rootElement: HTMLElement | null = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element #root not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 9: Write `tests/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 10: Write the failing test `tests/toolchain.test.ts`**

Proves three things at once: Vitest runs, jsdom globals exist, and `import.meta.env.BASE_URL` is readable (Task 8's `mediaUrl` depends on it).

```ts
import { describe, expect, it } from 'vitest'

describe('toolchain', () => {
  it('runs in a jsdom environment', () => {
    expect(typeof document).toBe('object')
    expect(document.createElement('div')).toBeInstanceOf(HTMLElement)
  })

  it('exposes import.meta.env.BASE_URL', () => {
    expect(typeof import.meta.env.BASE_URL).toBe('string')
  })
})
```

- [ ] **Step 11: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `vitest: command not found` or `Cannot find package 'vitest'`, because dependencies are not installed yet.

- [ ] **Step 12: Install dependencies**

Run: `npm install`
Expected: `node_modules/` created, no `ERR!` lines. Peer-dependency warnings are acceptable.

- [ ] **Step 13: Run the test to verify it passes**

Run: `npm test`
Expected: PASS — 2 passed.

- [ ] **Step 14: Verify the type-check and build**

Run: `npm run build`
Expected: `tsc --noEmit` silent, then `vite build` writes `dist/`. `dist/` must contain `index.html` and an `assets/` directory.

Note: `vite build` copies all of `public/` into `dist/`, so `dist/media/` will be ~111 MB. That is expected and is what gets deployed.

---

### Task 2: Design tokens and global styles

Translates `DESIGN-bmw-m.md`'s YAML front-matter into CSS custom properties, once, so no component ever writes a literal colour or size.

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`
- Modify: `src/main.tsx` (import both stylesheets)
- Test: `tests/styles/tokens.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: CSS custom properties on `:root` — the full colour, spacing, radius, and type scale. The gradient `--m-stripe` and the layout constant `--max-content` are the two composite tokens components rely on.

- [ ] **Step 1: Write the failing test `tests/styles/tokens.test.ts`**

The test reads the stylesheet as text rather than through jsdom's CSSOM, because jsdom does not resolve custom properties across imported sheets. It guards the two failure modes that matter: a token from the design doc missing entirely, and a colour drifting from the documented hex.

```ts
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
    expect(css).toContain('max-width: 767px')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/styles/tokens.test.ts`
Expected: FAIL — `ENOENT: no such file or directory ... src/styles/tokens.css`.

- [ ] **Step 3: Write `src/styles/tokens.css`**

```css
:root {
  /* ---- Colour: surface ---- */
  --color-canvas: #000000;
  --color-surface-soft: #0d0d0d;
  --color-surface-card: #1a1a1a;
  --color-surface-elevated: #262626;
  --color-carbon-gray: #2b2b2b;

  /* ---- Colour: hairlines ---- */
  --color-hairline: #3c3c3c;
  --color-hairline-strong: #262626;

  /* ---- Colour: text ---- */
  --color-ink: #ffffff;
  --color-body: #bbbbbb;
  --color-body-strong: #e6e6e6;
  --color-muted: #7e7e7e;

  /* ---- Colour: M tricolor (brand identity only) ---- */
  --color-m-blue-light: #0066b1;
  --color-m-blue-dark: #1c69d4;
  --color-m-red: #e22718;

  /* ---- Colour: semantic ---- */
  --color-warning: #f4b400;
  --color-success: #0fa336;

  /* ---- Spacing (base unit 4px) ---- */
  --space-xxs: 4px;
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 40px;
  --space-xxl: 64px;
  --space-section: 96px;

  /* ---- Radius: 0 by default, circular for icon buttons ---- */
  --radius-none: 0px;
  --radius-sm: 4px;
  --radius-full: 9999px;

  /* ---- Type ---- */
  --font-display: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    sans-serif;
  --weight-display: 700;
  --weight-body: 300;
  --tracking-label: 1.5px;
  --tracking-display: -0.5px;

  --size-display-xl: 80px;
  --size-display-lg: 56px;
  --size-display-md: 40px;
  --size-display-sm: 32px;
  --size-title-lg: 24px;
  --size-title-md: 20px;
  --size-title-sm: 18px;
  --size-label: 14px;
  --size-body-md: 16px;
  --size-body-sm: 14px;
  --size-caption: 12px;

  /* ---- Layout ---- */
  --max-content: 1440px;
  --nav-height: 64px;

  /* ---- The M stripe: three hard stops, no blend ---- */
  --m-stripe: linear-gradient(
    90deg,
    var(--color-m-blue-light) 0 33.33%,
    var(--color-m-blue-dark) 33.33% 66.66%,
    var(--color-m-red) 66.66% 100%
  );
}

/* Mobile: the design document scales the hero 80 -> 48px below 768px. */
@media (max-width: 767px) {
  :root {
    --size-display-xl: 48px;
    --size-display-lg: 36px;
    --size-display-md: 28px;
    --size-display-sm: 24px;
    --space-section: 56px;
    --space-xxl: 40px;
  }
}
```

- [ ] **Step 4: Write `src/styles/global.css`**

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--color-canvas);
  color: var(--color-body);
  font-family: var(--font-display);
  font-weight: var(--weight-body);
  font-size: var(--size-body-md);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

h1,
h2,
h3 {
  margin: 0;
  color: var(--color-ink);
  font-weight: var(--weight-display);
  letter-spacing: var(--tracking-display);
  text-transform: uppercase;
}

h1 {
  font-size: var(--size-display-xl);
  line-height: 1;
}

h2 {
  font-size: var(--size-display-lg);
  line-height: 1.05;
}

h3 {
  font-size: var(--size-title-lg);
  line-height: 1.3;
  letter-spacing: 0;
}

p {
  margin: 0;
}

a {
  color: var(--color-ink);
  text-decoration: none;
}

/* Focus is the only "decoration" the system allows itself. */
:focus-visible {
  outline: 2px solid var(--color-ink);
  outline-offset: 2px;
}

button {
  font: inherit;
  color: inherit;
  background: none;
  border: none;
  border-radius: var(--radius-none);
  cursor: pointer;
}

video {
  display: block;
  max-width: 100%;
}
```

- [ ] **Step 5: Import both stylesheets in `src/main.tsx`**

Add these two lines directly below the existing `import App from './App'`:

```tsx
import './styles/tokens.css'
import './styles/global.css'
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test -- tests/styles/tokens.test.ts`
Expected: PASS — all token and value assertions green.

- [ ] **Step 7: Verify**

Run: `npm run typecheck && npm test`
Expected: no type errors; all tests pass.

---

### Task 3: Data model and group 0 content structure

Establishes the structure/text split: this task owns identity and media paths only, and deliberately contains no human-readable prose.

**Files:**
- Create: `src/data/types.ts`, `src/data/groups.ts`, `src/lib/media.ts`
- Test: `tests/data/groups.test.ts`, `tests/lib/media.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `interface Exercise { readonly id: string; readonly video: string }` — `video` is a **filename only**, e.g. `'1-knee-side-drops.mp4'`.
  - `interface Group { readonly id: string; readonly order: number; readonly mediaDir: string; readonly exercises: readonly Exercise[] }`
  - `const groups: readonly Group[]`
  - `function findGroup(id: string): Group | undefined`
  - `function findExercise(group: Group, exerciseId: string): Exercise | undefined`
  - `function mediaUrl(group: Group, exercise: Exercise): string`

- [ ] **Step 1: Write the failing test `tests/data/groups.test.ts`**

The media-integrity test is the important one: it fails the build if a video filename in `groups.ts` does not name a real file on disk, which is the single easiest mistake to make when adding a group later.

```ts
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { findExercise, findGroup, groups } from '../../src/data/groups'
import type { Exercise, Group } from '../../src/data/types'

describe('groups data', () => {
  it('registers exactly one group, the warm-up group', () => {
    expect(groups).toHaveLength(1)
    expect(groups[0].id).toBe('warm-up')
    expect(groups[0].mediaDir).toBe('0-warm-up-and-postural-exercises')
  })

  it('lists the eight warm-up exercises in training order', () => {
    expect(groups[0].exercises.map((e: Exercise) => e.id)).toEqual([
      'knee-side-drops',
      'supine-straight-leg-circle',
      'bodyweight-glute-bridge',
      'scapular-retraction',
      'thoracic-extension',
      'elbow-thoracic-rotation',
      'prone-swimmer',
      'prone-w',
    ])
  })

  it('uses unique exercise ids within every group', () => {
    for (const group of groups) {
      const ids: string[] = group.exercises.map((e: Exercise) => e.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it('uses unique group ids', () => {
    const ids: string[] = groups.map((g: Group) => g.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('points every exercise at a video file that exists on disk', () => {
    for (const group of groups) {
      for (const exercise of group.exercises) {
        const path: string = join(
          process.cwd(),
          'public/media',
          group.mediaDir,
          exercise.video,
        )
        expect(existsSync(path), `missing video: ${path}`).toBe(true)
      }
    }
  })

  it('finds a group by id and returns undefined for an unknown id', () => {
    expect(findGroup('warm-up')?.id).toBe('warm-up')
    expect(findGroup('nope')).toBeUndefined()
  })

  it('finds an exercise within a group and returns undefined for an unknown id', () => {
    const group: Group = groups[0]
    expect(findExercise(group, 'prone-w')?.video).toBe('8-prone-w.mp4')
    expect(findExercise(group, 'nope')).toBeUndefined()
  })
})
```

- [ ] **Step 2: Write the failing test `tests/lib/media.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { groups } from '../../src/data/groups'
import { mediaUrl } from '../../src/lib/media'
import type { Exercise, Group } from '../../src/data/types'

describe('mediaUrl', () => {
  it('composes a URL from the base path, group media dir, and filename', () => {
    const group: Group = groups[0]
    const exercise: Exercise = group.exercises[0]
    expect(mediaUrl(group, exercise)).toBe(
      `${import.meta.env.BASE_URL}media/0-warm-up-and-postural-exercises/1-knee-side-drops.mp4`,
    )
  })

  it('never produces a double slash', () => {
    for (const group of groups) {
      for (const exercise of group.exercises) {
        expect(mediaUrl(group, exercise)).not.toMatch(/[^:]\/\//)
      }
    }
  })
})
```

- [ ] **Step 3: Run both tests to verify they fail**

Run: `npm test -- tests/data tests/lib`
Expected: FAIL — `Failed to resolve import "../../src/data/groups"`.

- [ ] **Step 4: Write `src/data/types.ts`**

```ts
export interface Exercise {
  /** Stable slug used in URLs and as the i18n key. */
  readonly id: string
  /** Filename only, relative to the group's media directory. */
  readonly video: string
}

export interface Group {
  /** Stable slug used in URLs and as the i18n key. */
  readonly id: string
  /** Display order, ascending. */
  readonly order: number
  /** Directory name under `public/media/`. */
  readonly mediaDir: string
  readonly exercises: readonly Exercise[]
}
```

- [ ] **Step 5: Write `src/data/groups.ts`**

Structure only — no titles, no reps. Those live in the locale files, keyed by these ids.

```ts
import type { Exercise, Group } from './types'

/**
 * Registered groups, in display order.
 *
 * Adding a group is two edits: append a Group here, then add its text block to
 * BOTH src/i18n/en.ts and src/i18n/tr.ts. The compiler enforces the second.
 * Media for six further groups is already on disk under public/media/.
 */
export const groups: readonly Group[] = [
  {
    id: 'warm-up',
    order: 0,
    mediaDir: '0-warm-up-and-postural-exercises',
    exercises: [
      { id: 'knee-side-drops', video: '1-knee-side-drops.mp4' },
      { id: 'supine-straight-leg-circle', video: '2-supine-straight-leg-circle.mp4' },
      { id: 'bodyweight-glute-bridge', video: '3-bodyweight-glute-bridge.mp4' },
      { id: 'scapular-retraction', video: '4-scapular-retraction.mp4' },
      { id: 'thoracic-extension', video: '5-thoracic-extension.mp4' },
      { id: 'elbow-thoracic-rotation', video: '6-elbow-thoracic-rotation.mp4' },
      { id: 'prone-swimmer', video: '7-prone-swimmer.mp4' },
      { id: 'prone-w', video: '8-prone-w.mp4' },
    ],
  },
]

export function findGroup(id: string): Group | undefined {
  return groups.find((group: Group): boolean => group.id === id)
}

export function findExercise(
  group: Group,
  exerciseId: string,
): Exercise | undefined {
  return group.exercises.find(
    (exercise: Exercise): boolean => exercise.id === exerciseId,
  )
}
```

- [ ] **Step 6: Write `src/lib/media.ts`**

```ts
import type { Exercise, Group } from '../data/types'

/**
 * Absolute URL for an exercise video.
 *
 * import.meta.env.BASE_URL always ends in '/', and is '/' under Vitest but
 * '/training-plan/' in a production build — which is why no component may
 * hard-code a media path.
 */
export function mediaUrl(group: Group, exercise: Exercise): string {
  return `${import.meta.env.BASE_URL}media/${group.mediaDir}/${exercise.video}`
}
```

- [ ] **Step 7: Run both tests to verify they pass**

Run: `npm test -- tests/data tests/lib`
Expected: PASS — including the eight on-disk video existence checks.

- [ ] **Step 8: Verify**

Run: `npm run typecheck && npm test`
Expected: no type errors; all tests pass.

---

### Task 4: Internationalisation foundation

The dictionary, both locales, persistence, and the provider. `tr` is typed as `typeof en`, so from here on a group added to `en` and forgotten in `tr` fails `npm run typecheck`.

**Files:**
- Create: `src/i18n/en.ts`, `src/i18n/tr.ts`, `src/i18n/storage.ts`, `src/i18n/index.tsx`
- Test: `tests/i18n/dictionary.test.ts`, `tests/i18n/storage.test.ts`, `tests/i18n/provider.test.tsx`

**Interfaces:**
- Consumes: `groups`, `Group`, `Exercise` from Task 3.
- Produces:
  - `type Language = 'en' | 'tr'`, `const LANGUAGES: readonly Language[]`
  - `type Dictionary = typeof en`
  - `const en: { ui: {...}; groups: Record<'warm-up', GroupText> }` — see Step 4 for the exact shape
  - `const tr: Dictionary`
  - `const STORAGE_KEY = 'training-plan.lang'`
  - `function loadLanguage(): Language`, `function saveLanguage(language: Language): void`
  - `function LanguageProvider(props: { children: ReactNode; initial?: Language }): JSX.Element`
  - `function useT(): Dictionary` — the active dictionary
  - `function useLanguage(): { language: Language; setLanguage: (language: Language) => void }`

- [ ] **Step 1: Write the failing test `tests/i18n/dictionary.test.ts`**

Key-parity is checked at runtime as well as by the compiler, because the runtime version produces a readable diff naming the missing key, while the compile error points at the whole object.

```ts
import { describe, expect, it } from 'vitest'
import { groups } from '../../src/data/groups'
import { en } from '../../src/i18n/en'
import { tr } from '../../src/i18n/tr'
import type { Exercise, Group } from '../../src/data/types'

function keyPaths(value: unknown, prefix: string = ''): string[] {
  if (typeof value !== 'object' || value === null) {
    return [prefix]
  }
  return Object.entries(value as Record<string, unknown>).flatMap(
    ([key, child]: [string, unknown]): string[] =>
      keyPaths(child, prefix ? `${prefix}.${key}` : key),
  )
}

describe('dictionaries', () => {
  it('gives Turkish exactly the same keys as English', () => {
    expect(keyPaths(tr).sort()).toEqual(keyPaths(en).sort())
  })

  it('covers every registered group', () => {
    for (const group of groups) {
      expect(Object.keys(en.groups)).toContain(group.id)
      expect(Object.keys(tr.groups)).toContain(group.id)
    }
  })

  it('covers every registered exercise in both languages', () => {
    for (const group of groups as Group[]) {
      const enGroup = en.groups[group.id as keyof typeof en.groups]
      const trGroup = tr.groups[group.id as keyof typeof tr.groups]
      for (const exercise of group.exercises as Exercise[]) {
        expect(
          Object.keys(enGroup.exercises),
          `en missing ${group.id}/${exercise.id}`,
        ).toContain(exercise.id)
        expect(
          Object.keys(trGroup.exercises),
          `tr missing ${group.id}/${exercise.id}`,
        ).toContain(exercise.id)
      }
    }
  })

  it('has no group or exercise text that is not backed by real data', () => {
    const groupIds: string[] = groups.map((g: Group) => g.id)
    expect(Object.keys(en.groups).sort()).toEqual([...groupIds].sort())
    for (const group of groups as Group[]) {
      const exerciseIds: string[] = group.exercises.map((e: Exercise) => e.id)
      const textIds: string[] = Object.keys(
        en.groups[group.id as keyof typeof en.groups].exercises,
      )
      expect(textIds.sort()).toEqual([...exerciseIds].sort())
    }
  })

  it('actually translates the reps, not just copies them', () => {
    expect(en.groups['warm-up'].exercises['knee-side-drops'].reps).toBe('20 reps')
    expect(tr.groups['warm-up'].exercises['knee-side-drops'].reps).toBe(
      '20 tekrar',
    )
  })

  it('translates the UI chrome', () => {
    expect(en.ui.appTitle).toBe('TRAINING PLAN')
    expect(tr.ui.appTitle).toBe('ANTRENMAN PLANI')
    expect(en.ui.repsLabel).not.toBe(tr.ui.repsLabel)
  })

  it('formats counted strings in both languages', () => {
    expect(en.ui.exerciseCount(8)).toBe('8 exercises')
    expect(tr.ui.exerciseCount(8)).toBe('8 egzersiz')
  })
})
```

- [ ] **Step 2: Write the failing test `tests/i18n/storage.test.ts`**

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { STORAGE_KEY, loadLanguage, saveLanguage } from '../../src/i18n/storage'

describe('language storage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  it('defaults to English when nothing is stored', () => {
    expect(loadLanguage()).toBe('en')
  })

  it('restores a stored Turkish preference', () => {
    window.localStorage.setItem(STORAGE_KEY, 'tr')
    expect(loadLanguage()).toBe('tr')
  })

  it('falls back to English for an unrecognised stored value', () => {
    window.localStorage.setItem(STORAGE_KEY, 'klingon')
    expect(loadLanguage()).toBe('en')
  })

  it('persists a language', () => {
    saveLanguage('tr')
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('tr')
  })

  it('survives localStorage throwing', () => {
    vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('denied')
    })
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('denied')
    })
    expect(loadLanguage()).toBe('en')
    expect(() => saveLanguage('tr')).not.toThrow()
  })
})
```

- [ ] **Step 3: Write the failing test `tests/i18n/provider.test.tsx`**

```tsx
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
```

- [ ] **Step 4: Run the three tests to verify they fail**

Run: `npm test -- tests/i18n`
Expected: FAIL — `Failed to resolve import "../../src/i18n/en"`.

- [ ] **Step 5: Write `src/i18n/en.ts`**

English is the source of truth for the *shape*: `Dictionary` is derived from it with `typeof`, which is what makes the Turkish file's completeness a compile-time property. The optional `sets`/`rest`/`note` fields are declared on `ExerciseText` for the later groups; group 0 does not use them.

```ts
export interface ExerciseText {
  /** Movement name. Kept in its common gym form, which is English even in Turkish. */
  name: string
  /** Prescribed volume, e.g. '20 reps' or '15 right / 15 left'. */
  reps: string
  /** Set count, used by the workout groups. */
  sets?: string
  /** Rest between sets, used by the workout groups. */
  rest?: string
  /** Tempo / rest-pause / drop-set explanation, used by the workout groups. */
  note?: string
}

/**
 * Keeps the exercise KEYS literal (so tr.ts must match them exactly) while
 * typing the VALUES as ExerciseText (so the optional sets/rest/note fields are
 * accessible on every exercise, not just the ones that populate them).
 *
 * Without this, `Dictionary = typeof en` would infer group 0's exercises as
 * `{ name: string; reps: string }` and ExercisePage's `text.sets` would not
 * compile.
 */
function defineExercises<K extends string>(
  map: Record<K, ExerciseText>,
): Record<K, ExerciseText> {
  return map
}

export const en = {
  ui: {
    appTitle: 'TRAINING PLAN',
    tagline: 'Personal training programme',
    groupsHeading: 'GROUPS',
    exercisesHeading: 'EXERCISES',
    allGroups: 'ALL GROUPS',
    backToGroup: 'BACK TO GROUP',
    home: 'HOME',
    previous: 'PREVIOUS',
    next: 'NEXT',
    repsLabel: 'REPS',
    setsLabel: 'SETS',
    restLabel: 'REST',
    noteLabel: 'NOTE',
    languageLabel: 'Language',
    notFoundTitle: 'NOT FOUND',
    notFoundBody: 'That page does not exist.',
    videoUnsupported: 'Your browser cannot play this video.',
    exerciseCount: (count: number): string => `${count} exercises`,
    exercisePosition: (index: number, total: number): string =>
      `${index} / ${total}`,
  },
  groups: {
    'warm-up': {
      title: 'WARM-UP & POSTURAL EXERCISES',
      subtitle: 'Do these before every session.',
      exercises: defineExercises({
        'knee-side-drops': {
          name: 'KNEE SIDE DROPS',
          reps: '20 reps',
        },
        'supine-straight-leg-circle': {
          name: 'SUPINE STRAIGHT LEG CIRCLE',
          reps: '15 right / 15 left',
        },
        'bodyweight-glute-bridge': {
          name: 'BODYWEIGHT GLUTE BRIDGE',
          reps: '15 reps, 2 sets',
        },
        'scapular-retraction': {
          name: 'SCAPULAR RETRACTION',
          reps: '15 reps',
        },
        'thoracic-extension': {
          name: 'THORACIC EXTENSION',
          reps: '10 reps, 2 sets',
        },
        'elbow-thoracic-rotation': {
          name: 'ELBOW THORACIC ROTATION',
          reps: '10 right / 10 left, 2 sets each',
        },
        'prone-swimmer': {
          name: 'PRONE SWIMMER',
          reps: '10 reps, 2 sets',
        },
        'prone-w': {
          name: 'PRONE W',
          reps: '15 reps, 2 sets',
        },
      }),
    },
  },
}

/**
 * The dictionary contract, derived from English.
 *
 * Because this is `typeof en` rather than a hand-written interface, adding a
 * group or exercise to en.ts makes tr.ts a type error until it is translated.
 */
export type Dictionary = typeof en
```

- [ ] **Step 6: Write `src/i18n/tr.ts`**

Exercise *names* stay in their English gym form — that is what the author's own Turkish source files do (`ONE ARM DUMBELL ROW`, `6 tekrar`). Reps, labels, and chrome are fully translated.

Note this file does NOT use `defineExercises` — it is annotated `: Dictionary`, so the object literal is checked against the contract directly. A missing or misspelled exercise key is a compile error here.

```ts
import type { Dictionary } from './en'

export const tr: Dictionary = {
  ui: {
    appTitle: 'ANTRENMAN PLANI',
    tagline: 'Kişisel antrenman programı',
    groupsHeading: 'GRUPLAR',
    exercisesHeading: 'EGZERSİZLER',
    allGroups: 'TÜM GRUPLAR',
    backToGroup: 'GRUBA DÖN',
    home: 'ANA SAYFA',
    previous: 'ÖNCEKİ',
    next: 'SONRAKİ',
    repsLabel: 'TEKRAR',
    setsLabel: 'SET',
    restLabel: 'DİNLENME',
    noteLabel: 'NOT',
    languageLabel: 'Dil',
    notFoundTitle: 'BULUNAMADI',
    notFoundBody: 'Böyle bir sayfa yok.',
    videoUnsupported: 'Tarayıcınız bu videoyu oynatamıyor.',
    exerciseCount: (count: number): string => `${count} egzersiz`,
    exercisePosition: (index: number, total: number): string =>
      `${index} / ${total}`,
  },
  groups: {
    'warm-up': {
      title: 'ISINMA VE POSTÜR EGZERSİZLERİ',
      subtitle: 'Her antrenmandan önce yap.',
      exercises: {
        'knee-side-drops': {
          name: 'KNEE SIDE DROPS',
          reps: '20 tekrar',
        },
        'supine-straight-leg-circle': {
          name: 'SUPINE STRAIGHT LEG CIRCLE',
          reps: '15 sağ / 15 sol',
        },
        'bodyweight-glute-bridge': {
          name: 'BODYWEIGHT GLUTE BRIDGE',
          reps: '15 tekrar, 2 set',
        },
        'scapular-retraction': {
          name: 'SCAPULAR RETRACTION',
          reps: '15 tekrar',
        },
        'thoracic-extension': {
          name: 'THORACIC EXTENSION',
          reps: '10 tekrar, 2 set',
        },
        'elbow-thoracic-rotation': {
          name: 'ELBOW THORACIC ROTATION',
          reps: '10 sağ / 10 sol, her biri 2 set',
        },
        'prone-swimmer': {
          name: 'PRONE SWIMMER',
          reps: '10 tekrar, 2 set',
        },
        'prone-w': {
          name: 'PRONE W',
          reps: '15 tekrar, 2 set',
        },
      },
    },
  },
}
```

- [ ] **Step 7: Write `src/i18n/storage.ts`**

Every access is wrapped: `localStorage` throws outright in some privacy modes, and a language preference is never worth a blank page.

```ts
export type Language = 'en' | 'tr'

export const LANGUAGES: readonly Language[] = ['en', 'tr']

export const DEFAULT_LANGUAGE: Language = 'en'

export const STORAGE_KEY = 'training-plan.lang'

function isLanguage(value: string | null): value is Language {
  return value !== null && (LANGUAGES as readonly string[]).includes(value)
}

export function loadLanguage(): Language {
  try {
    const stored: string | null = window.localStorage.getItem(STORAGE_KEY)
    return isLanguage(stored) ? stored : DEFAULT_LANGUAGE
  } catch {
    return DEFAULT_LANGUAGE
  }
}

export function saveLanguage(language: Language): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, language)
  } catch {
    // Preference is a convenience; a storage failure must not break the app.
  }
}
```

- [ ] **Step 8: Write `src/i18n/index.tsx`**

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { en, type Dictionary } from './en'
import { tr } from './tr'
import { loadLanguage, saveLanguage, type Language } from './storage'

export type { Dictionary } from './en'
export type { ExerciseText } from './en'
export { LANGUAGES, type Language } from './storage'

const dictionaries: Readonly<Record<Language, Dictionary>> = { en, tr }

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: Dictionary
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

interface LanguageProviderProps {
  children: ReactNode
  /** Overrides the stored preference. Used by tests. */
  initial?: Language
}

export function LanguageProvider({ children, initial }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(
    (): Language => initial ?? loadLanguage(),
  )

  useEffect((): void => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = useCallback((next: Language): void => {
    setLanguageState(next)
    saveLanguage(next)
  }, [])

  const value: LanguageContextValue = useMemo(
    (): LanguageContextValue => ({
      language,
      setLanguage,
      t: dictionaries[language],
    }),
    [language, setLanguage],
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

function useLanguageContext(): LanguageContextValue {
  const context: LanguageContextValue | null = useContext(LanguageContext)
  if (context === null) {
    throw new Error('useT / useLanguage must be used inside a LanguageProvider')
  }
  return context
}

/** The active dictionary. */
export function useT(): Dictionary {
  return useLanguageContext().t
}

export function useLanguage(): {
  language: Language
  setLanguage: (language: Language) => void
} {
  const { language, setLanguage } = useLanguageContext()
  return { language, setLanguage }
}
```

- [ ] **Step 9: Run the tests to verify they pass**

Run: `npm test -- tests/i18n`
Expected: PASS — all dictionary, storage, and provider tests green.

- [ ] **Step 10: Prove the compile-time guard actually works**

This step verifies the plan's central i18n claim rather than assuming it.

Temporarily add this line to `src/i18n/en.ts`, inside the `ui` block:

```ts
    temporaryProbe: 'PROBE',
```

Run: `npm run typecheck`
Expected: FAIL — an error on `src/i18n/tr.ts` reporting that `temporaryProbe` is missing.

Now **remove the line again** and re-run `npm run typecheck`.
Expected: PASS. If the first run did not fail, the `Dictionary` type is not wired correctly — stop and fix it before continuing.

- [ ] **Step 11: Verify**

Run: `npm run typecheck && npm test`
Expected: no type errors; all tests pass.

---

### Task 5: Application shell and routing

The persistent chrome — nav, M stripe, language switch, footer — plus the router and the not-found view. Pages are stubs here; Tasks 6-8 fill them in.

**Files:**
- Create: `src/components/MStripe.tsx`, `src/components/MStripe.module.css`, `src/components/LanguageSwitch.tsx`, `src/components/LanguageSwitch.module.css`, `src/components/TopNav.tsx`, `src/components/TopNav.module.css`, `src/components/SiteFooter.tsx`, `src/components/SiteFooter.module.css`, `src/pages/NotFoundPage.tsx`, `src/pages/GroupsPage.tsx`, `src/pages/GroupPage.tsx`, `src/pages/ExercisePage.tsx`, `src/App.module.css`
- Modify: `src/App.tsx` (replace placeholder entirely), `src/main.tsx` (wrap in providers)
- Test: `tests/helpers/render.tsx`, `tests/app/shell.test.tsx`, `tests/app/routing.test.tsx`

**Interfaces:**
- Consumes: `useT`, `useLanguage`, `LANGUAGES`, `LanguageProvider` from Task 4.
- Produces:
  - `function MStripe(props: { className?: string }): JSX.Element` — a 4px tricolor bar
  - `function TopNav(): JSX.Element`
  - `function SiteFooter(): JSX.Element`
  - `function LanguageSwitch(): JSX.Element`
  - `function App(): JSX.Element` — layout plus `<Routes>`; expects a Router and a `LanguageProvider` above it
  - `renderAt(path: string, options?: { language?: Language }): RenderResult` from the test helper
  - Page stubs `GroupsPage`, `GroupPage`, `ExercisePage`, `NotFoundPage`

- [ ] **Step 1: Write the test helper `tests/helpers/render.tsx`**

Every page test routes through this, so route params come from the real router rather than being mocked.

```tsx
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
```

- [ ] **Step 2: Write the failing test `tests/app/shell.test.tsx`**

```tsx
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
```

- [ ] **Step 3: Write the failing test `tests/app/routing.test.tsx`**

```tsx
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
```

- [ ] **Step 4: Run both tests to verify they fail**

Run: `npm test -- tests/app`
Expected: FAIL — `Failed to resolve import "react-router-dom"` is already installed, so the failure is on missing components / `getByTestId('groups-page')` finding nothing.

- [ ] **Step 5: Write `src/components/MStripe.tsx` and its stylesheet**

```tsx
import styles from './MStripe.module.css'

interface MStripeProps {
  className?: string
}

/**
 * The M tricolor divider. Decorative only — never an action surface.
 */
export function MStripe({ className }: MStripeProps) {
  return (
    <div
      data-testid="m-stripe"
      aria-hidden="true"
      className={className ? `${styles.stripe} ${className}` : styles.stripe}
    />
  )
}
```

```css
/* src/components/MStripe.module.css */
.stripe {
  height: 4px;
  width: 100%;
  background: var(--m-stripe);
}
```

- [ ] **Step 6: Write `src/components/LanguageSwitch.tsx` and its stylesheet**

The active language is marked by the M stripe underneath it — the design document's one sanctioned use of the tricolor as a state indicator.

```tsx
import { LANGUAGES, useLanguage, useT, type Language } from '../i18n'
import styles from './LanguageSwitch.module.css'

const LABELS: Readonly<Record<Language, string>> = { en: 'EN', tr: 'TR' }

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage()
  const t = useT()

  return (
    <div className={styles.switch} role="group" aria-label={t.ui.languageLabel}>
      {LANGUAGES.map((candidate: Language) => {
        const isActive: boolean = candidate === language
        return (
          <button
            key={candidate}
            type="button"
            className={isActive ? `${styles.option} ${styles.active}` : styles.option}
            aria-current={isActive ? 'true' : undefined}
            onClick={() => setLanguage(candidate)}
          >
            {LABELS[candidate]}
          </button>
        )
      })}
    </div>
  )
}
```

```css
/* src/components/LanguageSwitch.module.css */
.switch {
  display: flex;
  gap: var(--space-md);
}

.option {
  position: relative;
  padding: var(--space-sm) var(--space-xs);
  min-height: 48px;
  color: var(--color-muted);
  font-size: var(--size-label);
  font-weight: var(--weight-display);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
}

.active {
  color: var(--color-ink);
}

/* Active state marked by the M tricolor, per the design system. */
.active::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  bottom: 4px;
  height: 4px;
  background: var(--m-stripe);
}
```

- [ ] **Step 7: Write `src/components/TopNav.tsx` and its stylesheet**

```tsx
import { Link } from 'react-router-dom'
import { useT } from '../i18n'
import { LanguageSwitch } from './LanguageSwitch'
import { MStripe } from './MStripe'
import styles from './TopNav.module.css'

export function TopNav() {
  const t = useT()

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link to="/" className={styles.brand}>
          {t.ui.appTitle}
        </Link>
        <LanguageSwitch />
      </div>
      <MStripe />
    </header>
  )
}
```

```css
/* src/components/TopNav.module.css */
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--color-canvas);
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  height: var(--nav-height);
  max-width: var(--max-content);
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

.brand {
  color: var(--color-ink);
  font-size: var(--size-label);
  font-weight: var(--weight-display);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
}
```

- [ ] **Step 8: Write `src/components/SiteFooter.tsx` and its stylesheet**

```tsx
import { useT } from '../i18n'
import styles from './SiteFooter.module.css'

export function SiteFooter() {
  const t = useT()

  // Only the app title. The tagline belongs to the hero on the groups page;
  // repeating it here would make it ambiguous to query in tests.
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.line}>{t.ui.appTitle}</p>
      </div>
    </footer>
  )
}
```

```css
/* src/components/SiteFooter.module.css */
.footer {
  border-top: 1px solid var(--color-hairline);
  background-color: var(--color-canvas);
  padding: var(--space-xxl) 0;
}

.inner {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md) var(--space-xl);
  justify-content: space-between;
  max-width: var(--max-content);
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

.line {
  color: var(--color-muted);
  font-size: var(--size-caption);
  letter-spacing: 0.5px;
}
```

- [ ] **Step 9: Write `src/pages/NotFoundPage.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { useT } from '../i18n'

export function NotFoundPage() {
  const t = useT()

  return (
    <section data-testid="not-found-page">
      <h1>{t.ui.notFoundTitle}</h1>
      <p>{t.ui.notFoundBody}</p>
      <Link to="/">{t.ui.home}</Link>
    </section>
  )
}
```

- [ ] **Step 10: Write the three page stubs**

Filled in by Tasks 6, 7, and 8 respectively. The `data-testid` values are what Task 5's routing test asserts on, so they must not change later.

```tsx
// src/pages/GroupsPage.tsx
export function GroupsPage() {
  return <section data-testid="groups-page" />
}
```

```tsx
// src/pages/GroupPage.tsx
export function GroupPage() {
  return <section data-testid="group-page" />
}
```

```tsx
// src/pages/ExercisePage.tsx
export function ExercisePage() {
  return <section data-testid="exercise-page" />
}
```

- [ ] **Step 11: Write `src/App.tsx`, replacing the placeholder entirely**

```tsx
import { Route, Routes } from 'react-router-dom'
import { SiteFooter } from './components/SiteFooter'
import { TopNav } from './components/TopNav'
import { ExercisePage } from './pages/ExercisePage'
import { GroupPage } from './pages/GroupPage'
import { GroupsPage } from './pages/GroupsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import styles from './App.module.css'

/**
 * Layout and routes. Expects a Router and a LanguageProvider above it, which
 * is what lets tests mount it under a MemoryRouter.
 */
export default function App() {
  return (
    <div className={styles.shell}>
      <TopNav />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<GroupsPage />} />
          <Route path="/g/:groupId" element={<GroupPage />} />
          <Route path="/g/:groupId/e/:exerciseId" element={<ExercisePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}
```

```css
/* src/App.module.css */
.shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
  max-width: var(--max-content);
  width: 100%;
  margin: 0 auto;
  padding: var(--space-xxl) var(--space-lg) var(--space-section);
}
```

- [ ] **Step 12: Rewrite `src/main.tsx` to install the providers**

`HashRouter` rather than `BrowserRouter`: GitHub Pages cannot rewrite unknown paths to `index.html`, so a history-mode deep link would 404 on first load.

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { LanguageProvider } from './i18n'
import './styles/tokens.css'
import './styles/global.css'

const rootElement: HTMLElement | null = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element #root not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <LanguageProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </LanguageProvider>
  </StrictMode>,
)
```

- [ ] **Step 13: Run both tests to verify they pass**

Run: `npm test -- tests/app`
Expected: PASS — shell and routing tests green.

- [ ] **Step 14: Verify**

Run: `npm run typecheck && npm test`
Expected: no type errors; all tests pass.

---

### Task 6: Groups page

The landing view: a hero band and the list of groups. Built as a grid so it still reads correctly when the other six groups are registered.

**Files:**
- Create: `src/components/GroupCard.tsx`, `src/components/GroupCard.module.css`, `src/pages/GroupsPage.module.css`
- Modify: `src/pages/GroupsPage.tsx` (replace the stub)
- Test: `tests/pages/groups-page.test.tsx`

**Interfaces:**
- Consumes: `groups` (Task 3), `useT` (Task 4), `MStripe` (Task 5).
- Produces: `function GroupCard(props: { group: Group }): JSX.Element`. Card links to `/g/${group.id}` and shows the localised title, subtitle, and exercise count.

- [ ] **Step 1: Write the failing test `tests/pages/groups-page.test.tsx`**

```tsx
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/pages/groups-page.test.tsx`
Expected: FAIL — no heading found, because `GroupsPage` is still an empty stub.

- [ ] **Step 3: Write `src/components/GroupCard.tsx` and its stylesheet**

```tsx
import { Link } from 'react-router-dom'
import type { Group } from '../data/types'
import { useT } from '../i18n'
import styles from './GroupCard.module.css'

interface GroupCardProps {
  group: Group
}

export function GroupCard({ group }: GroupCardProps) {
  const t = useT()
  const text = t.groups[group.id as keyof typeof t.groups]

  return (
    <Link
      to={`/g/${group.id}`}
      className={styles.card}
      data-testid="group-card"
    >
      <span className={styles.index}>
        {String(group.order).padStart(2, '0')}
      </span>
      <h2 className={styles.title} data-testid="group-card-title">
        {text.title}
      </h2>
      <p className={styles.subtitle}>{text.subtitle}</p>
      <p className={styles.count}>{t.ui.exerciseCount(group.exercises.length)}</p>
    </Link>
  )
}
```

```css
/* src/components/GroupCard.module.css */
.card {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  background-color: var(--color-surface-card);
  border-radius: var(--radius-none);
  padding: var(--space-lg);
  min-height: 220px;
}

.index {
  color: var(--color-muted);
  font-size: var(--size-caption);
  font-weight: var(--weight-display);
  letter-spacing: var(--tracking-label);
}

.title {
  font-size: var(--size-display-md);
  line-height: 1.1;
  margin-top: auto;
}

.subtitle {
  color: var(--color-body);
  font-size: var(--size-body-md);
}

.count {
  color: var(--color-muted);
  font-size: var(--size-label);
  font-weight: var(--weight-display);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
}
```

- [ ] **Step 4: Write `src/pages/GroupsPage.tsx`, replacing the stub**

```tsx
import { GroupCard } from '../components/GroupCard'
import { MStripe } from '../components/MStripe'
import { groups } from '../data/groups'
import type { Group } from '../data/types'
import { useT } from '../i18n'
import styles from './GroupsPage.module.css'

export function GroupsPage() {
  const t = useT()
  const ordered: Group[] = [...groups].sort(
    (a: Group, b: Group): number => a.order - b.order,
  )

  return (
    <section data-testid="groups-page">
      <div className={styles.hero}>
        <h1>{t.ui.appTitle}</h1>
        <p className={styles.tagline}>{t.ui.tagline}</p>
      </div>
      <MStripe className={styles.divider} />
      <h2 className={styles.heading}>{t.ui.groupsHeading}</h2>
      <div className={styles.grid}>
        {ordered.map((group: Group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </section>
  )
}
```

```css
/* src/pages/GroupsPage.module.css */
.hero {
  padding: var(--space-xxl) 0;
}

.tagline {
  margin-top: var(--space-md);
  color: var(--color-body-strong);
  font-size: var(--size-title-sm);
}

.divider {
  margin-bottom: var(--space-xl);
}

.heading {
  margin-bottom: var(--space-lg);
  font-size: var(--size-label);
  font-weight: var(--weight-display);
  letter-spacing: var(--tracking-label);
}

/* 3-up desktop, 2-up tablet, 1-up mobile — columns reduce, cards do not shrink. */
.grid {
  display: grid;
  gap: var(--space-lg);
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- tests/pages/groups-page.test.tsx`
Expected: PASS.

- [ ] **Step 6: Verify**

Run: `npm run typecheck && npm test`
Expected: no type errors; all tests pass.

---

### Task 7: Group page

The exercise list for one group: hairline-separated rows carrying number, name, and reps. No video elements here — that is deliberate, so browsing a group costs no bandwidth.

**Files:**
- Create: `src/components/ExerciseRow.tsx`, `src/components/ExerciseRow.module.css`, `src/components/BackLink.tsx`, `src/components/BackLink.module.css`, `src/pages/GroupPage.module.css`
- Modify: `src/pages/GroupPage.tsx` (replace the stub)
- Test: `tests/pages/group-page.test.tsx`

**Interfaces:**
- Consumes: `findGroup` (Task 3), `useT` (Task 4), `MStripe` (Task 5).
- Produces:
  - `function BackLink(props: { to: string; label: string }): JSX.Element`
  - `function ExerciseRow(props: { group: Group; exercise: Exercise; position: number }): JSX.Element` — links to `/g/${group.id}/e/${exercise.id}`

- [ ] **Step 1: Write the failing test `tests/pages/group-page.test.tsx`**

```tsx
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/pages/group-page.test.tsx`
Expected: FAIL — no heading found; `GroupPage` is still a stub.

- [ ] **Step 3: Write `src/components/BackLink.tsx` and its stylesheet**

```tsx
import { Link } from 'react-router-dom'
import styles from './BackLink.module.css'

interface BackLinkProps {
  to: string
  label: string
}

export function BackLink({ to, label }: BackLinkProps) {
  return (
    <Link to={to} className={styles.link}>
      <span aria-hidden="true">&larr;</span> {label}
    </Link>
  )
}
```

```css
/* src/components/BackLink.module.css */
.link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  min-height: 48px;
  color: var(--color-ink);
  font-size: var(--size-label);
  font-weight: var(--weight-display);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
}
```

- [ ] **Step 4: Write `src/components/ExerciseRow.tsx` and its stylesheet**

```tsx
import { Link } from 'react-router-dom'
import type { Exercise, Group } from '../data/types'
import { useT } from '../i18n'
import styles from './ExerciseRow.module.css'

interface ExerciseRowProps {
  group: Group
  exercise: Exercise
  /** 1-based position within the group. */
  position: number
}

export function ExerciseRow({ group, exercise, position }: ExerciseRowProps) {
  const t = useT()
  const groupText = t.groups[group.id as keyof typeof t.groups]
  const text = groupText.exercises[exercise.id as keyof typeof groupText.exercises]

  return (
    <Link
      to={`/g/${group.id}/e/${exercise.id}`}
      className={styles.row}
      data-testid="exercise-row"
    >
      <span className={styles.number} data-testid="exercise-row-number">
        {String(position).padStart(2, '0')}
      </span>
      <span className={styles.name} data-testid="exercise-row-name">
        {text.name}
      </span>
      <span className={styles.reps}>{text.reps}</span>
      <span className={styles.chevron} aria-hidden="true">
        &rarr;
      </span>
    </Link>
  )
}
```

```css
/* src/components/ExerciseRow.module.css */
.row {
  display: grid;
  grid-template-columns: 48px 1fr auto 24px;
  align-items: center;
  gap: var(--space-md);
  min-height: 72px;
  padding: var(--space-md) 0;
  border-bottom: 1px solid var(--color-hairline);
}

.number {
  color: var(--color-muted);
  font-size: var(--size-caption);
  font-weight: var(--weight-display);
  letter-spacing: var(--tracking-label);
}

.name {
  color: var(--color-ink);
  font-size: var(--size-title-lg);
  font-weight: var(--weight-display);
  text-transform: uppercase;
}

.reps {
  color: var(--color-body);
  font-size: var(--size-body-md);
}

.chevron {
  color: var(--color-muted);
  text-align: right;
}

@media (max-width: 767px) {
  .row {
    grid-template-columns: 36px 1fr;
    row-gap: var(--space-xxs);
  }

  .name {
    font-size: var(--size-title-md);
  }

  /* Reps drop under the name; the chevron is redundant at this width. */
  .reps {
    grid-column: 2;
  }

  .chevron {
    display: none;
  }
}
```

- [ ] **Step 5: Write `src/pages/GroupPage.tsx`, replacing the stub**

```tsx
import { useParams } from 'react-router-dom'
import { BackLink } from '../components/BackLink'
import { ExerciseRow } from '../components/ExerciseRow'
import { MStripe } from '../components/MStripe'
import { findGroup } from '../data/groups'
import type { Exercise, Group } from '../data/types'
import { useT } from '../i18n'
import { NotFoundPage } from './NotFoundPage'
import styles from './GroupPage.module.css'

export function GroupPage() {
  const { groupId } = useParams<{ groupId: string }>()
  const t = useT()
  const group: Group | undefined = groupId ? findGroup(groupId) : undefined

  if (!group) {
    return <NotFoundPage />
  }

  const text = t.groups[group.id as keyof typeof t.groups]

  return (
    <section data-testid="group-page">
      <BackLink to="/" label={t.ui.allGroups} />
      <div className={styles.header}>
        <h1>{text.title}</h1>
        <p className={styles.subtitle}>{text.subtitle}</p>
      </div>
      <MStripe className={styles.divider} />
      <h2 className={styles.heading}>{t.ui.exercisesHeading}</h2>
      <div className={styles.list}>
        {group.exercises.map((exercise: Exercise, index: number) => (
          <ExerciseRow
            key={exercise.id}
            group={group}
            exercise={exercise}
            position={index + 1}
          />
        ))}
      </div>
    </section>
  )
}
```

```css
/* src/pages/GroupPage.module.css */
.header {
  padding: var(--space-xl) 0 var(--space-lg);
}

.subtitle {
  margin-top: var(--space-md);
  color: var(--color-body-strong);
  font-size: var(--size-title-sm);
}

.divider {
  margin-bottom: var(--space-xl);
}

.heading {
  margin-bottom: var(--space-xs);
  font-size: var(--size-label);
  font-weight: var(--weight-display);
  letter-spacing: var(--tracking-label);
}

.list {
  border-top: 1px solid var(--color-hairline);
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test -- tests/pages/group-page.test.tsx`
Expected: PASS.

- [ ] **Step 7: Verify**

Run: `npm run typecheck && npm test`
Expected: no type errors; all tests pass.

---

### Task 8: Exercise page

The detail view, and the only place a video loads. The video takes the structural role the hero photograph takes on BMW's own pages: full-bleed, 16:9, sharp corners.

**Files:**
- Create: `src/lib/navigation.ts`, `src/components/SpecCell.tsx`, `src/components/SpecCell.module.css`, `src/components/VideoPlayer.tsx`, `src/components/VideoPlayer.module.css`, `src/components/ExerciseNav.tsx`, `src/components/ExerciseNav.module.css`, `src/pages/ExercisePage.module.css`
- Modify: `src/pages/ExercisePage.tsx` (replace the stub)
- Test: `tests/lib/navigation.test.ts`, `tests/pages/exercise-page.test.tsx`

**Interfaces:**
- Consumes: `findGroup`, `findExercise` (Task 3), `mediaUrl` (Task 3), `useT` (Task 4), `MStripe`, `BackLink` (Tasks 5, 7).
- Produces:
  - `interface Neighbours<T> { index: number; previous: T | null; next: T | null }`
  - `function neighbours<T extends { id: string }>(items: readonly T[], id: string): Neighbours<T> | null`
  - `function SpecCell(props: { label: string; value: string }): JSX.Element`
  - `function VideoPlayer(props: { src: string; title: string; unsupportedMessage: string }): JSX.Element`
  - `function ExerciseNav(props: { group: Group; previous: Exercise | null; next: Exercise | null }): JSX.Element`

- [ ] **Step 1: Write the failing test `tests/lib/navigation.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { neighbours } from '../../src/lib/navigation'

interface Item {
  id: string
}

const items: readonly Item[] = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]

describe('neighbours', () => {
  it('returns null for an id that is not in the list', () => {
    expect(neighbours(items, 'zzz')).toBeNull()
  })

  it('has no previous at the start', () => {
    expect(neighbours(items, 'a')).toEqual({
      index: 0,
      previous: null,
      next: { id: 'b' },
    })
  })

  it('has both neighbours in the middle', () => {
    expect(neighbours(items, 'b')).toEqual({
      index: 1,
      previous: { id: 'a' },
      next: { id: 'c' },
    })
  })

  it('has no next at the end', () => {
    expect(neighbours(items, 'c')).toEqual({
      index: 2,
      previous: { id: 'b' },
      next: null,
    })
  })

  it('handles a single-item list', () => {
    expect(neighbours([{ id: 'only' }], 'only')).toEqual({
      index: 0,
      previous: null,
      next: null,
    })
  })

  it('handles an empty list', () => {
    expect(neighbours([], 'anything')).toBeNull()
  })
})
```

- [ ] **Step 2: Write the failing test `tests/pages/exercise-page.test.tsx`**

```tsx
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
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
    expect(video).toHaveAttribute('preload', 'metadata')
    expect(video).toHaveAttribute('playsinline')
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

  it('renders not-found for an unknown exercise', () => {
    renderAt('/g/warm-up/e/does-not-exist')
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument()
  })

  it('renders not-found for an unknown group', () => {
    renderAt('/g/nope/e/knee-side-drops')
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run both tests to verify they fail**

Run: `npm test -- tests/lib/navigation.test.ts tests/pages/exercise-page.test.tsx`
Expected: FAIL — `Failed to resolve import "../../src/lib/navigation"`, and no heading on the exercise page.

- [ ] **Step 4: Write `src/lib/navigation.ts`**

```ts
export interface Neighbours<T> {
  /** Zero-based index of the located item. */
  index: number
  previous: T | null
  next: T | null
}

/**
 * Locates an item by id and returns its immediate neighbours.
 * Returns null when the id is not present, which callers treat as not-found.
 */
export function neighbours<T extends { id: string }>(
  items: readonly T[],
  id: string,
): Neighbours<T> | null {
  const index: number = items.findIndex((item: T): boolean => item.id === id)
  if (index === -1) {
    return null
  }
  return {
    index,
    previous: index > 0 ? items[index - 1] : null,
    next: index < items.length - 1 ? items[index + 1] : null,
  }
}
```

- [ ] **Step 5: Write `src/components/SpecCell.tsx` and its stylesheet**

The design system's `spec-cell`: large value on top, small uppercase letterspaced label below.

```tsx
import styles from './SpecCell.module.css'

interface SpecCellProps {
  label: string
  value: string
}

export function SpecCell({ label, value }: SpecCellProps) {
  return (
    <div className={styles.cell} data-testid="spec-cell">
      <p className={styles.value}>{value}</p>
      <p className={styles.label}>{label}</p>
    </div>
  )
}
```

```css
/* src/components/SpecCell.module.css */
.cell {
  background-color: var(--color-surface-soft);
  border-radius: var(--radius-none);
  padding: var(--space-lg);
}

.value {
  color: var(--color-ink);
  font-size: var(--size-display-sm);
  font-weight: var(--weight-display);
  line-height: 1.15;
}

.label {
  margin-top: var(--space-xs);
  color: var(--color-muted);
  font-size: var(--size-label);
  font-weight: var(--weight-display);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
}
```

- [ ] **Step 6: Write `src/components/VideoPlayer.tsx` and its stylesheet**

`preload="metadata"` matters: without it the browser starts pulling megabytes before anyone presses play.

```tsx
import styles from './VideoPlayer.module.css'

interface VideoPlayerProps {
  src: string
  /** Accessible name for the player. */
  title: string
  unsupportedMessage: string
}

export function VideoPlayer({ src, title, unsupportedMessage }: VideoPlayerProps) {
  return (
    <div className={styles.frame}>
      <video
        data-testid="exercise-video"
        className={styles.video}
        src={src}
        title={title}
        controls
        loop
        playsInline
        preload="metadata"
      >
        {unsupportedMessage}
      </video>
    </div>
  )
}
```

```css
/* src/components/VideoPlayer.module.css */
.frame {
  background-color: var(--color-surface-soft);
  border-radius: var(--radius-none);
}

.video {
  width: 100%;
  max-height: 78vh;
  aspect-ratio: 16 / 9;
  object-fit: contain;
  background-color: #000;
}
```

- [ ] **Step 7: Write `src/components/ExerciseNav.tsx` and its stylesheet**

```tsx
import { Link } from 'react-router-dom'
import type { Exercise, Group } from '../data/types'
import { useT } from '../i18n'
import styles from './ExerciseNav.module.css'

interface ExerciseNavProps {
  group: Group
  previous: Exercise | null
  next: Exercise | null
}

export function ExerciseNav({ group, previous, next }: ExerciseNavProps) {
  const t = useT()

  return (
    <nav className={styles.nav}>
      {previous ? (
        <Link to={`/g/${group.id}/e/${previous.id}`} className={styles.link}>
          <span aria-hidden="true">&larr;</span> {t.ui.previous}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          to={`/g/${group.id}/e/${next.id}`}
          className={`${styles.link} ${styles.next}`}
        >
          {t.ui.next} <span aria-hidden="true">&rarr;</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}
```

```css
/* src/components/ExerciseNav.module.css */
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  margin-top: var(--space-xl);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--color-hairline);
}

.link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  min-height: 48px;
  padding: var(--space-md) var(--space-lg);
  border: 1px solid var(--color-ink);
  border-radius: var(--radius-none);
  color: var(--color-ink);
  font-size: var(--size-label);
  font-weight: var(--weight-display);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
}

.next {
  margin-inline-start: auto;
}
```

- [ ] **Step 8: Write `src/pages/ExercisePage.tsx`, replacing the stub**

Optional fields render conditionally, so the workout groups' `sets` / `rest` / `note` need no change here when they are added.

```tsx
import { useParams } from 'react-router-dom'
import { BackLink } from '../components/BackLink'
import { ExerciseNav } from '../components/ExerciseNav'
import { MStripe } from '../components/MStripe'
import { SpecCell } from '../components/SpecCell'
import { VideoPlayer } from '../components/VideoPlayer'
import { findGroup } from '../data/groups'
import type { Exercise, Group } from '../data/types'
import { useT } from '../i18n'
import { mediaUrl } from '../lib/media'
import { neighbours, type Neighbours } from '../lib/navigation'
import { NotFoundPage } from './NotFoundPage'
import styles from './ExercisePage.module.css'

export function ExercisePage() {
  const { groupId, exerciseId } = useParams<{
    groupId: string
    exerciseId: string
  }>()
  const t = useT()

  const group: Group | undefined = groupId ? findGroup(groupId) : undefined
  const position: Neighbours<Exercise> | null =
    group && exerciseId ? neighbours(group.exercises, exerciseId) : null

  if (!group || !position) {
    return <NotFoundPage />
  }

  const exercise: Exercise = group.exercises[position.index]
  const groupText = t.groups[group.id as keyof typeof t.groups]
  const text =
    groupText.exercises[exercise.id as keyof typeof groupText.exercises]

  return (
    <section data-testid="exercise-page">
      <BackLink to={`/g/${group.id}`} label={t.ui.backToGroup} />
      <div className={styles.header}>
        <p className={styles.position}>
          {t.ui.exercisePosition(position.index + 1, group.exercises.length)}
        </p>
        <h1>{text.name}</h1>
      </div>
      <MStripe className={styles.divider} />
      <VideoPlayer
        src={mediaUrl(group, exercise)}
        title={text.name}
        unsupportedMessage={t.ui.videoUnsupported}
      />
      <div className={styles.specs}>
        <SpecCell label={t.ui.repsLabel} value={text.reps} />
        {text.sets ? <SpecCell label={t.ui.setsLabel} value={text.sets} /> : null}
        {text.rest ? <SpecCell label={t.ui.restLabel} value={text.rest} /> : null}
      </div>
      {text.note ? (
        <div className={styles.note}>
          <p className={styles.noteLabel}>{t.ui.noteLabel}</p>
          <p className={styles.noteBody}>{text.note}</p>
        </div>
      ) : null}
      <ExerciseNav
        group={group}
        previous={position.previous}
        next={position.next}
      />
    </section>
  )
}
```

```css
/* src/pages/ExercisePage.module.css */
.header {
  padding: var(--space-xl) 0 var(--space-lg);
}

.position {
  margin-bottom: var(--space-sm);
  color: var(--color-muted);
  font-size: var(--size-label);
  font-weight: var(--weight-display);
  letter-spacing: var(--tracking-label);
}

.divider {
  margin-bottom: var(--space-lg);
}

/* Spec cells: 4-up desktop, 2-up tablet, 1-up mobile. Values do not shrink. */
.specs {
  display: grid;
  gap: var(--space-xxs);
  grid-template-columns: repeat(4, 1fr);
  margin-top: var(--space-lg);
}

@media (max-width: 1024px) {
  .specs {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .specs {
    grid-template-columns: 1fr;
  }
}

.note {
  margin-top: var(--space-lg);
  border-left: 4px solid var(--color-m-red);
  background-color: var(--color-surface-card);
  padding: var(--space-lg);
}

.noteLabel {
  margin-bottom: var(--space-xs);
  color: var(--color-muted);
  font-size: var(--size-label);
  font-weight: var(--weight-display);
  letter-spacing: var(--tracking-label);
}

.noteBody {
  color: var(--color-body-strong);
  font-size: var(--size-body-md);
}
```

- [ ] **Step 9: Run both tests to verify they pass**

Run: `npm test -- tests/lib/navigation.test.ts tests/pages/exercise-page.test.tsx`
Expected: PASS.

- [ ] **Step 10: Verify the whole suite**

Run: `npm run typecheck && npm test`
Expected: no type errors; all tests pass.

- [ ] **Step 11: Look at the running app**

Run: `npm run dev`
Open `http://localhost:5173/training-plan/` and confirm by eye:
1. Black canvas, white uppercase headline, M stripe under the nav.
2. The group card links through to the 8-row exercise list.
3. A row opens the detail page; the video plays.
4. `TR` switches titles and reps to Turkish and survives a page reload.
5. Prev/next walk the group; previous is absent on exercise 1, next absent on 8.

Stop the dev server when done.

---

### Task 9: GitHub Pages deployment and project documentation

Makes the build deployable and the project legible to someone arriving cold.

**Files:**
- Create: `.github/workflows/deploy.yml`, `README.md`
- Test: `tests/build/base-path.test.ts`

**Interfaces:**
- Consumes: the `vite.config.ts` `base` from Task 1.
- Produces: a Pages workflow that builds on push to `main`. Nothing imports from this task.

- [ ] **Step 1: Write the failing test `tests/build/base-path.test.ts`**

Guards the mistake that silently breaks every video on GitHub Pages: a hard-coded media path that works in dev and 404s in production.

```ts
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry: string): string[] => {
    const full: string = join(dir, entry)
    if (statSync(full).isDirectory()) {
      return sourceFiles(full)
    }
    return /\.(ts|tsx)$/.test(entry) ? [full] : []
  })
}

/**
 * Strips comments before scanning.
 *
 * The guard is about CODE composing a media path. Doc comments legitimately
 * name the media directory in prose — src/data/groups.ts and src/data/types.ts
 * both do — and matching those would make the test fail on correct code.
 */
function code(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
}

describe('base path safety', () => {
  it('declares the GitHub Pages base path', () => {
    const config: string = readFileSync(
      join(process.cwd(), 'vite.config.ts'),
      'utf-8',
    )
    expect(config).toContain("base: '/training-plan/'")
  })

  it('composes media URLs only through mediaUrl()', () => {
    const offenders: string[] = sourceFiles(join(process.cwd(), 'src'))
      .filter((file: string): boolean => !file.endsWith('lib/media.ts'))
      .filter((file: string): boolean =>
        code(readFileSync(file, 'utf-8')).includes('/media/'),
      )
    expect(offenders, `hard-coded media path in: ${offenders.join(', ')}`).toEqual(
      [],
    )
  })
})
```

- [ ] **Step 2: Run the test to verify it passes**

This test is written to pass against correct code from Task 1 and Task 3 — it is a regression guard, not a red-to-green cycle.

Run: `npm test -- tests/build/base-path.test.ts`
Expected: PASS. If the second assertion fails, a component is building a media URL by hand; route it through `mediaUrl()`.

- [ ] **Step 3: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci

      - run: npm run typecheck

      - run: npm test

      - run: npm run build

      - uses: actions/configure-pages@v5

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 4: Write `README.md`**

```markdown
# Training Plan

A single-page application presenting a personal training plan as groups →
exercises → exercise detail, with the demonstration video on each detail page.
English and Turkish, English by default.

Styled after the BMW M design system described in `DESIGN-bmw-m.md`.

## Running it

```bash
npm install
npm run dev     # http://localhost:5173/training-plan/
```

The dev server uses the same `/training-plan/` base path as production, so
what you see locally is what deploys.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check, then build to `dist/` |
| `npm run preview` | Serve the built `dist/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Vitest in watch mode |

## Layout

```
content/        Reps/sets text per group. Source of truth for the locale files.
                *.tr.txt files are the original Turkish where one exists.
                eml/ archives the original emails the media came from.
public/media/   49 exercise videos across 7 group folders (~111 MB).
src/data/       Structure only: group ids, exercise ids, video filenames.
src/i18n/       All display text. en.ts defines the shape; tr.ts must match it.
src/pages/      One file per route.
src/components/ Presentational components, each with a CSS module.
src/styles/     Design tokens as CSS custom properties, plus global reset.
docs/superpowers/  Design spec and implementation plan.
```

## Adding a group

Media for six further groups is already on disk under `public/media/`, with
English reps text in `content/`. Registering one takes two edits:

1. Append a `Group` to `src/data/groups.ts` — `id`, `order`, `mediaDir`, and
   the ordered `exercises` with their video filenames.
2. Add the matching text block to **both** `src/i18n/en.ts` and
   `src/i18n/tr.ts`.

Step 2 is not optional and not easy to forget: `tr` is typed as `typeof en`, so
omitting it fails `npm run typecheck`. `tests/data/groups.test.ts` separately
fails if a video filename does not name a real file on disk.

The workout groups also carry `sets`, `rest`, and a tempo/drop-set `note`.
Those fields already exist as optional members of `ExerciseText` and render
conditionally on the exercise page — no code change needed.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`: type-check, tests,
build, publish `dist/` to GitHub Pages. `base` in `vite.config.ts` must match
the repository name.

Routing is hash-based (`#/g/warm-up/e/prone-w`) because GitHub Pages cannot
rewrite unknown paths to `index.html`.
```

- [ ] **Step 5: Verify the full suite and a production build**

Run: `npm run typecheck && npm test && npm run build`
Expected: no type errors, all tests pass, `dist/` written.

- [ ] **Step 6: Verify the built output under the sub-path**

Run: `npm run preview`
Open the URL it prints (it will include `/training-plan/`) and confirm the app
loads, a video plays, and a deep link such as
`<url>#/g/warm-up/e/prone-w` works when pasted fresh into the address bar.

Stop the preview server when done.

- [ ] **Step 7: Hand back to the owner**

Do NOT run `git init`, `git add`, `git commit`, `git push`, or `gh repo create`.
Report to the owner:
- the test and build results,
- that the working tree is ready to commit,
- that creating `wlei07/training-plan` and enabling Pages (Settings → Pages →
  Source: GitHub Actions) are their calls to make.

---

## Notes for the executor

- **Turkish copy is machine-authored.** It is deliberately isolated in
  `src/i18n/tr.ts` for the owner to correct. Do not "improve" it beyond what
  this plan specifies, and do not translate exercise *names* — the author's own
  Turkish source files keep movement names in English, and the plan follows them.
- **Only group 0 is registered.** Media and English text for six more groups sit
  on disk. Registering them is explicitly out of scope; do not add them.
- **The `as keyof typeof` casts** in `GroupCard`, `ExerciseRow`, `GroupPage`, and
  `ExercisePage` are load-bearing. `Dictionary` is derived from `en` with
  `typeof`, so `t.groups` has literal keys while `group.id` is a `string`. The
  cast bridges the two. The data/dictionary parity tests in
  `tests/data/groups.test.ts` and `tests/i18n/dictionary.test.ts` are what make
  the cast safe — do not delete them.
- **No commits.** See the commit policy under Global Constraints.
