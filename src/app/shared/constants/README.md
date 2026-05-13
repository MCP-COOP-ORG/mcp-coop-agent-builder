# Constants Barrel

## Business Context
This directory serves as the Single Source of Truth (SSOT) for all static text and structural definitions across the application. It enforces the project's "Zero Literals Policy," ensuring that no hardcoded strings exist in the user interface.

## Technical Functionality
Exports static dictionaries, UI labels, configuration arrays, and system constants consumed by View Models in components to render the DOM dynamically.

### Exported Entities

#### `builder-dictionary.ts`
- **Business**: Centralizes all human-readable text (titles, buttons, notifications) to ensure consistent messaging.
- **Technical**: Exports the `BUILDER_DICTIONARY` constant containing localized string records, preventing template hardcoding.

#### `builder-steps.ts`
- **Business**: Defines the exact sequence and configuration of the Builder workflow steps.
- **Technical**: Exports the `BUILDER_STEPS` array containing router paths, IDs, and assigned icons for the global `TuiStepper`.

#### `routes.ts`
- **Business**: Centralizes application route names to prevent broken links during navigation changes.
- **Technical**: Exports the `APP_ROUTES` enum containing base path definitions.

#### `description-data.ts`
- **Business**: Configures the form inputs required for the user to describe their project and AI identity.
- **Technical**: Exports the `DESCRIPTION_BLOCKS` array used to dynamically generate the reactive form in the Setup step.

#### `review-editor.ts`
- **Business**: Provides the default structural parameters for the CodeMirror editor on the Review step.
- **Technical**: Exports configuration constants and theme extensions for syntax highlighting integration.

#### `schema-categories.ts`
- **Business**: Groups different technology stacks and rules into logical domains (e.g., Languages, Frameworks, Architecture).
- **Technical**: Exports categorization arrays (`SKILL_CATEGORIES`, `RULE_CATEGORIES`) used by the Archive Generator to structure the final ZIP.
