export const STEP_IDS = {
  PROJECT: 'project',
  IDE: 'ide',
  STACK: 'stack',
  EXPORT: 'export'
} as const;

export interface BuilderStep {
  id: string;
  label: string;
  title: string;
  description: string;
}

export const BUILDER_STEPS: BuilderStep[] = [
  { 
    id: STEP_IDS.PROJECT, 
    label: 'Project',
    title: 'Project Details',
    description: 'Define the core parameters and business domain for your AI assistant.'
  },
  { 
    id: STEP_IDS.IDE, 
    label: 'IDE',
    title: 'Target Environment',
    description: 'Select the primary AI agent or IDE where this context will be utilized.'
  },
  { 
    id: STEP_IDS.STACK, 
    label: 'Stack',
    title: 'Technology Stack',
    description: 'Choose the frontend, backend, and database technologies used in your project.'
  },
  { 
    id: STEP_IDS.EXPORT, 
    label: 'Export',
    title: 'Review & Export',
    description: 'Review your configuration and generate the final context archive.'
  }
];
