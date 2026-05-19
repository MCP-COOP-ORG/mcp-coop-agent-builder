import { ArchivePattern } from '@shared/models';
import { GENERATED_PAGE_CATEGORIES, MAIN } from '@shared/configs';

export const CURSOR: ArchivePattern[] = [
    {
        type: 'static',
        path: 'AGENTS.md',
        url: MAIN['cursor'],
    },
    {
        type: 'dynamic-category',
        path: '.cursor/skills/[category]/SKILL.md',
        categories: [...(GENERATED_PAGE_CATEGORIES['agents'] ?? [])],
    },
    {
        type: 'dynamic-category',
        path: '.cursor/rules/[category].mdc',
        categories: Array.from(
            new Set([...(GENERATED_PAGE_CATEGORIES['rules'] ?? []), ...(GENERATED_PAGE_CATEGORIES['workflows'] ?? [])]),
        ),
    },
    {
        type: 'dynamic-hook',
        path: '.cursor/hooks.json',
        categories: [...(GENERATED_PAGE_CATEGORIES['hooks'] ?? [])],
    },
];
