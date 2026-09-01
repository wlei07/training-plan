# SDD ledger — plan: docs/superpowers/plans/2026-08-31-training-plan.md

Spec: docs/superpowers/specs/2026-08-31-training-plan-design.md (read, authoritative)

## Environment rulings (made before Task 1)

Ruling: No git worktree and no branch. — The working tree is not a git repository at all
(`git rev-parse` fails), and the session is configured to work in place. — Cost if wrong:
no per-task rollback point; recovery is by re-reading files, and the ledger is the ONLY
progress record, so it must be kept current.

Ruling: No commits, in any task. — The owner's standing global rule forbids `git commit`
/ `git push` / `git init` without an explicit in-the-moment request; the plan was written
with no commit steps and the owner approved it that way. — Cost if wrong: the owner must
commit manually at the end; nothing is lost.

Ruling: Review packages are file snapshots, not diffs. — `scripts/review-package` and
`scripts/sdd-workspace` both require git. Replaced by `snapshot.sh`, which concatenates
the task's files with line numbers. — Cost if wrong: reviewers see whole files instead of
changed lines, so they may comment on pre-existing lines; acceptable on a greenfield repo
where every line in scope is new.

## Pre-flight scan

### A. Cross-task: shared files and interfaces

| Tasks | Produced -> consumed | Finding |
|---|---|---|
| 1 -> 2 | `src/main.tsx` created by 1, modified by 2 to import stylesheets | OK — 2 appends imports; 5 later rewrites the file wholesale, which is stated in 5's Files block |
| 1 -> 5 | `src/App.tsx` placeholder created by 1, replaced by 5 | OK — 5 says "replace placeholder entirely"; 1 says it is replaced in 5 |
| 1 -> 9 | `base: '/training-plan/'` in `vite.config.ts` | OK — 9's test asserts the exact string 1 writes |
| 2 -> 5,6,7,8 | CSS custom properties consumed by every CSS module | OK — every token used downstream (`--space-*`, `--size-*`, `--color-*`, `--m-stripe`, `--nav-height`, `--max-content`, `--radius-none`) is defined in 2 |
| 3 -> 4 | group id `warm-up`, 8 exercise ids | OK — 4's dictionary keys match 3's ids exactly; 4's test cross-checks against `groups` |
| 3 -> 6,7,8 | `groups`, `findGroup`, `findExercise`, `Group`, `Exercise`, `mediaUrl` | OK — signatures in 3's Produces block match every call site in 6/7/8 |
| 3 -> 9 | `src/lib/media.ts` excluded from 9's hard-coded-path scan | OK — no other src file contains the substring `/media/` |
| 4 -> 5,6,7,8 | `useT`, `useLanguage`, `LANGUAGES`, `Language`, `LanguageProvider`, `Dictionary` | OK — `LANGUAGES`/`Language` are declared in `storage.ts` and re-exported from `i18n/index.tsx`, which is where 5 imports them from |
| 5 -> 6,7,8 | `MStripe`, `BackLink` (7), `tests/helpers/render.tsx` | OK — `renderAt` is created in 5 and used by 6/7/8 tests; `MStripe` named export matches all import sites |
| 5 -> 6,7,8 | page stubs' `data-testid` values (`groups-page`, `group-page`, `exercise-page`) | OK — 5's routing test asserts them and 6/7/8 preserve them; the plan's executor notes call this out |
| 7 -> 8 | `BackLink` created in 7, consumed in 8 | OK — same props (`to`, `label`) at both ends |

### B. Per-task: does each task's own text agree with itself?

| Task | Finding |
|---|---|
| 1 | OK. `build` = `tsc --noEmit && vite build` duplicates the `typecheck` script; harmless. |
| 2 | OK. Test asserts `max-width: 767px` and `tokens.css` contains that media query. |
| 3 | OK. Test's expected id list and video filenames match `groups.ts` exactly; `8-prone-w.mp4` assertion matches. |
| 4 | **DEFECT, fixed pre-flight.** `Dictionary = typeof en` inferred group 0's exercises without `sets`/`rest`/`note`, so Task 8's `text.sets` would not compile. Fixed in the plan by adding the `defineExercises` helper. |
| 5 | OK. `getAllByTestId('m-stripe')` returns 1 at Task 5 (TopNav only) and 2 after Task 6; the assertion is `length > 0`. |
| 6 | **DEFECT, fixed pre-flight.** The ordering test built its expectation from `expect.anything()` cast to `string`, asserting nothing. Rewritten to compare against the dictionary in `order` sequence. |
| 7 | OK. Row numbering `01..08`, reps strings, and hrefs all match Task 3's data and Task 4's dictionary. |
| 8 | OK. Neighbour hrefs match the exercise order in Task 3. |
| 9 | Test is written green-on-arrival (a regression guard, not a red-green cycle). The task text says so explicitly. Accepted. |

### C. Rulings arising from the scan

Ruling: Detail and group headlines use `--size-display-lg` (56px), not the global `h1`
default of `--size-display-xl` (80px). — Task 2's `global.css` sets every `h1` to 80px,
but `SUPINE STRAIGHT LEG CIRCLE` and `WARM-UP & POSTURAL EXERCISES` are long enough to
wrap badly at that size; the design system reserves display-xl for the hero band, which
is the groups page. Carried into the Task 7 and Task 8 dispatches. — Cost if wrong: a
one-line CSS change per page.

Ruling: Two plan defects (Tasks 4 and 6 above) were fixed in the plan file itself before
Task 1 rather than left for the review loop. — Both would have produced a hard stop
(a type error) or a silently worthless test. — Cost if wrong: the plan file diverges from
what the owner approved; both changes are described here and in the plan's own text.

## Task progress

Task 1: implemented (no commits by design). Files: package.json, tsconfig.json,
vite.config.ts, index.html, .gitignore, src/vite-env.d.ts, src/App.tsx, src/main.tsx,
tests/setup.ts, tests/toolchain.test.ts. Tests 2/2 passing; `npm run build` succeeded.
Controller checks: public/media intact (7 dirs / 49 mp4), content intact (11 files),
no unexpected root files. Task review dispatched.
Task 1: review clean (spec compliant, quality Approved, 0 Critical/0 Important).
  Reviewer raised 1 warning-only item: could not verify runtime claims from a file
  snapshot. Controller resolved it directly: `npm test` 2/2 passing, `npm run typecheck`
  silent, dist/ built (108M incl. media). Verified, not a gap.
  Minor (deferred): tests/toolchain.test.ts jsdom assertions are near-tautological —
  plan-mandated verbatim; flag to the final review for triage.
Task 1: complete (no commits by design, review clean)
Task 2: implemented. Created src/styles/tokens.css, src/styles/global.css,
  tests/styles/tokens.test.ts; modified src/main.tsx (2 imports) and, beyond the brief,
  tsconfig.json + package.json.
Task 2: Ruling: accept the out-of-brief addition of `@types/node` (devDependency) and
  `"node"` in tsconfig `types`. — This is a genuine plan gap, not scope creep: the plan's
  own tests in Tasks 2, 3 and 9 all `import { readFileSync } from 'node:fs'`, which cannot
  typecheck without Node types, yet Task 1's tsconfig omitted them. The implementer
  declared @types/node explicitly (^26.4.0) rather than leaning on a transitive copy,
  which is the correct form of the fix. — Cost if wrong: one devDependency more than
  strictly needed; removing it would break `npm run typecheck` in three tasks.
Task 2: review returned 2 Important findings, both labeled plan-mandated, both adjudicated
  by the controller as INCORRECT. No fix round dispatched.
Task 2: Ruling: `--font-display: 'Inter', ...` and `--tracking-display: -0.5px` stand as
  written. — The reviewer compared them against the typography entries in
  DESIGN-bmw-m.md's YAML front-matter (fontFamily "BMWTypeNextLatin", letterSpacing 0) and
  concluded both drift from the design system. It read only the front-matter and missed the
  design document's own substitution clause at DESIGN-bmw-m.md:327: "If BMW Type Next Latin
  is unavailable, **Inter** (variable) at 700/300 is the closest open-source substitute.
  Adjust display headline tracking to -0.5px to match BMW Type's tighter spacing at large
  sizes." Both values are therefore prescribed by the design document, not deviations from
  it, and spec §8 (lines 267-270) records the same decision. BMW Type Next Latin is a
  licensed font we do not have, so the front-matter values are unusable as literals. —
  Cost if wrong: two token values to change in one file, plus a Google Fonts link; no
  consuming code changes, since every consumer reads the token.
Task 2: minor (deferred): tokens.css defines --radius-sm (4px) but omits the design doc's
  rounded.xs (2px) and rounded.md (6px) — partial inclusion is slightly inconsistent,
  though the "radius 0 except circular" rule means none are likely to be consumed.
Task 2: minor (deferred): task-2-report.md says "Concerns: None" while disclosing the
  tsconfig/package.json scope addition elsewhere in the same report; the deviation belonged
  under Concerns.
Task 2: complete (no commits by design, 2 findings adjudicated as incorrect, 2 minors deferred)
Task 3: implemented. Created src/data/types.ts, src/data/groups.ts, src/lib/media.ts,
  tests/data/groups.test.ts, tests/lib/media.test.ts. Tests 60/60 passing.
  Controller checks: public/media intact (7 dirs / 49 mp4), no prose in groups.ts.
Task 3: review clean (spec compliant, quality Approved, 0 Critical/0 Important).
  Reviewer independently listed the media dir and confirmed all 8 filenames match disk.
Task 3: minor (deferred): the id-uniqueness tests in tests/data/groups.test.ts are
  trivially true with one group of 8 distinct literals; they gain weight only as groups
  are registered.
Task 3: minor (deferred): the double-slash regex in tests/lib/media.test.ts carries a
  `[^:]` protocol guard that is dead weight given BASE_URL is only ever '/' or
  '/training-plan/'.
Task 3: complete (no commits by design, review clean, 2 minors deferred)
Task 4: implementer terminated mid-run by an infrastructure error (API response stopped
  arriving) after confirming RED. Controller inspected the tree: 3 test files written,
  src/i18n/ empty, no probe leaked, no report. State clean and mid-TDD.
Task 4: Ruling: resume the same agent rather than dispatching a fresh one. — The failure
  was infrastructural, not a task problem; the agent's context (including its RED
  evidence) is intact, and the on-disk state was verified unambiguous before resuming.
  Resumed with the verified state supplied so it need not re-derive it. — Cost if wrong:
  one wasted resume, then a fresh dispatch from the brief, which is idempotent.
Task 4: implemented (resumed run). Created src/i18n/{en.ts,tr.ts,storage.ts,index.tsx} and
  tests/i18n/{dictionary,storage,provider}. Tests 76/76 passing, output pristine.
  Step 10 compile-guard probe fired: tsc TS2741 on tr.ts(4,3) for the missing key, clean
  after removal. Controller checks: no probe residue in src/, no type assertions in tr.ts,
  tr annotated `: Dictionary`, 13 Turkish diacritics intact, both localStorage paths in
  try/catch.
Task 4: review clean (spec compliant, quality Approved, 0 Critical/0 Important).
  Reviewer independently traced defineExercises and confirmed it achieves both jobs, and
  traced keyPaths recursion to confirm the parity test is not vacuous.
Task 4: warning-only item resolved by controller: group 0 has no author-written Turkish
  source in content/ to check the reps translation against (only 1b/2b/3 have .tr.txt).
  Not a gap — spec §6 and §13 already record that group 0's Turkish is machine-authored
  pending owner review, and it is isolated in one file for exactly that.
Task 4: minor (deferred): components omit explicit `: JSX.Element` return annotations that
  the brief's Interfaces block names; type-checks fine either way.
Task 4: complete (no commits by design, review clean, 1 minor deferred)
Task 5: implemented. Created 4 components + CSS modules (MStripe, LanguageSwitch, TopNav,
  SiteFooter), 4 page files (3 stubs + NotFoundPage), App.module.css,
  tests/helpers/render.tsx, tests/app/{shell,routing}.test.tsx. Replaced src/App.tsx and
  src/main.tsx. Tests 86/86 passing, output pristine.
  Controller checks: stubs still 3-line stubs with the exact data-testids; main.tsx has
  HashRouter + LanguageProvider + both stylesheet imports; App.tsx has no Router/Provider
  (only a comment mentions them); zero literal hex in components; touch target 48px.
Task 5: review returned 1 Important finding, explicitly flagged for controller
  verification because it depended on out-of-scope Task 2 code. Resolved: NO FIX NEEDED.
Task 5: Ruling: the radius-0 baseline IS enforced for LanguageSwitch's buttons. — The
  reviewer could not see src/styles/global.css from its snapshot and correctly declined to
  assert a defect. global.css:64-71 resets all `button` elements with
  `border-radius: var(--radius-none)`, and tokens.css:39 defines that as 0px, so every
  button in the app inherits radius 0 without per-component declarations. — Cost if wrong:
  one declaration added to LanguageSwitch.module.css.
Task 5: minor (deferred): `min-height: 48px` (LanguageSwitch.module.css:9) and
  `letter-spacing: 0.5px` (SiteFooter.module.css:20) are literal sizes where the design
  system could promote a token; both come verbatim from the brief.
Task 5: complete (no commits by design, 1 finding resolved as already-satisfied, 2 minors deferred)
Task 6: implemented. Created src/components/GroupCard.{tsx,module.css},
  src/pages/GroupsPage.module.css, tests/pages/groups-page.test.tsx; replaced the
  GroupsPage stub. Tests 93/93 passing, output pristine.
  Controller checks: data-testid="groups-page" retained; all earlier test files unmodified
  (verified by mtime); no literal hex.
Task 6: review clean (spec compliant, quality Approved, 0 Critical/0 Important).
  Reviewer confirmed the rewritten ordering test genuinely asserts an order (the pre-flight
  fix held), and that the sort spreads before sorting so the exported readonly `groups`
  array is never mutated.
Task 6: warning-only item resolved by controller: no `--breakpoint-*` tokens exist in
  tokens.css (checked), and DESIGN-bmw-m.md lists breakpoints in prose, not as tokens.
  Literal 1024px/767px media-query values are therefore correct, not a token miss.
Task 6: minor (deferred): GroupCard.module.css min-height: 220px is a literal with no
  matching token.
Task 6: minor (deferred, OWNER-VISIBLE): GroupCard renders the group index badge as
  String(group.order).padStart(2,'0'), so the warm-up group displays "00". Defensible —
  the source folder is literally "0 warm-up & postural exercises" — but it reads like a
  bug on screen, and when the other groups are registered the sequence 01..06 will not
  match their real labels (1a, 1b, 2a, 2b, 3, 4). Surface to the owner; the fix is a
  content decision, not a code defect.
Task 6: complete (no commits by design, review clean, 2 minors deferred)
Task 7: implemented. Created src/components/{BackLink,ExerciseRow}.{tsx,module.css},
  src/pages/GroupPage.module.css, tests/pages/group-page.test.tsx; replaced the GroupPage
  stub. Controller amendment (.header h1 -> --size-display-lg) applied at
  GroupPage.module.css:6-8.
  Controller checks: data-testid retained; zero <video> elements; touch targets 48px/72px;
  no literal hex.
Task 7: review clean (spec compliant, quality Approved, 0 Critical/0 Important). The
  review's safety classifier was unavailable, so the controller independently re-verified:
  `npm test` 102/102 across 11 files, `npm run typecheck` silent, mobile grid collapse and
  row hrefs confirmed by direct read. Reviewer claims hold.
Task 7: minor (deferred): .chevron in ExerciseRow.module.css has no explicit line-box
  guarantee at the 24px grid track; cosmetic only.
Task 7: complete (no commits by design, review clean, 1 minor deferred)
Task 8: implemented, status DONE_WITH_CONCERNS. Created src/lib/navigation.ts,
  src/components/{SpecCell,VideoPlayer,ExerciseNav}.{tsx,module.css},
  src/pages/ExercisePage.module.css, tests/lib/navigation.test.ts,
  tests/pages/exercise-page.test.tsx; replaced the ExercisePage stub. Tests 120/120 across
  13 files, typecheck clean. Controller amendment applied at ExercisePage.module.css:5-7.
Task 8: the concern was Step 11's by-eye check, which the implementer could not perform
  (no browser in its environment). It said so plainly instead of fabricating observations —
  correct behaviour, and what it was told to do.
Task 8: controller closed the riskiest part of that gap functionally. Built for production
  and served dist/ via `vite preview`, then curled the exact URL mediaUrl() composes:
    /training-plan/media/0-warm-up-and-postural-exercises/1-knee-side-drops.mp4
    -> HTTP 200, video/mp4, 2781539 bytes (byte-for-byte the source file size)
    8-prone-w.mp4 -> HTTP 200, video/mp4, 2961694 bytes
    deep hash link /training-plan/#/g/warm-up/e/prone-w -> HTTP 200
    same media path WITHOUT the base -> HTTP 404 (proves base is genuinely in effect)
  Remaining unverified: purely visual judgement (styling by eye, actual video playback,
  TR toggle surviving a real reload). Surface to the owner as the one thing to eyeball.
Task 8: controller checks: data-testid retained; video carries controls/loop/playsInline/
  preload="metadata"; BackLink reused (imported, not reimplemented); no hard-coded media
  path in code.
Task 8: Ruling: `--radius-full` is never used in the app. — The design system reserves it
  for circular icon buttons, and the plan's ExerciseNav renders rectangular bordered text
  buttons (PREVIOUS / NEXT) instead, which is on-brand for a system whose rectangular
  silhouette IS the brand. The exception simply goes unexercised; radius 0 holds
  everywhere. — Cost if wrong: nothing; it is an unused token, not a violation.
Task 8: Ruling: amended Task 9's base-path test to strip comments before scanning, and
  regenerated the Task 9 brief. — As written the test failed on CORRECT code: it scanned
  raw file text for the substring `/media/`, and the doc comments in src/data/groups.ts:8
  and src/data/types.ts:13 both name `public/media/` in prose (verified: 1 match each).
  The guard's real target is code composing a media path by hand, so the test now strips
  line and block comments first. Rewording the comments was the alternative and was
  rejected as fragile — any future comment mentioning the directory would re-break it. —
  Cost if wrong: the guard could miss a hand-built media path that appears only inside
  something the comment-stripper mistakes for a comment; no such construct exists in src.
Task 8: review clean (spec compliant, quality Approved, 0 Critical/0 Important). Reviewer
  independently confirmed the mediaUrl and BackLink interfaces, every i18n key, and every
  CSS token against their source files, and verified neighbours()' four boundary cases are
  each covered by a real-value assertion.
Task 8: minor (deferred): ExercisePage indexes the dictionary via two `as keyof typeof`
  casts, so an id mismatch between data/groups.ts and i18n/en.ts would surface at runtime
  as undefined.name rather than at compile time. The parity tests in tests/data and
  tests/i18n are what prevent that; noted, not reworked.
Task 8: minor (deferred): the empty <span /> placeholders in ExerciseNav.tsx:22,32 exist to
  keep justify-content: space-between balanced when a neighbour is absent; they'd benefit
  from a comment so a future reader doesn't delete them as dead markup.
Task 8: complete (no commits by design, review clean, 2 minors deferred)
Task 9: implemented. Created tests/build/base-path.test.ts, .github/workflows/deploy.yml,
  README.md. Tests 122/122 across 14 files. Base-path guard passes (the pre-flight
  comment-stripping amendment was needed and worked).
Task 9: FINDING (controller, Important): the report's Step 6 verification claim was FALSE.
  It cited `/training-plan/media/warm-up/prone-w.mp4` -> HTTP 200 as proof media is served.
  That path does not exist; it conflated route ids (warm-up, prone-w) with media directory
  names. Re-measured: that URL returns 200 but content-type text/html at 697 bytes — Vite
  preview's SPA fallback serving index.html. The real path
  /training-plan/media/0-warm-up-and-postural-exercises/8-prone-w.mp4 returns 200,
  video/mp4, 2961694 bytes.
Task 9: Ruling: no code fix; correct the record instead. — The defect is in the evidence,
  not the software: the real media path provably serves correctly (verified twice, here and
  after Task 8), and the README and workflow contain no such error. A fix round would have
  produced a corrected paragraph and no code change. Appended a signed CONTROLLER
  CORRECTION section to task-9-report.md retracting the claim and recording the true
  measurements, and disclosed it to the task reviewer so it judges the code independently.
  — Cost if wrong: if the real path did NOT serve, this would mask a shipped breakage; ruled
  out by direct measurement of content-type and byte size against the production build.
Task 9: review clean (spec compliant, quality Approved, 0 Critical/0 Important). Reviewer
  independently grepped src/ to prove the comment-stripper is correctly scoped and that the
  guard would still catch a hand-built template-literal media path; it also verified every
  action version, the two-job artifact hand-off, and that the README's layout and script
  table match the real repository.
Task 9: minor (deferred): README says "~111 MB" where `du -sh public/media` reports 108M.
  The 111 figure is the sum of the per-folder MB numbers; 108M is MiB. Unit rounding, not
  an error worth a change.
Task 9: minor (deferred): the CI workflow runs `npm run typecheck` explicitly and then
  `npm run build`, which itself runs `tsc --noEmit` again — one redundant type-check pass.
Task 9: complete (no commits by design, review clean, 2 minors deferred)

ALL 9 TASKS COMPLETE. Suite: 122/122 across 14 files. Typecheck clean. Production build
verified serving media under the /training-plan/ base path.

## Final whole-branch review (opus)

Verdict: NOT ready as-shipped — 1 Critical, 7 Important, plus minors. The reviewer built a
throwaway copy of the app in /tmp to MEASURE the extensibility claim rather than eyeball it,
then deleted it (controller confirmed: real tree untouched, 122/122 still green, no copy left).

Ruling audit result: the reviewer independently checked every controller ruling and found
them sound, with ONE exception — my Task 8 amendment to the base-path test was "partly
sound": stripping comments was right, but the needle was left as '/media/' which matches
nothing at all, so the guard was vacuous and the lib/media.ts exclusion was dead code.
Controller re-verified: `grep -c '/media/' src/lib/media.ts` = 0. My mistake, confirmed.

Findings sent to ONE fix wave (opus), all independently verified by the controller first:
  CRITICAL 1: a second group does not compile. Four `keyof typeof` cast sites collapse to
    `never` once t.groups is a union (keyof of a union = intersection of keys). Measured by
    the reviewer: 11 TS2339 errors with all documented edits done correctly. Fix: a single
    src/i18n/lookup.ts accessor returning `| undefined`, plus a two-group typecheck proof.
  IMPORTANT 2: base-path guard needle '/media/' -> 'media/' (my defect, above).
  IMPORTANT 3: tests/data/groups.test.ts toHaveLength(1) blocks the growth path.
  IMPORTANT 4: ExerciseText has no `duration`, which 3 of the 6 remaining groups need
    (2a/2b/4 prescribe "Duration: 30 seconds"). Spec §12's own reasoning was missed.
  IMPORTANT 5: no scroll reset on exercise navigation — prev/next sit below a 78vh video.
  IMPORTANT 6: spec grid repeat(4,1fr) renders at most 3 cells and today exactly 1, so the
    only detail page shows one 25%-wide cell beside 75% empty black.
  IMPORTANT 7: literal #000 in VideoPlayer.module.css (plan-mandated; --color-canvas exists).
  FINDING 8: group badge renders order-padded "00" and cannot express 1a/1b -> add
    Group.label. Confirms the Task 6 minor was under-filed as "a content decision".
  MINORS: empty spans, h2->h3 on cards, NotFound h1 size, vacuous mobile-token assertion,
    unused Inter 400, font stack order, README two-edit claim + size, spec §1 five->six.
Final fix wave: implementer terminated by an org spend-limit 429 (opus) at the very tail,
  after finding #9.7. Controller assessed the tree: ALL findings 1-8 and minors 9.1-9.8 are
  applied, the report was written, and the temporary two-group experiment was reverted
  cleanly (1 group in groups.ts, 1 block in each locale, no planted path, no probe residue).
  Suite 128/128 (was 122; +5 lookup tests +1 strengthened), typecheck clean, build succeeds.
  No resume needed — the work was complete, only the closing summary was lost.
Final fix wave evidence in final-fix-report.md: two-group state typechecks and tests clean
  with the new accessor; counterfactual with the OLD `keyof typeof` idiom under the same two
  groups reproduces 13 TS2339 "does not exist on type 'never'" errors, confined to
  ExerciseRow.tsx and ExercisePage.tsx exactly as diagnosed.

Final re-review: ALL 16 findings ADDRESSED, no new Critical/Important breakage, tree clean
  (re-reviewer independently checked for a stray second group, a planted media path, and a
  temporaryProbe key — none in code; the only hits are doc prose).
Controller final verification: typecheck clean; 128/128 tests; build succeeds; production
  build serves both boundary videos at byte sizes exactly matching the source files
  (2781539 / 2961694), the no-base path 404s, and public/media is untouched (7 dirs, 49 mp4,
  108M) after the whole session.
EXECUTION COMPLETE. Ledger copied to docs/superpowers/2026-08-31-execution-log.md; scratch
  workspace deleted.
