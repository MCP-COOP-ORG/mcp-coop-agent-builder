export const STEP_IDS = {
  SETUP: 'setup',
  STACK: 'stack',
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
    id: STEP_IDS.SETUP,
    label: 'Setup',
    icon: '@tui.settings',
    title: 'Project Setup',
    description: 'Select your target AI agent and define the core project parameters.'
  },
  {
    id: STEP_IDS.STACK,
    label: 'Stack',
    icon: '@tui.layers',
    title: 'Technology Stack',
    description: 'Choose the frontend, backend, and database technologies used in your project.'
  },
  {
    id: STEP_IDS.REVIEW,
    label: 'Review',
    icon: '@tui.file-check',
    title: 'Review & Export',
    description: 'Review your configuration and generate the final context archive.'
  }
];
