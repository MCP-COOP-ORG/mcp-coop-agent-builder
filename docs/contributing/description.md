# Adding Project Descriptions & Meta-Information

The **Description** step allows users to provide high-level context about their project's domain, target audience, and primary functionality.
These presets are located in `public/assets/pages/description/`.

## Adding a Category

Categories are defined by folders (e.g., `project-meta-information`) containing a `_meta.json`.

```json
{
    "id": "project-meta-information",
    "title": "Project Domain",
    "description": "Select the primary industry domain of your project.",
    "inputType": "radio"
}
```

## Adding a Description Snippet

Create a JSON file in the target folder:

```json
{
    "id": "fintech",
    "title": "FinTech",
    "icon": "@tui.dollar-sign",
    "description": {
        "default": "This is a FinTech application. Strict security, data privacy, and transaction consistency rules apply."
    }
}
```

### Attributes Explained

- **`description`**: The AI context injected into the prompt. For domains, the `default` description provides the main explanation of the industry focus. You can override it for specific platforms if necessary, but usually, `default` is enough.
