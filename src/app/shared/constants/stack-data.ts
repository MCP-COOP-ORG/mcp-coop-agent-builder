import { StackBlocks } from '../../models';

export const STACK_BLOCKS: StackBlocks = {
  frontend: {
    id: 'frontend',
    title: 'Client-Side Ecosystem',
    icon: '@tui.layout',
  },
  backend: {
    id: 'backend',
    title: 'Server-Side Ecosystem',
    icon: '@tui.server',
  },
  database: {
    id: 'database',
    title: 'Data Layer',
    icon: '@tui.database',
  },
  tooling: {
    id: 'tooling',
    title: 'Tooling & Quality',
    icon: '@tui.wrench',
  },
} as const;
