export * from './types.js';
export { VERSION } from './version.js';
export { scan, exitCodeFor, verdictOf, DEFAULT_MAX_FILE_BYTES, type ScanOptions } from './scan.js';
export { sha256Hex } from './hash.js';
export { rulesetHash } from './ruleset.js';
export { CONFIG_PATH, ConfigError, EMPTY_CONFIG, parseConfig, type AllowEntry, type DomeConfig } from './config.js';
export { grade, isIndicatorRule, AUTORUN_SURFACES, PAYLOAD_PARTNERS } from './grade.js';
export { ALL_RULES, rulesIn, ruleMeta } from './rules/index.js';
export { ruleCatalog, type RuleCatalog, type RuleCatalogEntry } from './rule-docs.js';
export type { Rule, RuleContext } from './rules/rule.js';
export { FsSource, type FsSourceOptions } from './source/fs.js';
export { MemorySource } from './source/memory.js';
export {
  GitTreeSource,
  GitError,
  cloneRepo,
  fetchCommit,
  gitChangedPaths,
  gitMergeBase,
  gitResolve,
  isCloneableUrl,
  type ClonedRepo,
} from './source/git.js';
export type { FileSource, TreeEntry, EntryKind } from './source/types.js';
export * from './report/index.js';
