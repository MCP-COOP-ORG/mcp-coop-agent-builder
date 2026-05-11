# Current Project Context & History

## General Context
The Shpakich AI Agents Builder is in the early active development phase. The foundational architecture (Native Federation, Angular 21, Taiga UI) is set up. The core layout and routing for the Builder feature are complete. We are currently focusing on implementing the individual form steps (Project, IDE, Stack, Export) strictly adhering to the established Zero Literals and View Model patterns.

## Development History

### Commit `6102a72`: chore: setup initial builder architecture, routing, and AI context docs
**Status:** Completed
**Key Features Implemented:**
- **Persistent Navigation Layout**: Developed a viewport-pinned footer with a dynamic `TuiStepper` and navigation buttons.
- **Reactive Router Sync**: Implemented `toSignal()` to synchronize the Stepper state with the current browser URL dynamically.
- **Zero Literals Enforcement**: Extracted all hardcoded UI labels, step definitions, and router paths into `@shared/constants` (e.g., `builder-dictionary.ts`, `builder-steps.ts`).
- **Clean Architecture Standards**: Implemented Barrel exports (`index.ts`) for constants and configured TypeScript path aliases (`@shared/*`). Grouped UI data into a highly cohesive `readonly view` object (View Model Pattern).
- **Test-Driven Safety**: Replaced default tests with a comprehensive Vitest suite covering router logic and step synchronization (100% passing).
- **Documentation**: Established formal enterprise architecture rules in `docs/architecture.md`.
