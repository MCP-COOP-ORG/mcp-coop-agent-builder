# Current Project Context & History

## General Context
The Shpakich AI Agents Builder is in the early active development phase. The foundational architecture (Native Federation, Angular 21, Taiga UI) is set up. The core layout and routing for the Builder feature are complete. We are currently focusing on implementing the individual form steps (Project, IDE, Stack, Export) strictly adhering to the established Zero Literals and View Model patterns.

## Development History

### Commit `50c2be3`: refactor: enforce strict barrel architecture, fix Taiga UI typography, and strictly align AI prompt
**Status:** Completed
**Key Features Implemented:**
- **Strict Barrel Architecture**: Eliminated all `tsconfig.json` wildcard paths (`/*`) and the global `shared/index.ts` barrel. Replaced them with explicit sub-domain aliases (e.g., `@shared/constants`, `@shared/components`) to prevent Native Federation warnings, tree-shaking issues, and circular dependencies.
- **Taiga UI v4 Typography**: Fixed missing typography by migrating from deprecated CSS variables to the modern v4 `var(--tui-typography-family-text)` and `display` variables, globally applying JetBrains Mono.
- **UI Consolidation**: Centralized step headers into the standalone `StepHeaderComponent` utilizing Angular Signals (`input.required`) and explicitly bound `styleUrl` for proper SCSS encapsulation.
- **AI Rule Enforcement**: Updated `Gemini.md` with a strict `MANDATORY PRE-FLIGHT CHECK` mechanical rule, eliminating AI guessing by requiring mandatory MCP server usage (`mcp_taiga-ui_get_overview` / `mcp_angular-cli_search_documentation`) before any CSS/Angular logic is written.

### Commit `2e99c3e`: feat: implement builder navigation UI, zero literals policy, and vitest coverage
**Status:** Completed
**Key Features Implemented:**
- **Persistent Navigation Layout**: Developed a viewport-pinned footer with a dynamic `TuiStepper` and navigation buttons.
- **Reactive Router Sync**: Implemented `toSignal()` to synchronize the Stepper state with the current browser URL dynamically.
- **Zero Literals Enforcement**: Extracted all hardcoded UI labels, step definitions, and router paths into `@shared/constants` (e.g., `builder-dictionary.ts`, `builder-steps.ts`).
- **Clean Architecture Standards**: Implemented Barrel exports (`index.ts`) for constants and configured TypeScript path aliases (`@shared/*`). Grouped UI data into a highly cohesive `readonly view` object (View Model Pattern).
- **Test-Driven Safety**: Replaced default tests with a comprehensive Vitest suite covering router logic and step synchronization (100% passing).
- **Documentation**: Established formal enterprise architecture rules in `docs/architecture.md`, `docs/concept.md`, and `Gemini.md`.

### Commit `6102a72`: chore: setup initial builder architecture, routing, and AI context docs
**Status:** Completed
**Key Features Implemented:**
- Initialized core application structure.
- Set up basic placeholder routing for the Builder feature.
