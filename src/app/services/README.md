# Services Barrel

## Business Context
This directory encapsulates the core business intelligence and state persistence of the application.

## Technical Functionality
Exports Angular `@Injectable` services for managing globally available Signals and complex generation logic.

### Exported Entities

#### `builder-state.ts`
- **Business**: Holds the user's form inputs across all steps, ensuring progress isn't lost during navigation.
- **Technical**: Uses granular WritableSignals (`descriptionData`, `agentsData`, etc.) and an `effect()` to auto-sync state with `sessionStorage`.

#### `template-interpolator.ts`
- **Business**: Replaces placeholder variables in the AI templates with the user's actual project data.
- **Technical**: Fetches JSON assets and executes RegExp-based string replacement (`{{ variable }}`).

#### `archive-generator.ts`
- **Business**: Assembles all selected templates, architectural rules, and metadata into a final, downloadable ZIP context file.
- **Technical**: Uses `fflate` for synchronous ZIP generation. Dynamically fetches assets using the `TemplateInterpolator` and writes to a `previewFiles` Signal.
