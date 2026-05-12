# Current Project Context & History

## General Context
The Shpakich AI Agents Builder is in the early active development phase. The foundational architecture (Native Federation, Angular 21, Taiga UI) is set up. The core layout and routing for the Builder feature are complete. The builder uses a 3-step workflow (Setup, Stack, Review) with Lucide icons on the TuiStepper. We are currently focusing on implementing the individual form steps strictly adhering to the established Zero Literals and View Model patterns.

## Development History

### Commit `1a01164`: fix: perfect scroll-spy sidebar, strictly typed linters, and full session reset
**Status:** Completed
**Key Features Implemented:**
- **Scroll Sync & Anchor Navigation**: Rewrote the builder sidebar synchronization. Removed error-prone `window.scrollTo` in favor of native `element.scrollIntoView()` paired with CSS `scroll-margin-top`. Fixed a CSS Grid flaw (`align-items: start`) that previously collapsed the grid layout, restoring full `position: sticky` behavior to the Taiga UI sidebar.
- **Honest Linter Compliance**: Resolved 23 linter errors strictly without utilizing `eslint-disable`. Addressed all `any` casting in tests, replaced empty callbacks with `() => undefined`, and resolved `label-has-associated-control` template errors by implementing static ID counters in custom `ControlValueAccessor` fields.
- **Hard Session Reset**: Implemented a "Reset All" button in the footer with a clean Taiga UI flat-destructive aesthetic. The reset logic robustly clears `sessionStorage` and triggers a full router-level or window-level SPA redirect, guaranteeing complete clearance of residual reactive form states.
- **100% Passing Coverage**: Expanded unit tests in `builder.spec.ts` and `builder-state.spec.ts` to cover the new reset behavior, restoring the global project coverage safely above the required 85% threshold.

### Commit `4c31e7a`: feat: enforce 85% vitest coverage, harden CVA tests, and fix asset routing for ZIP generator
**Status:** Completed
**Key Features Implemented:**
- **Strict Vitest Coverage Enforcement**: Configured `vitest.config.ts` to strictly require >85% global coverage across Lines, Branches, Statements, and Functions. This rule physically blocks builds if untested UI logic is introduced.
- **ControlValueAccessor (CVA) Hardening**: Wrote comprehensive unit tests for all custom form components (`textarea-field`, `checkbox-group`, `radio-group`). Covered blind spots related to the default callbacks in `registerOnChange` and `registerOnTouched`, achieving an overall coverage of ~94% Lines.
- **Modern Angular Static Assets Routing**: Resolved a critical 404 bug affecting the `fflate` ZIP downloader. Moved the legacy `src/assets` folder to `public/assets` to comply with the modern Angular 18+ `@angular/build:application` structure, which only serves static files from the `public/` directory by default.
- **Archive Generation Finalization**: Stabilized the Builder's final step. The `fflate` engine now successfully intercepts the Builder State, iterates over the `ARCHIVE_SCHEMA`, handles hidden directories (e.g., `.agent`, `.cursor`), injects template strings, and triggers the browser's native download API for the final context zip.

### Commit `fe19c43`: refactor: strictly configuration-driven UI, zero eslint disables, and comprehensive form tests
**Status:** Completed
**Key Features Implemented:**
- **Dynamic Configuration-Driven Forms**: Refactored `SetupStep` and `StackStep` to iterate over arrays (`SETUP_BLOCKS`, `STACK_BLOCKS`) and dynamically build `FormGroup` structures via `Array.reduce`. This ensures 100% UI layout universality, permitting arbitrary reshuffling of config arrays without modifying component TS logic.
- **Strict Quality Assurance**: Installed `angular-eslint` via schematics and refactored code to eliminate all lint violations **without using a single `eslint-disable` comment**. Enforced strict typing across all custom `ControlValueAccessor` implementations (`RadioGroup`, `CheckboxGroup`, `TextareaField`).
- **Comprehensive Testing**: Wrote new unit tests covering the dynamic reactive form generation logic and validated user interactions within `RadioGroup` and `CheckboxGroup` via `ControlValueAccessor` implementations. The test suite passes fully (32/32 tests).
- **Flexbox Layout Optimization**: Migrated from a strict CSS grid to `display: flex; flex-wrap: wrap;` in `radio-group.scss` and `checkbox-group.scss`, preventing unwanted text wrapping and ensuring container widths natively fit the content.

### Commit `30a23d5`: refactor: enforce strict CSS layout encapsulation, BEM architecture, and Native Federation cache safety
**Status:** Completed
**Key Features Implemented:**
- **Component Encapsulation & Layout**: Refactored `builder-block` and `step-layout` to strictly use the `:host` selector for width/centering constraints (1200px max-width), eliminating redundant HTML wrapper `div`s. Replaced inappropriate semantic `<header>` tags in sub-components with generic `div`s.
- **BEM & SCSS Architecture**: Refactored component SCSS to adhere to BEM conventions (`__header`, `__icon`, `__title`) with SCSS nesting, replacing scattered and generic class names. Fixed visual hierarchy by scaling down sub-heading font sizes (`1.125rem`) and aligning icons with flexbox.
- **Zero Literals Policy (Templates)**: Extracted missed hardcoded labels (e.g., "Contents" in the Table of Contents) into the central `BUILDER_DICTIONARY.labels` and mapped them via the View Model.
- **Agent Workflow Directives**: Updated `docs/architecture.md` and `GEMINI.md` to introduce a mandatory CSS Integrity Check (validating `:host` encapsulation and BEM) and established a Cache Recovery protocol to handle Native Federation cache poisoning by auto-clearing `.angular/cache` via `npm run prestart`.

### Commit `9155358`: refactor: restructure builder from 4 steps to 3, add Lucide icons on stepper
**Status:** Completed
**Key Features Implemented:**
- **3-Step Workflow**: Consolidated 4 builder steps (Project, IDE, Stack, Export) into 3 logical steps: Setup (project + IDE), Stack (unchanged), Review (review + export). Deleted `project-step`, `ide-step`, `export-step` components; created `setup-step` and `review-step`.
- **Lucide Icons on Stepper**: Added `icon` field to `BuilderStep` interface and applied Taiga UI's `[icon]` input on `tuiStep` (`@tui.settings`, `@tui.layers`, `@tui.file-check`).
- **Download Button Icon**: Added `@tui.download` icon via `[iconEnd]` on the final step's Download button, with the icon constant stored in `BUILDER_DICTIONARY.icons`.
- **Zero Magic Numbers**: Replaced hardcoded step indices (`< 3`, `=== 2`) with data-driven expressions (`view.steps.length - 1`, `view.steps.length - 2`).
- **Test Fixes**: Fixed `app.spec.ts` (added `provideRouter`, `provideTaiga`, `matchMedia` mock for jsdom) and `welcome.spec.ts` (added `provideRouter`). All 21/21 tests passing.

### Commit `c6cb6ec`: refactor: enforce strict barrel architecture, fix Taiga UI typography, and strictly align AI prompt
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
