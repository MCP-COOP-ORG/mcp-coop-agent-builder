import { ArchivePattern } from '../models';
import { SKILL_CATEGORIES, RULE_CATEGORIES, WORKFLOW_CATEGORIES } from '../constants';
import { MAIN } from './templates';

export const ANTIGRAVITY: ArchivePattern[] = [
  {
    type: 'static',
    path: 'GEMINI.md',
    url: MAIN['antigravity']
  },
  {
    type: 'dynamic-category',
    path: '.agents/skills/[category]-agent/SKILL.md',
    categories: SKILL_CATEGORIES
  },
  {
    type: 'dynamic-category',
    path: '.agents/rules/[category].md',
    categories: [...SKILL_CATEGORIES, ...RULE_CATEGORIES]
  },
  {
    type: 'dynamic-item',
    path: '.agents/workflows/[item].md',
    categories: WORKFLOW_CATEGORIES
  }
];
