export interface ArchiveNode {
  /** The destination path inside the generated ZIP archive */
  path: string;

  /** Type of the node: 'folder' or 'file' */
  type: 'folder' | 'file';

  /** 
   * Simple key-value matching condition against BuilderState. 
   * E.g., { aiAgent: 'cursor' }. If omitted, it's always included.
   * TODO: In the future, this should support complex tag-based conditions or arrays of conditions.
   */
  condition?: Record<string, unknown>;

  /** 
   * URL to fetch the template content from assets. Required if type === 'file'.
   * TODO: Support fragment composition for complex files instead of single URLs.
   */
  templateUrl?: string;
}

export const ARCHIVE_SCHEMA: ArchiveNode[] = [
  // ============================================
  // Antigravity rules
  // ============================================
  {
    path: '.agent',
    type: 'folder',
    condition: { aiAgent: 'antigravity' }
  },
  {
    path: 'GEMINI.md',
    type: 'file',
    condition: { aiAgent: 'antigravity' },
    templateUrl: 'assets/templates/ai/antigravity.md'
  },

  // ============================================
  // Cursor rules
  // ============================================
  {
    path: '.cursor',
    type: 'folder',
    condition: { aiAgent: 'cursor' }
  },
  {
    path: '.cursorrules',
    type: 'file',
    condition: { aiAgent: 'cursor' },
    templateUrl: 'assets/templates/ai/cursor.md'
  },

  // ============================================
  // Claude (Cline/Roo) rules
  // ============================================
  {
    path: '.agent',
    type: 'folder',
    condition: { aiAgent: 'claude' }
  },
  {
    path: 'CLAUDE.md',
    type: 'file',
    condition: { aiAgent: 'claude' },
    templateUrl: 'assets/templates/ai/claude.md'
  }
];
