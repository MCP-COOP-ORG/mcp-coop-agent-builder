export interface StaticFilePattern {
  type: 'static';
  path: string; // e.g., 'GEMINI.md'
  url: string;  // Asset path to download the file from
}

// Iterates over the specified state keys (e.g., ['frontend', 'backend'])
// Creates a single file for each key (containing all selected items within that key)
export interface DynamicCategoryPattern {
  type: 'dynamic-category';
  path: string;          // e.g., '.agents/skills/[category]-agent/SKILL.md'
  categories: string[];  // Array of state keys to apply this template to
}

// Targets specific state keys (e.g., ['workflows'])
// Creates a separate file for EACH selected item within those keys
export interface DynamicItemPattern {
  type: 'dynamic-item';
  path: string;          // e.g., '.agents/workflows/[item].md'
  categories: string[];  // Array of state keys to draw items from
}

export type ArchivePattern = StaticFilePattern | DynamicCategoryPattern | DynamicItemPattern;

