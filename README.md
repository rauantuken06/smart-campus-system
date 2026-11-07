Smart Campus Room Availability Checker
A small React + TypeScript application for checking the availability of fictional campus rooms. Developed and extended for Software Engineering — Assignment #04.
Features
- Browse a catalog of five fictional rooms.
- Filter rooms by minimum capacity (a room with exactly the requested capacity is included).
- Filter rooms by required equipment (a room must have all selected items).
- See a clear message when no rooms match the filters.
- Select a room and check whether it is available for a chosen time interval.
- Prevent bookings for blocked rooms, invalid or past intervals, durations over 120 minutes, and overlapping reservations.
- Allow booking intervals that touch an existing reservation's start or end time without overlapping.
- Use only the selected room's bookings when checking availability.
- Keep booking data unchanged during availability checks.
- Hide an outdated availability result when the selected room or time inputs change.
Technologies
- React 18
- TypeScript
- Vite 5
- Tailwind CSS 3
- Vitest
Requirements
- Node.js and npm installed on your computer.
Installation
Open a terminal in the project root (the directory containing package.json) and run:
npm install
Run the application
npm run dev
Open the local address printed by Vite in the terminal.
Run tests and checks
npm test
npm run build
npm run typecheck
The last recorded verification for Assignment #04 reported 44 passing tests across six test files, a successful production build, and a successful TypeScript type check. These are historical results; execute the commands above to verify your own copy.
Main project files
File	Responsibility
src/App.tsx	Application state and component integration
src/data.ts	Fictional room and booking data
src/types.ts	Shared TypeScript types
src/availability.ts	Booking validation and stale-result comparison
src/roomFilters.ts	Pure capacity and equipment filtering logic
src/constants.ts	Shared booking limits
src/time.ts	Time formatting utility
src/components/RoomFilters.tsx	Filter controls
src/components/RoomGrid.tsx	Room list and empty state
src/components/TimeSelector.tsx	Reusable time input
src/__tests__/	Unit and component rendering tests


How to use
1. Set the minimum attendee capacity and choose any required equipment.
2. Select a room from the matching results.
3. Enter the current time, booking start, and booking end (in minutes from midnight).
4. Click Check Availability to see the result.
5. If you change a room or time input, run the availability check again for an updated result.
Scope and known limitations
- Room and booking data are fictional and stored locally; no database, authentication, payments, or live APIs are used.
- The current time is entered manually, rather than read from a real-time clock.
- Automated tests cover booking and filtering rules and some static component rendering. They do not fully cover browser interactions or responsive layout; stale-result protection is tested through a helper rather than a full interactive React test.
AI-assisted development
ChatGPT was used for planning, analysis, and reporting. Bolt.new was used to inspect and modify the React + TypeScript project. Automated checks were used to verify the code after changes.
Assignment evidence
The accompanying Assignment #04 report contains the codebase analysis, feature extension, refactoring diagrams, test results, quality comparison, AI reflection, and AI evidence appendix.