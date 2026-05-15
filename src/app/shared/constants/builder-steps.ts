import { GENERATED_PAGES_CONFIG } from '@shared/configs';
import { PageConfig } from '@shared/models';

export const STEP_IDS = {
  DESCRIPTION: 'description',
  AGENTS: 'agents',
  RULES: 'rules',
  WORKFLOWS: 'workflows',
  REVIEW: 'review'
} as const;

export type FieldLayout = 'full' | 'half' | 'third';
export type FieldType = 'radio' | 'checkbox' | 'textarea' | 'input' | 'multi-select' | 'composite' | 'select';

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
  ...Object.values(GENERATED_PAGES_CONFIG).sort((a: PageConfig, b: PageConfig) => (a.order ?? 999) - (b.order ?? 999)) as BuilderStep[],
  {
    id: STEP_IDS.REVIEW,
    label: 'Review',
    icon: '@tui.file-check',
    title: 'Review & Export',
    description: 'Review your configuration and generate the final context archive.'
  }
];
