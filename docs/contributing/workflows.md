# Adding Workflows

The **Workflows** step contains interactive AI commands and scenario scripts (e.g., Code Review prompt, TDD workflow).
These are located in `public/assets/pages/workflows/`.

## Adding a Category

Workflows are grouped into categories like `basic`, `testing`.
The `_meta.json` for workflows supports an additional `events` attribute to show which platforms natively support these hooks.

```json
{
    "id": "testing",
    "title": "Testing Workflows",
    "description": "Prompts to run before committing code.",
    "events": ["cursor", "windsurf"]
}
```

- **`events`**: Renders visual badges in the UI indicating which AI Assistants support these specific workflow hooks natively.

## Adding a Workflow Snippet

Create a JSON file:

```json
{
    "id": "tdd-loop",
    "title": "TDD Loop",
    "icon": "@tui.refresh-cw",
    "description": {
        "default": "Write a failing test, implement the code, refactor."
    }
}
```
