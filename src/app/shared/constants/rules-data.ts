import { BuilderBlockConfig } from './builder-steps';

export const RULES_BLOCKS: BuilderBlockConfig[] = [
  {
    id: 'codeQuality',
    title: 'Code Quality Rules',
    icon: '@tui.check-circle',
    type: 'checkbox',
    options: [
      { id: 'strict-typing', label: 'Strict Typing (No Any)' },
      { id: 'zero-literals', label: 'Zero Literals Policy' },
    ]
  },
  {
    id: 'security',
    title: 'Security Rules',
    icon: '@tui.lock',
    type: 'checkbox',
    options: [
      { id: 'xss-protection', label: 'XSS Protection' },
      { id: 'auth-guards', label: 'Authentication Guards' },
    ]
  }
];
