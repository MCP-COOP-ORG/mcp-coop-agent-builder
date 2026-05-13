# Configs Barrel

## Business Context
This directory manages overarching platform and UI configurations, defining what features and options are available to the user in the Builder interface.

## Technical Functionality
Exports environment-aware JSON assets, generated page configurations, and path mappings.

### Exported Entities

#### `generated-pages-config.ts`
- **Business**: Automatically maps the directory structure of the application's assets to form choices, eliminating manual configuration updates.
- **Technical**: An auto-generated TypeScript file (via `npm run generate:pages`) that exports the `GENERATED_PAGES_CONFIG` object, dictating the dynamic generation of the Reactive Forms.
