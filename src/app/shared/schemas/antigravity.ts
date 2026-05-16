import { ArchivePattern } from '@shared/models';
import { GENERATED_PAGE_CATEGORIES, MAIN } from '@shared/configs';

export const ANTIGRAVITY: ArchivePattern[] = [
    {
        type: 'static',
        path: 'GEMINI.md',
        url: MAIN['antigravity'],
    },
    {
        type: 'dynamic-category',
        path: '.agents/skills/[category]-agent/SKILL.md',
        categories: GENERATED_PAGE_CATEGORIES['agents'],
    },
    {
        type: 'dynamic-category',
        path: '.agents/rules/[category].md',
        categories: [...(GENERATED_PAGE_CATEGORIES['agents'] ?? []), ...(GENERATED_PAGE_CATEGORIES['rules'] ?? [])],
    },
    {
        type: 'dynamic-item',
        path: '.agents/workflows/[item].md',
        categories: GENERATED_PAGE_CATEGORIES['workflows'],
    },
    {
        type: 'dynamic-hook',
        path: '.gemini/settings.json',
        categories: GENERATED_PAGE_CATEGORIES['hooks'],
    },
];
