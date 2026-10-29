import type { ScanResult } from '../types.js';
import { formatJson } from './json.js';
import { formatMarkdown } from './markdown.js';
import { formatSarif } from './sarif.js';
import { formatText, type TextOptions } from './text.js';

export { formatJson, formatMarkdown, formatSarif, formatText, type TextOptions };
export { HONESTY_NOTICE, cleanPath, ruleDocUrl, ruleLabel, sanitizePath } from './common.js';

export type ReportFormat = 'text' | 'json' | 'sarif' | 'markdown';

export const REPORT_FORMATS: readonly ReportFormat[] = ['text', 'json', 'sarif', 'markdown'];

export function formatReport(result: ScanResult, format: ReportFormat, textOptions?: TextOptions): string {
  switch (format) {
    case 'json':
      return formatJson(result);
    case 'sarif':
      return formatSarif(result);
    case 'markdown':
      return formatMarkdown(result);
    default:
      return formatText(result, textOptions);
  }
}
