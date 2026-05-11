# Gemini Agent System Rules & Context

You are an expert AI assistant working on the **Shpakich AI Agents Builder** project.
Read `docs/concept.md` and `docs/architecture.md` before making architectural decisions.

## Agent Behavior & Workflow
1. **Use MCP Servers Actively**: You MUST actively use the installed MCP servers (`angular-cli` and `taiga-ui`) to verify syntax, read documentation, and ensure you are using the modern APIs correctly. Base your code on the official MCP documentation, do not invent syntax from memory.
2. **Planner Mode First**: Do not generate code, files, or artifacts autonomously. Always analyze the request, discuss the "what" and "how" with the user, and agree on a plan before execution.
3. **Use IDE Artifacts**: Always formulate your steps through the IDE's built-in artifacts (`implementation_plan.md`, `task.md`). Present the plan for user approval before touching source code.
4. **Step-by-Step Execution**: Work systematically. Execute one logical step at a time, asking for verification.
5. **Ask, Don't Guess**: If there is any ambiguity about libraries, architecture, state structure, or terminology, stop and ask the user. Do not make architectural assumptions.
6. **Terminology**: Carefully use the terminology established by the user. This project is a **Builder**.

## Tech Stack & Strict Constraints
- **Framework:** Angular 21+
- **Component Architecture:** STRICTLY Standalone Components. Do not use NgModules.
- **State Management:** STRICTLY Angular Signals (`signal`, `computed`). Do not use NgRx.
- **Dependency Injection:** Use the `inject()` function exclusively. Do not use constructor injection.
- **UI Library:** Taiga UI 5.x.
- **Micro-frontend:** Native Federation.

## Folder Structure Rules
Do not use Feature-Sliced Design (FSD). Use the following strict flat structure in `src/app/`:
- `pages/` - Routable container components (Smart components).
- `components/` - Feature blocks and UI components (Dumb components).
- `services/` - Business logic, state, API calls (`providedIn: 'root'`).
- `models/` - TypeScript interfaces and types.
- `shared/` - Reusable UI elements, directives, and pipes.

## Implementation Roadmap (Current Focus)
When starting a new session, you should follow this exact roadmap:

### 1. Builder State (`src/app/services/builder-state.ts`)
- Implement the state using individual, granular Signals for each step (IDE, Project, Stack, Export).
- Do not use one giant state object. Keep signals separated to allow minimal, isolated re-renders of only the components that change.
- No `localStorage` persistence is required at this stage.

### 2. Rules Config & Engine (`src/app/services/rules-engine.ts`)
- Rules for tech-stack combinations MUST be externalized into configuration objects/files (e.g., a JSON file or a constant in `src/app/models/stack-rules.data.ts`) so they can be easily edited without changing the engine logic.
- The Rules Engine service will consume these configs to filter and validate options based on the `BuilderState`.

### 3. Builder Navigation UI
- Implement a Stepper component (using Taiga UI) positioned at the **bottom** of the Builder page.
- Add standard "Forward" and "Back" navigation buttons next to or inside the bottom Stepper area.

### 4. Step Implementations
- Gradually implement the UI for `ide-step`, `project-step`, `stack-step`, and `export-step`.
- Keep components extremely thin. They should only bind to the granular Signals in `builder-state.ts` and trigger service methods.

## Code Style
- Use `RouterOutlet` for routing.
- Keep CSS resets and global variables in `src/styles.scss`.
- Components should only handle UI rendering; all complex logic belongs in `services/`.
