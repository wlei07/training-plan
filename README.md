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
public/media/   49 exercise videos across 7 group folders (~108 MB).
src/data/       Structure only: group ids, exercise ids, video filenames.
src/i18n/       All display text. en.ts defines the shape; tr.ts must match it.
src/pages/      One file per route.
src/components/ Presentational components, each with a CSS module.
src/styles/     Design tokens as CSS custom properties, plus global reset.
docs/superpowers/  Design spec and implementation plan.
```

## Adding a group

All seven groups from `content/` are registered (49 exercises). Adding a
further one is an edit to **three files**:

1. `src/data/groups.ts` — append a `Group`: `id`, `order`, `label`, `mediaDir`,
   and the ordered `exercises` with their video filenames. `order` is the sort
   key; `label` is what the group card displays and should match the leading
   token of the media directory (`'1a'`, `'2b'`, …), which is why it is a
   string rather than a number.
2. `src/i18n/en.ts` — add the group's text block.
3. `src/i18n/tr.ts` — add the same block, translated.

What enforces what, precisely:

- **The compiler enforces only `en` → `tr` parity.** `tr` is typed as
  `typeof en`, so once a group is in `en.ts`, omitting it from `tr.ts` fails
  `npm run typecheck`.
- **The compiler does *not* notice a group registered in `groups.ts` but
  missing from `en.ts`.** That is caught at test time by
  `tests/i18n/dictionary.test.ts`, which fails if any registered group or
  exercise has no text in either locale — and equally if a locale carries text
  for something that is not registered.
- `tests/data/groups.test.ts` fails if a video filename does not name a real
  file on disk.

Read the dictionary only through `src/i18n/lookup.ts` (`groupText`,
`exerciseText`). Those accessors hold the single cast between the
literal-keyed dictionary and the plain `string` ids in `src/data`; indexing
`t.groups` with `keyof typeof` at a call site compiles with one group and
collapses to `never` with two.

### Reps, and how held stretches are modelled

`reps` is required on every exercise, because there is no exercise you do zero
times. A held stretch **is** one repetition, so the stretching groups carry
`reps: '1'` with the hold time in `duration` — notated the way isometrics
normally are, `1 × 30s`. The exercise page shows both cells; the group list
rows show `duration ?? reps`, since `30 seconds` is what you scan a routine
for and `1` is noise.

The workout groups additionally carry `sets`, `rest`, and a tempo/rest-pause/
drop-set `note`. All four of these are optional members of `ExerciseText` and
render conditionally, so a new group populates whichever apply with no code
change.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`: type-check, tests,
build, publish `dist/` to GitHub Pages. `base` in `vite.config.ts` must match
the repository name.

Routing is hash-based (`#/g/warm-up/e/prone-w`) because GitHub Pages cannot
rewrite unknown paths to `index.html`.
