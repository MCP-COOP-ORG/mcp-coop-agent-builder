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
