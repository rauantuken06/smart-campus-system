# Project memory

## Product intent & audience

- Smart Campus Room Availability Checker: lets users check whether campus rooms are available for booking at a given time.
- Intentionally no backend or database; data is hardcoded fixtures (`src/data.ts`).
- Includes an LLM-powered "explain" feature with a mock offline adapter.

## Brand personality & voice

- Internal/campus utility tool; tone is functional and clear.
- Acceptance criteria emphasize "clear desktop and mobile UI feedback" (AC6).

## Visual design & UX direction

- Stack: Vite + React 18 + TypeScript; Tailwind CSS for styling; Lucide React for icons.
- Component layout: `TimeSelector` (inputs) → `RoomFilters` (filter sidebar) → `RoomGrid` (cards) → `ResultBanner` + `ExplainSection` + `BookingSchedule`.
- `BookingSchedule` sorts bookings by start time using a copy (AC5: no mutation).
- Responsive: must work on desktop and mobile.
- Known UX gap: `TimeSelector` passes raw `Number()` values without clamping; NaN/out-of-range can break duration hint and stale-result guard.

## Decisions, constraints & rationale

- Project is NOT a git repository; Bolt's own Version History is used instead. Do not `git commit`/`push`.
- npm scripts: `dev`, `build`, `test` (vitest run), `typecheck` (tsc --noEmit -p tsconfig.app.json), `lint` (eslint .), `preview`.
- Core availability rules in `src/availability.ts` enforce AC1–AC4: reject invalid/past intervals, max 120 min booking, reject blocked rooms, reject overlapping bookings but allow touching endpoints.
- `MAX_BOOKING_MINUTES` = 120; `DAY_END_MINUTES` = 1440 (constants in `src/constants.ts`).
- LLM explain feature uses an adapter interface (`src/llm/explain.ts`) with output validation and timeout; `src/llm/mockAdapter.ts` is deterministic and ≤2 sentences.
- Baseline health (all green): 70 tests pass, typecheck pass, build pass, lint pass.
- `@supabase/supabase-js` is listed in `package.json` but unused in `src/` — candidate for removal.

## Open questions & assumptions

- W2 (Observed): Should `TimeSelector` clamp values to 0–1440 and coerce NaN to 0? No fix applied yet.
- W3 (Unverified): `ExplainSection` lacks unmount guard during pending LLM request; React 18 silently ignores — may need `AbortController` or `mountedRef` + test.
- W4 (Observed): `BookingSchedule` has only 1 test (empty state); sort-order and multi-booking rendering untested.
- W5 (Assumed): No CI or pre-commit hooks; nothing enforces the documented verification checks.
- Open: whether to remove unused Supabase dependency or add CI workflow.