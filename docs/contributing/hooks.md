# Adding Lifecycle Hooks

The **Hooks** step (or lifecycle events) defines triggers that AI agents can react to during development.
These are located in `public/assets/pages/hooks/`.

## Adding a Hook Category

Categories are defined by folders (e.g., `before-tool`, `file-changed`) containing a `_meta.json`.
The `_meta.json` for hooks usually includes an `events` attribute to show which platforms natively support these hooks.

```json
{
    "id": "before-tool",
    "title": "Before Tool Execution",
    "description": "Fires before a specific tool is executed.",
    "events": ["claude", "antigravity"]
}
```

## Adding a Hook Snippet

Create a JSON file:

```json
{
    "id": "env-guard",
    "title": "Environment Variable Guard",
    "icon": "@tui.shield-alert",
    "description": {
        "default": "Check if .env is exposed before running git commands."
    }
}
```
