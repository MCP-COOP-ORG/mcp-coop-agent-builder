export type CodeLanguage = 'markdown' | 'json' | 'yaml';

export interface GeneratedFile {
  readonly path: string;
  readonly type: 'file' | 'folder';
  readonly content: string;
}

export const LANGUAGE_MAP: Record<string, CodeLanguage> = {
  '.json': 'json',
  '.yaml': 'yaml',
  '.yml': 'yaml',
};

export const DEFAULT_LANGUAGE: CodeLanguage = 'markdown';
