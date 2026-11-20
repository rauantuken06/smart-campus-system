# AGENTS.md — Smart Campus Room Availability Checker

> Instructions for AI agents (Bolt, Copilot, etc.) working on this project.
> Read this file before modifying source code. Summarize the constraints
> before implementation. Do not assume this file was loaded automatically.

## 1. Project Purpose

A React + TypeScript web application that lets campus users check whether a
room is available for booking at a given time. Room and booking data are
**fictional and hardcoded** — there is no backend, database, authentication,
payments, or live API. The app is an internal campus utility tool with a
functional, clear tone.

An LLM-powered "Explain availability" feature produces a short, human-readable
summary of the availability verdict using a **mock offline adapter** (no network
calls).

## 2. Architecture

```
src/
├── App.tsx                  Application state, check flow, component integration
├── availability.ts          Pure booking availability rules (AC1–AC4) + isSameCheck
├── constants.ts             MAX_BOOKING_MINUTES (120), DAY_END_MINUTES (1440)
├── data.ts                  5 sample rooms + 6 sample bookings (hardcoded fixtures)
├── types.ts                 Room, Booking, CheckInputs, AvailabilityResult
├── roomFilters.ts           filterRooms(), getEquipmentOptions() — pure functions
├── time.ts                  minutesToLabel() — pure formatting utility
├── components/
│   ├── TimeSelector.tsx     Numeric time input (minutes from midnight)
│   ├── RoomFilters.tsx      Capacity + equipment filter controls
│   ├── RoomGrid.tsx         Room card list + empty state
│   ├── RoomCard.tsx         Single room card (selectable, blocked indicator)
│   ├── ResultBanner.tsx     Available / Unavailable verdict display
│   ├── ExplainSection.tsx   LLM explain button + result rendering
│   └── BookingSchedule.tsx  Existing bookings list (sorted by start time)
├── llm/
│   ├── explain.ts           LlmAdapter interface, explainSafely(), output validation, timeout
│   └── mockAdapter.ts       Deterministic offline adapter (≤2-sentence template)
└── __tests__/               Vitest unit + component tests (8 files, 70 tests)
```

### Data flow

`TimeSelector` (inputs) → `RoomFilters` (sidebar) → `RoomGrid` (cards) →
`Check Availability` button → `ResultBanner` + `ExplainSection` + `BookingSchedule`.

`ExplainSection` calls `explainSafely(adapter, request)` which races the adapter
against a 2-second timeout, validates the output structurally and enforces a
2-sentence limit, and normalizes every failure mode into a safe fallback string.

## 3. Setup

```bash
npm install        # install dependencies
npm run dev        # start Vite dev server (runs automatically in Bolt)
```

Requirements: Node.js and npm.

## 4. Safe Commands

These commands are safe to run at any time and do not modify source files:

```bash
npm test           # run all Vitest tests (70 tests across 8 files)
npm run build      # production build via Vite
npm run typecheck  # TypeScript type check (tsc --noEmit)
npm run lint       # ESLint
npm run preview    # preview the production build locally
```

## 5. Acceptance Criteria (AC1–AC6)

Do not change these criteria. All code changes must preserve them.

| AC | Rule | Enforced in |
|---|---|---|
| AC1 | Reject invalid intervals and past requests. | `availability.ts` |
| AC2 | Maximum booking duration is 120 minutes. | `availability.ts`, `constants.ts` |
| AC3 | Reject blocked rooms. | `availability.ts` |
| AC4 | Reject overlapping bookings but allow touching endpoints. | `availability.ts` |
| AC5 | Do not mutate booking data. | `availability.ts`, `BookingSchedule.tsx` (sorts a copy) |
| AC6 | Preserve clear desktop and mobile UI feedback. | All components (responsive Tailwind) |

Additional feature rules:
- The LLM explain feature must limit output to 2 sentences, validate adapter output structurally, handle timeouts (2 s), and return a safe fallback on any failure.
- Hide an outdated availability result when the selected room or time inputs change (stale-result guard in `App.tsx` via `isSameCheck`).
- Use only the selected room's bookings when checking availability.

## 6. Coding Conventions

- **Pure functions first.** Keep business rules in `availability.ts`, `roomFilters.ts`, `time.ts`, and `llm/explain.ts` — separate from UI components.
- **No mutation of input arrays.** Sort or filter copies, not originals (AC5).
- **No magic numbers.** Use constants from `constants.ts` (`MAX_BOOKING_MINUTES`, `DAY_END_MINUTES`) and `llm/explain.ts` (`EXPLAIN_TIMEOUT_MS`, `MAX_EXPLAIN_SENTENCES`).
- **Type safety.** Every function parameter has an explicit type. Avoid `any`. Use the shared types in `types.ts`.
- **Imports.** Use the `@/` path alias (maps to `src/`) for project modules. Import every symbol you reference.
- **Icons.** Use `lucide-react` for all icons.
- **Styling.** Tailwind CSS classes only. No CSS-in-JS or inline style objects unless unavoidable.
- **Comments.** Write comments only when the "why" is non-obvious. Do not explain what the code does.
- **Design patterns.** Use at most two justified design patterns. Do not introduce unnecessary abstractions.
- **Dependencies.** Do not add new dependencies unless explicitly approved. The existing dependency list is intentional.
- **File organization.** Organize by cohesion. Place new files where a reader would expect them based on the existing directory structure.

## 7. Test Expectations

- Run `npm test` before considering work complete. All 70 tests must pass.
- Do not remove or weaken existing tests.
- Add focused regression tests when fixing a bug or adding a rule.
- Test the explain feature for: fallback on rejection, fallback on timeout, fallback on malformed output, fallback on >2-sentence output, scenario fidelity (overlap, blocked, invalid, past, available), and UI integration.
- Stale-result protection is tested through a helper (`isSameCheck`) and an interactive App test.

## 8. Allowed File Changes

- Edit existing source files in `src/` to fix bugs, add tests, or improve correctness.
- Add new test files under `src/__tests__/` when justified.
- Add focused regression tests in existing test files.
- Edit `AGENTS.md` or `README.md` to keep documentation current.
- Extract utilities into existing modules (`time.ts`, `constants.ts`) when it reduces duplication.
- Replace mutating sorting with sorting a copy.
- Centralize constants that are currently magic numbers.

## 9. Prohibited Operations

### Secrets and security
- **Do not access, expose, or commit secrets** (API keys, passwords, tokens, credentials).
- **Do not add `.env` values to version control** or paste them into chat.
- **Do not introduce external services, APIs, or network calls.** The explain feature uses a mock adapter only.

### Infrastructure
- **Do not introduce a backend or database.** Data is hardcoded in `src/data.ts`.
- **Do not add authentication or login.**
- **Do not implement booking creation or persistence.** The app is read-only.
- **Do not deploy to production** or any external environment.
- **Do not modify production systems.**

### Destructive commands
- **Do not run destructive shell commands** (`rm -rf`, `git push --force`, `git reset --hard`, `DROP TABLE`, `DELETE FROM`, etc.) unless explicitly approved by the user.
- **Do not delete files unless they are confirmed unused** — check call sites first.
- **Do not overwrite or discard uncommitted user work.** If unexpected files or state appear, investigate before acting.

### Dependencies and scope
- **Do not add, remove, or upgrade dependencies without explicit human approval.** This includes npm packages, Tailwind plugins, ESLint configs, and TypeScript compiler options.
- **Do not make unrelated code changes.** A bug fix should not include surrounding refactoring.
- **Do not redesign the existing UI.** Preserve the visual appearance and layout.
- **Do not change AC1–AC6.**
- **Do not introduce unnecessary design patterns or abstractions.**

## 10. Human Review Gates

Before completing any task:

1. **Explain planned changes** before applying them. Wait for user approval on non-trivial changes.
2. **Review the affected files and code differences.**
3. **Run all verification commands** and report results:
   ```bash
   npm test
   npm run build
   npm run typecheck
   npm run lint
   ```
4. **Verify AC1–AC6 are preserved.**
5. **Check the application at desktop and mobile widths** (or state that interactive verification was not possible).
6. **Report changed files, test results, and remaining risks.**
7. **Explain any remaining limitations.**
8. **Require human approval before merging or deploying.**

All failures must be reported. Never claim that an unexecuted test passed. Never claim work is complete when checks show failures.

## 11. Remaining Gaps (Known)

These are documented for awareness; do not fix unless explicitly tasked:

- `@supabase/supabase-js` is listed in `package.json` but unused in `src/` — candidate for removal with human approval.
- `TimeSelector` passes raw `Number()` values without clamping to 0–1440 or coercing NaN to 0. NaN can break the duration hint and the stale-result guard (`isSameCheck`).
- `ExplainSection` has no unmount guard during a pending LLM request. React 18 silently ignores `setPhase` on an unmounted component, so there is no visible bug, but a `mountedRef` or `AbortController` would be more correct.
- `BookingSchedule` has only 1 test (empty state). Sort-order and multi-booking rendering are untested.
- No CI or pre-commit hooks enforce the verification commands.
