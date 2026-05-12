# Gemini Agent System Rules & Context

You are an expert AI assistant working on the **Shpakich AI Agents Builder** project.

## Core Documentation Rules
Do NOT guess architectural decisions or tech stack configurations. Instead, read the highly specific documentation in the `docs/` folder depending on your current task:
- **Architecture & Code Standards**: Read `docs/architecture.md` (Contains rules for Signals, Standalone Components, Zero Literals Policy, View Model Pattern, and folder structure).
- **Project Concept & Roadmap**: Read `docs/concept.md` to understand the business logic, what we are building, why, and what the future steps are.
- **Current Context & History**: Read `docs/context.md` to understand what has already been built, the current state of the application, and the history of recent changes.

## Documentation Update Policy (IMPORTANT)
When the user tells you to "commit", "save progress", or "update docs" at the end of a session/task:
1. You MUST update `docs/context.md`. Add a new entry at the top of the `Development History` list (descending order) detailing the new features implemented and architectural changes made.
2. If fundamental architectural rules or roadmap steps changed, update `docs/architecture.md` and `docs/concept.md` accordingly to keep the global context perfectly synced.

## Agent Behavior & Workflow
1. **MANDATORY PRE-FLIGHT CHECK (NO GUESSING)**: BEFORE writing any UI/CSS code, you MUST execute `mcp_taiga-ui_get_overview` or `mcp_taiga-ui_get_component_example`. BEFORE writing any Angular logic, you MUST execute `mcp_angular-cli_get_best_practices` or `mcp_angular-cli_search_documentation`. If you propose an implementation plan or write code without executing these MCP tools first in the current session, you are violating core directives.
2. **Planner Mode First**: Do not generate code, files, or artifacts autonomously. Always analyze the request, run the Pre-Flight Check via MCP tools, and agree on a plan before execution.
3. **Use IDE Artifacts**: Always formulate your steps through the IDE's built-in artifacts (`implementation_plan.md`, `task.md`). Present the plan for user approval before touching source code.
4. **Step-by-Step Execution**: Work systematically. Execute one logical step at a time, asking for verification.
5. **Ask, Don't Guess**: If there is any ambiguity about libraries, architecture, state structure, or terminology, stop and ask the user.
6. **CSS & Markup Integrity Check**: Before finalizing UI changes, autonomously verify strict adherence to BEM, `:host` encapsulation, and the Zero Literals Policy across both HTML and SCSS files.
7. **Federation Cache Recovery**: If Angular build or Native Federation throws inexplicable syntax/404 errors during local development, assume cache poisoning. Immediately clear `.angular/cache` and restart the server before attempting to debug phantom code errors.
