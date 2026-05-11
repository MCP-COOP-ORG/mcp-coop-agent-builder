# Application Concept: Shpakich AI Agents Builder

## The Problem
Default AI assistant rules (such as a standard `.cursorrules` file or a generic system prompt for Gemini/Copilot) are too abstract. They lack specific context about the project's unique technology stack, architectural patterns (e.g., Hexagonal Architecture), and internal team coding conventions (e.g., a Zero Literals Policy). Because of this, developers waste significant time repeatedly correcting the AI and manually providing context in every chat session.

## The Solution
A visual web-based **Builder** that allows developers to seamlessly generate a perfect, project-specific AI context file in a few clicks:
1. **Target Selection**: Choose the specific AI assistant or IDE being used (Cursor, Windsurf, Copilot, Gemini).
2. **Domain Definition**: Briefly describe the business logic and context of the project.
3. **Tech Stack Configuration**: Select the precise technologies used (Frontend, Backend, Database).
4. **Architecture & Standards**: Define the architectural patterns and clean code rules the AI must follow.
5. **Generation**: Instantly generate and download a perfectly formatted, logically consistent context archive or prompt file.

## Key Features
- **Smart Rules Engine**: A dependency-aware configuration graph. The engine ensures logical consistency—for example, if a developer selects Angular, it will restrict the selection of React-specific libraries; if NestJS is selected alongside Hexagonal Architecture, it automatically includes specific port/adapter rules for the AI.
- **Client-Side Generation**: 100% frontend-driven. The application has no backend, ensuring maximum privacy and instant feedback. Archives and prompt files are generated entirely in the user's browser.
- **Micro-Frontend Architecture**: Built from the ground up as a Native Federation Micro-Frontend (MFE), designed to be seamlessly embedded into the overarching Shpakich Platform ecosystem.

## Development Roadmap & Strategy
To build this visual Builder correctly, we follow a strict sequential plan. Each step is designed to enforce the architecture and clean code standards.

### 1. State Management (`Builder State`)
- **Why:** The builder is a complex multi-step form. Instead of a monolithic object, we need isolated reactivity to avoid performance bottlenecks.
- **Plan:** Implement the state using individual, granular Signals for each step (IDE, Project, Stack, Export) in `builder-state.ts`. This ensures only modified components re-render. No `localStorage` persistence is required initially.

### 2. Validation & Rules (`Rules Engine`)
- **Why:** To enforce the "Smart Rules Engine" concept without hardcoding logic into components.
- **Plan:** Externalize tech-stack configurations into static objects/files (e.g., `stack-rules.data.ts`). The `Rules Engine` service will consume these configs and evaluate them against the `Builder State` to validate user choices dynamically.

### 3. Core Shell & Navigation (`Builder Navigation UI`) - ✅ Completed
- **Why:** The user needs a persistent, intuitive way to navigate the workflow without losing context.
- **Plan:** Implement a globally pinned Stepper (using Taiga UI) at the bottom of the page, with dynamic "Forward" and "Back" routing. This shell serves as the container for the steps.

### 4. Form Steps (`Step Implementations`) - 🔄 Current Focus
- **Why:** Each step in the "Solution" workflow needs a dedicated, highly focused UI component.
- **Plan:** Sequentially build out the UI for `project-step`, `ide-step`, `stack-step`, and `export-step`.
- **Constraint:** Keep these components *extremely thin*. They should only bind to the granular Signals in `builder-state.ts`, trigger service methods, and strictly follow the View Model Pattern and Zero Literals Policy (see `architecture.md`).
