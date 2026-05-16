# Adding Architecture Rules

The **Rules** step contains global coding standards and architectural rules (e.g., Hexagonal Architecture, Error Handling).
These are located in `public/assets/pages/rules/`.

## Adding a Category

Categories are defined by folders (e.g., `basic`, `advanced`) containing a `_meta.json`.
_Note: If you want a category to be pre-selected for all users by default, add `"default": true` to the `_meta.json`._

## Adding a Rule Snippet

Create a JSON file in the target folder:

```json
{
    "id": "hexagonal-architecture",
    "title": "Hexagonal Architecture",
    "icon": "@tui.hexagon",
    "description": {
        "default": "Enforce strict separation between domain logic and infrastructure ports/adapters."
    },
    "recommendedWith": ["nestjs"]
}
```

### Attributes Explained

- **`description`**: The actual AI prompt snippet. Since rules are often abstract, the `default` description is usually sufficient for all platforms.
- **`recommendedWith`**: Highly encouraged for architectural rules. E.g., if you add a rule for Redux, recommend it with React.
