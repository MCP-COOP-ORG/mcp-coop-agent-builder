export const STEP_IDS = {
  DESCRIPTION: 'description',
  AGENTS: 'agents',
  RULES: 'rules',
  WORKFLOWS: 'workflows',
  REVIEW: 'review'
} as const;

export type FieldLayout = 'full' | 'half' | 'third';

export type FieldType = 'radio' | 'checkbox' | 'textarea' | 'input' | 'multi-select' | 'composite';

export interface BuilderFieldConfig {
  id: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  options?: { id: string; label: string }[];
  layout?: FieldLayout;
  validators?: string[];
}

export interface BuilderBlockConfig {
  id: string;
  title: string;
  icon: string;
  type: FieldType;
  options?: { id: string; label: string }[];
  defaultOptionId?: string;
  label?: string;
  placeholder?: string;
  fields?: BuilderFieldConfig[];
}

export interface BuilderStep {
  id: string;
  label: string;
  icon: string;
  title: string;
  description: string;
}

export const BUILDER_STEPS: BuilderStep[] = [
  {
    id: STEP_IDS.DESCRIPTION,
    label: 'Project',
    icon: '@tui.folder-code',
    title: 'Project Description',
    description: 'Define the core project parameters and identity.'
  },
  {
    id: STEP_IDS.AGENTS,
    label: 'Agents',
    icon: '@tui.bot',
    title: 'Agents Configuration',
    description: 'Select skills, technologies, and tooling for your AI agents.'
  },
  {
    id: STEP_IDS.RULES,
    label: 'Rules',
    icon: '@tui.shield-check',
    title: 'Project Rules',
    description: 'Configure standard engineering rules and constraints.'
  },
  {
    id: STEP_IDS.WORKFLOWS,
    label: 'Workflows',
    icon: '@tui.git-merge',
    title: 'Workflows',
    description: 'Select standard operational workflows for your team.'
  },
  {
    id: STEP_IDS.REVIEW,
    label: 'Review',
    icon: '@tui.file-check',
    title: 'Review & Export',
    description: 'Review your configuration and generate the final context archive.'
  }
];
