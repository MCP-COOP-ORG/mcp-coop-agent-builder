import { ArchivePattern } from '../models';
import { ANTIGRAVITY } from './antigravity';
import { CURSOR } from './cursor';
import { CLAUDE } from './claude';

export const SCHEMA_MAP: Record<string, ArchivePattern[]> = {
  antigravity: ANTIGRAVITY,
  claude: CLAUDE,
  cursor: CURSOR
};
