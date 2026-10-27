import type { ScanResult } from '../types.js';
import { HONESTY_NOTICE } from './common.js';

export function formatJson(result: ScanResult): string {
  return `${JSON.stringify({ ...result, notice: HONESTY_NOTICE }, null, 2)}\n`;
}
