# Project Architecture

## Technology Stack
- **Framework:** Angular 21+
- **Component Architecture:** Standalone Components (Strictly no NgModules).
- **State Management:** Angular Signals (Strictly no NgRx or RxJS-based state).
- **UI Component Library:** Taiga UI 5.x.
- **Micro-Frontend Architecture:** `@angular-architects/native-federation`.
- **Styling Architecture:** Strictly enforce BEM (Block, Element, Modifier) methodology combined with SCSS nesting (`&__element`). Loose, generic class names are strictly forbidden.
- **Component Encapsulation:** Utilize the `:host` selector for all component-level layout boundaries (margins, max-width, display logic) to eliminate redundant HTML wrapper elements.
## Directory Structure (Technical Role Grouping)
The architecture explicitly avoids Feature-Sliced Design (FSD) to prevent over-engineering. We use a flat, role-based directory structure within `src/app/`:

- `src/app/pages/`: Routable container components (`welcome`, `builder`). These act as the Smart components that tie routing to the layout.
- `src/app/components/`: UI feature blocks representing the specific steps of the Builder (`setup-step`, `stack-step`, `review-step`). These are Dumb components that focus purely on rendering and user interaction.
- `src/app/services/`: The core business logic layer.
  - `builder-state.service.ts`: Manages the state of the form. It uses highly granular Signals (individual signals for each step) to ensure that Angular only re-renders the specific UI components that change, avoiding expensive global re-renders.
  - `rules-engine.service.ts`: The dependency validation engine. It evaluates user selections against external configurations to filter out incompatible technologies.
- `src/app/models/`: TypeScript interfaces and type definitions (e.g., config types).
- `src/app/shared/`: Reusable UI elements, such as the bottom Stepper navigation and Forward/Back buttons.

## Design Patterns & Principles
- **Configuration-Driven Rules**: The dependencies and logic mappings for the tech stack (e.g., which databases are compatible with Node.js) are strictly decoupled from the `rules-engine` service code. They are stored in static configuration files (like `stack-rules.data.ts`), allowing rules to be easily updated or extended without refactoring the service logic.
- **Granular Reactivity**: State is not kept in a massive monolithic object. Instead, each Builder step updates its own specific Signal in the `builder-state` service.
- **Thin Components**: UI Components do not contain complex validation or business logic. They exclusively bind to state Signals and trigger methods on the injected services.
- **Modern Dependency Injection**: We rely exclusively on the modern `inject()` function for DI, avoiding traditional constructor injection to keep components clean and highly readable.
- **Zero Literals Policy (SSOT)**: No hardcoded UI strings, dictionary keys, or router paths in components or HTML templates. All static texts, including micro-labels, MUST be exported as constants from `src/app/shared/constants/` and bound via the component's View Model.
- **Semantic Minimalism**: Prefer clean, generic structural tags (`<div>`) with BEM classes for isolated component blocks over forced semantic tags (`<header>`, `<main>`) that disrupt global document outlines.
- **Barrels & Path Aliases**: All imports from core directories MUST go through barrel files (`index.ts`). Always use TypeScript path aliases (e.g., `@shared/constants`) instead of deep relative paths.
- **View Model Pattern**: Do not pollute the component class with scattered variables for the template. Group all UI-bound static data into a single `readonly view = { ... }` object to maximize cohesion.
- **Test-Driven & Coverage Safety**: Write unit tests (Vitest) immediately after major component refactoring to ensure regression safety. A strict `85%` minimum coverage threshold (Lines, Branches, Functions, Statements) is enforced in the CI/CD and local build pipeline via `vitest.config.ts`. Commits dropping below this threshold will fail the build.
- **English Comments**: Write all code comments strictly in English to adhere to international Enterprise standards.
- **Client-Side Processing (CSR)**: The application relies heavily on browser APIs (Blob, JSZip, LocalStorage) and does not utilize Server-Side Rendering (SSR).
- **Static Asset Management**: In modern Angular 18+ utilizing `@angular/build:application`, NEVER use the legacy `src/assets` folder. All static assets (templates, icons, dictionaries, mock data) MUST be placed inside the root `public/` directory to ensure proper serving and copying during federation builds.
