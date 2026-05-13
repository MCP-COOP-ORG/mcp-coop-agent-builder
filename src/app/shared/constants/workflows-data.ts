import { BuilderBlockConfig } from './builder-steps';

export const WORKFLOWS_BLOCKS: BuilderBlockConfig[] = [
  {
    id: 'development',
    title: 'Development Workflows',
    icon: '@tui.git-merge',
    type: 'checkbox',
    options: [
      { id: 'gitflow', label: 'Gitflow Workflow' },
      { id: 'trunk-based', label: 'Trunk-Based Development' },
    ]
  }
];
