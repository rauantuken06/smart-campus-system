
# Smart Campus Room Availability Checker

## Project
This project is a React and TypeScript web application that checks room availability using fictional booking data.

## Structure
- src/availability.ts: Pure booking availability rules.
- src/App.tsx: Main UI state and check flow.
- src/components/: UI components.
- src/data.ts: Sample room and booking fixtures.
- src/types.ts: Shared TypeScript types.
- src/__tests__/: Automated Vitest tests.

## Acceptance Criteria
- AC1: Reject invalid intervals and past requests.
- AC2: Maximum booking duration is 120 minutes.
- AC3: Reject blocked rooms.
- AC4: Reject overlapping bookings but allow touching endpoints.
- AC5: Do not mutate booking data.
- AC6: Preserve clear desktop and mobile UI feedback.

## Engineering Rules
- Prefer pure functions and minimal changes.
- Use at most two justified design patterns.
- Do not introduce unnecessary design patterns.
- Keep business rules separate from UI components.
- Avoid duplicated code and magic numbers.
- Never mutate input booking arrays.
- Preserve existing behavior and UI appearance.
- Do not remove or weaken existing tests.

## Allowed Refactoring
- Extract minutesToLabel into src/time.ts.
- Centralize booking duration and day-end constants.
- Replace mutating sorting with sorting a copy.
- Add focused regression tests when justified.

## Forbidden Changes
- Do not introduce a backend or database.
- Do not add authentication or login.
- Do not implement booking creation or persistence.
- Do not introduce unnecessary dependencies.
- Do not redesign the existing UI.
- Do not change AC1–AC6.

## Verification
Run the following commands:

npm test
npm run build

Before completing a refactoring task:
1. Review the changed files.
2. Run all existing tests.
3. Verify that AC1–AC6 are preserved.
4. Check the application at desktop and mobile widths.
5. Report changed files and test results.
6. Explain any remaining limitations.

## AI Agent Instructions
- Read this file explicitly before modifying source code.
- Summarize the constraints before implementation.
- Explain the planned changes.
- Do not assume this file was loaded automatically.
- Wait for user approval before applying changes.
