import { BuilderBlockConfig } from './builder-steps';
import { BUILDER_DICTIONARY } from './builder-dictionary';

export const SETUP_BLOCKS: BuilderBlockConfig[] = [
  {
    id: 'aiAgent',
    title: 'AI Environment',
    icon: '@tui.bot',
    type: 'radio',
    options: [
      { id: 'antigravity', label: 'Antigravity' },
      { id: 'clode-code', label: 'Clode Code' },
      { id: 'cursor', label: 'Cursor' },
    ],
    defaultOptionId: 'antigravity'
  },
  {
    id: 'projectIdentity',
    title: 'Project Identity',
    icon: '@tui.folder-code',
    type: 'textarea',
    label: BUILDER_DICTIONARY.labels.projectIdentity,
    placeholder: BUILDER_DICTIONARY.placeholders.projectIdentity
  },
];
