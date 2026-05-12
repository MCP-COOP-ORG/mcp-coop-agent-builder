# Shpakich AI Agents Builder 🤖🛠️

A modern, client-side web application designed to help developers visually construct, configure, and generate custom AI Agent rules and project contexts for various IDEs and AI Assistants (Cursor, Windsurf, GitHub Copilot, Antigravity, etc.).

## 🌟 The Problem
Generic AI rules (like default `.cursorrules` or `Gemini.md`) are often too abstract and lack project-specific constraints. Developers waste time copy-pasting poorly written prompts.

## 🚀 The Solution
This tool provides a **guided, step-by-step wizard** where developers can:
1. Select their target IDE/Assistant.
2. Describe their project domain.
3. Check off their tech stack and architectural constraints (e.g., React, NestJS, Hexagonal Architecture, Zero Literals Policy).
4. **Instantly download a `.zip` archive** containing a perfectly structured, logic-checked set of rules and context files ready to be dropped into the root of their project.

## 🏗️ Architecture & Tech Stack

This project is built using modern front-end standards (as of 2026):

* **Framework:** [Angular 21+](https://angular.dev/) (Standalone Components, Signals, new Control Flow).
* **UI Library:** [Taiga UI 5.x](https://taiga-ui.dev/) (Fast, modern, and highly modular).
* **Micro-frontend (MFE):** Architected using **Native Federation**, allowing this wizard to be embedded as a widget into any host application or website.
* **Testing:** Jest for unit tests.
* **Core Logic:** 
  * Completely serverless (Client-Side SPA).
  * Uses `jszip` to construct the rule archives purely in the browser.
  * **Rules Graph Engine:** Validates that selected technologies don't conflict (e.g., Vue + React) and composes rules based on a dependency graph.

## 📂 Project Structure

```text
src/
├── app/
│   ├── core/
│   │   ├── rules-engine/      # Tech stack dependency graph, snippets, regex validators
│   │   ├── archive-builder/   # Strategy pattern for generating IDE-specific folders
│   │   └── state/             # Wizard Signals state & localStorage sync
│   ├── features/
│   │   └── wizard/            # Main wizard logic and routes (SOLID / SRP)
│   │       ├── steps/         # Isolated step components
│   ├── shared/                # Shared Taiga UI wrappers and models
```

## 🛠️ Getting Started

### Prerequisites
* Node.js (v20+)
* Angular CLI (v21+)

### Installation

1. Clone the repository and navigate into the folder:
   ```bash
   cd shpakich-ai-agents-builder
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Run `npm start` (or `ng serve`) for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Testing

Run `npm test` to execute the unit tests via Jest.

## 🤝 Contribution
*(TBD - Contribution guidelines for adding new AI agent templates and tech stack snippets).*
