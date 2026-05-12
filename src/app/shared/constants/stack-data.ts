import { BuilderBlockConfig } from './builder-steps';

export const STACK_BLOCKS: BuilderBlockConfig[] = [
  {
    id: 'frontend',
    title: 'Client-Side Ecosystem',
    icon: '@tui.layout',
    type: 'checkbox',
    options: [
      { id: 'angular', label: 'Angular' },
      { id: 'react', label: 'React' },
      { id: 'vue', label: 'Vue' },
      { id: 'typescript', label: 'TypeScript' },
      { id: 'javascript', label: 'ESNext' },
    ]
  },
  {
    id: 'backend',
    title: 'Server-Side Ecosystem',
    icon: '@tui.server',
    type: 'checkbox',
    options: [
      { id: 'nestjs', label: 'NestJS' },
      { id: 'express', label: 'Express' },
      { id: 'spring-boot', label: 'Spring Boot' },
    ]
  },
  {
    id: 'database',
    title: 'Data Layer',
    icon: '@tui.database',
    type: 'checkbox',
    options: [
      { id: 'postgresql', label: 'PostgreSQL' },
      { id: 'mongodb', label: 'MongoDB' },
      { id: 'mysql', label: 'MySQL' },
    ]
  },
  {
    id: 'conventions',
    title: 'Core Architecture',
    icon: '@tui.shield-check',
    type: 'checkbox',
    options: [
      { id: 'hexagonal', label: 'Hexagonal Arch' },
      { id: 'clean', label: 'Clean Arch' },
      { id: 'mvc', label: 'MVC' },
      { id: 'ddd', label: 'DDD' },
      { id: 'fsd', label: 'FSD' },
    ]
  },
  {
    id: 'tooling',
    title: 'Tooling & Quality',
    icon: '@tui.wrench',
    type: 'checkbox',
    options: [
      { id: 'eslint', label: 'ESLint' },
      { id: 'prettier', label: 'Prettier' },
      { id: 'husky', label: 'Husky' },
      { id: 'jest', label: 'Jest' },
      { id: 'vitest', label: 'Vitest' },
    ]
  },
];
