import { ArchivePattern } from '../models';
import { SKILL_CATEGORIES, RULE_CATEGORIES, WORKFLOW_CATEGORIES } from '../constants';
import { MAIN } from '@shared/configs';

export const CLAUDE: ArchivePattern[] = [
  {
    type: 'static',
    path: 'CLAUDE.md',
    url: MAIN['claude']
  },
  {
    // Agent skills (Following official Claude docs: a folder named after the skill containing SKILL.md)
    type: 'dynamic-category',
    path: '.claude/skills/[category]/SKILL.md',
    categories: SKILL_CATEGORIES
  },
  {
    // Custom rules and instructions are organized within the .claude/rules/ directory
    type: 'dynamic-category',
    path: '.claude/rules/[category].md',
    categories: [...SKILL_CATEGORIES, ...RULE_CATEGORIES]
  },
  {
    type: 'dynamic-item',
    path: '.claude/workflows/[item].md',
    categories: WORKFLOW_CATEGORIES
  }
];
