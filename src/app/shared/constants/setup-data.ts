import { SetupBlocks } from '../../models';

export const SETUP_BLOCKS: SetupBlocks = {
  aiAgent: {
    id: 'ai-agent',
    title: 'AI Environment',
    icon: '@tui.bot',
  },
  projectMeta: {
    id: 'project-meta',
    title: 'Project Identity',
    icon: '@tui.folder-code',
  },
  conventions: {
    id: 'conventions',
    title: 'Core Architecture',
    icon: '@tui.shield-check',
  },
} as const;
