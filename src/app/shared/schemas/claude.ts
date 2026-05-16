import { ArchivePattern } from '@shared/models';
import { GENERATED_PAGE_CATEGORIES, MAIN } from '@shared/configs';

export const CLAUDE: ArchivePattern[] = [
    {
        type: 'static',
        path: 'CLAUDE.md',
        url: MAIN['claude'],
    },
    {
        // Agent skills (Following official Claude docs: a folder named after the skill containing SKILL.md)
        type: 'dynamic-category',
        path: '.claude/skills/[category]/SKILL.md',
        categories: GENERATED_PAGE_CATEGORIES['agents'],
    },
    {
        // Custom rules and instructions are organized within the .claude/rules/ directory
        type: 'dynamic-category',
        path: '.claude/rules/[category].md',
        categories: [...(GENERATED_PAGE_CATEGORIES['agents'] ?? []), ...(GENERATED_PAGE_CATEGORIES['rules'] ?? [])],
    },
    {
        type: 'dynamic-item',
        path: '.claude/workflows/[item].md',
        categories: GENERATED_PAGE_CATEGORIES['workflows'],
    },
    {
        type: 'dynamic-hook',
        path: '.claude/settings.json',
        categories: GENERATED_PAGE_CATEGORIES['hooks'],
    },
];
