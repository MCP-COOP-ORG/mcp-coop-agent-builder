export const STEP_IDS = {
  SETUP: 'setup',
  STACK: 'stack',
  REVIEW: 'review'
} as const;

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
