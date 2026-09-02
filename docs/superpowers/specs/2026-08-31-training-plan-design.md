# Training Plan — Design Spec

- **Date:** 2026-08-31
- **Status:** Approved (design), pending implementation
- **Owner:** lei.wang@zetes.com

## 1. Purpose

A single-page web application that presents a personal training plan as a
browsable hierarchy: **groups → exercises → exercise detail**. Each exercise
detail page shows the exercise name, its prescribed reps/sets, and the
demonstration video.

The application ships with **one group wired up** — *warm-up & postural
exercises* — but the data model, routing, and content files are built so that
the six remaining groups (already present as media on disk) can be added later
without structural change.

The interface follows `DESIGN-bmw-m.md`, a BMW M motorsport design system:
near-black canvas, white UPPERCASE display type, zero border radius, and the M
tricolor stripe used sparingly as a brand marker.

## 2. Scope

### In scope

- React 19 + TypeScript single-page application, built with Vite.
- Three views: group list, exercise list within a group, exercise detail.
- Two languages, English (default) and Turkish, switchable at runtime.
- Group 0 (*warm-up & postural exercises*, 8 exercises) fully populated.
- Media reorganisation: all six groups' videos moved into `public/media/`.
- Static build deployable to GitHub Pages.
- Automated tests (Vitest + React Testing Library).

### Out of scope

- Progress tracking, timers, sets completed, or any persisted user state
  beyond the language preference.
- Authentication, backend, or database.
- Content for groups 1a, 1b, 2a, 2b, 3a — their media is relocated but they are
  not registered in the application.
- Video transcoding, poster-frame generation, or a CDN. Videos are served as
  plain static `.mp4` files.

## 3. Content inventory

Six source folders exist at the repository root. Only group 0 is wired into the
application; the rest are relocated and reserved.

| Id | Group | Videos | English text | Size |
|---|---|---|---|---|
| `warm-up` | 0 warm-up & postural exercises | 8 | ✅ original | 23 MB |
| — | 1a upper body push workout | 6 | ✅ original | 13 MB |
| — | 1b upper body pull workout | 6 | ✅ translated | 16 MB |
| — | 2a upper body push post-workout stretching | 8 | ✅ original | 16 MB |
| — | 2b upper body pull post-workout stretching | 8 | ✅ translated | 16 MB |
| — | 3a lower body workout | 5 | ✅ translated | 10 MB |
| — | 3b lower body post-workout stretching | 8 | ✅ original | 17 MB |

49 videos, ~111 MB total. The largest single file is ~3.9 MB, well below
GitHub's 100 MB per-file limit; the repository stays well below the 1 GB
GitHub Pages soft limit.

The numbering pairs each workout with its post-workout stretching routine:
1a→2a, 1b→2b, 3a→3b. The lower-body stretching group was renumbered from 3 to 4
on 2026-08-31 to make room for the lower-body workout, then the pair became
3a/3b on 2026-09-02 so the numbering matches the other workout/stretch pairs.

Groups 1b and 2b originally had **no loose video files** — their videos were
attachments inside a single `.eml` message, and 2b's reps text existed only as
an attachment too. Both messages have since been unpacked (see §3.1); every
group now has its videos on disk as plain files and its reps text in English.

### 3.1 Email extraction (completed 2026-08-31)

The two `.eml` messages were unpacked with Python's `email` module:

- **1b** — 6 `video/mp4` attachments plus a Turkish `SET-TEKRAR.txt`.
- **2b** — 8 `video/mp4` attachments plus a Turkish `SET-TEKRAR.txt`.
- **3** — 5 `video/mp4` attachments plus a Turkish `SET-TEKRAR.txt`
  (`planlamalar - 7 _ 3= alt vücut antrenmanı.eml`).

All 19 extracted files were verified to carry a valid MP4 `ftyp` header. The
attachment order in the message does not match the training order, so each file
was renamed against the order given in its text attachment.

`1b upper body pull workout/SETS-REPS.txt` was byte-identical to that message's
`SET-TEKRAR.txt` and was dropped in favour of it.

Both Turkish sources were translated to English, matching the register of the
author's own English file for group 1a (`Rest between sets: 75–90 sec.`,
`! Rest/Pause System: …`). Turkish originals are retained beside them as
`content/<group>.tr.txt` — they are the reference for the Turkish locale of
those groups when it is written.

The original `.eml` messages were **deleted after extraction**, on 2026-09-01, before the
repository was made public: they carried two third parties' email addresses and mail routing
headers, and every attachment in them was verified byte-identical to a file already on disk.

### Group 0 exercises (English source text)

| # | Name | Reps |
|---|---|---|
| 1 | KNEE SIDE DROPS | 20 reps |
| 2 | SUPINE STRAIGHT LEG CIRCLE | 15 right / 15 left |
| 3 | BODYWEIGHT GLUTE BRIDGE | 15 reps, 2 sets |
| 4 | SCAPULAR RETRACTION | 15 reps |
| 5 | THORACIC EXTENSION | 10 reps, 2 sets |
| 6 | ELBOW THORACIC ROTATION | 10 right / 10 left, 2 sets each |
| 7 | PRONE SWIMMER | 10 reps, 2 sets |
| 8 | PRONE W | 15 reps, 2 sets |

Note the video file is named `3 BW Glute bridge.mp4` while the text says
`BODYWEIGHT GLUTE BRIDGE`. The exercise id follows the text
(`bodyweight-glute-bridge`); the video filename is normalised to match.

## 4. Repository layout

Media and text move **once**, out of the numbered source folders, which are
then deleted. Nothing is duplicated — there is no second copy to keep in sync.

```
training_plan/
├─ content/                                     # source-of-truth text, reference only
│  ├─ 0-warm-up-and-postural-exercises.txt      # was "SETS & REPS.txt"
│  ├─ 1a-upper-body-push-workout.txt
│  ├─ 1b-upper-body-pull-workout.txt            # translated from .tr.txt
│  ├─ 1b-upper-body-pull-workout.tr.txt         # Turkish original
│  ├─ 2a-upper-body-push-workout-stretching.txt
│  ├─ 2b-upper-body-pull-workout-stretching.txt        # translated
│  ├─ 2b-upper-body-pull-workout-stretching.tr.txt     # Turkish original
│  ├─ 3a-lower-body-workout.txt                 # translated
│  ├─ 3a-lower-body-workout.tr.txt              # Turkish original
│  ├─ 3b-lower-body-stretching.txt
│                                               # (the original .eml messages were deleted
│                                               #  after extraction — they carried third-party
│                                               #  email addresses and no unique content)
├─ docs/superpowers/specs/                      # this document
├─ public/media/
│  ├─ 0-warm-up-and-postural-exercises/
│  │  ├─ 1-knee-side-drops.mp4
│  │  ├─ 2-supine-straight-leg-circle.mp4
│  │  ├─ 3-bodyweight-glute-bridge.mp4
│  │  ├─ 4-scapular-retraction.mp4
│  │  ├─ 5-thoracic-extension.mp4
│  │  ├─ 6-elbow-thoracic-rotation.mp4
│  │  ├─ 7-prone-swimmer.mp4
│  │  └─ 8-prone-w.mp4
│  ├─ 1a-upper-body-push-workout/               # 6 videos
│  ├─ 1b-upper-body-pull-workout/               # 6 videos, from .eml
│  ├─ 2a-upper-body-push-workout-stretching/    # 8 videos
│  ├─ 2b-upper-body-pull-workout-stretching/    # 8 videos, from .eml
│  ├─ 3a-lower-body-workout/                    # 5 videos, from .eml
│  └─ 3b-lower-body-stretching/                 # 8 videos
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ data/groups.ts
│  ├─ i18n/{index.tsx,en.ts,tr.ts}
│  ├─ components/{TopNav,MStripe,BackLink,ExerciseRow,GroupCard}.tsx
│  ├─ pages/{GroupsPage,GroupPage,ExercisePage}.tsx
│  └─ styles/{tokens.css,global.css}
├─ tests/
├─ .github/workflows/deploy.yml
├─ DESIGN-bmw-m.md
├─ index.html
├─ package.json
├─ tsconfig.json
└─ vite.config.ts
```

### Naming convention

Folder and file names become **kebab-case ASCII**: `0 warm-up & postural
exercises` → `0-warm-up-and-postural-exercises`. Leading numbers and every word
are preserved so the folder still reads the same to a human, but spaces and `&`
are removed because they require URL-encoding and break unpredictably across
static hosts. This is a deliberate, approved deviation from "keep the original
structure exactly".

## 5. Data model

Structure and display text are kept apart. `src/data/groups.ts` holds only
identity, ordering, and media paths — no human-readable prose. All prose lives
in the locale files, keyed by the same ids.

```ts
export type ExerciseId = string;
export type GroupId = string;

export interface Exercise {
  id: ExerciseId;        // "knee-side-drops"
  video: string;         // filename only: "1-knee-side-drops.mp4"
}

export interface Group {
  id: GroupId;           // "warm-up"
  order: number;         // display order
  mediaDir: string;      // "0-warm-up-and-postural-exercises"
  exercises: Exercise[]; // ordered
}

export const groups: readonly Group[];
```

Display text is a structured record sized for the later groups, which carry
more fields than group 0 does:

```ts
export interface ExerciseText {
  name: string;    // "KNEE SIDE DROPS"
  reps: string;    // "20 reps"
  sets?: string;   // "3 sets (last set rest/pause system)"
  rest?: string;   // "75–90 sec."
  note?: string;   // tempo / rest-pause / drop-set explanation
}
```

Group 0 populates `name` and `reps` only. The optional fields render
conditionally, so adding group 1a later needs no component or type change.

**Adding a new group** is therefore exactly two edits: append a `Group` to
`groups.ts`, and add its `GroupText` block to both `en.ts` and `tr.ts`. The
TypeScript compiler enforces that the second edit is complete.

## 6. Internationalisation

A hand-written typed context, roughly 40 lines — no i18n library.

- `en.ts` exports the dictionary and its inferred type is the contract.
- `tr.ts` is declared `const tr: typeof en` so a missing or misspelled Turkish
  key is a **compile error**, not a runtime fallback to English. This is the
  guardrail that keeps the two languages in step as groups are added.
- `LanguageProvider` holds the active language; `useT()` returns the active
  dictionary.
- Default language: **English**. The chosen language persists to
  `localStorage` under `training-plan.lang`; an unrecognised or absent stored
  value falls back to English.
- `<html lang>` is updated to match the active language.

The dictionary covers UI chrome (nav, buttons, labels), group titles and
descriptions, and every exercise's `ExerciseText`.

Turkish copy is authored as part of implementation and left in a single file
for the owner to correct. Exercise names are kept in their common gym form —
Turkish lifters generally use the English movement names — while reps, sets,
rest, and notes are fully translated (`20 reps` → `20 tekrar`, `Rest between
sets` → `Set arası dinlenme`), matching the register already used in
`1b upper body pull workout/SETS-REPS.txt`.

## 7. Routing

`react-router-dom` with **HashRouter**. GitHub Pages performs no server-side
rewriting, so a history-mode SPA needs a `404.html` redirect hack; hash routing
avoids it entirely and works from any sub-path.

| Route | View | Contents |
|---|---|---|
| `#/` | `GroupsPage` | Hero band + list of groups |
| `#/g/:groupId` | `GroupPage` | Group title, M stripe, ordered exercise rows |
| `#/g/:groupId/e/:exerciseId` | `ExercisePage` | Name, reps block, video, prev/next |

Unknown `groupId` or `exerciseId` renders a localised not-found panel with a
link home rather than throwing.

## 8. Visual design

Tokens from `DESIGN-bmw-m.md` are declared once as CSS custom properties in
`src/styles/tokens.css` (colors, typography scale, spacing, radius) and
referenced everywhere — no inline hex, per the design system's iteration guide.

- **Type:** Inter at 700 and 300, the substitute the design document itself
  names, loaded from Google Fonts. Display headlines get -0.5px tracking to
  approximate BMW Type Next's tighter setting at large sizes. Uppercase
  letterspaced labels stay at 1.5px tracking.
- **Canvas:** `#000000`. Cards `#1a1a1a`, spec cells `#0d0d0d`, hairlines
  `#3c3c3c`.
- **Radius:** 0 everywhere. The only exception is the circular prev/next icon
  buttons at `9999px`, exactly as the system prescribes.
- **M tricolor stripe:** 4px, `#0066b1 → #1c69d4 → #e22718`. Used as a section
  divider under page titles and as the active-language marker. Never a button
  fill, never a background.
- **Rhythm:** 96px between major bands, 24px card padding, 1440px max width.

### The photography constraint

The BMW M system draws its energy from full-bleed automotive photography, and
this project has none. Rather than substitute stock imagery or gradients — both
explicitly called out as off-brand in the design document — the interface leans
on the system's other strong patterns:

- Group and exercise lists are **typographic**, built on the `model-card` and
  hairline-row patterns.
- Reps and sets render as **`spec-cell`** blocks: a large 32px/700 value with a
  small uppercase letterspaced label beneath.
- The **exercise video plays the role the hero photo plays** on BMW's own
  pages: full-bleed, 16:9, edge to edge, sharp corners, native controls.

### Responsive

Per the design document's breakpoints: hero display type scales 80 → 48px below
768px; card grids collapse 3-up → 2-up → 1-up; the video stays full-bleed at
every width; the M stripe stays 4px throughout. All interactive targets are at
least 48px.

## 9. Video playback

A plain `<video>` element with `controls`, `playsInline`, `loop`, and
`preload="metadata"`. No custom player, no third-party library. `preload`
avoids downloading megabytes before the user presses play. Exercise list pages
render no video elements at all, so navigating a group costs no bandwidth.

Media URLs are composed as `` `${import.meta.env.BASE_URL}media/${group.mediaDir}/${exercise.video}` ``
so the same code works at the dev server root and under the GitHub Pages
sub-path.

## 10. Testing

Vitest + React Testing Library + jsdom. Implementation follows TDD — tests
first, per the project's development workflow.

| Test | Guards against |
|---|---|
| Locale parity | A group added to `en` but forgotten in `tr` (belt-and-braces alongside the type constraint) |
| Media integrity | Every `exercise.video` resolves to a file that exists under `public/media/` |
| Groups page renders | Group list renders, links point at valid routes |
| Group page renders | All 8 exercises listed, in order, with names and reps |
| Exercise page renders | Name, reps, and a `<video>` with the right `src` |
| Unknown route | Bad group/exercise id renders not-found, does not throw |
| Language switch | Switching to Turkish changes visible copy and persists to `localStorage` |
| Restore language | A stored `tr` preference is applied on mount; garbage falls back to `en` |

## 11. Build and deployment

- **Vite**, `base: '/training-plan/'` for GitHub Pages project-site hosting.
- `npm run dev` for local work, `npm run build` producing static `dist/`,
  `npm run preview` to verify the built output under the sub-path.
- `.github/workflows/deploy.yml`: build on push to `main`, publish `dist/` with
  `actions/deploy-pages`.
- The GitHub repository (`wlei07/training-plan`) does **not** exist yet. Per the
  owner's standing rule, no `git commit`, `git push`, or `gh repo create` runs
  without an explicit request in the moment. Implementation stops at a working
  local app plus a committed-ready working tree; creating and pushing the repo
  is a separate, explicitly-requested step.

## 12. Decisions and rationale

| Decision | Alternative rejected | Why |
|---|---|---|
| Move media into `public/`, delete originals | Copy, or symlink | A copy means 110 MB duplicated and two structures to maintain; symlinks break on some static hosts and on Windows checkouts. |
| Kebab-case ASCII filenames | Preserve `&` and spaces | URL-encoding of `&` and spaces is a recurring source of breakage on static hosts. Numbers and words are preserved, so readability survives. |
| Hash routing | History routing + `404.html` | GitHub Pages cannot rewrite; the `404.html` trick breaks deep links on first load and pollutes analytics. |
| Hand-written i18n | `react-i18next` | ~40 lines versus a dependency and its config; and `typeof en` gives compile-time completeness checking that the library does not. |
| Text in locale files, structure in `groups.ts` | English text in `groups.ts`, Turkish as overrides | One source per language, no "which one wins" ambiguity, and the type system enforces parity. |
| Optional `sets`/`rest`/`note` fields now | Add them when group 1a lands | The later groups' text already exists on disk and needs them; designing them in now avoids a model migration. |
| No poster frames | Generate thumbnails with ffmpeg | ffmpeg is not installed on the dev box, and the list pages are typographic by design, so posters buy nothing. |

## 13. Known limitations

- No offline support or service worker; videos stream from the host each visit.
- No progress tracking — the app is a reference, not a logbook.
- Turkish copy is machine-authored pending the owner's review.
- All six remaining groups (1a, 1b, 2a, 2b, 3a, 3b) have their videos and English
  reps text on disk but are not registered in `groups.ts`. Adding them is
  content work, not development work — no blockers remain.
- The English text for groups 1b, 2b, and 3a is a translation of the author's
  Turkish, not the author's own English. It is worth an owner review; the
  Turkish originals sit beside it as `content/<group>.tr.txt`.
