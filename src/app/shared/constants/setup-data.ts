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
      { id: 'claude', label: 'Claude' },
      { id: 'cursor', label: 'Cursor' },
    ],
    defaultOptionId: 'antigravity'
  },
  {
    id: 'projectIdentity',
    title: 'Project Identity',
    icon: '@tui.folder-code',
    type: 'composite',
    fields: [
      {
        id: 'name',
        type: 'input',
        label: BUILDER_DICTIONARY.labels.projectName,
        placeholder: BUILDER_DICTIONARY.placeholders.projectName,
        layout: 'half',
        validators: ['required']
      },
      {
        id: 'domains',
        type: 'multi-select',
        label: BUILDER_DICTIONARY.labels.businessDomains,
        placeholder: BUILDER_DICTIONARY.placeholders.businessDomains,
        layout: 'half',
        options: [
          { id: 'ecommerce', label: 'E-commerce' },
          { id: 'fintech', label: 'Fintech' },
          { id: 'edtech', label: 'Edtech' },
          { id: 'healthtech', label: 'Healthtech' },
          { id: 'saas', label: 'SaaS' },
          { id: 'social', label: 'Social Network' },
          { id: 'marketplace', label: 'Marketplace' }
        ]
      },
      {
        id: 'description',
        type: 'textarea',
        label: BUILDER_DICTIONARY.labels.projectIdentity,
        placeholder: BUILDER_DICTIONARY.placeholders.projectIdentity,
        layout: 'full'
      }
    ]
  },
];
