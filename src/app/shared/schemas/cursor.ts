import { ArchivePattern } from '@shared/models';
import { GENERATED_PAGE_CATEGORIES, MAIN } from '@shared/configs';

export const CURSOR: ArchivePattern[] = [
    {
        type: 'static',
        path: '.cursorrules',
        url: MAIN['cursor'],
    },
    {
        type: 'dynamic-category',
        path: '.cursor/rules/[category].mdc',
        categories: [
            ...(GENERATED_PAGE_CATEGORIES['agents'] ?? []),
            ...(GENERATED_PAGE_CATEGORIES['rules'] ?? []),
            ...(GENERATED_PAGE_CATEGORIES['workflows'] ?? []),
        ],
    },
];
