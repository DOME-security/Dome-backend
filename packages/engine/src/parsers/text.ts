const decoder = new TextDecoder('utf-8', { fatal: false, ignoreBOM: false });

export function decodeText(bytes: Uint8Array): string {
  return decoder.decode(bytes);
}

/** Maps character offsets to 1-based line and column numbers in O(log n). */
export class LineIndex {
  private readonly starts: number[] = [0];

  constructor(text: string) {
    for (let i = 0; i < text.length; i++) {
      if (text.charCodeAt(i) === 10) this.starts.push(i + 1);
    }
  }

  position(offset: number): { line: number; column: number } {
    let lo = 0;
    let hi = this.starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (this.starts[mid]! <= offset) lo = mid;
      else hi = mid - 1;
    }
    return { line: lo + 1, column: offset - this.starts[lo]! + 1 };
  }
}

export function basename(p: string): string {
  const slash = p.lastIndexOf('/');
  return slash === -1 ? p : p.slice(slash + 1);
}

export function dirname(p: string): string {
  const slash = p.lastIndexOf('/');
  return slash === -1 ? '' : p.slice(0, slash);
}

/** Lowercase extension without the dot, or '' when there is none. */
export function extname(p: string): string {
  const base = basename(p);
  const dot = base.lastIndexOf('.');
  return dot <= 0 ? '' : base.slice(dot + 1).toLowerCase();
}

/**
 * Resolves `ref` (as written in a command or import) against `fromDir` into a
 * repository-relative POSIX path. Returns undefined when the reference leaves
 * the repository or is not a relative path.
 */
export function resolveRepoPath(fromDir: string, ref: string): string | undefined {
  let cleaned = ref.replace(/\\/g, '/');
  cleaned = cleaned.replace(/^\$\{(?:workspaceFolder|workspaceRoot|cwd|fileWorkspaceFolder)\}\/?/, '');
  cleaned = cleaned.replace(/^%~dp0\/?/i, '');
  if (cleaned.startsWith('/') || /^[a-z]+:/i.test(cleaned) || cleaned.startsWith('~')) return undefined;
  const parts = fromDir ? fromDir.split('/') : [];
  for (const part of cleaned.split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') {
      if (parts.length === 0) return undefined;
      parts.pop();
    } else {
      parts.push(part);
    }
  }
  return parts.length ? parts.join('/') : undefined;
}

export const FONT_EXTENSIONS = new Set(['woff', 'woff2', 'ttf', 'otf', 'eot']);
export const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'ico', 'svg', 'avif', 'tif', 'tiff']);
export const MEDIA_EXTENSIONS = new Set(['mp3', 'mp4', 'wav', 'ogg', 'webm', 'pdf', 'zip']);

/** Extensions Node can legitimately load as a script or addon. */
export const NODE_SCRIPT_EXTENSIONS = new Set(['js', 'mjs', 'cjs', 'ts', 'mts', 'cts', 'jsx', 'tsx', 'node', 'json']);

export function isAssetPath(p: string): boolean {
  const ext = extname(p);
  return FONT_EXTENSIONS.has(ext) || IMAGE_EXTENSIONS.has(ext) || MEDIA_EXTENSIONS.has(ext);
}

/** A file Node would only run if someone disguised a script as something else. */
export function isNonScriptForNode(p: string): boolean {
  const ext = extname(p);
  if (ext === '') return false;
  return !NODE_SCRIPT_EXTENSIONS.has(ext);
}

export const JS_EXTENSIONS = new Set(['js', 'mjs', 'cjs', 'ts', 'mts', 'cts', 'jsx', 'tsx']);

export function isJsLike(p: string): boolean {
  return JS_EXTENSIONS.has(extname(p));
}

const CONFIG_FILE = /(?:^|\/)(?:[\w.-]+\.config|\.[a-z]+rc|gatsby-(?:node|config|browser|ssr))\.(?:c|m)?[jt]s$/;

/** Build and tool configuration loaded as code (`next.config.mjs`, `.eslintrc.js`, ...). */
export function isJsConfigFile(p: string): boolean {
  return CONFIG_FILE.test(p);
}

const ROUTE_FILE =
  /(?:^|\/)(?:routes?|api|controllers?|middlewares?|handlers?)\/|(?:^|\/)route\.(?:c|m)?[jt]sx?$|(?:^|\/)(?:server|app|index)\.(?:c|m)?[jt]s$/;

/** Server-side route, handler and entry files. */
export function isRouteFile(p: string): boolean {
  return isJsLike(p) && ROUTE_FILE.test(p) && !/(?:^|\/)(?:test|tests|__tests__|fixtures)\//.test(p);
}

/** Minified bundles are expected to have long lines. */
export function isMinifiedName(p: string): boolean {
  return /[.-]min\.(?:c|m)?js$/.test(p) || /\.bundle\.(?:c|m)?js$/.test(p);
}
