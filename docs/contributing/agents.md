# Adding Tech Stack Agents

The **Agents** step of the Builder allows users to select their specific tech stack (Frontend, Backend, Database).
These are located in `public/assets/pages/agents/`.

## Adding a Category

Categories are folders inside `agents/` (e.g., `frontend`, `backend`).
If you create a new folder, you **must** create a `_meta.json` file inside it:

```json
{
    "id": "database",
    "title": "Databases",
    "description": "Select your database.",
    "icon": "@tui.database",
    "inputType": "radio"
}
```

- **`inputType`**: Can be `checkbox` (multiple selections) or `radio` (single selection).

## Adding an Agent Snippet

To add a new technology (e.g., PostgreSQL), add a JSON file in the relevant category folder:

```json
{
    "id": "postgresql",
    "title": "PostgreSQL",
    "icon": "https://img.icons8.com/color/postgreesql.png",
    "description": {
        "default": "Use PostgreSQL standard syntax.",
        "cursor": "Use Cursor's specific DB integration rules."
    },
    "recommendedWith": ["prisma-orm"],
    "discouragedWith": ["mongodb"]
}
```

### Attributes Explained

- **`id`**: Unique identifier (must match filename).
- **`title`**: Human-readable name.
- **`icon`**: URL or SVG path for the UI icon.
- **`description`**: An object containing the actual prompt instructions. You must provide a `default` string. You can also provide platform-specific strings (e.g., `cursor`, `antigravity`) which override the default.
- **`recommendedWith`**: (Optional) Array of other item `id`s. If a user selects this item, the UI will highlight the recommended items in green.
- **`discouragedWith`**: (Optional) Array of other item `id`s. If selected, the UI highlights these items in red to prevent anti-patterns.
