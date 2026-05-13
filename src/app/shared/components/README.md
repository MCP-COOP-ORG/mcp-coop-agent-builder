# Shared Components Barrel

## Business Context
This directory houses reusable, atomic UI blocks that maintain a consistent visual language across the platform.

## Technical Functionality
Exports standalone "Dumb" Angular components that adhere to BEM styling, `OnPush` change detection, and often implement `ControlValueAccessor`.

### Exported Entities

#### `app-header.ts`
- **Business**: The global top navigation bar containing the theme switcher.
- **Technical**: Binds to `TUI_DARK_MODE` to toggle visual themes.

#### `step-header.ts`
- **Business**: A unified title and description block used at the top of each form step.
- **Technical**: A stateless component using Angular `input()` signals.

#### `base-form-step.ts`
- **Business**: The foundational class that connects user form inputs to the underlying session state.
- **Technical**: An abstract directive that dynamically generates a `FormGroup` from configurations and syncs it with a `WritableSignal`.

#### `builder-block.ts`
- **Business**: A visual card wrapper used to segment different form fields.
- **Technical**: A layout component utilizing `TuiCardLarge`.

#### `step-layout.ts`
- **Business**: The container that structures the grid layout of blocks inside a step.
- **Technical**: A host-encapsulated component that manages responsive width and centering.

#### `checkbox-group.ts` / `radio-group.ts`
- **Business**: Custom selection controls for single or multiple tech-stack choices.
- **Technical**: Implements `ControlValueAccessor` to integrate seamlessly with Angular Reactive Forms.

#### `textarea-field.ts` / `input-field.ts`
- **Business**: Standard text entry fields for descriptions and basic inputs.
- **Technical**: `ControlValueAccessor` components wrapping Taiga UI textfields.

#### `multi-select-field.ts`
- **Business**: A dropdown component for selecting multiple complex options.
- **Technical**: Implements `ControlValueAccessor` over `TuiMultiSelect`.

#### `code-editor.ts`
- **Business**: An embedded IDE for users to review and manually tweak the generated AI files.
- **Technical**: Wraps `CodeMirror 6` initialization inside `afterNextRender()` for syntax highlighting.
