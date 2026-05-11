export interface BuilderStep {
  id: string;
  label: string;
}

export const BUILDER_STEPS: BuilderStep[] = [
  { id: 'project', label: 'Project' },
  { id: 'ide', label: 'IDE' },
  { id: 'stack', label: 'Stack' },
  { id: 'export', label: 'Export' }
];
