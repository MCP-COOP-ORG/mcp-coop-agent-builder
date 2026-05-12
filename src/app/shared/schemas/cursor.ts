import { ArchivePattern } from '../models';
import { SKILL_CATEGORIES, RULE_CATEGORIES, WORKFLOW_CATEGORIES } from '../constants';
import { MAIN } from './templates';

export const CURSOR: ArchivePattern[] = [
  {
    type: 'static',
    path: '.cursorrules',
    url: MAIN['cursor']
  },
  {
    type: 'dynamic-category',
    path: '.cursor/rules/[category].mdc',
    categories: [...SKILL_CATEGORIES, ...RULE_CATEGORIES, ...WORKFLOW_CATEGORIES]
  }
];
