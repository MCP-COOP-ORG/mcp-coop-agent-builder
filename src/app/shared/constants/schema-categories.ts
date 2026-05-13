export const SKILL_CATEGORIES = ['frontend', 'backend', 'database'];
export const RULE_CATEGORIES = ['conventions', 'tooling', 'codeQuality', 'security'];
export const WORKFLOW_CATEGORIES = ['development'];

export const WRAPPER_TYPES = {
  SKILL: 'skill',
  RULE: 'rule',
  WORKFLOW: 'workflow'
} as const;

export type WrapperType = typeof WRAPPER_TYPES[keyof typeof WRAPPER_TYPES];

export const AI_ENVIRONMENTS = [
  { id: 'antigravity', label: 'Antigravity' },
  { id: 'claude', label: 'Claude' },
  { id: 'cursor', label: 'Cursor' }
] as const;

export const DEFAULT_TEMPLATE_PARAMS = {
  trigger: 'always',
  globs: '*',
  getRuleDescription: (category: string) => `Standard rules and conventions for ${category}.`,
  getWorkflowDescription: (item: string) => `Standard operational workflow for ${item}.`
} as const;
