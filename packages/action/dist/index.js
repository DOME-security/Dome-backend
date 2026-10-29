import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/constants.js
var require_constants = __commonJS({
  "../../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/constants.js"(exports, module) {
    "use strict";
    var WIN_SLASH = "\\\\/";
    var WIN_NO_SLASH = `[^${WIN_SLASH}]`;
    var DOT_LITERAL = "\\.";
    var PLUS_LITERAL = "\\+";
    var QMARK_LITERAL = "\\?";
    var SLASH_LITERAL = "\\/";
    var ONE_CHAR = "(?=.)";
    var QMARK = "[^/]";
    var END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
    var START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
    var DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
    var NO_DOT = `(?!${DOT_LITERAL})`;
    var NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
    var NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
    var NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
    var QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
    var STAR = `${QMARK}*?`;
    var SEP = "/";
    var POSIX_CHARS = {
      DOT_LITERAL,
      PLUS_LITERAL,
      QMARK_LITERAL,
      SLASH_LITERAL,
      ONE_CHAR,
      QMARK,
      END_ANCHOR,
      DOTS_SLASH,
      NO_DOT,
      NO_DOTS,
      NO_DOT_SLASH,
      NO_DOTS_SLASH,
      QMARK_NO_DOT,
      STAR,
      START_ANCHOR,
      SEP
    };
    var WINDOWS_CHARS = {
      ...POSIX_CHARS,
      SLASH_LITERAL: `[${WIN_SLASH}]`,
      QMARK: WIN_NO_SLASH,
      STAR: `${WIN_NO_SLASH}*?`,
      DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
      NO_DOT: `(?!${DOT_LITERAL})`,
      NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
      NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
      START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
      END_ANCHOR: `(?:[${WIN_SLASH}]|$)`,
      SEP: "\\"
    };
    var POSIX_REGEX_SOURCE = {
      alnum: "a-zA-Z0-9",
      alpha: "a-zA-Z",
      ascii: "\\x00-\\x7F",
      blank: " \\t",
      cntrl: "\\x00-\\x1F\\x7F",
      digit: "0-9",
      graph: "\\x21-\\x7E",
      lower: "a-z",
      print: "\\x20-\\x7E ",
      punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
      space: " \\t\\r\\n\\v\\f",
      upper: "A-Z",
      word: "A-Za-z0-9_",
      xdigit: "A-Fa-f0-9"
    };
    module.exports = {
      MAX_LENGTH: 1024 * 64,
      POSIX_REGEX_SOURCE,
      // regular expressions
      REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
      REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
      REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
      REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
      REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
      REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
      // Replace globs with equivalent patterns to reduce parsing time.
      REPLACEMENTS: {
        __proto__: null,
        "***": "*",
        "**/**": "**",
        "**/**/**": "**"
      },
      // Digits
      CHAR_0: 48,
      /* 0 */
      CHAR_9: 57,
      /* 9 */
      // Alphabet chars.
      CHAR_UPPERCASE_A: 65,
      /* A */
      CHAR_LOWERCASE_A: 97,
      /* a */
      CHAR_UPPERCASE_Z: 90,
      /* Z */
      CHAR_LOWERCASE_Z: 122,
      /* z */
      CHAR_LEFT_PARENTHESES: 40,
      /* ( */
      CHAR_RIGHT_PARENTHESES: 41,
      /* ) */
      CHAR_ASTERISK: 42,
      /* * */
      // Non-alphabetic chars.
      CHAR_AMPERSAND: 38,
      /* & */
      CHAR_AT: 64,
      /* @ */
      CHAR_BACKWARD_SLASH: 92,
      /* \ */
      CHAR_CARRIAGE_RETURN: 13,
      /* \r */
      CHAR_CIRCUMFLEX_ACCENT: 94,
      /* ^ */
      CHAR_COLON: 58,
      /* : */
      CHAR_COMMA: 44,
      /* , */
      CHAR_DOT: 46,
      /* . */
      CHAR_DOUBLE_QUOTE: 34,
      /* " */
      CHAR_EQUAL: 61,
      /* = */
      CHAR_EXCLAMATION_MARK: 33,
      /* ! */
      CHAR_FORM_FEED: 12,
      /* \f */
      CHAR_FORWARD_SLASH: 47,
      /* / */
      CHAR_GRAVE_ACCENT: 96,
      /* ` */
      CHAR_HASH: 35,
      /* # */
      CHAR_HYPHEN_MINUS: 45,
      /* - */
      CHAR_LEFT_ANGLE_BRACKET: 60,
      /* < */
      CHAR_LEFT_CURLY_BRACE: 123,
      /* { */
      CHAR_LEFT_SQUARE_BRACKET: 91,
      /* [ */
      CHAR_LINE_FEED: 10,
      /* \n */
      CHAR_NO_BREAK_SPACE: 160,
      /* \u00A0 */
      CHAR_PERCENT: 37,
      /* % */
      CHAR_PLUS: 43,
      /* + */
      CHAR_QUESTION_MARK: 63,
      /* ? */
      CHAR_RIGHT_ANGLE_BRACKET: 62,
      /* > */
      CHAR_RIGHT_CURLY_BRACE: 125,
      /* } */
      CHAR_RIGHT_SQUARE_BRACKET: 93,
      /* ] */
      CHAR_SEMICOLON: 59,
      /* ; */
      CHAR_SINGLE_QUOTE: 39,
      /* ' */
      CHAR_SPACE: 32,
      /*   */
      CHAR_TAB: 9,
      /* \t */
      CHAR_UNDERSCORE: 95,
      /* _ */
      CHAR_VERTICAL_LINE: 124,
      /* | */
      CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
      /* \uFEFF */
      /**
       * Create EXTGLOB_CHARS
       */
      extglobChars(chars) {
        return {
          "!": { type: "negate", open: "(?:(?!(?:", close: `))${chars.STAR})` },
          "?": { type: "qmark", open: "(?:", close: ")?" },
          "+": { type: "plus", open: "(?:", close: ")+" },
          "*": { type: "star", open: "(?:", close: ")*" },
          "@": { type: "at", open: "(?:", close: ")" }
        };
      },
      /**
       * Create GLOB_CHARS
       */
      globChars(win32) {
        return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
      }
    };
  }
});

// ../../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/utils.js
var require_utils = __commonJS({
  "../../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/utils.js"(exports) {
    "use strict";
    var {
      REGEX_BACKSLASH,
      REGEX_REMOVE_BACKSLASH,
      REGEX_SPECIAL_CHARS,
      REGEX_SPECIAL_CHARS_GLOBAL
    } = require_constants();
    exports.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
    exports.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
    exports.isRegexChar = (str) => str.length === 1 && exports.hasRegexChars(str);
    exports.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
    exports.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");
    exports.isWindows = () => {
      if (typeof navigator !== "undefined" && navigator.platform) {
        const platform = navigator.platform.toLowerCase();
        return platform === "win32" || platform === "windows";
      }
      if (typeof process !== "undefined" && process.platform) {
        return process.platform === "win32";
      }
      return false;
    };
    exports.removeBackslashes = (str) => {
      return str.replace(REGEX_REMOVE_BACKSLASH, (match) => {
        return match === "\\" ? "" : match;
      });
    };
    exports.escapeLast = (input2, char, lastIdx) => {
      const idx = input2.lastIndexOf(char, lastIdx);
      if (idx === -1) return input2;
      if (input2[idx - 1] === "\\") return exports.escapeLast(input2, char, idx - 1);
      return `${input2.slice(0, idx)}\\${input2.slice(idx)}`;
    };
    exports.removePrefix = (input2, state = {}) => {
      let output = input2;
      if (output.startsWith("./")) {
        output = output.slice(2);
        state.prefix = "./";
      }
      return output;
    };
    exports.wrapOutput = (input2, state = {}, options = {}) => {
      const prepend = options.contains ? "" : "^";
      const append = options.contains ? "" : "$";
      let output = `${prepend}(?:${input2})${append}`;
      if (state.negated === true) {
        output = `(?:^(?!${output}).*$)`;
      }
      return output;
    };
    exports.basename = (path2, { windows } = {}) => {
      const segs = path2.split(windows ? /[\\/]/ : "/");
      const last = segs[segs.length - 1];
      if (last === "") {
        return segs[segs.length - 2];
      }
      return last;
    };
  }
});

// ../../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/scan.js
var require_scan = __commonJS({
  "../../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/scan.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var {
      CHAR_ASTERISK,
      /* * */
      CHAR_AT,
      /* @ */
      CHAR_BACKWARD_SLASH,
      /* \ */
      CHAR_COMMA,
      /* , */
      CHAR_DOT,
      /* . */
      CHAR_EXCLAMATION_MARK,
      /* ! */
      CHAR_FORWARD_SLASH,
      /* / */
      CHAR_LEFT_CURLY_BRACE,
      /* { */
      CHAR_LEFT_PARENTHESES,
      /* ( */
      CHAR_LEFT_SQUARE_BRACKET,
      /* [ */
      CHAR_PLUS,
      /* + */
      CHAR_QUESTION_MARK,
      /* ? */
      CHAR_RIGHT_CURLY_BRACE,
      /* } */
      CHAR_RIGHT_PARENTHESES,
      /* ) */
      CHAR_RIGHT_SQUARE_BRACKET
      /* ] */
    } = require_constants();
    var isPathSeparator = (code) => {
      return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
    };
    var depth = (token) => {
      if (token.isPrefix !== true) {
        token.depth = token.isGlobstar ? Infinity : 1;
      }
    };
    var scan2 = (input2, options) => {
      const opts = options || {};
      const length = input2.length - 1;
      const scanToEnd = opts.parts === true || opts.scanToEnd === true;
      const slashes = [];
      const tokens = [];
      const parts = [];
      let str = input2;
      let index = -1;
      let start = 0;
      let lastIndex = 0;
      let isBrace = false;
      let isBracket = false;
      let isGlob = false;
      let isExtglob = false;
      let isGlobstar = false;
      let braceEscaped = false;
      let backslashes = false;
      let negated = false;
      let negatedExtglob = false;
      let finished = false;
      let braces = 0;
      let prev;
      let code;
      let token = { value: "", depth: 0, isGlob: false };
      const eos = () => index >= length;
      const peek = () => str.charCodeAt(index + 1);
      const advance = () => {
        prev = code;
        return str.charCodeAt(++index);
      };
      while (index < length) {
        code = advance();
        let next;
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          code = advance();
          if (code === CHAR_LEFT_CURLY_BRACE) {
            braceEscaped = true;
          }
          continue;
        }
        if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
          braces++;
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }
            if (code === CHAR_LEFT_CURLY_BRACE) {
              braces++;
              continue;
            }
            if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;
              if (scanToEnd === true) {
                continue;
              }
              break;
            }
            if (braceEscaped !== true && code === CHAR_COMMA) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;
              if (scanToEnd === true) {
                continue;
              }
              break;
            }
            if (code === CHAR_RIGHT_CURLY_BRACE) {
              braces--;
              if (braces === 0) {
                braceEscaped = false;
                isBrace = token.isBrace = true;
                finished = true;
                break;
              }
            }
          }
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_FORWARD_SLASH) {
          slashes.push(index);
          tokens.push(token);
          token = { value: "", depth: 0, isGlob: false };
          if (finished === true) continue;
          if (prev === CHAR_DOT && index === start + 1) {
            start += 2;
            continue;
          }
          lastIndex = index + 1;
          continue;
        }
        if (opts.noext !== true) {
          const isExtglobChar = code === CHAR_PLUS || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK;
          if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
            isGlob = token.isGlob = true;
            isExtglob = token.isExtglob = true;
            finished = true;
            if (code === CHAR_EXCLAMATION_MARK && index === start) {
              negatedExtglob = true;
            }
            if (scanToEnd === true) {
              while (eos() !== true && (code = advance())) {
                if (code === CHAR_BACKWARD_SLASH) {
                  backslashes = token.backslashes = true;
                  code = advance();
                  continue;
                }
                if (code === CHAR_RIGHT_PARENTHESES) {
                  isGlob = token.isGlob = true;
                  finished = true;
                  break;
                }
              }
              continue;
            }
            break;
          }
        }
        if (code === CHAR_ASTERISK) {
          if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
          isGlob = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_QUESTION_MARK) {
          isGlob = token.isGlob = true;
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (code === CHAR_LEFT_SQUARE_BRACKET) {
          while (eos() !== true && (next = advance())) {
            if (next === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }
            if (next === CHAR_RIGHT_SQUARE_BRACKET) {
              isBracket = token.isBracket = true;
              isGlob = token.isGlob = true;
              finished = true;
              break;
            }
          }
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
        if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
          negated = token.negated = true;
          start++;
          continue;
        }
        if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
          isGlob = token.isGlob = true;
          if (scanToEnd === true) {
            while (eos() !== true && (code = advance())) {
              if (code === CHAR_LEFT_PARENTHESES) {
                backslashes = token.backslashes = true;
                code = advance();
                continue;
              }
              if (code === CHAR_RIGHT_PARENTHESES) {
                finished = true;
                break;
              }
            }
            continue;
          }
          break;
        }
        if (isGlob === true) {
          finished = true;
          if (scanToEnd === true) {
            continue;
          }
          break;
        }
      }
      if (opts.noext === true) {
        isExtglob = false;
        isGlob = false;
      }
      let base = str;
      let prefix = "";
      let glob = "";
      if (start > 0) {
        prefix = str.slice(0, start);
        str = str.slice(start);
        lastIndex -= start;
      }
      if (base && isGlob === true && lastIndex > 0) {
        base = str.slice(0, lastIndex);
        glob = str.slice(lastIndex);
      } else if (isGlob === true) {
        base = "";
        glob = str;
      } else {
        base = str;
      }
      if (base && base !== "" && base !== "/" && base !== str) {
        if (isPathSeparator(base.charCodeAt(base.length - 1))) {
          base = base.slice(0, -1);
        }
      }
      if (opts.unescape === true) {
        if (glob) glob = utils.removeBackslashes(glob);
        if (base && backslashes === true) {
          base = utils.removeBackslashes(base);
        }
      }
      const state = {
        prefix,
        input: input2,
        start,
        base,
        glob,
        isBrace,
        isBracket,
        isGlob,
        isExtglob,
        isGlobstar,
        negated,
        negatedExtglob
      };
      if (opts.tokens === true) {
        state.maxDepth = 0;
        if (!isPathSeparator(code)) {
          tokens.push(token);
        }
        state.tokens = tokens;
      }
      if (opts.parts === true || opts.tokens === true) {
        let prevIndex;
        for (let idx = 0; idx < slashes.length; idx++) {
          const n = prevIndex ? prevIndex + 1 : start;
          const i = slashes[idx];
          const value2 = input2.slice(n, i);
          if (opts.tokens) {
            if (idx === 0 && start !== 0) {
              tokens[idx].isPrefix = true;
              tokens[idx].value = prefix;
            } else {
              tokens[idx].value = value2;
            }
            depth(tokens[idx]);
            state.maxDepth += tokens[idx].depth;
          }
          if (idx !== 0 || value2 !== "") {
            parts.push(value2);
          }
          prevIndex = i;
        }
        if (prevIndex && prevIndex + 1 < input2.length) {
          const value2 = input2.slice(prevIndex + 1);
          parts.push(value2);
          if (opts.tokens) {
            tokens[tokens.length - 1].value = value2;
            depth(tokens[tokens.length - 1]);
            state.maxDepth += tokens[tokens.length - 1].depth;
          }
        }
        state.slashes = slashes;
        state.parts = parts;
      }
      return state;
    };
    module.exports = scan2;
  }
});

// ../../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/parse.js
var require_parse = __commonJS({
  "../../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/parse.js"(exports, module) {
    "use strict";
    var constants = require_constants();
    var utils = require_utils();
    var {
      MAX_LENGTH,
      POSIX_REGEX_SOURCE,
      REGEX_NON_SPECIAL_CHARS,
      REGEX_SPECIAL_CHARS_BACKREF,
      REPLACEMENTS
    } = constants;
    var expandRange = (args, options) => {
      if (typeof options.expandRange === "function") {
        return options.expandRange(...args, options);
      }
      args.sort();
      const value2 = `[${args.join("-")}]`;
      try {
        new RegExp(value2);
      } catch (ex) {
        return args.map((v) => utils.escapeRegex(v)).join("..");
      }
      return value2;
    };
    var syntaxError = (type, char) => {
      return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
    };
    var parse2 = (input2, options) => {
      if (typeof input2 !== "string") {
        throw new TypeError("Expected a string");
      }
      input2 = REPLACEMENTS[input2] || input2;
      const opts = { ...options };
      const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      let len = input2.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }
      const bos = { type: "bos", value: "", output: opts.prepend || "" };
      const tokens = [bos];
      const capture = opts.capture ? "" : "?:";
      const PLATFORM_CHARS = constants.globChars(opts.windows);
      const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);
      const {
        DOT_LITERAL,
        PLUS_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOT_SLASH,
        NO_DOTS_SLASH,
        QMARK,
        QMARK_NO_DOT,
        STAR,
        START_ANCHOR
      } = PLATFORM_CHARS;
      const globstar = (opts2) => {
        return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };
      const nodot = opts.dot ? "" : NO_DOT;
      const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
      let star = opts.bash === true ? globstar(opts) : STAR;
      if (opts.capture) {
        star = `(${star})`;
      }
      if (typeof opts.noext === "boolean") {
        opts.noextglob = opts.noext;
      }
      const state = {
        input: input2,
        index: -1,
        start: 0,
        dot: opts.dot === true,
        consumed: "",
        output: "",
        prefix: "",
        backtrack: false,
        negated: false,
        brackets: 0,
        braces: 0,
        parens: 0,
        quotes: 0,
        globstar: false,
        tokens
      };
      input2 = utils.removePrefix(input2, state);
      len = input2.length;
      const extglobs = [];
      const braces = [];
      const stack = [];
      let prev = bos;
      let value2;
      const eos = () => state.index === len - 1;
      const peek = state.peek = (n = 1) => input2[state.index + n];
      const advance = state.advance = () => input2[++state.index] || "";
      const remaining = () => input2.slice(state.index + 1);
      const consume = (value3 = "", num = 0) => {
        state.consumed += value3;
        state.index += num;
      };
      const append = (token) => {
        state.output += token.output != null ? token.output : token.value;
        consume(token.value);
      };
      const negate = () => {
        let count = 1;
        while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
          advance();
          state.start++;
          count++;
        }
        if (count % 2 === 0) {
          return false;
        }
        state.negated = true;
        state.start++;
        return true;
      };
      const increment = (type) => {
        state[type]++;
        stack.push(type);
      };
      const decrement = (type) => {
        state[type]--;
        stack.pop();
      };
      const push = (tok) => {
        if (prev.type === "globstar") {
          const isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
          const isExtglob = tok.extglob === true || extglobs.length && (tok.type === "pipe" || tok.type === "paren");
          if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob) {
            state.output = state.output.slice(0, -prev.output.length);
            prev.type = "star";
            prev.value = "*";
            prev.output = star;
            state.output += prev.output;
          }
        }
        if (extglobs.length && tok.type !== "paren") {
          extglobs[extglobs.length - 1].inner += tok.value;
        }
        if (tok.value || tok.output) append(tok);
        if (prev && prev.type === "text" && tok.type === "text") {
          prev.output = (prev.output || prev.value) + tok.value;
          prev.value += tok.value;
          return;
        }
        tok.prev = prev;
        tokens.push(tok);
        prev = tok;
      };
      const extglobOpen = (type, value3) => {
        const token = { ...EXTGLOB_CHARS[value3], conditions: 1, inner: "" };
        token.prev = prev;
        token.parens = state.parens;
        token.output = state.output;
        const output = (opts.capture ? "(" : "") + token.open;
        increment("parens");
        push({ type, value: value3, output: state.output ? "" : ONE_CHAR });
        push({ type: "paren", extglob: true, value: advance(), output });
        extglobs.push(token);
      };
      const extglobClose = (token) => {
        let output = token.close + (opts.capture ? ")" : "");
        let rest;
        if (token.type === "negate") {
          let extglobStar = star;
          if (token.inner && token.inner.length > 1 && token.inner.includes("/")) {
            extglobStar = globstar(opts);
          }
          if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
            output = token.close = `)$))${extglobStar}`;
          }
          if (token.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
            const expression = parse2(rest, { ...options, fastpaths: false }).output;
            output = token.close = `)${expression})${extglobStar})`;
          }
          if (token.prev.type === "bos") {
            state.negatedExtglob = true;
          }
        }
        push({ type: "paren", extglob: true, value: value2, output });
        decrement("parens");
      };
      if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input2)) {
        let backslashes = false;
        let output = input2.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
          if (first === "\\") {
            backslashes = true;
            return m;
          }
          if (first === "?") {
            if (esc) {
              return esc + first + (rest ? QMARK.repeat(rest.length) : "");
            }
            if (index === 0) {
              return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : "");
            }
            return QMARK.repeat(chars.length);
          }
          if (first === ".") {
            return DOT_LITERAL.repeat(chars.length);
          }
          if (first === "*") {
            if (esc) {
              return esc + first + (rest ? star : "");
            }
            return star;
          }
          return esc ? m : `\\${m}`;
        });
        if (backslashes === true) {
          if (opts.unescape === true) {
            output = output.replace(/\\/g, "");
          } else {
            output = output.replace(/\\+/g, (m) => {
              return m.length % 2 === 0 ? "\\\\" : m ? "\\" : "";
            });
          }
        }
        if (output === input2 && opts.contains === true) {
          state.output = input2;
          return state;
        }
        state.output = utils.wrapOutput(output, state, options);
        return state;
      }
      while (!eos()) {
        value2 = advance();
        if (value2 === "\0") {
          continue;
        }
        if (value2 === "\\") {
          const next = peek();
          if (next === "/" && opts.bash !== true) {
            continue;
          }
          if (next === "." || next === ";") {
            continue;
          }
          if (!next) {
            value2 += "\\";
            push({ type: "text", value: value2 });
            continue;
          }
          const match = /^\\+/.exec(remaining());
          let slashes = 0;
          if (match && match[0].length > 2) {
            slashes = match[0].length;
            state.index += slashes;
            if (slashes % 2 !== 0) {
              value2 += "\\";
            }
          }
          if (opts.unescape === true) {
            value2 = advance();
          } else {
            value2 += advance();
          }
          if (state.brackets === 0) {
            push({ type: "text", value: value2 });
            continue;
          }
        }
        if (state.brackets > 0 && (value2 !== "]" || prev.value === "[" || prev.value === "[^")) {
          if (opts.posix !== false && value2 === ":") {
            const inner = prev.value.slice(1);
            if (inner.includes("[")) {
              prev.posix = true;
              if (inner.includes(":")) {
                const idx = prev.value.lastIndexOf("[");
                const pre = prev.value.slice(0, idx);
                const rest2 = prev.value.slice(idx + 2);
                const posix = POSIX_REGEX_SOURCE[rest2];
                if (posix) {
                  prev.value = pre + posix;
                  state.backtrack = true;
                  advance();
                  if (!bos.output && tokens.indexOf(prev) === 1) {
                    bos.output = ONE_CHAR;
                  }
                  continue;
                }
              }
            }
          }
          if (value2 === "[" && peek() !== ":" || value2 === "-" && peek() === "]") {
            value2 = `\\${value2}`;
          }
          if (value2 === "]" && (prev.value === "[" || prev.value === "[^")) {
            value2 = `\\${value2}`;
          }
          if (opts.posix === true && value2 === "!" && prev.value === "[") {
            value2 = "^";
          }
          prev.value += value2;
          append({ value: value2 });
          continue;
        }
        if (state.quotes === 1 && value2 !== '"') {
          value2 = utils.escapeRegex(value2);
          prev.value += value2;
          append({ value: value2 });
          continue;
        }
        if (value2 === '"') {
          state.quotes = state.quotes === 1 ? 0 : 1;
          if (opts.keepQuotes === true) {
            push({ type: "text", value: value2 });
          }
          continue;
        }
        if (value2 === "(") {
          increment("parens");
          push({ type: "paren", value: value2 });
          continue;
        }
        if (value2 === ")") {
          if (state.parens === 0 && opts.strictBrackets === true) {
            throw new SyntaxError(syntaxError("opening", "("));
          }
          const extglob = extglobs[extglobs.length - 1];
          if (extglob && state.parens === extglob.parens + 1) {
            extglobClose(extglobs.pop());
            continue;
          }
          push({ type: "paren", value: value2, output: state.parens ? ")" : "\\)" });
          decrement("parens");
          continue;
        }
        if (value2 === "[") {
          if (opts.nobracket === true || !remaining().includes("]")) {
            if (opts.nobracket !== true && opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError("closing", "]"));
            }
            value2 = `\\${value2}`;
          } else {
            increment("brackets");
          }
          push({ type: "bracket", value: value2 });
          continue;
        }
        if (value2 === "]") {
          if (opts.nobracket === true || prev && prev.type === "bracket" && prev.value.length === 1) {
            push({ type: "text", value: value2, output: `\\${value2}` });
            continue;
          }
          if (state.brackets === 0) {
            if (opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError("opening", "["));
            }
            push({ type: "text", value: value2, output: `\\${value2}` });
            continue;
          }
          decrement("brackets");
          const prevValue = prev.value.slice(1);
          if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) {
            value2 = `/${value2}`;
          }
          prev.value += value2;
          append({ value: value2 });
          if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
            continue;
          }
          const escaped = utils.escapeRegex(prev.value);
          state.output = state.output.slice(0, -prev.value.length);
          if (opts.literalBrackets === true) {
            state.output += escaped;
            prev.value = escaped;
            continue;
          }
          prev.value = `(${capture}${escaped}|${prev.value})`;
          state.output += prev.value;
          continue;
        }
        if (value2 === "{" && opts.nobrace !== true) {
          increment("braces");
          const open = {
            type: "brace",
            value: value2,
            output: "(",
            outputIndex: state.output.length,
            tokensIndex: state.tokens.length
          };
          braces.push(open);
          push(open);
          continue;
        }
        if (value2 === "}") {
          const brace = braces[braces.length - 1];
          if (opts.nobrace === true || !brace) {
            push({ type: "text", value: value2, output: value2 });
            continue;
          }
          let output = ")";
          if (brace.dots === true) {
            const arr = tokens.slice();
            const range = [];
            for (let i = arr.length - 1; i >= 0; i--) {
              tokens.pop();
              if (arr[i].type === "brace") {
                break;
              }
              if (arr[i].type !== "dots") {
                range.unshift(arr[i].value);
              }
            }
            output = expandRange(range, opts);
            state.backtrack = true;
          }
          if (brace.comma !== true && brace.dots !== true) {
            const out = state.output.slice(0, brace.outputIndex);
            const toks = state.tokens.slice(brace.tokensIndex);
            brace.value = brace.output = "\\{";
            value2 = output = "\\}";
            state.output = out;
            for (const t of toks) {
              state.output += t.output || t.value;
            }
          }
          push({ type: "brace", value: value2, output });
          decrement("braces");
          braces.pop();
          continue;
        }
        if (value2 === "|") {
          if (extglobs.length > 0) {
            extglobs[extglobs.length - 1].conditions++;
          }
          push({ type: "text", value: value2 });
          continue;
        }
        if (value2 === ",") {
          let output = value2;
          const brace = braces[braces.length - 1];
          if (brace && stack[stack.length - 1] === "braces") {
            brace.comma = true;
            output = "|";
          }
          push({ type: "comma", value: value2, output });
          continue;
        }
        if (value2 === "/") {
          if (prev.type === "dot" && state.index === state.start + 1) {
            state.start = state.index + 1;
            state.consumed = "";
            state.output = "";
            tokens.pop();
            prev = bos;
            continue;
          }
          push({ type: "slash", value: value2, output: SLASH_LITERAL });
          continue;
        }
        if (value2 === ".") {
          if (state.braces > 0 && prev.type === "dot") {
            if (prev.value === ".") prev.output = DOT_LITERAL;
            const brace = braces[braces.length - 1];
            prev.type = "dots";
            prev.output += value2;
            prev.value += value2;
            brace.dots = true;
            continue;
          }
          if (state.braces + state.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
            push({ type: "text", value: value2, output: DOT_LITERAL });
            continue;
          }
          push({ type: "dot", value: value2, output: DOT_LITERAL });
          continue;
        }
        if (value2 === "?") {
          const isGroup = prev && prev.value === "(";
          if (!isGroup && opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            extglobOpen("qmark", value2);
            continue;
          }
          if (prev && prev.type === "paren") {
            const next = peek();
            let output = value2;
            if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining())) {
              output = `\\${value2}`;
            }
            push({ type: "text", value: value2, output });
            continue;
          }
          if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
            push({ type: "qmark", value: value2, output: QMARK_NO_DOT });
            continue;
          }
          push({ type: "qmark", value: value2, output: QMARK });
          continue;
        }
        if (value2 === "!") {
          if (opts.noextglob !== true && peek() === "(") {
            if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
              extglobOpen("negate", value2);
              continue;
            }
          }
          if (opts.nonegate !== true && state.index === 0) {
            negate();
            continue;
          }
        }
        if (value2 === "+") {
          if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            extglobOpen("plus", value2);
            continue;
          }
          if (prev && prev.value === "(" || opts.regex === false) {
            push({ type: "plus", value: value2, output: PLUS_LITERAL });
            continue;
          }
          if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace") || state.parens > 0) {
            push({ type: "plus", value: value2 });
            continue;
          }
          push({ type: "plus", value: PLUS_LITERAL });
          continue;
        }
        if (value2 === "@") {
          if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
            push({ type: "at", extglob: true, value: value2, output: "" });
            continue;
          }
          push({ type: "text", value: value2 });
          continue;
        }
        if (value2 !== "*") {
          if (value2 === "$" || value2 === "^") {
            value2 = `\\${value2}`;
          }
          const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
          if (match) {
            value2 += match[0];
            state.index += match[0].length;
          }
          push({ type: "text", value: value2 });
          continue;
        }
        if (prev && (prev.type === "globstar" || prev.star === true)) {
          prev.type = "star";
          prev.star = true;
          prev.value += value2;
          prev.output = star;
          state.backtrack = true;
          state.globstar = true;
          consume(value2);
          continue;
        }
        let rest = remaining();
        if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
          extglobOpen("star", value2);
          continue;
        }
        if (prev.type === "star") {
          if (opts.noglobstar === true) {
            consume(value2);
            continue;
          }
          const prior = prev.prev;
          const before = prior.prev;
          const isStart = prior.type === "slash" || prior.type === "bos";
          const afterStar = before && (before.type === "star" || before.type === "globstar");
          if (opts.bash === true && (!isStart || rest[0] && rest[0] !== "/")) {
            push({ type: "star", value: value2, output: "" });
            continue;
          }
          const isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
          const isExtglob = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
          if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob) {
            push({ type: "star", value: value2, output: "" });
            continue;
          }
          while (rest.slice(0, 3) === "/**") {
            const after = input2[state.index + 4];
            if (after && after !== "/") {
              break;
            }
            rest = rest.slice(3);
            consume("/**", 3);
          }
          if (prior.type === "bos" && eos()) {
            prev.type = "globstar";
            prev.value += value2;
            prev.output = globstar(opts);
            state.output = prev.output;
            state.globstar = true;
            consume(value2);
            continue;
          }
          if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && eos()) {
            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;
            prev.type = "globstar";
            prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
            prev.value += value2;
            state.globstar = true;
            state.output += prior.output + prev.output;
            consume(value2);
            continue;
          }
          if (prior.type === "slash" && prior.prev.type !== "bos" && rest[0] === "/") {
            const end = rest[1] !== void 0 ? "|$" : "";
            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;
            prev.type = "globstar";
            prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
            prev.value += value2;
            state.output += prior.output + prev.output;
            state.globstar = true;
            consume(value2 + advance());
            push({ type: "slash", value: "/", output: "" });
            continue;
          }
          if (prior.type === "bos" && rest[0] === "/") {
            prev.type = "globstar";
            prev.value += value2;
            prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
            state.output = prev.output;
            state.globstar = true;
            consume(value2 + advance());
            push({ type: "slash", value: "/", output: "" });
            continue;
          }
          state.output = state.output.slice(0, -prev.output.length);
          prev.type = "globstar";
          prev.output = globstar(opts);
          prev.value += value2;
          state.output += prev.output;
          state.globstar = true;
          consume(value2);
          continue;
        }
        const token = { type: "star", value: value2, output: star };
        if (opts.bash === true) {
          token.output = ".*?";
          if (prev.type === "bos" || prev.type === "slash") {
            token.output = nodot + token.output;
          }
          push(token);
          continue;
        }
        if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
          token.output = value2;
          push(token);
          continue;
        }
        if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
          if (prev.type === "dot") {
            state.output += NO_DOT_SLASH;
            prev.output += NO_DOT_SLASH;
          } else if (opts.dot === true) {
            state.output += NO_DOTS_SLASH;
            prev.output += NO_DOTS_SLASH;
          } else {
            state.output += nodot;
            prev.output += nodot;
          }
          if (peek() !== "*") {
            state.output += ONE_CHAR;
            prev.output += ONE_CHAR;
          }
        }
        push(token);
      }
      while (state.brackets > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
        state.output = utils.escapeLast(state.output, "[");
        decrement("brackets");
      }
      while (state.parens > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", ")"));
        state.output = utils.escapeLast(state.output, "(");
        decrement("parens");
      }
      while (state.braces > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "}"));
        state.output = utils.escapeLast(state.output, "{");
        decrement("braces");
      }
      if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) {
        push({ type: "maybe_slash", value: "", output: `${SLASH_LITERAL}?` });
      }
      if (state.backtrack === true) {
        state.output = "";
        for (const token of state.tokens) {
          state.output += token.output != null ? token.output : token.value;
          if (token.suffix) {
            state.output += token.suffix;
          }
        }
      }
      return state;
    };
    parse2.fastpaths = (input2, options) => {
      const opts = { ...options };
      const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      const len = input2.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }
      input2 = REPLACEMENTS[input2] || input2;
      const {
        DOT_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOTS,
        NO_DOTS_SLASH,
        STAR,
        START_ANCHOR
      } = constants.globChars(opts.windows);
      const nodot = opts.dot ? NO_DOTS : NO_DOT;
      const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
      const capture = opts.capture ? "" : "?:";
      const state = { negated: false, prefix: "" };
      let star = opts.bash === true ? ".*?" : STAR;
      if (opts.capture) {
        star = `(${star})`;
      }
      const globstar = (opts2) => {
        if (opts2.noglobstar === true) return star;
        return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };
      const create = (str) => {
        switch (str) {
          case "*":
            return `${nodot}${ONE_CHAR}${star}`;
          case ".*":
            return `${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "*.*":
            return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "*/*":
            return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
          case "**":
            return nodot + globstar(opts);
          case "**/*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
          case "**/*.*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
          case "**/.*":
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
          default: {
            const match = /^(.*?)\.(\w+)$/.exec(str);
            if (!match) return;
            const source2 = create(match[1]);
            if (!source2) return;
            return source2 + DOT_LITERAL + match[2];
          }
        }
      };
      const output = utils.removePrefix(input2, state);
      let source = create(output);
      if (source && opts.strictSlashes !== true) {
        source += `${SLASH_LITERAL}?`;
      }
      return source;
    };
    module.exports = parse2;
  }
});

// ../../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/picomatch.js
var require_picomatch = __commonJS({
  "../../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/lib/picomatch.js"(exports, module) {
    "use strict";
    var scan2 = require_scan();
    var parse2 = require_parse();
    var utils = require_utils();
    var constants = require_constants();
    var isObject = (val) => val && typeof val === "object" && !Array.isArray(val);
    var picomatch2 = (glob, options, returnState = false) => {
      if (Array.isArray(glob)) {
        const fns = glob.map((input2) => picomatch2(input2, options, returnState));
        const arrayMatcher = (str) => {
          for (const isMatch of fns) {
            const state2 = isMatch(str);
            if (state2) return state2;
          }
          return false;
        };
        return arrayMatcher;
      }
      const isState = isObject(glob) && glob.tokens && glob.input;
      if (glob === "" || typeof glob !== "string" && !isState) {
        throw new TypeError("Expected pattern to be a non-empty string");
      }
      const opts = options || {};
      const posix = opts.windows;
      const regex = isState ? picomatch2.compileRe(glob, options) : picomatch2.makeRe(glob, options, false, true);
      const state = regex.state;
      delete regex.state;
      let isIgnored = () => false;
      if (opts.ignore) {
        const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
        isIgnored = picomatch2(opts.ignore, ignoreOpts, returnState);
      }
      const matcher = (input2, returnObject = false) => {
        const { isMatch, match, output } = picomatch2.test(input2, regex, options, { glob, posix });
        const result = { glob, state, regex, posix, input: input2, output, match, isMatch };
        if (typeof opts.onResult === "function") {
          opts.onResult(result);
        }
        if (isMatch === false) {
          result.isMatch = false;
          return returnObject ? result : false;
        }
        if (isIgnored(input2)) {
          if (typeof opts.onIgnore === "function") {
            opts.onIgnore(result);
          }
          result.isMatch = false;
          return returnObject ? result : false;
        }
        if (typeof opts.onMatch === "function") {
          opts.onMatch(result);
        }
        return returnObject ? result : true;
      };
      if (returnState) {
        matcher.state = state;
      }
      return matcher;
    };
    picomatch2.test = (input2, regex, options, { glob, posix } = {}) => {
      if (typeof input2 !== "string") {
        throw new TypeError("Expected input to be a string");
      }
      if (input2 === "") {
        return { isMatch: false, output: "" };
      }
      const opts = options || {};
      const format2 = opts.format || (posix ? utils.toPosixSlashes : null);
      let match = input2 === glob;
      let output = match && format2 ? format2(input2) : input2;
      if (match === false) {
        output = format2 ? format2(input2) : input2;
        match = output === glob;
      }
      if (match === false || opts.capture === true) {
        if (opts.matchBase === true || opts.basename === true) {
          match = picomatch2.matchBase(input2, regex, options, posix);
        } else {
          match = regex.exec(output);
        }
      }
      return { isMatch: Boolean(match), match, output };
    };
    picomatch2.matchBase = (input2, glob, options) => {
      const regex = glob instanceof RegExp ? glob : picomatch2.makeRe(glob, options);
      return regex.test(utils.basename(input2));
    };
    picomatch2.isMatch = (str, patterns, options) => picomatch2(patterns, options)(str);
    picomatch2.parse = (pattern, options) => {
      if (Array.isArray(pattern)) return pattern.map((p) => picomatch2.parse(p, options));
      return parse2(pattern, { ...options, fastpaths: false });
    };
    picomatch2.scan = (input2, options) => scan2(input2, options);
    picomatch2.compileRe = (state, options, returnOutput = false, returnState = false) => {
      if (returnOutput === true) {
        return state.output;
      }
      const opts = options || {};
      const prepend = opts.contains ? "" : "^";
      const append = opts.contains ? "" : "$";
      let source = `${prepend}(?:${state.output})${append}`;
      if (state && state.negated === true) {
        source = `^(?!${source}).*$`;
      }
      const regex = picomatch2.toRegex(source, options);
      if (returnState === true) {
        regex.state = state;
      }
      return regex;
    };
    picomatch2.makeRe = (input2, options = {}, returnOutput = false, returnState = false) => {
      if (!input2 || typeof input2 !== "string") {
        throw new TypeError("Expected a non-empty string");
      }
      let parsed = { negated: false, fastpaths: true };
      if (options.fastpaths !== false && (input2[0] === "." || input2[0] === "*")) {
        parsed.output = parse2.fastpaths(input2, options);
      }
      if (!parsed.output) {
        parsed = parse2(input2, options);
      }
      return picomatch2.compileRe(parsed, options, returnOutput, returnState);
    };
    picomatch2.toRegex = (source, options) => {
      try {
        const opts = options || {};
        return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
      } catch (err) {
        if (options && options.debug === true) throw err;
        return /$^/;
      }
    };
    picomatch2.constants = constants;
    module.exports = picomatch2;
  }
});

// ../../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/index.js
var require_picomatch2 = __commonJS({
  "../../node_modules/.pnpm/picomatch@4.0.3/node_modules/picomatch/index.js"(exports, module) {
    "use strict";
    var pico = require_picomatch();
    var utils = require_utils();
    function picomatch2(glob, options, returnState = false) {
      if (options && (options.windows === null || options.windows === void 0)) {
        options = { ...options, windows: utils.isWindows() };
      }
      return pico(glob, options, returnState);
    }
    Object.assign(picomatch2, pico);
    module.exports = picomatch2;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/nodes/identity.js
var require_identity = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/nodes/identity.js"(exports) {
    "use strict";
    var ALIAS = Symbol.for("yaml.alias");
    var DOC = Symbol.for("yaml.document");
    var MAP = Symbol.for("yaml.map");
    var PAIR = Symbol.for("yaml.pair");
    var SCALAR = Symbol.for("yaml.scalar");
    var SEQ = Symbol.for("yaml.seq");
    var NODE_TYPE = Symbol.for("yaml.node.type");
    var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
    var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
    var isMap = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
    var isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
    var isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
    var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
    function isCollection(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case MAP:
          case SEQ:
            return true;
        }
      return false;
    }
    function isNode(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case ALIAS:
          case MAP:
          case SCALAR:
          case SEQ:
            return true;
        }
      return false;
    }
    var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
    exports.ALIAS = ALIAS;
    exports.DOC = DOC;
    exports.MAP = MAP;
    exports.NODE_TYPE = NODE_TYPE;
    exports.PAIR = PAIR;
    exports.SCALAR = SCALAR;
    exports.SEQ = SEQ;
    exports.hasAnchor = hasAnchor;
    exports.isAlias = isAlias;
    exports.isCollection = isCollection;
    exports.isDocument = isDocument;
    exports.isMap = isMap;
    exports.isNode = isNode;
    exports.isPair = isPair;
    exports.isScalar = isScalar;
    exports.isSeq = isSeq;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/visit.js
var require_visit = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/visit.js"(exports) {
    "use strict";
    var identity = require_identity();
    var BREAK = Symbol("break visit");
    var SKIP = Symbol("skip children");
    var REMOVE = Symbol("remove node");
    function visit2(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        visit_(null, node, visitor_, Object.freeze([]));
    }
    visit2.BREAK = BREAK;
    visit2.SKIP = SKIP;
    visit2.REMOVE = REMOVE;
    function visit_(key, node, visitor, path2) {
      const ctrl = callVisitor(key, node, visitor, path2);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path2, ctrl);
        return visit_(key, ctrl, visitor, path2);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path2 = Object.freeze(path2.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = visit_(i, node.items[i], visitor, path2);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path2 = Object.freeze(path2.concat(node));
          const ck = visit_("key", node.key, visitor, path2);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = visit_("value", node.value, visitor, path2);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    async function visitAsync(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        await visitAsync_(null, node, visitor_, Object.freeze([]));
    }
    visitAsync.BREAK = BREAK;
    visitAsync.SKIP = SKIP;
    visitAsync.REMOVE = REMOVE;
    async function visitAsync_(key, node, visitor, path2) {
      const ctrl = await callVisitor(key, node, visitor, path2);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path2, ctrl);
        return visitAsync_(key, ctrl, visitor, path2);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path2 = Object.freeze(path2.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = await visitAsync_(i, node.items[i], visitor, path2);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path2 = Object.freeze(path2.concat(node));
          const ck = await visitAsync_("key", node.key, visitor, path2);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = await visitAsync_("value", node.value, visitor, path2);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    function initVisitor(visitor) {
      if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
        return Object.assign({
          Alias: visitor.Node,
          Map: visitor.Node,
          Scalar: visitor.Node,
          Seq: visitor.Node
        }, visitor.Value && {
          Map: visitor.Value,
          Scalar: visitor.Value,
          Seq: visitor.Value
        }, visitor.Collection && {
          Map: visitor.Collection,
          Seq: visitor.Collection
        }, visitor);
      }
      return visitor;
    }
    function callVisitor(key, node, visitor, path2) {
      if (typeof visitor === "function")
        return visitor(key, node, path2);
      if (identity.isMap(node))
        return visitor.Map?.(key, node, path2);
      if (identity.isSeq(node))
        return visitor.Seq?.(key, node, path2);
      if (identity.isPair(node))
        return visitor.Pair?.(key, node, path2);
      if (identity.isScalar(node))
        return visitor.Scalar?.(key, node, path2);
      if (identity.isAlias(node))
        return visitor.Alias?.(key, node, path2);
      return void 0;
    }
    function replaceNode(key, path2, node) {
      const parent = path2[path2.length - 1];
      if (identity.isCollection(parent)) {
        parent.items[key] = node;
      } else if (identity.isPair(parent)) {
        if (key === "key")
          parent.key = node;
        else
          parent.value = node;
      } else if (identity.isDocument(parent)) {
        parent.contents = node;
      } else {
        const pt = identity.isAlias(parent) ? "alias" : "scalar";
        throw new Error(`Cannot replace node with ${pt} parent`);
      }
    }
    exports.visit = visit2;
    exports.visitAsync = visitAsync;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/doc/directives.js
var require_directives = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/doc/directives.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit2 = require_visit();
    var escapeChars = {
      "!": "%21",
      ",": "%2C",
      "[": "%5B",
      "]": "%5D",
      "{": "%7B",
      "}": "%7D"
    };
    var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
    var Directives = class _Directives {
      constructor(yaml, tags) {
        this.docStart = null;
        this.docEnd = false;
        this.yaml = Object.assign({}, _Directives.defaultYaml, yaml);
        this.tags = Object.assign({}, _Directives.defaultTags, tags);
      }
      clone() {
        const copy = new _Directives(this.yaml, this.tags);
        copy.docStart = this.docStart;
        return copy;
      }
      /**
       * During parsing, get a Directives instance for the current document and
       * update the stream state according to the current version's spec.
       */
      atDocument() {
        const res = new _Directives(this.yaml, this.tags);
        switch (this.yaml.version) {
          case "1.1":
            this.atNextDocument = true;
            break;
          case "1.2":
            this.atNextDocument = false;
            this.yaml = {
              explicit: _Directives.defaultYaml.explicit,
              version: "1.2"
            };
            this.tags = Object.assign({}, _Directives.defaultTags);
            break;
        }
        return res;
      }
      /**
       * @param onError - May be called even if the action was successful
       * @returns `true` on success
       */
      add(line, onError) {
        if (this.atNextDocument) {
          this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" };
          this.tags = Object.assign({}, _Directives.defaultTags);
          this.atNextDocument = false;
        }
        const parts = line.trim().split(/[ \t]+/);
        const name = parts.shift();
        switch (name) {
          case "%TAG": {
            if (parts.length !== 2) {
              onError(0, "%TAG directive should contain exactly two parts");
              if (parts.length < 2)
                return false;
            }
            const [handle, prefix] = parts;
            this.tags[handle] = prefix;
            return true;
          }
          case "%YAML": {
            this.yaml.explicit = true;
            if (parts.length !== 1) {
              onError(0, "%YAML directive should contain exactly one part");
              return false;
            }
            const [version] = parts;
            if (version === "1.1" || version === "1.2") {
              this.yaml.version = version;
              return true;
            } else {
              const isValid = /^\d+\.\d+$/.test(version);
              onError(6, `Unsupported YAML version ${version}`, isValid);
              return false;
            }
          }
          default:
            onError(0, `Unknown directive ${name}`, true);
            return false;
        }
      }
      /**
       * Resolves a tag, matching handles to those defined in %TAG directives.
       *
       * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
       *   `'!local'` tag, or `null` if unresolvable.
       */
      tagName(source, onError) {
        if (source === "!")
          return "!";
        if (source[0] !== "!") {
          onError(`Not a valid tag: ${source}`);
          return null;
        }
        if (source[1] === "<") {
          const verbatim = source.slice(2, -1);
          if (verbatim === "!" || verbatim === "!!") {
            onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
            return null;
          }
          if (source[source.length - 1] !== ">")
            onError("Verbatim tags must end with a >");
          return verbatim;
        }
        const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
        if (!suffix)
          onError(`The ${source} tag has no suffix`);
        const prefix = this.tags[handle];
        if (prefix) {
          try {
            return prefix + decodeURIComponent(suffix);
          } catch (error) {
            onError(String(error));
            return null;
          }
        }
        if (handle === "!")
          return source;
        onError(`Could not resolve tag: ${source}`);
        return null;
      }
      /**
       * Given a fully resolved tag, returns its printable string form,
       * taking into account current tag prefixes and defaults.
       */
      tagString(tag) {
        for (const [handle, prefix] of Object.entries(this.tags)) {
          if (tag.startsWith(prefix))
            return handle + escapeTagName(tag.substring(prefix.length));
        }
        return tag[0] === "!" ? tag : `!<${tag}>`;
      }
      toString(doc) {
        const lines2 = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
        const tagEntries = Object.entries(this.tags);
        let tagNames;
        if (doc && tagEntries.length > 0 && identity.isNode(doc.contents)) {
          const tags = {};
          visit2.visit(doc.contents, (_key, node) => {
            if (identity.isNode(node) && node.tag)
              tags[node.tag] = true;
          });
          tagNames = Object.keys(tags);
        } else
          tagNames = [];
        for (const [handle, prefix] of tagEntries) {
          if (handle === "!!" && prefix === "tag:yaml.org,2002:")
            continue;
          if (!doc || tagNames.some((tn) => tn.startsWith(prefix)))
            lines2.push(`%TAG ${handle} ${prefix}`);
        }
        return lines2.join("\n");
      }
    };
    Directives.defaultYaml = { explicit: false, version: "1.2" };
    Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
    exports.Directives = Directives;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/doc/anchors.js
var require_anchors = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/doc/anchors.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit2 = require_visit();
    function anchorIsValid(anchor) {
      if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
        const sa = JSON.stringify(anchor);
        const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
        throw new Error(msg);
      }
      return true;
    }
    function anchorNames(root) {
      const anchors = /* @__PURE__ */ new Set();
      visit2.visit(root, {
        Value(_key, node) {
          if (node.anchor)
            anchors.add(node.anchor);
        }
      });
      return anchors;
    }
    function findNewAnchor(prefix, exclude) {
      for (let i = 1; true; ++i) {
        const name = `${prefix}${i}`;
        if (!exclude.has(name))
          return name;
      }
    }
    function createNodeAnchors(doc, prefix) {
      const aliasObjects = [];
      const sourceObjects = /* @__PURE__ */ new Map();
      let prevAnchors = null;
      return {
        onAnchor: (source) => {
          aliasObjects.push(source);
          prevAnchors ?? (prevAnchors = anchorNames(doc));
          const anchor = findNewAnchor(prefix, prevAnchors);
          prevAnchors.add(anchor);
          return anchor;
        },
        /**
         * With circular references, the source node is only resolved after all
         * of its child nodes are. This is why anchors are set only after all of
         * the nodes have been created.
         */
        setAnchors: () => {
          for (const source of aliasObjects) {
            const ref = sourceObjects.get(source);
            if (typeof ref === "object" && ref.anchor && (identity.isScalar(ref.node) || identity.isCollection(ref.node))) {
              ref.node.anchor = ref.anchor;
            } else {
              const error = new Error("Failed to resolve repeated object (this should not happen)");
              error.source = source;
              throw error;
            }
          }
        },
        sourceObjects
      };
    }
    exports.anchorIsValid = anchorIsValid;
    exports.anchorNames = anchorNames;
    exports.createNodeAnchors = createNodeAnchors;
    exports.findNewAnchor = findNewAnchor;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/doc/applyReviver.js
var require_applyReviver = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/doc/applyReviver.js"(exports) {
    "use strict";
    function applyReviver(reviver, obj, key, val) {
      if (val && typeof val === "object") {
        if (Array.isArray(val)) {
          for (let i = 0, len = val.length; i < len; ++i) {
            const v0 = val[i];
            const v1 = applyReviver(reviver, val, String(i), v0);
            if (v1 === void 0)
              delete val[i];
            else if (v1 !== v0)
              val[i] = v1;
          }
        } else if (val instanceof Map) {
          for (const k of Array.from(val.keys())) {
            const v0 = val.get(k);
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              val.delete(k);
            else if (v1 !== v0)
              val.set(k, v1);
          }
        } else if (val instanceof Set) {
          for (const v0 of Array.from(val)) {
            const v1 = applyReviver(reviver, val, v0, v0);
            if (v1 === void 0)
              val.delete(v0);
            else if (v1 !== v0) {
              val.delete(v0);
              val.add(v1);
            }
          }
        } else {
          for (const [k, v0] of Object.entries(val)) {
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              delete val[k];
            else if (v1 !== v0)
              val[k] = v1;
          }
        }
      }
      return reviver.call(obj, key, val);
    }
    exports.applyReviver = applyReviver;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/nodes/toJS.js
var require_toJS = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/nodes/toJS.js"(exports) {
    "use strict";
    var identity = require_identity();
    function toJS(value2, arg, ctx) {
      if (Array.isArray(value2))
        return value2.map((v, i) => toJS(v, String(i), ctx));
      if (value2 && typeof value2.toJSON === "function") {
        if (!ctx || !identity.hasAnchor(value2))
          return value2.toJSON(arg, ctx);
        const data = { aliasCount: 0, count: 1, res: void 0 };
        ctx.anchors.set(value2, data);
        ctx.onCreate = (res2) => {
          data.res = res2;
          delete ctx.onCreate;
        };
        const res = value2.toJSON(arg, ctx);
        if (ctx.onCreate)
          ctx.onCreate(res);
        return res;
      }
      if (typeof value2 === "bigint" && !ctx?.keep)
        return Number(value2);
      return value2;
    }
    exports.toJS = toJS;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/nodes/Node.js
var require_Node = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/nodes/Node.js"(exports) {
    "use strict";
    var applyReviver = require_applyReviver();
    var identity = require_identity();
    var toJS = require_toJS();
    var NodeBase = class {
      constructor(type) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: type });
      }
      /** Create a copy of this node.  */
      clone() {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** A plain JavaScript representation of this node. */
      toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        if (!identity.isDocument(doc))
          throw new TypeError("A document argument is required");
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc,
          keep: true,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this, "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
    };
    exports.NodeBase = NodeBase;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/nodes/Alias.js
var require_Alias = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/nodes/Alias.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var visit2 = require_visit();
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var Alias = class extends Node.NodeBase {
      constructor(source) {
        super(identity.ALIAS);
        this.source = source;
        Object.defineProperty(this, "tag", {
          set() {
            throw new Error("Alias nodes cannot have tags");
          }
        });
      }
      /**
       * Resolve the value of this alias within `doc`, finding the last
       * instance of the `source` anchor before this node.
       */
      resolve(doc, ctx) {
        let nodes;
        if (ctx?.aliasResolveCache) {
          nodes = ctx.aliasResolveCache;
        } else {
          nodes = [];
          visit2.visit(doc, {
            Node: (_key, node) => {
              if (identity.isAlias(node) || identity.hasAnchor(node))
                nodes.push(node);
            }
          });
          if (ctx)
            ctx.aliasResolveCache = nodes;
        }
        let found = void 0;
        for (const node of nodes) {
          if (node === this)
            break;
          if (node.anchor === this.source)
            found = node;
        }
        return found;
      }
      toJSON(_arg, ctx) {
        if (!ctx)
          return { source: this.source };
        const { anchors: anchors2, doc, maxAliasCount } = ctx;
        const source = this.resolve(doc, ctx);
        if (!source) {
          const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new ReferenceError(msg);
        }
        let data = anchors2.get(source);
        if (!data) {
          toJS.toJS(source, null, ctx);
          data = anchors2.get(source);
        }
        if (!data || data.res === void 0) {
          const msg = "This should not happen: Alias anchor was not resolved?";
          throw new ReferenceError(msg);
        }
        if (maxAliasCount >= 0) {
          data.count += 1;
          if (data.aliasCount === 0)
            data.aliasCount = getAliasCount(doc, source, anchors2);
          if (data.count * data.aliasCount > maxAliasCount) {
            const msg = "Excessive alias count indicates a resource exhaustion attack";
            throw new ReferenceError(msg);
          }
        }
        return data.res;
      }
      toString(ctx, _onComment, _onChompKeep) {
        const src = `*${this.source}`;
        if (ctx) {
          anchors.anchorIsValid(this.source);
          if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
            const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new Error(msg);
          }
          if (ctx.implicitKey)
            return `${src} `;
        }
        return src;
      }
    };
    function getAliasCount(doc, node, anchors2) {
      if (identity.isAlias(node)) {
        const source = node.resolve(doc);
        const anchor = anchors2 && source && anchors2.get(source);
        return anchor ? anchor.count * anchor.aliasCount : 0;
      } else if (identity.isCollection(node)) {
        let count = 0;
        for (const item of node.items) {
          const c = getAliasCount(doc, item, anchors2);
          if (c > count)
            count = c;
        }
        return count;
      } else if (identity.isPair(node)) {
        const kc = getAliasCount(doc, node.key, anchors2);
        const vc = getAliasCount(doc, node.value, anchors2);
        return Math.max(kc, vc);
      }
      return 1;
    }
    exports.Alias = Alias;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/nodes/Scalar.js
var require_Scalar = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/nodes/Scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var isScalarValue = (value2) => !value2 || typeof value2 !== "function" && typeof value2 !== "object";
    var Scalar = class extends Node.NodeBase {
      constructor(value2) {
        super(identity.SCALAR);
        this.value = value2;
      }
      toJSON(arg, ctx) {
        return ctx?.keep ? this.value : toJS.toJS(this.value, arg, ctx);
      }
      toString() {
        return String(this.value);
      }
    };
    Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
    Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
    Scalar.PLAIN = "PLAIN";
    Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
    Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
    exports.Scalar = Scalar;
    exports.isScalarValue = isScalarValue;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/doc/createNode.js
var require_createNode = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/doc/createNode.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var defaultTagPrefix = "tag:yaml.org,2002:";
    function findTagObject(value2, tagName, tags) {
      if (tagName) {
        const match = tags.filter((t) => t.tag === tagName);
        const tagObj = match.find((t) => !t.format) ?? match[0];
        if (!tagObj)
          throw new Error(`Tag ${tagName} not found`);
        return tagObj;
      }
      return tags.find((t) => t.identify?.(value2) && !t.format);
    }
    function createNode(value2, tagName, ctx) {
      if (identity.isDocument(value2))
        value2 = value2.contents;
      if (identity.isNode(value2))
        return value2;
      if (identity.isPair(value2)) {
        const map = ctx.schema[identity.MAP].createNode?.(ctx.schema, null, ctx);
        map.items.push(value2);
        return map;
      }
      if (value2 instanceof String || value2 instanceof Number || value2 instanceof Boolean || typeof BigInt !== "undefined" && value2 instanceof BigInt) {
        value2 = value2.valueOf();
      }
      const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
      let ref = void 0;
      if (aliasDuplicateObjects && value2 && typeof value2 === "object") {
        ref = sourceObjects.get(value2);
        if (ref) {
          ref.anchor ?? (ref.anchor = onAnchor(value2));
          return new Alias.Alias(ref.anchor);
        } else {
          ref = { anchor: null, node: null };
          sourceObjects.set(value2, ref);
        }
      }
      if (tagName?.startsWith("!!"))
        tagName = defaultTagPrefix + tagName.slice(2);
      let tagObj = findTagObject(value2, tagName, schema.tags);
      if (!tagObj) {
        if (value2 && typeof value2.toJSON === "function") {
          value2 = value2.toJSON();
        }
        if (!value2 || typeof value2 !== "object") {
          const node2 = new Scalar.Scalar(value2);
          if (ref)
            ref.node = node2;
          return node2;
        }
        tagObj = value2 instanceof Map ? schema[identity.MAP] : Symbol.iterator in Object(value2) ? schema[identity.SEQ] : schema[identity.MAP];
      }
      if (onTagObj) {
        onTagObj(tagObj);
        delete ctx.onTagObj;
      }
      const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value2, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value2, ctx) : new Scalar.Scalar(value2);
      if (tagName)
        node.tag = tagName;
      else if (!tagObj.default)
        node.tag = tagObj.tag;
      if (ref)
        ref.node = node;
      return node;
    }
    exports.createNode = createNode;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/nodes/Collection.js
var require_Collection = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/nodes/Collection.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var identity = require_identity();
    var Node = require_Node();
    function collectionFromPath(schema, path2, value2) {
      let v = value2;
      for (let i = path2.length - 1; i >= 0; --i) {
        const k = path2[i];
        if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
          const a = [];
          a[k] = v;
          v = a;
        } else {
          v = /* @__PURE__ */ new Map([[k, v]]);
        }
      }
      return createNode.createNode(v, void 0, {
        aliasDuplicateObjects: false,
        keepUndefined: false,
        onAnchor: () => {
          throw new Error("This should not happen, please report a bug.");
        },
        schema,
        sourceObjects: /* @__PURE__ */ new Map()
      });
    }
    var isEmptyPath = (path2) => path2 == null || typeof path2 === "object" && !!path2[Symbol.iterator]().next().done;
    var Collection = class extends Node.NodeBase {
      constructor(type, schema) {
        super(type);
        Object.defineProperty(this, "schema", {
          value: schema,
          configurable: true,
          enumerable: false,
          writable: true
        });
      }
      /**
       * Create a copy of this collection.
       *
       * @param schema - If defined, overwrites the original's schema
       */
      clone(schema) {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (schema)
          copy.schema = schema;
        copy.items = copy.items.map((it) => identity.isNode(it) || identity.isPair(it) ? it.clone(schema) : it);
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /**
       * Adds a value to the collection. For `!!map` and `!!omap` the value must
       * be a Pair instance or a `{ key, value }` object, which may not have a key
       * that already exists in the map.
       */
      addIn(path2, value2) {
        if (isEmptyPath(path2))
          this.add(value2);
        else {
          const [key, ...rest] = path2;
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.addIn(rest, value2);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value2));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
      /**
       * Removes a value from the collection.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path2) {
        const [key, ...rest] = path2;
        if (rest.length === 0)
          return this.delete(key);
        const node = this.get(key, true);
        if (identity.isCollection(node))
          return node.deleteIn(rest);
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path2, keepScalar) {
        const [key, ...rest] = path2;
        const node = this.get(key, true);
        if (rest.length === 0)
          return !keepScalar && identity.isScalar(node) ? node.value : node;
        else
          return identity.isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
      }
      hasAllNullValues(allowScalar) {
        return this.items.every((node) => {
          if (!identity.isPair(node))
            return false;
          const n = node.value;
          return n == null || allowScalar && identity.isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
        });
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       */
      hasIn(path2) {
        const [key, ...rest] = path2;
        if (rest.length === 0)
          return this.has(key);
        const node = this.get(key, true);
        return identity.isCollection(node) ? node.hasIn(rest) : false;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path2, value2) {
        const [key, ...rest] = path2;
        if (rest.length === 0) {
          this.set(key, value2);
        } else {
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.setIn(rest, value2);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value2));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
    };
    exports.Collection = Collection;
    exports.collectionFromPath = collectionFromPath;
    exports.isEmptyPath = isEmptyPath;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/stringify/stringifyComment.js
var require_stringifyComment = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/stringify/stringifyComment.js"(exports) {
    "use strict";
    var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
    function indentComment(comment, indent) {
      if (/^\n+$/.test(comment))
        return comment.substring(1);
      return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
    }
    var lineComment = (str, indent, comment) => str.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;
    exports.indentComment = indentComment;
    exports.lineComment = lineComment;
    exports.stringifyComment = stringifyComment;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/stringify/foldFlowLines.js
var require_foldFlowLines = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/stringify/foldFlowLines.js"(exports) {
    "use strict";
    var FOLD_FLOW = "flow";
    var FOLD_BLOCK = "block";
    var FOLD_QUOTED = "quoted";
    function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
      if (!lineWidth || lineWidth < 0)
        return text;
      if (lineWidth < minContentWidth)
        minContentWidth = 0;
      const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
      if (text.length <= endStep)
        return text;
      const folds = [];
      const escapedFolds = {};
      let end = lineWidth - indent.length;
      if (typeof indentAtStart === "number") {
        if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
          folds.push(0);
        else
          end = lineWidth - indentAtStart;
      }
      let split = void 0;
      let prev = void 0;
      let overflow = false;
      let i = -1;
      let escStart = -1;
      let escEnd = -1;
      if (mode === FOLD_BLOCK) {
        i = consumeMoreIndentedLines(text, i, indent.length);
        if (i !== -1)
          end = i + endStep;
      }
      for (let ch; ch = text[i += 1]; ) {
        if (mode === FOLD_QUOTED && ch === "\\") {
          escStart = i;
          switch (text[i + 1]) {
            case "x":
              i += 3;
              break;
            case "u":
              i += 5;
              break;
            case "U":
              i += 9;
              break;
            default:
              i += 1;
          }
          escEnd = i;
        }
        if (ch === "\n") {
          if (mode === FOLD_BLOCK)
            i = consumeMoreIndentedLines(text, i, indent.length);
          end = i + indent.length + endStep;
          split = void 0;
        } else {
          if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
            const next = text[i + 1];
            if (next && next !== " " && next !== "\n" && next !== "	")
              split = i;
          }
          if (i >= end) {
            if (split) {
              folds.push(split);
              end = split + endStep;
              split = void 0;
            } else if (mode === FOLD_QUOTED) {
              while (prev === " " || prev === "	") {
                prev = ch;
                ch = text[i += 1];
                overflow = true;
              }
              const j = i > escEnd + 1 ? i - 2 : escStart - 1;
              if (escapedFolds[j])
                return text;
              folds.push(j);
              escapedFolds[j] = true;
              end = j + endStep;
              split = void 0;
            } else {
              overflow = true;
            }
          }
        }
        prev = ch;
      }
      if (overflow && onOverflow)
        onOverflow();
      if (folds.length === 0)
        return text;
      if (onFold)
        onFold();
      let res = text.slice(0, folds[0]);
      for (let i2 = 0; i2 < folds.length; ++i2) {
        const fold = folds[i2];
        const end2 = folds[i2 + 1] || text.length;
        if (fold === 0)
          res = `
${indent}${text.slice(0, end2)}`;
        else {
          if (mode === FOLD_QUOTED && escapedFolds[fold])
            res += `${text[fold]}\\`;
          res += `
${indent}${text.slice(fold + 1, end2)}`;
        }
      }
      return res;
    }
    function consumeMoreIndentedLines(text, i, indent) {
      let end = i;
      let start = i + 1;
      let ch = text[start];
      while (ch === " " || ch === "	") {
        if (i < start + indent) {
          ch = text[++i];
        } else {
          do {
            ch = text[++i];
          } while (ch && ch !== "\n");
          end = i;
          start = i + 1;
          ch = text[start];
        }
      }
      return end;
    }
    exports.FOLD_BLOCK = FOLD_BLOCK;
    exports.FOLD_FLOW = FOLD_FLOW;
    exports.FOLD_QUOTED = FOLD_QUOTED;
    exports.foldFlowLines = foldFlowLines;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/stringify/stringifyString.js
var require_stringifyString = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/stringify/stringifyString.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var foldFlowLines = require_foldFlowLines();
    var getFoldOptions = (ctx, isBlock) => ({
      indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
      lineWidth: ctx.options.lineWidth,
      minContentWidth: ctx.options.minContentWidth
    });
    var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
    function lineLengthOverLimit(str, lineWidth, indentLength) {
      if (!lineWidth || lineWidth < 0)
        return false;
      const limit = lineWidth - indentLength;
      const strLen = str.length;
      if (strLen <= limit)
        return false;
      for (let i = 0, start = 0; i < strLen; ++i) {
        if (str[i] === "\n") {
          if (i - start > limit)
            return true;
          start = i + 1;
          if (strLen - start <= limit)
            return false;
        }
      }
      return true;
    }
    function doubleQuotedString(value2, ctx) {
      const json = JSON.stringify(value2);
      if (ctx.options.doubleQuotedAsJSON)
        return json;
      const { implicitKey } = ctx;
      const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
      const indent = ctx.indent || (containsDocumentMarker(value2) ? "  " : "");
      let str = "";
      let start = 0;
      for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
        if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
          str += json.slice(start, i) + "\\ ";
          i += 1;
          start = i;
          ch = "\\";
        }
        if (ch === "\\")
          switch (json[i + 1]) {
            case "u":
              {
                str += json.slice(start, i);
                const code = json.substr(i + 2, 4);
                switch (code) {
                  case "0000":
                    str += "\\0";
                    break;
                  case "0007":
                    str += "\\a";
                    break;
                  case "000b":
                    str += "\\v";
                    break;
                  case "001b":
                    str += "\\e";
                    break;
                  case "0085":
                    str += "\\N";
                    break;
                  case "00a0":
                    str += "\\_";
                    break;
                  case "2028":
                    str += "\\L";
                    break;
                  case "2029":
                    str += "\\P";
                    break;
                  default:
                    if (code.substr(0, 2) === "00")
                      str += "\\x" + code.substr(2);
                    else
                      str += json.substr(i, 6);
                }
                i += 5;
                start = i + 1;
              }
              break;
            case "n":
              if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
                i += 1;
              } else {
                str += json.slice(start, i) + "\n\n";
                while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
                  str += "\n";
                  i += 2;
                }
                str += indent;
                if (json[i + 2] === " ")
                  str += "\\";
                i += 1;
                start = i + 1;
              }
              break;
            default:
              i += 1;
          }
      }
      str = start ? str + json.slice(start) : json;
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx, false));
    }
    function singleQuotedString(value2, ctx) {
      if (ctx.options.singleQuote === false || ctx.implicitKey && value2.includes("\n") || /[ \t]\n|\n[ \t]/.test(value2))
        return doubleQuotedString(value2, ctx);
      const indent = ctx.indent || (containsDocumentMarker(value2) ? "  " : "");
      const res = "'" + value2.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
      return ctx.implicitKey ? res : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function quotedString(value2, ctx) {
      const { singleQuote } = ctx.options;
      let qs;
      if (singleQuote === false)
        qs = doubleQuotedString;
      else {
        const hasDouble = value2.includes('"');
        const hasSingle = value2.includes("'");
        if (hasDouble && !hasSingle)
          qs = singleQuotedString;
        else if (hasSingle && !hasDouble)
          qs = doubleQuotedString;
        else
          qs = singleQuote ? singleQuotedString : doubleQuotedString;
      }
      return qs(value2, ctx);
    }
    var blockEndNewlines;
    try {
      blockEndNewlines = new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
    } catch {
      blockEndNewlines = /\n+(?!\n|$)/g;
    }
    function blockString({ comment, type, value: value2 }, ctx, onComment, onChompKeep) {
      const { blockQuote, commentString, lineWidth } = ctx.options;
      if (!blockQuote || /\n[\t ]+$/.test(value2)) {
        return quotedString(value2, ctx);
      }
      const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value2) ? "  " : "");
      const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.Scalar.BLOCK_FOLDED ? false : type === Scalar.Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value2, lineWidth, indent.length);
      if (!value2)
        return literal ? "|\n" : ">\n";
      let chomp;
      let endStart;
      for (endStart = value2.length; endStart > 0; --endStart) {
        const ch = value2[endStart - 1];
        if (ch !== "\n" && ch !== "	" && ch !== " ")
          break;
      }
      let end = value2.substring(endStart);
      const endNlPos = end.indexOf("\n");
      if (endNlPos === -1) {
        chomp = "-";
      } else if (value2 === end || endNlPos !== end.length - 1) {
        chomp = "+";
        if (onChompKeep)
          onChompKeep();
      } else {
        chomp = "";
      }
      if (end) {
        value2 = value2.slice(0, -end.length);
        if (end[end.length - 1] === "\n")
          end = end.slice(0, -1);
        end = end.replace(blockEndNewlines, `$&${indent}`);
      }
      let startWithSpace = false;
      let startEnd;
      let startNlPos = -1;
      for (startEnd = 0; startEnd < value2.length; ++startEnd) {
        const ch = value2[startEnd];
        if (ch === " ")
          startWithSpace = true;
        else if (ch === "\n")
          startNlPos = startEnd;
        else
          break;
      }
      let start = value2.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
      if (start) {
        value2 = value2.substring(start.length);
        start = start.replace(/\n+/g, `$&${indent}`);
      }
      const indentSize = indent ? "2" : "1";
      let header = (startWithSpace ? indentSize : "") + chomp;
      if (comment) {
        header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
        if (onComment)
          onComment();
      }
      if (!literal) {
        const foldedValue = value2.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
        let literalFallback = false;
        const foldOptions = getFoldOptions(ctx, true);
        if (blockQuote !== "folded" && type !== Scalar.Scalar.BLOCK_FOLDED) {
          foldOptions.onOverflow = () => {
            literalFallback = true;
          };
        }
        const body = foldFlowLines.foldFlowLines(`${start}${foldedValue}${end}`, indent, foldFlowLines.FOLD_BLOCK, foldOptions);
        if (!literalFallback)
          return `>${header}
${indent}${body}`;
      }
      value2 = value2.replace(/\n+/g, `$&${indent}`);
      return `|${header}
${indent}${start}${value2}${end}`;
    }
    function plainString(item, ctx, onComment, onChompKeep) {
      const { type, value: value2 } = item;
      const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
      if (implicitKey && value2.includes("\n") || inFlow && /[[\]{},]/.test(value2)) {
        return quotedString(value2, ctx);
      }
      if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value2)) {
        return implicitKey || inFlow || !value2.includes("\n") ? quotedString(value2, ctx) : blockString(item, ctx, onComment, onChompKeep);
      }
      if (!implicitKey && !inFlow && type !== Scalar.Scalar.PLAIN && value2.includes("\n")) {
        return blockString(item, ctx, onComment, onChompKeep);
      }
      if (containsDocumentMarker(value2)) {
        if (indent === "") {
          ctx.forceBlockIndent = true;
          return blockString(item, ctx, onComment, onChompKeep);
        } else if (implicitKey && indent === indentStep) {
          return quotedString(value2, ctx);
        }
      }
      const str = value2.replace(/\n+/g, `$&
${indent}`);
      if (actualString) {
        const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str);
        const { compat, tags } = ctx.doc.schema;
        if (tags.some(test) || compat?.some(test))
          return quotedString(value2, ctx);
      }
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function stringifyString(item, ctx, onComment, onChompKeep) {
      const { implicitKey, inFlow } = ctx;
      const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
      let { type } = item;
      if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
        if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
          type = Scalar.Scalar.QUOTE_DOUBLE;
      }
      const _stringify = (_type) => {
        switch (_type) {
          case Scalar.Scalar.BLOCK_FOLDED:
          case Scalar.Scalar.BLOCK_LITERAL:
            return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
          case Scalar.Scalar.QUOTE_DOUBLE:
            return doubleQuotedString(ss.value, ctx);
          case Scalar.Scalar.QUOTE_SINGLE:
            return singleQuotedString(ss.value, ctx);
          case Scalar.Scalar.PLAIN:
            return plainString(ss, ctx, onComment, onChompKeep);
          default:
            return null;
        }
      };
      let res = _stringify(type);
      if (res === null) {
        const { defaultKeyType, defaultStringType } = ctx.options;
        const t = implicitKey && defaultKeyType || defaultStringType;
        res = _stringify(t);
        if (res === null)
          throw new Error(`Unsupported default string type ${t}`);
      }
      return res;
    }
    exports.stringifyString = stringifyString;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/stringify/stringify.js
var require_stringify = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/stringify/stringify.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var identity = require_identity();
    var stringifyComment = require_stringifyComment();
    var stringifyString = require_stringifyString();
    function createStringifyContext(doc, options) {
      const opt = Object.assign({
        blockQuote: true,
        commentString: stringifyComment.stringifyComment,
        defaultKeyType: null,
        defaultStringType: "PLAIN",
        directives: null,
        doubleQuotedAsJSON: false,
        doubleQuotedMinMultiLineLength: 40,
        falseStr: "false",
        flowCollectionPadding: true,
        indentSeq: true,
        lineWidth: 80,
        minContentWidth: 20,
        nullStr: "null",
        simpleKeys: false,
        singleQuote: null,
        trueStr: "true",
        verifyAliasOrder: true
      }, doc.schema.toStringOptions, options);
      let inFlow;
      switch (opt.collectionStyle) {
        case "block":
          inFlow = false;
          break;
        case "flow":
          inFlow = true;
          break;
        default:
          inFlow = null;
      }
      return {
        anchors: /* @__PURE__ */ new Set(),
        doc,
        flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
        indent: "",
        indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
        inFlow,
        options: opt
      };
    }
    function getTagObject(tags, item) {
      if (item.tag) {
        const match = tags.filter((t) => t.tag === item.tag);
        if (match.length > 0)
          return match.find((t) => t.format === item.format) ?? match[0];
      }
      let tagObj = void 0;
      let obj;
      if (identity.isScalar(item)) {
        obj = item.value;
        let match = tags.filter((t) => t.identify?.(obj));
        if (match.length > 1) {
          const testMatch = match.filter((t) => t.test);
          if (testMatch.length > 0)
            match = testMatch;
        }
        tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
      } else {
        obj = item;
        tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
      }
      if (!tagObj) {
        const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
        throw new Error(`Tag not resolved for ${name} value`);
      }
      return tagObj;
    }
    function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
      if (!doc.directives)
        return "";
      const props = [];
      const anchor = (identity.isScalar(node) || identity.isCollection(node)) && node.anchor;
      if (anchor && anchors.anchorIsValid(anchor)) {
        anchors$1.add(anchor);
        props.push(`&${anchor}`);
      }
      const tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
      if (tag)
        props.push(doc.directives.tagString(tag));
      return props.join(" ");
    }
    function stringify(item, ctx, onComment, onChompKeep) {
      if (identity.isPair(item))
        return item.toString(ctx, onComment, onChompKeep);
      if (identity.isAlias(item)) {
        if (ctx.doc.directives)
          return item.toString(ctx);
        if (ctx.resolvedAliases?.has(item)) {
          throw new TypeError(`Cannot stringify circular structure without alias nodes`);
        } else {
          if (ctx.resolvedAliases)
            ctx.resolvedAliases.add(item);
          else
            ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
          item = item.resolve(ctx.doc);
        }
      }
      let tagObj = void 0;
      const node = identity.isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
      tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
      const props = stringifyProps(node, tagObj, ctx);
      if (props.length > 0)
        ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
      const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : identity.isScalar(node) ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
      if (!props)
        return str;
      return identity.isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
    }
    exports.createStringifyContext = createStringifyContext;
    exports.stringify = stringify;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/stringify/stringifyPair.js
var require_stringifyPair = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/stringify/stringifyPair.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyPair({ key, value: value2 }, ctx, onComment, onChompKeep) {
      const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
      let keyComment = identity.isNode(key) && key.comment || null;
      if (simpleKeys) {
        if (keyComment) {
          throw new Error("With simple keys, key nodes cannot have comments");
        }
        if (identity.isCollection(key) || !identity.isNode(key) && typeof key === "object") {
          const msg = "With simple keys, collection cannot be used as a key value";
          throw new Error(msg);
        }
      }
      let explicitKey = !simpleKeys && (!key || keyComment && value2 == null && !ctx.inFlow || identity.isCollection(key) || (identity.isScalar(key) ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL : typeof key === "object"));
      ctx = Object.assign({}, ctx, {
        allNullValues: false,
        implicitKey: !explicitKey && (simpleKeys || !allNullValues),
        indent: indent + indentStep
      });
      let keyCommentDone = false;
      let chompKeep = false;
      let str = stringify.stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
      if (!explicitKey && !ctx.inFlow && str.length > 1024) {
        if (simpleKeys)
          throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
        explicitKey = true;
      }
      if (ctx.inFlow) {
        if (allNullValues || value2 == null) {
          if (keyCommentDone && onComment)
            onComment();
          return str === "" ? "?" : explicitKey ? `? ${str}` : str;
        }
      } else if (allNullValues && !simpleKeys || value2 == null && explicitKey) {
        str = `? ${str}`;
        if (keyComment && !keyCommentDone) {
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        } else if (chompKeep && onChompKeep)
          onChompKeep();
        return str;
      }
      if (keyCommentDone)
        keyComment = null;
      if (explicitKey) {
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        str = `? ${str}
${indent}:`;
      } else {
        str = `${str}:`;
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
      }
      let vsb, vcb, valueComment;
      if (identity.isNode(value2)) {
        vsb = !!value2.spaceBefore;
        vcb = value2.commentBefore;
        valueComment = value2.comment;
      } else {
        vsb = false;
        vcb = null;
        valueComment = null;
        if (value2 && typeof value2 === "object")
          value2 = doc.createNode(value2);
      }
      ctx.implicitKey = false;
      if (!explicitKey && !keyComment && identity.isScalar(value2))
        ctx.indentAtStart = str.length + 1;
      chompKeep = false;
      if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && identity.isSeq(value2) && !value2.flow && !value2.tag && !value2.anchor) {
        ctx.indent = ctx.indent.substring(2);
      }
      let valueCommentDone = false;
      const valueStr = stringify.stringify(value2, ctx, () => valueCommentDone = true, () => chompKeep = true);
      let ws = " ";
      if (keyComment || vsb || vcb) {
        ws = vsb ? "\n" : "";
        if (vcb) {
          const cs = commentString(vcb);
          ws += `
${stringifyComment.indentComment(cs, ctx.indent)}`;
        }
        if (valueStr === "" && !ctx.inFlow) {
          if (ws === "\n")
            ws = "\n\n";
        } else {
          ws += `
${ctx.indent}`;
        }
      } else if (!explicitKey && identity.isCollection(value2)) {
        const vs0 = valueStr[0];
        const nl0 = valueStr.indexOf("\n");
        const hasNewline = nl0 !== -1;
        const flow = ctx.inFlow ?? value2.flow ?? value2.items.length === 0;
        if (hasNewline || !flow) {
          let hasPropsLine = false;
          if (hasNewline && (vs0 === "&" || vs0 === "!")) {
            let sp0 = valueStr.indexOf(" ");
            if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
              sp0 = valueStr.indexOf(" ", sp0 + 1);
            }
            if (sp0 === -1 || nl0 < sp0)
              hasPropsLine = true;
          }
          if (!hasPropsLine)
            ws = `
${ctx.indent}`;
        }
      } else if (valueStr === "" || valueStr[0] === "\n") {
        ws = "";
      }
      str += ws + valueStr;
      if (ctx.inFlow) {
        if (valueCommentDone && onComment)
          onComment();
      } else if (valueComment && !valueCommentDone) {
        str += stringifyComment.lineComment(str, ctx.indent, commentString(valueComment));
      } else if (chompKeep && onChompKeep) {
        onChompKeep();
      }
      return str;
    }
    exports.stringifyPair = stringifyPair;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/log.js
var require_log = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/log.js"(exports) {
    "use strict";
    var node_process = __require("process");
    function debug(logLevel, ...messages) {
      if (logLevel === "debug")
        console.log(...messages);
    }
    function warn(logLevel, warning) {
      if (logLevel === "debug" || logLevel === "warn") {
        if (typeof node_process.emitWarning === "function")
          node_process.emitWarning(warning);
        else
          console.warn(warning);
      }
    }
    exports.debug = debug;
    exports.warn = warn;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/yaml-1.1/merge.js
var require_merge = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/yaml-1.1/merge.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var MERGE_KEY = "<<";
    var merge = {
      identify: (value2) => value2 === MERGE_KEY || typeof value2 === "symbol" && value2.description === MERGE_KEY,
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () => Object.assign(new Scalar.Scalar(Symbol(MERGE_KEY)), {
        addToJSMap: addMergeToJSMap
      }),
      stringify: () => MERGE_KEY
    };
    var isMergeKey = (ctx, key) => (merge.identify(key) || identity.isScalar(key) && (!key.type || key.type === Scalar.Scalar.PLAIN) && merge.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default);
    function addMergeToJSMap(ctx, map, value2) {
      value2 = ctx && identity.isAlias(value2) ? value2.resolve(ctx.doc) : value2;
      if (identity.isSeq(value2))
        for (const it of value2.items)
          mergeValue(ctx, map, it);
      else if (Array.isArray(value2))
        for (const it of value2)
          mergeValue(ctx, map, it);
      else
        mergeValue(ctx, map, value2);
    }
    function mergeValue(ctx, map, value2) {
      const source = ctx && identity.isAlias(value2) ? value2.resolve(ctx.doc) : value2;
      if (!identity.isMap(source))
        throw new Error("Merge sources must be maps or map aliases");
      const srcMap = source.toJSON(null, ctx, Map);
      for (const [key, value3] of srcMap) {
        if (map instanceof Map) {
          if (!map.has(key))
            map.set(key, value3);
        } else if (map instanceof Set) {
          map.add(key);
        } else if (!Object.prototype.hasOwnProperty.call(map, key)) {
          Object.defineProperty(map, key, {
            value: value3,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      }
      return map;
    }
    exports.addMergeToJSMap = addMergeToJSMap;
    exports.isMergeKey = isMergeKey;
    exports.merge = merge;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/nodes/addPairToJSMap.js
var require_addPairToJSMap = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/nodes/addPairToJSMap.js"(exports) {
    "use strict";
    var log = require_log();
    var merge = require_merge();
    var stringify = require_stringify();
    var identity = require_identity();
    var toJS = require_toJS();
    function addPairToJSMap(ctx, map, { key, value: value2 }) {
      if (identity.isNode(key) && key.addToJSMap)
        key.addToJSMap(ctx, map, value2);
      else if (merge.isMergeKey(ctx, key))
        merge.addMergeToJSMap(ctx, map, value2);
      else {
        const jsKey = toJS.toJS(key, "", ctx);
        if (map instanceof Map) {
          map.set(jsKey, toJS.toJS(value2, jsKey, ctx));
        } else if (map instanceof Set) {
          map.add(jsKey);
        } else {
          const stringKey = stringifyKey(key, jsKey, ctx);
          const jsValue = toJS.toJS(value2, stringKey, ctx);
          if (stringKey in map)
            Object.defineProperty(map, stringKey, {
              value: jsValue,
              writable: true,
              enumerable: true,
              configurable: true
            });
          else
            map[stringKey] = jsValue;
        }
      }
      return map;
    }
    function stringifyKey(key, jsKey, ctx) {
      if (jsKey === null)
        return "";
      if (typeof jsKey !== "object")
        return String(jsKey);
      if (identity.isNode(key) && ctx?.doc) {
        const strCtx = stringify.createStringifyContext(ctx.doc, {});
        strCtx.anchors = /* @__PURE__ */ new Set();
        for (const node of ctx.anchors.keys())
          strCtx.anchors.add(node.anchor);
        strCtx.inFlow = true;
        strCtx.inStringifyKey = true;
        const strKey = key.toString(strCtx);
        if (!ctx.mapKeyWarned) {
          let jsonStr = JSON.stringify(strKey);
          if (jsonStr.length > 40)
            jsonStr = jsonStr.substring(0, 36) + '..."';
          log.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
          ctx.mapKeyWarned = true;
        }
        return strKey;
      }
      return JSON.stringify(jsKey);
    }
    exports.addPairToJSMap = addPairToJSMap;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/nodes/Pair.js
var require_Pair = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/nodes/Pair.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyPair = require_stringifyPair();
    var addPairToJSMap = require_addPairToJSMap();
    var identity = require_identity();
    function createPair(key, value2, ctx) {
      const k = createNode.createNode(key, void 0, ctx);
      const v = createNode.createNode(value2, void 0, ctx);
      return new Pair(k, v);
    }
    var Pair = class _Pair {
      constructor(key, value2 = null) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.PAIR });
        this.key = key;
        this.value = value2;
      }
      clone(schema) {
        let { key, value: value2 } = this;
        if (identity.isNode(key))
          key = key.clone(schema);
        if (identity.isNode(value2))
          value2 = value2.clone(schema);
        return new _Pair(key, value2);
      }
      toJSON(_, ctx) {
        const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        return addPairToJSMap.addPairToJSMap(ctx, pair, this);
      }
      toString(ctx, onComment, onChompKeep) {
        return ctx?.doc ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
      }
    };
    exports.Pair = Pair;
    exports.createPair = createPair;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/stringify/stringifyCollection.js
var require_stringifyCollection = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/stringify/stringifyCollection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyCollection(collection, ctx, options) {
      const flow = ctx.inFlow ?? collection.flow;
      const stringify2 = flow ? stringifyFlowCollection : stringifyBlockCollection;
      return stringify2(collection, ctx, options);
    }
    function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
      const { indent, options: { commentString } } = ctx;
      const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
      let chompKeep = false;
      const lines2 = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment2 = null;
        if (identity.isNode(item)) {
          if (!chompKeep && item.spaceBefore)
            lines2.push("");
          addCommentBefore(ctx, lines2, item.commentBefore, chompKeep);
          if (item.comment)
            comment2 = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (!chompKeep && ik.spaceBefore)
              lines2.push("");
            addCommentBefore(ctx, lines2, ik.commentBefore, chompKeep);
          }
        }
        chompKeep = false;
        let str2 = stringify.stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
        if (comment2)
          str2 += stringifyComment.lineComment(str2, itemIndent, commentString(comment2));
        if (chompKeep && comment2)
          chompKeep = false;
        lines2.push(blockItemPrefix + str2);
      }
      let str;
      if (lines2.length === 0) {
        str = flowChars.start + flowChars.end;
      } else {
        str = lines2[0];
        for (let i = 1; i < lines2.length; ++i) {
          const line = lines2[i];
          str += line ? `
${indent}${line}` : "\n";
        }
      }
      if (comment) {
        str += "\n" + stringifyComment.indentComment(commentString(comment), indent);
        if (onComment)
          onComment();
      } else if (chompKeep && onChompKeep)
        onChompKeep();
      return str;
    }
    function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
      const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
      itemIndent += indentStep;
      const itemCtx = Object.assign({}, ctx, {
        indent: itemIndent,
        inFlow: true,
        type: null
      });
      let reqNewline = false;
      let linesAtValue = 0;
      const lines2 = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment = null;
        if (identity.isNode(item)) {
          if (item.spaceBefore)
            lines2.push("");
          addCommentBefore(ctx, lines2, item.commentBefore, false);
          if (item.comment)
            comment = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (ik.spaceBefore)
              lines2.push("");
            addCommentBefore(ctx, lines2, ik.commentBefore, false);
            if (ik.comment)
              reqNewline = true;
          }
          const iv = identity.isNode(item.value) ? item.value : null;
          if (iv) {
            if (iv.comment)
              comment = iv.comment;
            if (iv.commentBefore)
              reqNewline = true;
          } else if (item.value == null && ik?.comment) {
            comment = ik.comment;
          }
        }
        if (comment)
          reqNewline = true;
        let str = stringify.stringify(item, itemCtx, () => comment = null);
        if (i < items.length - 1)
          str += ",";
        if (comment)
          str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
        if (!reqNewline && (lines2.length > linesAtValue || str.includes("\n")))
          reqNewline = true;
        lines2.push(str);
        linesAtValue = lines2.length;
      }
      const { start, end } = flowChars;
      if (lines2.length === 0) {
        return start + end;
      } else {
        if (!reqNewline) {
          const len = lines2.reduce((sum, line) => sum + line.length + 2, 2);
          reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
        }
        if (reqNewline) {
          let str = start;
          for (const line of lines2)
            str += line ? `
${indentStep}${indent}${line}` : "\n";
          return `${str}
${indent}${end}`;
        } else {
          return `${start}${fcPadding}${lines2.join(" ")}${fcPadding}${end}`;
        }
      }
    }
    function addCommentBefore({ indent, options: { commentString } }, lines2, comment, chompKeep) {
      if (comment && chompKeep)
        comment = comment.replace(/^\n+/, "");
      if (comment) {
        const ic = stringifyComment.indentComment(commentString(comment), indent);
        lines2.push(ic.trimStart());
      }
    }
    exports.stringifyCollection = stringifyCollection;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/nodes/YAMLMap.js
var require_YAMLMap = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/nodes/YAMLMap.js"(exports) {
    "use strict";
    var stringifyCollection = require_stringifyCollection();
    var addPairToJSMap = require_addPairToJSMap();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    function findPair(items, key) {
      const k = identity.isScalar(key) ? key.value : key;
      for (const it of items) {
        if (identity.isPair(it)) {
          if (it.key === key || it.key === k)
            return it;
          if (identity.isScalar(it.key) && it.key.value === k)
            return it;
        }
      }
      return void 0;
    }
    var YAMLMap = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:map";
      }
      constructor(schema) {
        super(identity.MAP, schema);
        this.items = [];
      }
      /**
       * A generic collection parsing method that can be extended
       * to other node classes that inherit from YAMLMap
       */
      static from(schema, obj, ctx) {
        const { keepUndefined, replacer } = ctx;
        const map = new this(schema);
        const add = (key, value2) => {
          if (typeof replacer === "function")
            value2 = replacer.call(obj, key, value2);
          else if (Array.isArray(replacer) && !replacer.includes(key))
            return;
          if (value2 !== void 0 || keepUndefined)
            map.items.push(Pair.createPair(key, value2, ctx));
        };
        if (obj instanceof Map) {
          for (const [key, value2] of obj)
            add(key, value2);
        } else if (obj && typeof obj === "object") {
          for (const key of Object.keys(obj))
            add(key, obj[key]);
        }
        if (typeof schema.sortMapEntries === "function") {
          map.items.sort(schema.sortMapEntries);
        }
        return map;
      }
      /**
       * Adds a value to the collection.
       *
       * @param overwrite - If not set `true`, using a key that is already in the
       *   collection will throw. Otherwise, overwrites the previous value.
       */
      add(pair, overwrite) {
        let _pair;
        if (identity.isPair(pair))
          _pair = pair;
        else if (!pair || typeof pair !== "object" || !("key" in pair)) {
          _pair = new Pair.Pair(pair, pair?.value);
        } else
          _pair = new Pair.Pair(pair.key, pair.value);
        const prev = findPair(this.items, _pair.key);
        const sortEntries = this.schema?.sortMapEntries;
        if (prev) {
          if (!overwrite)
            throw new Error(`Key ${_pair.key} already set`);
          if (identity.isScalar(prev.value) && Scalar.isScalarValue(_pair.value))
            prev.value.value = _pair.value;
          else
            prev.value = _pair.value;
        } else if (sortEntries) {
          const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
          if (i === -1)
            this.items.push(_pair);
          else
            this.items.splice(i, 0, _pair);
        } else {
          this.items.push(_pair);
        }
      }
      delete(key) {
        const it = findPair(this.items, key);
        if (!it)
          return false;
        const del = this.items.splice(this.items.indexOf(it), 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const it = findPair(this.items, key);
        const node = it?.value;
        return (!keepScalar && identity.isScalar(node) ? node.value : node) ?? void 0;
      }
      has(key) {
        return !!findPair(this.items, key);
      }
      set(key, value2) {
        this.add(new Pair.Pair(key, value2), true);
      }
      /**
       * @param ctx - Conversion context, originally set in Document#toJS()
       * @param {Class} Type - If set, forces the returned collection type
       * @returns Instance of Type, Map, or Object
       */
      toJSON(_, ctx, Type) {
        const map = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const item of this.items)
          addPairToJSMap.addPairToJSMap(ctx, map, item);
        return map;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        for (const item of this.items) {
          if (!identity.isPair(item))
            throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
        }
        if (!ctx.allNullValues && this.hasAllNullValues(false))
          ctx = Object.assign({}, ctx, { allNullValues: true });
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "",
          flowChars: { start: "{", end: "}" },
          itemIndent: ctx.indent || "",
          onChompKeep,
          onComment
        });
      }
    };
    exports.YAMLMap = YAMLMap;
    exports.findPair = findPair;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/common/map.js
var require_map = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/common/map.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLMap = require_YAMLMap();
    var map = {
      collection: "map",
      default: true,
      nodeClass: YAMLMap.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(map2, onError) {
        if (!identity.isMap(map2))
          onError("Expected a mapping for this tag");
        return map2;
      },
      createNode: (schema, obj, ctx) => YAMLMap.YAMLMap.from(schema, obj, ctx)
    };
    exports.map = map;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/nodes/YAMLSeq.js
var require_YAMLSeq = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/nodes/YAMLSeq.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyCollection = require_stringifyCollection();
    var Collection = require_Collection();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var toJS = require_toJS();
    var YAMLSeq = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:seq";
      }
      constructor(schema) {
        super(identity.SEQ, schema);
        this.items = [];
      }
      add(value2) {
        this.items.push(value2);
      }
      /**
       * Removes a value from the collection.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       *
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return false;
        const del = this.items.splice(idx, 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return void 0;
        const it = this.items[idx];
        return !keepScalar && identity.isScalar(it) ? it.value : it;
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       */
      has(key) {
        const idx = asItemIndex(key);
        return typeof idx === "number" && idx < this.items.length;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       *
       * If `key` does not contain a representation of an integer, this will throw.
       * It may be wrapped in a `Scalar`.
       */
      set(key, value2) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          throw new Error(`Expected a valid index, not ${key}.`);
        const prev = this.items[idx];
        if (identity.isScalar(prev) && Scalar.isScalarValue(value2))
          prev.value = value2;
        else
          this.items[idx] = value2;
      }
      toJSON(_, ctx) {
        const seq = [];
        if (ctx?.onCreate)
          ctx.onCreate(seq);
        let i = 0;
        for (const item of this.items)
          seq.push(toJS.toJS(item, String(i++), ctx));
        return seq;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "- ",
          flowChars: { start: "[", end: "]" },
          itemIndent: (ctx.indent || "") + "  ",
          onChompKeep,
          onComment
        });
      }
      static from(schema, obj, ctx) {
        const { replacer } = ctx;
        const seq = new this(schema);
        if (obj && Symbol.iterator in Object(obj)) {
          let i = 0;
          for (let it of obj) {
            if (typeof replacer === "function") {
              const key = obj instanceof Set ? it : String(i++);
              it = replacer.call(obj, key, it);
            }
            seq.items.push(createNode.createNode(it, void 0, ctx));
          }
        }
        return seq;
      }
    };
    function asItemIndex(key) {
      let idx = identity.isScalar(key) ? key.value : key;
      if (idx && typeof idx === "string")
        idx = Number(idx);
      return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
    }
    exports.YAMLSeq = YAMLSeq;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/common/seq.js
var require_seq = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/common/seq.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLSeq = require_YAMLSeq();
    var seq = {
      collection: "seq",
      default: true,
      nodeClass: YAMLSeq.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(seq2, onError) {
        if (!identity.isSeq(seq2))
          onError("Expected a sequence for this tag");
        return seq2;
      },
      createNode: (schema, obj, ctx) => YAMLSeq.YAMLSeq.from(schema, obj, ctx)
    };
    exports.seq = seq;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/common/string.js
var require_string = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/common/string.js"(exports) {
    "use strict";
    var stringifyString = require_stringifyString();
    var string = {
      identify: (value2) => typeof value2 === "string",
      default: true,
      tag: "tag:yaml.org,2002:str",
      resolve: (str) => str,
      stringify(item, ctx, onComment, onChompKeep) {
        ctx = Object.assign({ actualString: true }, ctx);
        return stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
      }
    };
    exports.string = string;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/common/null.js
var require_null = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/common/null.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var nullTag = {
      identify: (value2) => value2 == null,
      createNode: () => new Scalar.Scalar(null),
      default: true,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new Scalar.Scalar(null),
      stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
    };
    exports.nullTag = nullTag;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/core/bool.js
var require_bool = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/core/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var boolTag = {
      identify: (value2) => typeof value2 === "boolean",
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (str) => new Scalar.Scalar(str[0] === "t" || str[0] === "T"),
      stringify({ source, value: value2 }, ctx) {
        if (source && boolTag.test.test(source)) {
          const sv = source[0] === "t" || source[0] === "T";
          if (value2 === sv)
            return source;
        }
        return value2 ? ctx.options.trueStr : ctx.options.falseStr;
      }
    };
    exports.boolTag = boolTag;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/stringify/stringifyNumber.js
var require_stringifyNumber = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/stringify/stringifyNumber.js"(exports) {
    "use strict";
    function stringifyNumber({ format: format2, minFractionDigits, tag, value: value2 }) {
      if (typeof value2 === "bigint")
        return String(value2);
      const num = typeof value2 === "number" ? value2 : Number(value2);
      if (!isFinite(num))
        return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
      let n = JSON.stringify(value2);
      if (!format2 && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^\d/.test(n)) {
        let i = n.indexOf(".");
        if (i < 0) {
          i = n.length;
          n += ".";
        }
        let d = minFractionDigits - (n.length - i - 1);
        while (d-- > 0)
          n += "0";
      }
      return n;
    }
    exports.stringifyNumber = stringifyNumber;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/core/float.js
var require_float = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/core/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value2) => typeof value2 === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value2) => typeof value2 === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value2) => typeof value2 === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str));
        const dot = str.indexOf(".");
        if (dot !== -1 && str[str.length - 1] === "0")
          node.minFractionDigits = str.length - dot - 1;
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/core/int.js
var require_int = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/core/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value2) => typeof value2 === "bigint" || Number.isInteger(value2);
    var intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
    function intStringify(node, radix, prefix) {
      const { value: value2 } = node;
      if (intIdentify(value2) && value2 >= 0)
        return prefix + value2.toString(radix);
      return stringifyNumber.stringifyNumber(node);
    }
    var intOct = {
      identify: (value2) => intIdentify(value2) && value2 >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
      stringify: (node) => intStringify(node, 8, "0o")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: (value2) => intIdentify(value2) && value2 >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/core/schema.js
var require_schema = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/core/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.boolTag,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float
    ];
    exports.schema = schema;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/json/schema.js
var require_schema2 = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/json/schema.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var map = require_map();
    var seq = require_seq();
    function intIdentify(value2) {
      return typeof value2 === "bigint" || Number.isInteger(value2);
    }
    var stringifyJSON = ({ value: value2 }) => JSON.stringify(value2);
    var jsonScalars = [
      {
        identify: (value2) => typeof value2 === "string",
        default: true,
        tag: "tag:yaml.org,2002:str",
        resolve: (str) => str,
        stringify: stringifyJSON
      },
      {
        identify: (value2) => value2 == null,
        createNode: () => new Scalar.Scalar(null),
        default: true,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: stringifyJSON
      },
      {
        identify: (value2) => typeof value2 === "boolean",
        default: true,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (str) => str === "true",
        stringify: stringifyJSON
      },
      {
        identify: intIdentify,
        default: true,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
        stringify: ({ value: value2 }) => intIdentify(value2) ? value2.toString() : JSON.stringify(value2)
      },
      {
        identify: (value2) => typeof value2 === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (str) => parseFloat(str),
        stringify: stringifyJSON
      }
    ];
    var jsonError = {
      default: true,
      tag: "",
      test: /^/,
      resolve(str, onError) {
        onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
        return str;
      }
    };
    var schema = [map.map, seq.seq].concat(jsonScalars, jsonError);
    exports.schema = schema;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/yaml-1.1/binary.js
var require_binary = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/yaml-1.1/binary.js"(exports) {
    "use strict";
    var node_buffer = __require("buffer");
    var Scalar = require_Scalar();
    var stringifyString = require_stringifyString();
    var binary = {
      identify: (value2) => value2 instanceof Uint8Array,
      // Buffer inherits from Uint8Array
      default: false,
      tag: "tag:yaml.org,2002:binary",
      /**
       * Returns a Buffer in node and an Uint8Array in browsers
       *
       * To use the resulting buffer as an image, you'll want to do something like:
       *
       *   const blob = new Blob([buffer], { type: 'image/jpeg' })
       *   document.querySelector('#photo').src = URL.createObjectURL(blob)
       */
      resolve(src, onError) {
        if (typeof node_buffer.Buffer === "function") {
          return node_buffer.Buffer.from(src, "base64");
        } else if (typeof atob === "function") {
          const str = atob(src.replace(/[\n\r]/g, ""));
          const buffer = new Uint8Array(str.length);
          for (let i = 0; i < str.length; ++i)
            buffer[i] = str.charCodeAt(i);
          return buffer;
        } else {
          onError("This environment does not support reading binary tags; either Buffer or atob is required");
          return src;
        }
      },
      stringify({ comment, type, value: value2 }, ctx, onComment, onChompKeep) {
        if (!value2)
          return "";
        const buf = value2;
        let str;
        if (typeof node_buffer.Buffer === "function") {
          str = buf instanceof node_buffer.Buffer ? buf.toString("base64") : node_buffer.Buffer.from(buf.buffer).toString("base64");
        } else if (typeof btoa === "function") {
          let s = "";
          for (let i = 0; i < buf.length; ++i)
            s += String.fromCharCode(buf[i]);
          str = btoa(s);
        } else {
          throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        }
        type ?? (type = Scalar.Scalar.BLOCK_LITERAL);
        if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
          const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
          const n = Math.ceil(str.length / lineWidth);
          const lines2 = new Array(n);
          for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
            lines2[i] = str.substr(o, lineWidth);
          }
          str = lines2.join(type === Scalar.Scalar.BLOCK_LITERAL ? "\n" : " ");
        }
        return stringifyString.stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
      }
    };
    exports.binary = binary;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/yaml-1.1/pairs.js
var require_pairs = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/yaml-1.1/pairs.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLSeq = require_YAMLSeq();
    function resolvePairs(seq, onError) {
      if (identity.isSeq(seq)) {
        for (let i = 0; i < seq.items.length; ++i) {
          let item = seq.items[i];
          if (identity.isPair(item))
            continue;
          else if (identity.isMap(item)) {
            if (item.items.length > 1)
              onError("Each pair must have its own sequence indicator");
            const pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
            if (item.commentBefore)
              pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
            if (item.comment) {
              const cn = pair.value ?? pair.key;
              cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
            }
            item = pair;
          }
          seq.items[i] = identity.isPair(item) ? item : new Pair.Pair(item);
        }
      } else
        onError("Expected a sequence for this tag");
      return seq;
    }
    function createPairs(schema, iterable, ctx) {
      const { replacer } = ctx;
      const pairs2 = new YAMLSeq.YAMLSeq(schema);
      pairs2.tag = "tag:yaml.org,2002:pairs";
      let i = 0;
      if (iterable && Symbol.iterator in Object(iterable))
        for (let it of iterable) {
          if (typeof replacer === "function")
            it = replacer.call(iterable, String(i++), it);
          let key, value2;
          if (Array.isArray(it)) {
            if (it.length === 2) {
              key = it[0];
              value2 = it[1];
            } else
              throw new TypeError(`Expected [key, value] tuple: ${it}`);
          } else if (it && it instanceof Object) {
            const keys = Object.keys(it);
            if (keys.length === 1) {
              key = keys[0];
              value2 = it[key];
            } else {
              throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
            }
          } else {
            key = it;
          }
          pairs2.items.push(Pair.createPair(key, value2, ctx));
        }
      return pairs2;
    }
    var pairs = {
      collection: "seq",
      default: false,
      tag: "tag:yaml.org,2002:pairs",
      resolve: resolvePairs,
      createNode: createPairs
    };
    exports.createPairs = createPairs;
    exports.pairs = pairs;
    exports.resolvePairs = resolvePairs;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/yaml-1.1/omap.js
var require_omap = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/yaml-1.1/omap.js"(exports) {
    "use strict";
    var identity = require_identity();
    var toJS = require_toJS();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var pairs = require_pairs();
    var YAMLOMap = class _YAMLOMap extends YAMLSeq.YAMLSeq {
      constructor() {
        super();
        this.add = YAMLMap.YAMLMap.prototype.add.bind(this);
        this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this);
        this.get = YAMLMap.YAMLMap.prototype.get.bind(this);
        this.has = YAMLMap.YAMLMap.prototype.has.bind(this);
        this.set = YAMLMap.YAMLMap.prototype.set.bind(this);
        this.tag = _YAMLOMap.tag;
      }
      /**
       * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
       * but TypeScript won't allow widening the signature of a child method.
       */
      toJSON(_, ctx) {
        if (!ctx)
          return super.toJSON(_);
        const map = /* @__PURE__ */ new Map();
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const pair of this.items) {
          let key, value2;
          if (identity.isPair(pair)) {
            key = toJS.toJS(pair.key, "", ctx);
            value2 = toJS.toJS(pair.value, key, ctx);
          } else {
            key = toJS.toJS(pair, "", ctx);
          }
          if (map.has(key))
            throw new Error("Ordered maps must not include duplicate keys");
          map.set(key, value2);
        }
        return map;
      }
      static from(schema, iterable, ctx) {
        const pairs$1 = pairs.createPairs(schema, iterable, ctx);
        const omap2 = new this();
        omap2.items = pairs$1.items;
        return omap2;
      }
    };
    YAMLOMap.tag = "tag:yaml.org,2002:omap";
    var omap = {
      collection: "seq",
      identify: (value2) => value2 instanceof Map,
      nodeClass: YAMLOMap,
      default: false,
      tag: "tag:yaml.org,2002:omap",
      resolve(seq, onError) {
        const pairs$1 = pairs.resolvePairs(seq, onError);
        const seenKeys = [];
        for (const { key } of pairs$1.items) {
          if (identity.isScalar(key)) {
            if (seenKeys.includes(key.value)) {
              onError(`Ordered maps must not include duplicate keys: ${key.value}`);
            } else {
              seenKeys.push(key.value);
            }
          }
        }
        return Object.assign(new YAMLOMap(), pairs$1);
      },
      createNode: (schema, iterable, ctx) => YAMLOMap.from(schema, iterable, ctx)
    };
    exports.YAMLOMap = YAMLOMap;
    exports.omap = omap;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/yaml-1.1/bool.js
var require_bool2 = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/yaml-1.1/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function boolStringify({ value: value2, source }, ctx) {
      const boolObj = value2 ? trueTag : falseTag;
      if (source && boolObj.test.test(source))
        return source;
      return value2 ? ctx.options.trueStr : ctx.options.falseStr;
    }
    var trueTag = {
      identify: (value2) => value2 === true,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new Scalar.Scalar(true),
      stringify: boolStringify
    };
    var falseTag = {
      identify: (value2) => value2 === false,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new Scalar.Scalar(false),
      stringify: boolStringify
    };
    exports.falseTag = falseTag;
    exports.trueTag = trueTag;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/yaml-1.1/float.js
var require_float2 = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/yaml-1.1/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value2) => typeof value2 === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value2) => typeof value2 === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str.replace(/_/g, "")),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value2) => typeof value2 === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str.replace(/_/g, "")));
        const dot = str.indexOf(".");
        if (dot !== -1) {
          const f = str.substring(dot + 1).replace(/_/g, "");
          if (f[f.length - 1] === "0")
            node.minFractionDigits = f.length;
        }
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/yaml-1.1/int.js
var require_int2 = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/yaml-1.1/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value2) => typeof value2 === "bigint" || Number.isInteger(value2);
    function intResolve(str, offset, radix, { intAsBigInt }) {
      const sign = str[0];
      if (sign === "-" || sign === "+")
        offset += 1;
      str = str.substring(offset).replace(/_/g, "");
      if (intAsBigInt) {
        switch (radix) {
          case 2:
            str = `0b${str}`;
            break;
          case 8:
            str = `0o${str}`;
            break;
          case 16:
            str = `0x${str}`;
            break;
        }
        const n2 = BigInt(str);
        return sign === "-" ? BigInt(-1) * n2 : n2;
      }
      const n = parseInt(str, radix);
      return sign === "-" ? -1 * n : n;
    }
    function intStringify(node, radix, prefix) {
      const { value: value2 } = node;
      if (intIdentify(value2)) {
        const str = value2.toString(radix);
        return value2 < 0 ? "-" + prefix + str.substr(1) : prefix + str;
      }
      return stringifyNumber.stringifyNumber(node);
    }
    var intBin = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
      stringify: (node) => intStringify(node, 2, "0b")
    };
    var intOct = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
      stringify: (node) => intStringify(node, 8, "0")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intBin = intBin;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/yaml-1.1/set.js
var require_set = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/yaml-1.1/set.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSet = class _YAMLSet extends YAMLMap.YAMLMap {
      constructor(schema) {
        super(schema);
        this.tag = _YAMLSet.tag;
      }
      add(key) {
        let pair;
        if (identity.isPair(key))
          pair = key;
        else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
          pair = new Pair.Pair(key.key, null);
        else
          pair = new Pair.Pair(key, null);
        const prev = YAMLMap.findPair(this.items, pair.key);
        if (!prev)
          this.items.push(pair);
      }
      /**
       * If `keepPair` is `true`, returns the Pair matching `key`.
       * Otherwise, returns the value of that Pair's key.
       */
      get(key, keepPair) {
        const pair = YAMLMap.findPair(this.items, key);
        return !keepPair && identity.isPair(pair) ? identity.isScalar(pair.key) ? pair.key.value : pair.key : pair;
      }
      set(key, value2) {
        if (typeof value2 !== "boolean")
          throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value2}`);
        const prev = YAMLMap.findPair(this.items, key);
        if (prev && !value2) {
          this.items.splice(this.items.indexOf(prev), 1);
        } else if (!prev && value2) {
          this.items.push(new Pair.Pair(key));
        }
      }
      toJSON(_, ctx) {
        return super.toJSON(_, ctx, Set);
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        if (this.hasAllNullValues(true))
          return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
        else
          throw new Error("Set items must all have null values");
      }
      static from(schema, iterable, ctx) {
        const { replacer } = ctx;
        const set2 = new this(schema);
        if (iterable && Symbol.iterator in Object(iterable))
          for (let value2 of iterable) {
            if (typeof replacer === "function")
              value2 = replacer.call(iterable, value2, value2);
            set2.items.push(Pair.createPair(value2, null, ctx));
          }
        return set2;
      }
    };
    YAMLSet.tag = "tag:yaml.org,2002:set";
    var set = {
      collection: "map",
      identify: (value2) => value2 instanceof Set,
      nodeClass: YAMLSet,
      default: false,
      tag: "tag:yaml.org,2002:set",
      createNode: (schema, iterable, ctx) => YAMLSet.from(schema, iterable, ctx),
      resolve(map, onError) {
        if (identity.isMap(map)) {
          if (map.hasAllNullValues(true))
            return Object.assign(new YAMLSet(), map);
          else
            onError("Set items must all have null values");
        } else
          onError("Expected a mapping for this tag");
        return map;
      }
    };
    exports.YAMLSet = YAMLSet;
    exports.set = set;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/yaml-1.1/timestamp.js
var require_timestamp = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/yaml-1.1/timestamp.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    function parseSexagesimal(str, asBigInt) {
      const sign = str[0];
      const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
      const num = (n) => asBigInt ? BigInt(n) : Number(n);
      const res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num(60) + num(p), num(0));
      return sign === "-" ? num(-1) * res : res;
    }
    function stringifySexagesimal(node) {
      let { value: value2 } = node;
      let num = (n) => n;
      if (typeof value2 === "bigint")
        num = (n) => BigInt(n);
      else if (isNaN(value2) || !isFinite(value2))
        return stringifyNumber.stringifyNumber(node);
      let sign = "";
      if (value2 < 0) {
        sign = "-";
        value2 *= num(-1);
      }
      const _60 = num(60);
      const parts = [value2 % _60];
      if (value2 < 60) {
        parts.unshift(0);
      } else {
        value2 = (value2 - parts[0]) / _60;
        parts.unshift(value2 % _60);
        if (value2 >= 60) {
          value2 = (value2 - parts[0]) / _60;
          parts.unshift(value2);
        }
      }
      return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
    }
    var intTime = {
      identify: (value2) => typeof value2 === "bigint" || Number.isInteger(value2),
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
      stringify: stringifySexagesimal
    };
    var floatTime = {
      identify: (value2) => typeof value2 === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (str) => parseSexagesimal(str, false),
      stringify: stringifySexagesimal
    };
    var timestamp = {
      identify: (value2) => value2 instanceof Date,
      default: true,
      tag: "tag:yaml.org,2002:timestamp",
      // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
      // may be omitted altogether, resulting in a date format. In such a case, the time part is
      // assumed to be 00:00:00Z (start of day, UTC).
      test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
      resolve(str) {
        const match = str.match(timestamp.test);
        if (!match)
          throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        const [, year, month, day, hour, minute, second] = match.map(Number);
        const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
        let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
        const tz = match[8];
        if (tz && tz !== "Z") {
          let d = parseSexagesimal(tz, false);
          if (Math.abs(d) < 30)
            d *= 60;
          date -= 6e4 * d;
        }
        return new Date(date);
      },
      stringify: ({ value: value2 }) => value2?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
    };
    exports.floatTime = floatTime;
    exports.intTime = intTime;
    exports.timestamp = timestamp;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/yaml-1.1/schema.js
var require_schema3 = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/yaml-1.1/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var binary = require_binary();
    var bool = require_bool2();
    var float = require_float2();
    var int = require_int2();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var set = require_set();
    var timestamp = require_timestamp();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.trueTag,
      bool.falseTag,
      int.intBin,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float,
      binary.binary,
      merge.merge,
      omap.omap,
      pairs.pairs,
      set.set,
      timestamp.intTime,
      timestamp.floatTime,
      timestamp.timestamp
    ];
    exports.schema = schema;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/tags.js
var require_tags = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/tags.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = require_schema();
    var schema$1 = require_schema2();
    var binary = require_binary();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var schema$2 = require_schema3();
    var set = require_set();
    var timestamp = require_timestamp();
    var schemas = /* @__PURE__ */ new Map([
      ["core", schema.schema],
      ["failsafe", [map.map, seq.seq, string.string]],
      ["json", schema$1.schema],
      ["yaml11", schema$2.schema],
      ["yaml-1.1", schema$2.schema]
    ]);
    var tagsByName = {
      binary: binary.binary,
      bool: bool.boolTag,
      float: float.float,
      floatExp: float.floatExp,
      floatNaN: float.floatNaN,
      floatTime: timestamp.floatTime,
      int: int.int,
      intHex: int.intHex,
      intOct: int.intOct,
      intTime: timestamp.intTime,
      map: map.map,
      merge: merge.merge,
      null: _null.nullTag,
      omap: omap.omap,
      pairs: pairs.pairs,
      seq: seq.seq,
      set: set.set,
      timestamp: timestamp.timestamp
    };
    var coreKnownTags = {
      "tag:yaml.org,2002:binary": binary.binary,
      "tag:yaml.org,2002:merge": merge.merge,
      "tag:yaml.org,2002:omap": omap.omap,
      "tag:yaml.org,2002:pairs": pairs.pairs,
      "tag:yaml.org,2002:set": set.set,
      "tag:yaml.org,2002:timestamp": timestamp.timestamp
    };
    function getTags(customTags, schemaName, addMergeTag) {
      const schemaTags = schemas.get(schemaName);
      if (schemaTags && !customTags) {
        return addMergeTag && !schemaTags.includes(merge.merge) ? schemaTags.concat(merge.merge) : schemaTags.slice();
      }
      let tags = schemaTags;
      if (!tags) {
        if (Array.isArray(customTags))
          tags = [];
        else {
          const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
        }
      }
      if (Array.isArray(customTags)) {
        for (const tag of customTags)
          tags = tags.concat(tag);
      } else if (typeof customTags === "function") {
        tags = customTags(tags.slice());
      }
      if (addMergeTag)
        tags = tags.concat(merge.merge);
      return tags.reduce((tags2, tag) => {
        const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
        if (!tagObj) {
          const tagName = JSON.stringify(tag);
          const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
        }
        if (!tags2.includes(tagObj))
          tags2.push(tagObj);
        return tags2;
      }, []);
    }
    exports.coreKnownTags = coreKnownTags;
    exports.getTags = getTags;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/Schema.js
var require_Schema = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/schema/Schema.js"(exports) {
    "use strict";
    var identity = require_identity();
    var map = require_map();
    var seq = require_seq();
    var string = require_string();
    var tags = require_tags();
    var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    var Schema = class _Schema {
      constructor({ compat, customTags, merge, resolveKnownTags, schema, sortMapEntries, toStringDefaults }) {
        this.compat = Array.isArray(compat) ? tags.getTags(compat, "compat") : compat ? tags.getTags(null, compat) : null;
        this.name = typeof schema === "string" && schema || "core";
        this.knownTags = resolveKnownTags ? tags.coreKnownTags : {};
        this.tags = tags.getTags(customTags, this.name, merge);
        this.toStringOptions = toStringDefaults ?? null;
        Object.defineProperty(this, identity.MAP, { value: map.map });
        Object.defineProperty(this, identity.SCALAR, { value: string.string });
        Object.defineProperty(this, identity.SEQ, { value: seq.seq });
        this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
      }
      clone() {
        const copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
        copy.tags = this.tags.slice();
        return copy;
      }
    };
    exports.Schema = Schema;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/stringify/stringifyDocument.js
var require_stringifyDocument = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/stringify/stringifyDocument.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyDocument(doc, options) {
      const lines2 = [];
      let hasDirectives = options.directives === true;
      if (options.directives !== false && doc.directives) {
        const dir = doc.directives.toString(doc);
        if (dir) {
          lines2.push(dir);
          hasDirectives = true;
        } else if (doc.directives.docStart)
          hasDirectives = true;
      }
      if (hasDirectives)
        lines2.push("---");
      const ctx = stringify.createStringifyContext(doc, options);
      const { commentString } = ctx.options;
      if (doc.commentBefore) {
        if (lines2.length !== 1)
          lines2.unshift("");
        const cs = commentString(doc.commentBefore);
        lines2.unshift(stringifyComment.indentComment(cs, ""));
      }
      let chompKeep = false;
      let contentComment = null;
      if (doc.contents) {
        if (identity.isNode(doc.contents)) {
          if (doc.contents.spaceBefore && hasDirectives)
            lines2.push("");
          if (doc.contents.commentBefore) {
            const cs = commentString(doc.contents.commentBefore);
            lines2.push(stringifyComment.indentComment(cs, ""));
          }
          ctx.forceBlockIndent = !!doc.comment;
          contentComment = doc.contents.comment;
        }
        const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
        let body = stringify.stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
        if (contentComment)
          body += stringifyComment.lineComment(body, "", commentString(contentComment));
        if ((body[0] === "|" || body[0] === ">") && lines2[lines2.length - 1] === "---") {
          lines2[lines2.length - 1] = `--- ${body}`;
        } else
          lines2.push(body);
      } else {
        lines2.push(stringify.stringify(doc.contents, ctx));
      }
      if (doc.directives?.docEnd) {
        if (doc.comment) {
          const cs = commentString(doc.comment);
          if (cs.includes("\n")) {
            lines2.push("...");
            lines2.push(stringifyComment.indentComment(cs, ""));
          } else {
            lines2.push(`... ${cs}`);
          }
        } else {
          lines2.push("...");
        }
      } else {
        let dc = doc.comment;
        if (dc && chompKeep)
          dc = dc.replace(/^\n+/, "");
        if (dc) {
          if ((!chompKeep || contentComment) && lines2[lines2.length - 1] !== "")
            lines2.push("");
          lines2.push(stringifyComment.indentComment(commentString(dc), ""));
        }
      }
      return lines2.join("\n") + "\n";
    }
    exports.stringifyDocument = stringifyDocument;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/doc/Document.js
var require_Document = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/doc/Document.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var toJS = require_toJS();
    var Schema = require_Schema();
    var stringifyDocument = require_stringifyDocument();
    var anchors = require_anchors();
    var applyReviver = require_applyReviver();
    var createNode = require_createNode();
    var directives = require_directives();
    var Document = class _Document {
      constructor(value2, replacer, options) {
        this.commentBefore = null;
        this.comment = null;
        this.errors = [];
        this.warnings = [];
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.DOC });
        let _replacer = null;
        if (typeof replacer === "function" || Array.isArray(replacer)) {
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const opt = Object.assign({
          intAsBigInt: false,
          keepSourceTokens: false,
          logLevel: "warn",
          prettyErrors: true,
          strict: true,
          stringKeys: false,
          uniqueKeys: true,
          version: "1.2"
        }, options);
        this.options = opt;
        let { version } = opt;
        if (options?._directives) {
          this.directives = options._directives.atDocument();
          if (this.directives.yaml.explicit)
            version = this.directives.yaml.version;
        } else
          this.directives = new directives.Directives({ version });
        this.setSchema(version, options);
        this.contents = value2 === void 0 ? null : this.createNode(value2, _replacer, options);
      }
      /**
       * Create a deep copy of this Document and its contents.
       *
       * Custom Node values that inherit from `Object` still refer to their original instances.
       */
      clone() {
        const copy = Object.create(_Document.prototype, {
          [identity.NODE_TYPE]: { value: identity.DOC }
        });
        copy.commentBefore = this.commentBefore;
        copy.comment = this.comment;
        copy.errors = this.errors.slice();
        copy.warnings = this.warnings.slice();
        copy.options = Object.assign({}, this.options);
        if (this.directives)
          copy.directives = this.directives.clone();
        copy.schema = this.schema.clone();
        copy.contents = identity.isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** Adds a value to the document. */
      add(value2) {
        if (assertCollection(this.contents))
          this.contents.add(value2);
      }
      /** Adds a value to the document. */
      addIn(path2, value2) {
        if (assertCollection(this.contents))
          this.contents.addIn(path2, value2);
      }
      /**
       * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
       *
       * If `node` already has an anchor, `name` is ignored.
       * Otherwise, the `node.anchor` value will be set to `name`,
       * or if an anchor with that name is already present in the document,
       * `name` will be used as a prefix for a new unique anchor.
       * If `name` is undefined, the generated anchor will use 'a' as a prefix.
       */
      createAlias(node, name) {
        if (!node.anchor) {
          const prev = anchors.anchorNames(this);
          node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          !name || prev.has(name) ? anchors.findNewAnchor(name || "a", prev) : name;
        }
        return new Alias.Alias(node.anchor);
      }
      createNode(value2, replacer, options) {
        let _replacer = void 0;
        if (typeof replacer === "function") {
          value2 = replacer.call({ "": value2 }, "", value2);
          _replacer = replacer;
        } else if (Array.isArray(replacer)) {
          const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
          const asStr = replacer.filter(keyToStr).map(String);
          if (asStr.length > 0)
            replacer = replacer.concat(asStr);
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
        const { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(
          this,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          anchorPrefix || "a"
        );
        const ctx = {
          aliasDuplicateObjects: aliasDuplicateObjects ?? true,
          keepUndefined: keepUndefined ?? false,
          onAnchor,
          onTagObj,
          replacer: _replacer,
          schema: this.schema,
          sourceObjects
        };
        const node = createNode.createNode(value2, tag, ctx);
        if (flow && identity.isCollection(node))
          node.flow = true;
        setAnchors();
        return node;
      }
      /**
       * Convert a key and a value into a `Pair` using the current schema,
       * recursively wrapping all values as `Scalar` or `Collection` nodes.
       */
      createPair(key, value2, options = {}) {
        const k = this.createNode(key, null, options);
        const v = this.createNode(value2, null, options);
        return new Pair.Pair(k, v);
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        return assertCollection(this.contents) ? this.contents.delete(key) : false;
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path2) {
        if (Collection.isEmptyPath(path2)) {
          if (this.contents == null)
            return false;
          this.contents = null;
          return true;
        }
        return assertCollection(this.contents) ? this.contents.deleteIn(path2) : false;
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      get(key, keepScalar) {
        return identity.isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
      }
      /**
       * Returns item at `path`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path2, keepScalar) {
        if (Collection.isEmptyPath(path2))
          return !keepScalar && identity.isScalar(this.contents) ? this.contents.value : this.contents;
        return identity.isCollection(this.contents) ? this.contents.getIn(path2, keepScalar) : void 0;
      }
      /**
       * Checks if the document includes a value with the key `key`.
       */
      has(key) {
        return identity.isCollection(this.contents) ? this.contents.has(key) : false;
      }
      /**
       * Checks if the document includes a value at `path`.
       */
      hasIn(path2) {
        if (Collection.isEmptyPath(path2))
          return this.contents !== void 0;
        return identity.isCollection(this.contents) ? this.contents.hasIn(path2) : false;
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      set(key, value2) {
        if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, [key], value2);
        } else if (assertCollection(this.contents)) {
          this.contents.set(key, value2);
        }
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path2, value2) {
        if (Collection.isEmptyPath(path2)) {
          this.contents = value2;
        } else if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, Array.from(path2), value2);
        } else if (assertCollection(this.contents)) {
          this.contents.setIn(path2, value2);
        }
      }
      /**
       * Change the YAML version and schema used by the document.
       * A `null` version disables support for directives, explicit tags, anchors, and aliases.
       * It also requires the `schema` option to be given as a `Schema` instance value.
       *
       * Overrides all previously set schema options.
       */
      setSchema(version, options = {}) {
        if (typeof version === "number")
          version = String(version);
        let opt;
        switch (version) {
          case "1.1":
            if (this.directives)
              this.directives.yaml.version = "1.1";
            else
              this.directives = new directives.Directives({ version: "1.1" });
            opt = { resolveKnownTags: false, schema: "yaml-1.1" };
            break;
          case "1.2":
          case "next":
            if (this.directives)
              this.directives.yaml.version = version;
            else
              this.directives = new directives.Directives({ version });
            opt = { resolveKnownTags: true, schema: "core" };
            break;
          case null:
            if (this.directives)
              delete this.directives;
            opt = null;
            break;
          default: {
            const sv = JSON.stringify(version);
            throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
          }
        }
        if (options.schema instanceof Object)
          this.schema = options.schema;
        else if (opt)
          this.schema = new Schema.Schema(Object.assign(opt, options));
        else
          throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
      }
      // json & jsonArg are only used from toJSON()
      toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc: this,
          keep: !json,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this.contents, jsonArg ?? "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
      /**
       * A JSON representation of the document `contents`.
       *
       * @param jsonArg Used by `JSON.stringify` to indicate the array index or
       *   property name.
       */
      toJSON(jsonArg, onAnchor) {
        return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
      }
      /** A YAML representation of the document. */
      toString(options = {}) {
        if (this.errors.length > 0)
          throw new Error("Document with errors cannot be stringified");
        if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
          const s = JSON.stringify(options.indent);
          throw new Error(`"indent" option must be a positive integer, not ${s}`);
        }
        return stringifyDocument.stringifyDocument(this, options);
      }
    };
    function assertCollection(contents) {
      if (identity.isCollection(contents))
        return true;
      throw new Error("Expected a YAML collection as document contents");
    }
    exports.Document = Document;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/errors.js
var require_errors = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/errors.js"(exports) {
    "use strict";
    var YAMLError = class extends Error {
      constructor(name, pos, code, message) {
        super();
        this.name = name;
        this.code = code;
        this.message = message;
        this.pos = pos;
      }
    };
    var YAMLParseError = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLParseError", pos, code, message);
      }
    };
    var YAMLWarning = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLWarning", pos, code, message);
      }
    };
    var prettifyError = (src, lc) => (error) => {
      if (error.pos[0] === -1)
        return;
      error.linePos = error.pos.map((pos) => lc.linePos(pos));
      const { line, col } = error.linePos[0];
      error.message += ` at line ${line}, column ${col}`;
      let ci = col - 1;
      let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
      if (ci >= 60 && lineStr.length > 80) {
        const trimStart = Math.min(ci - 39, lineStr.length - 79);
        lineStr = "\u2026" + lineStr.substring(trimStart);
        ci -= trimStart - 1;
      }
      if (lineStr.length > 80)
        lineStr = lineStr.substring(0, 79) + "\u2026";
      if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
        let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
        if (prev.length > 80)
          prev = prev.substring(0, 79) + "\u2026\n";
        lineStr = prev + lineStr;
      }
      if (/[^ ]/.test(lineStr)) {
        let count = 1;
        const end = error.linePos[1];
        if (end && end.line === line && end.col > col) {
          count = Math.max(1, Math.min(end.col - col, 80 - ci));
        }
        const pointer = " ".repeat(ci) + "^".repeat(count);
        error.message += `:

${lineStr}
${pointer}
`;
      }
    };
    exports.YAMLError = YAMLError;
    exports.YAMLParseError = YAMLParseError;
    exports.YAMLWarning = YAMLWarning;
    exports.prettifyError = prettifyError;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/resolve-props.js
var require_resolve_props = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/resolve-props.js"(exports) {
    "use strict";
    function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
      let spaceBefore = false;
      let atNewline = startOnNewline;
      let hasSpace = startOnNewline;
      let comment = "";
      let commentSep = "";
      let hasNewline = false;
      let reqSpace = false;
      let tab = null;
      let anchor = null;
      let tag = null;
      let newlineAfterProp = null;
      let comma = null;
      let found = null;
      let start = null;
      for (const token of tokens) {
        if (reqSpace) {
          if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
            onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
          reqSpace = false;
        }
        if (tab) {
          if (atNewline && token.type !== "comment" && token.type !== "newline") {
            onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
          }
          tab = null;
        }
        switch (token.type) {
          case "space":
            if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	")) {
              tab = token;
            }
            hasSpace = true;
            break;
          case "comment": {
            if (!hasSpace)
              onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            const cb = token.source.substring(1) || " ";
            if (!comment)
              comment = cb;
            else
              comment += commentSep + cb;
            commentSep = "";
            atNewline = false;
            break;
          }
          case "newline":
            if (atNewline) {
              if (comment)
                comment += token.source;
              else if (!found || indicator !== "seq-item-ind")
                spaceBefore = true;
            } else
              commentSep += token.source;
            atNewline = true;
            hasNewline = true;
            if (anchor || tag)
              newlineAfterProp = token;
            hasSpace = true;
            break;
          case "anchor":
            if (anchor)
              onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
            if (token.source.endsWith(":"))
              onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
            anchor = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          case "tag": {
            if (tag)
              onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
            tag = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          }
          case indicator:
            if (anchor || tag)
              onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
            if (found)
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
            found = token;
            atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
            hasSpace = false;
            break;
          case "comma":
            if (flow) {
              if (comma)
                onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
              comma = token;
              atNewline = false;
              hasSpace = false;
              break;
            }
          // else fallthrough
          default:
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
            atNewline = false;
            hasSpace = false;
        }
      }
      const last = tokens[tokens.length - 1];
      const end = last ? last.offset + last.source.length : offset;
      if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
        onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
      }
      if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
        onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
      return {
        comma,
        found,
        spaceBefore,
        comment,
        hasNewline,
        anchor,
        tag,
        newlineAfterProp,
        end,
        start: start ?? end
      };
    }
    exports.resolveProps = resolveProps;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/util-contains-newline.js
var require_util_contains_newline = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/util-contains-newline.js"(exports) {
    "use strict";
    function containsNewline(key) {
      if (!key)
        return null;
      switch (key.type) {
        case "alias":
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          if (key.source.includes("\n"))
            return true;
          if (key.end) {
            for (const st of key.end)
              if (st.type === "newline")
                return true;
          }
          return false;
        case "flow-collection":
          for (const it of key.items) {
            for (const st of it.start)
              if (st.type === "newline")
                return true;
            if (it.sep) {
              for (const st of it.sep)
                if (st.type === "newline")
                  return true;
            }
            if (containsNewline(it.key) || containsNewline(it.value))
              return true;
          }
          return false;
        default:
          return true;
      }
    }
    exports.containsNewline = containsNewline;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/util-flow-indent-check.js
var require_util_flow_indent_check = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/util-flow-indent-check.js"(exports) {
    "use strict";
    var utilContainsNewline = require_util_contains_newline();
    function flowIndentCheck(indent, fc, onError) {
      if (fc?.type === "flow-collection") {
        const end = fc.end[0];
        if (end.indent === indent && (end.source === "]" || end.source === "}") && utilContainsNewline.containsNewline(fc)) {
          const msg = "Flow end indicator should be more indented than parent";
          onError(end, "BAD_INDENT", msg, true);
        }
      }
    }
    exports.flowIndentCheck = flowIndentCheck;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/util-map-includes.js
var require_util_map_includes = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/util-map-includes.js"(exports) {
    "use strict";
    var identity = require_identity();
    function mapIncludes(ctx, items, search) {
      const { uniqueKeys } = ctx.options;
      if (uniqueKeys === false)
        return false;
      const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || identity.isScalar(a) && identity.isScalar(b) && a.value === b.value;
      return items.some((pair) => isEqual(pair.key, search));
    }
    exports.mapIncludes = mapIncludes;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/resolve-block-map.js
var require_resolve_block_map = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/resolve-block-map.js"(exports) {
    "use strict";
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    var utilMapIncludes = require_util_map_includes();
    var startColMsg = "All mapping items must start at the same column";
    function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLMap.YAMLMap;
      const map = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      let offset = bm.offset;
      let commentEnd = null;
      for (const collItem of bm.items) {
        const { start, key, sep, value: value2 } = collItem;
        const keyProps = resolveProps.resolveProps(start, {
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: bm.indent,
          startOnNewline: true
        });
        const implicitKey = !keyProps.found;
        if (implicitKey) {
          if (key) {
            if (key.type === "block-seq")
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
            else if ("indent" in key && key.indent !== bm.indent)
              onError(offset, "BAD_INDENT", startColMsg);
          }
          if (!keyProps.anchor && !keyProps.tag && !sep) {
            commentEnd = keyProps.end;
            if (keyProps.comment) {
              if (map.comment)
                map.comment += "\n" + keyProps.comment;
              else
                map.comment = keyProps.comment;
            }
            continue;
          }
          if (keyProps.newlineAfterProp || utilContainsNewline.containsNewline(key)) {
            onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
          }
        } else if (keyProps.found?.indent !== bm.indent) {
          onError(offset, "BAD_INDENT", startColMsg);
        }
        ctx.atKey = true;
        const keyStart = keyProps.end;
        const keyNode = key ? composeNode(ctx, key, keyProps, onError) : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bm.indent, key, onError);
        ctx.atKey = false;
        if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
          onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
        const valueProps = resolveProps.resolveProps(sep ?? [], {
          indicator: "map-value-ind",
          next: value2,
          offset: keyNode.range[2],
          onError,
          parentIndent: bm.indent,
          startOnNewline: !key || key.type === "block-scalar"
        });
        offset = valueProps.end;
        if (valueProps.found) {
          if (implicitKey) {
            if (value2?.type === "block-map" && !valueProps.hasNewline)
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
            if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
              onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
          }
          const valueNode = value2 ? composeNode(ctx, value2, valueProps, onError) : composeEmptyNode(ctx, offset, sep, null, valueProps, onError);
          if (ctx.schema.compat)
            utilFlowIndentCheck.flowIndentCheck(bm.indent, value2, onError);
          offset = valueNode.range[2];
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        } else {
          if (implicitKey)
            onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
          if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        }
      }
      if (commentEnd && commentEnd < offset)
        onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
      map.range = [bm.offset, offset, commentEnd ?? offset];
      return map;
    }
    exports.resolveBlockMap = resolveBlockMap;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/resolve-block-seq.js
var require_resolve_block_seq = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/resolve-block-seq.js"(exports) {
    "use strict";
    var YAMLSeq = require_YAMLSeq();
    var resolveProps = require_resolve_props();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLSeq.YAMLSeq;
      const seq = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = bs.offset;
      let commentEnd = null;
      for (const { start, value: value2 } of bs.items) {
        const props = resolveProps.resolveProps(start, {
          indicator: "seq-item-ind",
          next: value2,
          offset,
          onError,
          parentIndent: bs.indent,
          startOnNewline: true
        });
        if (!props.found) {
          if (props.anchor || props.tag || value2) {
            if (value2 && value2.type === "block-seq")
              onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
            else
              onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
          } else {
            commentEnd = props.end;
            if (props.comment)
              seq.comment = props.comment;
            continue;
          }
        }
        const node = value2 ? composeNode(ctx, value2, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bs.indent, value2, onError);
        offset = node.range[2];
        seq.items.push(node);
      }
      seq.range = [bs.offset, offset, commentEnd ?? offset];
      return seq;
    }
    exports.resolveBlockSeq = resolveBlockSeq;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/resolve-end.js
var require_resolve_end = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/resolve-end.js"(exports) {
    "use strict";
    function resolveEnd(end, offset, reqSpace, onError) {
      let comment = "";
      if (end) {
        let hasSpace = false;
        let sep = "";
        for (const token of end) {
          const { source, type } = token;
          switch (type) {
            case "space":
              hasSpace = true;
              break;
            case "comment": {
              if (reqSpace && !hasSpace)
                onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
              const cb = source.substring(1) || " ";
              if (!comment)
                comment = cb;
              else
                comment += sep + cb;
              sep = "";
              break;
            }
            case "newline":
              if (comment)
                sep += source;
              hasSpace = true;
              break;
            default:
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
          }
          offset += source.length;
        }
      }
      return { comment, offset };
    }
    exports.resolveEnd = resolveEnd;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/resolve-flow-collection.js
var require_resolve_flow_collection = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/resolve-flow-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilMapIncludes = require_util_map_includes();
    var blockMsg = "Block collections are not allowed within flow collections";
    var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
    function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError, tag) {
      const isMap = fc.start.source === "{";
      const fcName = isMap ? "flow map" : "flow sequence";
      const NodeClass = tag?.nodeClass ?? (isMap ? YAMLMap.YAMLMap : YAMLSeq.YAMLSeq);
      const coll = new NodeClass(ctx.schema);
      coll.flow = true;
      const atRoot = ctx.atRoot;
      if (atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = fc.offset + fc.start.source.length;
      for (let i = 0; i < fc.items.length; ++i) {
        const collItem = fc.items[i];
        const { start, key, sep, value: value2 } = collItem;
        const props = resolveProps.resolveProps(start, {
          flow: fcName,
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: fc.indent,
          startOnNewline: false
        });
        if (!props.found) {
          if (!props.anchor && !props.tag && !sep && !value2) {
            if (i === 0 && props.comma)
              onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
            else if (i < fc.items.length - 1)
              onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
            if (props.comment) {
              if (coll.comment)
                coll.comment += "\n" + props.comment;
              else
                coll.comment = props.comment;
            }
            offset = props.end;
            continue;
          }
          if (!isMap && ctx.options.strict && utilContainsNewline.containsNewline(key))
            onError(
              key,
              // checked by containsNewline()
              "MULTILINE_IMPLICIT_KEY",
              "Implicit keys of flow sequence pairs need to be on a single line"
            );
        }
        if (i === 0) {
          if (props.comma)
            onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
        } else {
          if (!props.comma)
            onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
          if (props.comment) {
            let prevItemComment = "";
            loop: for (const st of start) {
              switch (st.type) {
                case "comma":
                case "space":
                  break;
                case "comment":
                  prevItemComment = st.source.substring(1);
                  break loop;
                default:
                  break loop;
              }
            }
            if (prevItemComment) {
              let prev = coll.items[coll.items.length - 1];
              if (identity.isPair(prev))
                prev = prev.value ?? prev.key;
              if (prev.comment)
                prev.comment += "\n" + prevItemComment;
              else
                prev.comment = prevItemComment;
              props.comment = props.comment.substring(prevItemComment.length + 1);
            }
          }
        }
        if (!isMap && !sep && !props.found) {
          const valueNode = value2 ? composeNode(ctx, value2, props, onError) : composeEmptyNode(ctx, props.end, sep, null, props, onError);
          coll.items.push(valueNode);
          offset = valueNode.range[2];
          if (isBlock(value2))
            onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else {
          ctx.atKey = true;
          const keyStart = props.end;
          const keyNode = key ? composeNode(ctx, key, props, onError) : composeEmptyNode(ctx, keyStart, start, null, props, onError);
          if (isBlock(key))
            onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
          ctx.atKey = false;
          const valueProps = resolveProps.resolveProps(sep ?? [], {
            flow: fcName,
            indicator: "map-value-ind",
            next: value2,
            offset: keyNode.range[2],
            onError,
            parentIndent: fc.indent,
            startOnNewline: false
          });
          if (valueProps.found) {
            if (!isMap && !props.found && ctx.options.strict) {
              if (sep)
                for (const st of sep) {
                  if (st === valueProps.found)
                    break;
                  if (st.type === "newline") {
                    onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                    break;
                  }
                }
              if (props.start < valueProps.found.offset - 1024)
                onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
            }
          } else if (value2) {
            if ("source" in value2 && value2.source && value2.source[0] === ":")
              onError(value2, "MISSING_CHAR", `Missing space after : in ${fcName}`);
            else
              onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
          }
          const valueNode = value2 ? composeNode(ctx, value2, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep, null, valueProps, onError) : null;
          if (valueNode) {
            if (isBlock(value2))
              onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
          } else if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          if (isMap) {
            const map = coll;
            if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
              onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
            map.items.push(pair);
          } else {
            const map = new YAMLMap.YAMLMap(ctx.schema);
            map.flow = true;
            map.items.push(pair);
            const endRange = (valueNode ?? keyNode).range;
            map.range = [keyNode.range[0], endRange[1], endRange[2]];
            coll.items.push(map);
          }
          offset = valueNode ? valueNode.range[2] : valueProps.end;
        }
      }
      const expectedEnd = isMap ? "}" : "]";
      const [ce, ...ee] = fc.end;
      let cePos = offset;
      if (ce && ce.source === expectedEnd)
        cePos = ce.offset + ce.source.length;
      else {
        const name = fcName[0].toUpperCase() + fcName.substring(1);
        const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
        onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
        if (ce && ce.source.length !== 1)
          ee.unshift(ce);
      }
      if (ee.length > 0) {
        const end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
        if (end.comment) {
          if (coll.comment)
            coll.comment += "\n" + end.comment;
          else
            coll.comment = end.comment;
        }
        coll.range = [fc.offset, cePos, end.offset];
      } else {
        coll.range = [fc.offset, cePos, cePos];
      }
      return coll;
    }
    exports.resolveFlowCollection = resolveFlowCollection;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/compose-collection.js
var require_compose_collection = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/compose-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveBlockMap = require_resolve_block_map();
    var resolveBlockSeq = require_resolve_block_seq();
    var resolveFlowCollection = require_resolve_flow_collection();
    function resolveCollection(CN, ctx, token, onError, tagName, tag) {
      const coll = token.type === "block-map" ? resolveBlockMap.resolveBlockMap(CN, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError, tag) : resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError, tag);
      const Coll = coll.constructor;
      if (tagName === "!" || tagName === Coll.tagName) {
        coll.tag = Coll.tagName;
        return coll;
      }
      if (tagName)
        coll.tag = tagName;
      return coll;
    }
    function composeCollection(CN, ctx, token, props, onError) {
      const tagToken = props.tag;
      const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
      if (token.type === "block-seq") {
        const { anchor, newlineAfterProp: nl } = props;
        const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
        if (lastProp && (!nl || nl.offset < lastProp.offset)) {
          const message = "Missing newline after block sequence props";
          onError(lastProp, "MISSING_CHAR", message);
        }
      }
      const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
      if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.YAMLSeq.tagName && expType === "seq") {
        return resolveCollection(CN, ctx, token, onError, tagName);
      }
      let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
      if (!tag) {
        const kt = ctx.schema.knownTags[tagName];
        if (kt && kt.collection === expType) {
          ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
          tag = kt;
        } else {
          if (kt) {
            onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
          } else {
            onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
          }
          return resolveCollection(CN, ctx, token, onError, tagName);
        }
      }
      const coll = resolveCollection(CN, ctx, token, onError, tagName, tag);
      const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
      const node = identity.isNode(res) ? res : new Scalar.Scalar(res);
      node.range = coll.range;
      node.tag = tagName;
      if (tag?.format)
        node.format = tag.format;
      return node;
    }
    exports.composeCollection = composeCollection;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/resolve-block-scalar.js
var require_resolve_block_scalar = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/resolve-block-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function resolveBlockScalar(ctx, scalar, onError) {
      const start = scalar.offset;
      const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
      if (!header)
        return { value: "", type: null, comment: "", range: [start, start, start] };
      const type = header.mode === ">" ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
      const lines2 = scalar.source ? splitLines(scalar.source) : [];
      let chompStart = lines2.length;
      for (let i = lines2.length - 1; i >= 0; --i) {
        const content = lines2[i][1];
        if (content === "" || content === "\r")
          chompStart = i;
        else
          break;
      }
      if (chompStart === 0) {
        const value3 = header.chomp === "+" && lines2.length > 0 ? "\n".repeat(Math.max(1, lines2.length - 1)) : "";
        let end2 = start + header.length;
        if (scalar.source)
          end2 += scalar.source.length;
        return { value: value3, type, comment: header.comment, range: [start, end2, end2] };
      }
      let trimIndent = scalar.indent + header.indent;
      let offset = scalar.offset + header.length;
      let contentStart = 0;
      for (let i = 0; i < chompStart; ++i) {
        const [indent, content] = lines2[i];
        if (content === "" || content === "\r") {
          if (header.indent === 0 && indent.length > trimIndent)
            trimIndent = indent.length;
        } else {
          if (indent.length < trimIndent) {
            const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
            onError(offset + indent.length, "MISSING_CHAR", message);
          }
          if (header.indent === 0)
            trimIndent = indent.length;
          contentStart = i;
          if (trimIndent === 0 && !ctx.atRoot) {
            const message = "Block scalar values in collections must be indented";
            onError(offset, "BAD_INDENT", message);
          }
          break;
        }
        offset += indent.length + content.length + 1;
      }
      for (let i = lines2.length - 1; i >= chompStart; --i) {
        if (lines2[i][0].length > trimIndent)
          chompStart = i + 1;
      }
      let value2 = "";
      let sep = "";
      let prevMoreIndented = false;
      for (let i = 0; i < contentStart; ++i)
        value2 += lines2[i][0].slice(trimIndent) + "\n";
      for (let i = contentStart; i < chompStart; ++i) {
        let [indent, content] = lines2[i];
        offset += indent.length + content.length + 1;
        const crlf = content[content.length - 1] === "\r";
        if (crlf)
          content = content.slice(0, -1);
        if (content && indent.length < trimIndent) {
          const src = header.indent ? "explicit indentation indicator" : "first line";
          const message = `Block scalar lines must not be less indented than their ${src}`;
          onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
          indent = "";
        }
        if (type === Scalar.Scalar.BLOCK_LITERAL) {
          value2 += sep + indent.slice(trimIndent) + content;
          sep = "\n";
        } else if (indent.length > trimIndent || content[0] === "	") {
          if (sep === " ")
            sep = "\n";
          else if (!prevMoreIndented && sep === "\n")
            sep = "\n\n";
          value2 += sep + indent.slice(trimIndent) + content;
          sep = "\n";
          prevMoreIndented = true;
        } else if (content === "") {
          if (sep === "\n")
            value2 += "\n";
          else
            sep = "\n";
        } else {
          value2 += sep + content;
          sep = " ";
          prevMoreIndented = false;
        }
      }
      switch (header.chomp) {
        case "-":
          break;
        case "+":
          for (let i = chompStart; i < lines2.length; ++i)
            value2 += "\n" + lines2[i][0].slice(trimIndent);
          if (value2[value2.length - 1] !== "\n")
            value2 += "\n";
          break;
        default:
          value2 += "\n";
      }
      const end = start + header.length + scalar.source.length;
      return { value: value2, type, comment: header.comment, range: [start, end, end] };
    }
    function parseBlockScalarHeader({ offset, props }, strict, onError) {
      if (props[0].type !== "block-scalar-header") {
        onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
        return null;
      }
      const { source } = props[0];
      const mode = source[0];
      let indent = 0;
      let chomp = "";
      let error = -1;
      for (let i = 1; i < source.length; ++i) {
        const ch = source[i];
        if (!chomp && (ch === "-" || ch === "+"))
          chomp = ch;
        else {
          const n = Number(ch);
          if (!indent && n)
            indent = n;
          else if (error === -1)
            error = offset + i;
        }
      }
      if (error !== -1)
        onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
      let hasSpace = false;
      let comment = "";
      let length = source.length;
      for (let i = 1; i < props.length; ++i) {
        const token = props[i];
        switch (token.type) {
          case "space":
            hasSpace = true;
          // fallthrough
          case "newline":
            length += token.source.length;
            break;
          case "comment":
            if (strict && !hasSpace) {
              const message = "Comments must be separated from other tokens by white space characters";
              onError(token, "MISSING_CHAR", message);
            }
            length += token.source.length;
            comment = token.source.substring(1);
            break;
          case "error":
            onError(token, "UNEXPECTED_TOKEN", token.message);
            length += token.source.length;
            break;
          /* istanbul ignore next should not happen */
          default: {
            const message = `Unexpected token in block scalar header: ${token.type}`;
            onError(token, "UNEXPECTED_TOKEN", message);
            const ts = token.source;
            if (ts && typeof ts === "string")
              length += ts.length;
          }
        }
      }
      return { mode, indent, chomp, comment, length };
    }
    function splitLines(source) {
      const split = source.split(/\n( *)/);
      const first = split[0];
      const m = first.match(/^( *)/);
      const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
      const lines2 = [line0];
      for (let i = 1; i < split.length; i += 2)
        lines2.push([split[i], split[i + 1]]);
      return lines2;
    }
    exports.resolveBlockScalar = resolveBlockScalar;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/resolve-flow-scalar.js
var require_resolve_flow_scalar = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/resolve-flow-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var resolveEnd = require_resolve_end();
    function resolveFlowScalar(scalar, strict, onError) {
      const { offset, type, source, end } = scalar;
      let _type;
      let value2;
      const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
      switch (type) {
        case "scalar":
          _type = Scalar.Scalar.PLAIN;
          value2 = plainValue(source, _onError);
          break;
        case "single-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_SINGLE;
          value2 = singleQuotedValue(source, _onError);
          break;
        case "double-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_DOUBLE;
          value2 = doubleQuotedValue(source, _onError);
          break;
        /* istanbul ignore next should not happen */
        default:
          onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
          return {
            value: "",
            type: null,
            comment: "",
            range: [offset, offset + source.length, offset + source.length]
          };
      }
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
      return {
        value: value2,
        type: _type,
        comment: re.comment,
        range: [offset, valueEnd, re.offset]
      };
    }
    function plainValue(source, onError) {
      let badChar = "";
      switch (source[0]) {
        /* istanbul ignore next should not happen */
        case "	":
          badChar = "a tab character";
          break;
        case ",":
          badChar = "flow indicator character ,";
          break;
        case "%":
          badChar = "directive indicator character %";
          break;
        case "|":
        case ">": {
          badChar = `block scalar indicator ${source[0]}`;
          break;
        }
        case "@":
        case "`": {
          badChar = `reserved character ${source[0]}`;
          break;
        }
      }
      if (badChar)
        onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
      return foldLines(source);
    }
    function singleQuotedValue(source, onError) {
      if (source[source.length - 1] !== "'" || source.length === 1)
        onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
      return foldLines(source.slice(1, -1)).replace(/''/g, "'");
    }
    function foldLines(source) {
      let first, line;
      try {
        first = new RegExp("(.*?)(?<![ 	])[ 	]*\r?\n", "sy");
        line = new RegExp("[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?\n", "sy");
      } catch {
        first = /(.*?)[ \t]*\r?\n/sy;
        line = /[ \t]*(.*?)[ \t]*\r?\n/sy;
      }
      let match = first.exec(source);
      if (!match)
        return source;
      let res = match[1];
      let sep = " ";
      let pos = first.lastIndex;
      line.lastIndex = pos;
      while (match = line.exec(source)) {
        if (match[1] === "") {
          if (sep === "\n")
            res += sep;
          else
            sep = "\n";
        } else {
          res += sep + match[1];
          sep = " ";
        }
        pos = line.lastIndex;
      }
      const last = /[ \t]*(.*)/sy;
      last.lastIndex = pos;
      match = last.exec(source);
      return res + sep + (match?.[1] ?? "");
    }
    function doubleQuotedValue(source, onError) {
      let res = "";
      for (let i = 1; i < source.length - 1; ++i) {
        const ch = source[i];
        if (ch === "\r" && source[i + 1] === "\n")
          continue;
        if (ch === "\n") {
          const { fold, offset } = foldNewline(source, i);
          res += fold;
          i = offset;
        } else if (ch === "\\") {
          let next = source[++i];
          const cc = escapeCodes[next];
          if (cc)
            res += cc;
          else if (next === "\n") {
            next = source[i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "\r" && source[i + 1] === "\n") {
            next = source[++i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "x" || next === "u" || next === "U") {
            const length = { x: 2, u: 4, U: 8 }[next];
            res += parseCharCode(source, i + 1, length, onError);
            i += length;
          } else {
            const raw = source.substr(i - 1, 2);
            onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
            res += raw;
          }
        } else if (ch === " " || ch === "	") {
          const wsStart = i;
          let next = source[i + 1];
          while (next === " " || next === "	")
            next = source[++i + 1];
          if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n"))
            res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
        } else {
          res += ch;
        }
      }
      if (source[source.length - 1] !== '"' || source.length === 1)
        onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
      return res;
    }
    function foldNewline(source, offset) {
      let fold = "";
      let ch = source[offset + 1];
      while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
        if (ch === "\r" && source[offset + 2] !== "\n")
          break;
        if (ch === "\n")
          fold += "\n";
        offset += 1;
        ch = source[offset + 1];
      }
      if (!fold)
        fold = " ";
      return { fold, offset };
    }
    var escapeCodes = {
      "0": "\0",
      // null character
      a: "\x07",
      // bell character
      b: "\b",
      // backspace
      e: "\x1B",
      // escape character
      f: "\f",
      // form feed
      n: "\n",
      // line feed
      r: "\r",
      // carriage return
      t: "	",
      // horizontal tab
      v: "\v",
      // vertical tab
      N: "\x85",
      // Unicode next line
      _: "\xA0",
      // Unicode non-breaking space
      L: "\u2028",
      // Unicode line separator
      P: "\u2029",
      // Unicode paragraph separator
      " ": " ",
      '"': '"',
      "/": "/",
      "\\": "\\",
      "	": "	"
    };
    function parseCharCode(source, offset, length, onError) {
      const cc = source.substr(offset, length);
      const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
      const code = ok ? parseInt(cc, 16) : NaN;
      if (isNaN(code)) {
        const raw = source.substr(offset - 2, length + 2);
        onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
        return raw;
      }
      return String.fromCodePoint(code);
    }
    exports.resolveFlowScalar = resolveFlowScalar;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/compose-scalar.js
var require_compose_scalar = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/compose-scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    function composeScalar(ctx, token, tagToken, onError) {
      const { value: value2, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar.resolveBlockScalar(ctx, token, onError) : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError);
      const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
      let tag;
      if (ctx.options.stringKeys && ctx.atKey) {
        tag = ctx.schema[identity.SCALAR];
      } else if (tagName)
        tag = findScalarTagByName(ctx.schema, value2, tagName, tagToken, onError);
      else if (token.type === "scalar")
        tag = findScalarTagByTest(ctx, value2, token, onError);
      else
        tag = ctx.schema[identity.SCALAR];
      let scalar;
      try {
        const res = tag.resolve(value2, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
        scalar = identity.isScalar(res) ? res : new Scalar.Scalar(res);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
        scalar = new Scalar.Scalar(value2);
      }
      scalar.range = range;
      scalar.source = value2;
      if (type)
        scalar.type = type;
      if (tagName)
        scalar.tag = tagName;
      if (tag.format)
        scalar.format = tag.format;
      if (comment)
        scalar.comment = comment;
      return scalar;
    }
    function findScalarTagByName(schema, value2, tagName, tagToken, onError) {
      if (tagName === "!")
        return schema[identity.SCALAR];
      const matchWithTest = [];
      for (const tag of schema.tags) {
        if (!tag.collection && tag.tag === tagName) {
          if (tag.default && tag.test)
            matchWithTest.push(tag);
          else
            return tag;
        }
      }
      for (const tag of matchWithTest)
        if (tag.test?.test(value2))
          return tag;
      const kt = schema.knownTags[tagName];
      if (kt && !kt.collection) {
        schema.tags.push(Object.assign({}, kt, { default: false, test: void 0 }));
        return kt;
      }
      onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
      return schema[identity.SCALAR];
    }
    function findScalarTagByTest({ atKey, directives, schema }, value2, token, onError) {
      const tag = schema.tags.find((tag2) => (tag2.default === true || atKey && tag2.default === "key") && tag2.test?.test(value2)) || schema[identity.SCALAR];
      if (schema.compat) {
        const compat = schema.compat.find((tag2) => tag2.default && tag2.test?.test(value2)) ?? schema[identity.SCALAR];
        if (tag.tag !== compat.tag) {
          const ts = directives.tagString(tag.tag);
          const cs = directives.tagString(compat.tag);
          const msg = `Value may be parsed as either ${ts} or ${cs}`;
          onError(token, "TAG_RESOLVE_FAILED", msg, true);
        }
      }
      return tag;
    }
    exports.composeScalar = composeScalar;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/util-empty-scalar-position.js
var require_util_empty_scalar_position = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/util-empty-scalar-position.js"(exports) {
    "use strict";
    function emptyScalarPosition(offset, before, pos) {
      if (before) {
        pos ?? (pos = before.length);
        for (let i = pos - 1; i >= 0; --i) {
          let st = before[i];
          switch (st.type) {
            case "space":
            case "comment":
            case "newline":
              offset -= st.source.length;
              continue;
          }
          st = before[++i];
          while (st?.type === "space") {
            offset += st.source.length;
            st = before[++i];
          }
          break;
        }
      }
      return offset;
    }
    exports.emptyScalarPosition = emptyScalarPosition;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/compose-node.js
var require_compose_node = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/compose-node.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var composeCollection = require_compose_collection();
    var composeScalar = require_compose_scalar();
    var resolveEnd = require_resolve_end();
    var utilEmptyScalarPosition = require_util_empty_scalar_position();
    var CN = { composeNode, composeEmptyNode };
    function composeNode(ctx, token, props, onError) {
      const atKey = ctx.atKey;
      const { spaceBefore, comment, anchor, tag } = props;
      let node;
      let isSrcToken = true;
      switch (token.type) {
        case "alias":
          node = composeAlias(ctx, token, onError);
          if (anchor || tag)
            onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
          break;
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "block-scalar":
          node = composeScalar.composeScalar(ctx, token, tag, onError);
          if (anchor)
            node.anchor = anchor.source.substring(1);
          break;
        case "block-map":
        case "block-seq":
        case "flow-collection":
          node = composeCollection.composeCollection(CN, ctx, token, props, onError);
          if (anchor)
            node.anchor = anchor.source.substring(1);
          break;
        default: {
          const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
          onError(token, "UNEXPECTED_TOKEN", message);
          node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError);
          isSrcToken = false;
        }
      }
      if (anchor && node.anchor === "")
        onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      if (atKey && ctx.options.stringKeys && (!identity.isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) {
        const msg = "With stringKeys, all keys must be strings";
        onError(tag ?? token, "NON_STRING_KEY", msg);
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        if (token.type === "scalar" && token.source === "")
          node.comment = comment;
        else
          node.commentBefore = comment;
      }
      if (ctx.options.keepSourceTokens && isSrcToken)
        node.srcToken = token;
      return node;
    }
    function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
      const token = {
        type: "scalar",
        offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
        indent: -1,
        source: ""
      };
      const node = composeScalar.composeScalar(ctx, token, tag, onError);
      if (anchor) {
        node.anchor = anchor.source.substring(1);
        if (node.anchor === "")
          onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        node.comment = comment;
        node.range[2] = end;
      }
      return node;
    }
    function composeAlias({ options }, { offset, source, end }, onError) {
      const alias = new Alias.Alias(source.substring(1));
      if (alias.source === "")
        onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
      if (alias.source.endsWith(":"))
        onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
      alias.range = [offset, valueEnd, re.offset];
      if (re.comment)
        alias.comment = re.comment;
      return alias;
    }
    exports.composeEmptyNode = composeEmptyNode;
    exports.composeNode = composeNode;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/compose-doc.js
var require_compose_doc = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/compose-doc.js"(exports) {
    "use strict";
    var Document = require_Document();
    var composeNode = require_compose_node();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    function composeDoc(options, directives, { offset, start, value: value2, end }, onError) {
      const opts = Object.assign({ _directives: directives }, options);
      const doc = new Document.Document(void 0, opts);
      const ctx = {
        atKey: false,
        atRoot: true,
        directives: doc.directives,
        options: doc.options,
        schema: doc.schema
      };
      const props = resolveProps.resolveProps(start, {
        indicator: "doc-start",
        next: value2 ?? end?.[0],
        offset,
        onError,
        parentIndent: 0,
        startOnNewline: true
      });
      if (props.found) {
        doc.directives.docStart = true;
        if (value2 && (value2.type === "block-map" || value2.type === "block-seq") && !props.hasNewline)
          onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
      }
      doc.contents = value2 ? composeNode.composeNode(ctx, value2, props, onError) : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
      const contentEnd = doc.contents.range[2];
      const re = resolveEnd.resolveEnd(end, contentEnd, false, onError);
      if (re.comment)
        doc.comment = re.comment;
      doc.range = [offset, contentEnd, re.offset];
      return doc;
    }
    exports.composeDoc = composeDoc;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/composer.js
var require_composer = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/compose/composer.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var directives = require_directives();
    var Document = require_Document();
    var errors = require_errors();
    var identity = require_identity();
    var composeDoc = require_compose_doc();
    var resolveEnd = require_resolve_end();
    function getErrorPos(src) {
      if (typeof src === "number")
        return [src, src + 1];
      if (Array.isArray(src))
        return src.length === 2 ? src : [src[0], src[1]];
      const { offset, source } = src;
      return [offset, offset + (typeof source === "string" ? source.length : 1)];
    }
    function parsePrelude(prelude) {
      let comment = "";
      let atComment = false;
      let afterEmptyLine = false;
      for (let i = 0; i < prelude.length; ++i) {
        const source = prelude[i];
        switch (source[0]) {
          case "#":
            comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
            atComment = true;
            afterEmptyLine = false;
            break;
          case "%":
            if (prelude[i + 1]?.[0] !== "#")
              i += 1;
            atComment = false;
            break;
          default:
            if (!atComment)
              afterEmptyLine = true;
            atComment = false;
        }
      }
      return { comment, afterEmptyLine };
    }
    var Composer = class {
      constructor(options = {}) {
        this.doc = null;
        this.atDirectives = false;
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
        this.onError = (source, code, message, warning) => {
          const pos = getErrorPos(source);
          if (warning)
            this.warnings.push(new errors.YAMLWarning(pos, code, message));
          else
            this.errors.push(new errors.YAMLParseError(pos, code, message));
        };
        this.directives = new directives.Directives({ version: options.version || "1.2" });
        this.options = options;
      }
      decorate(doc, afterDoc) {
        const { comment, afterEmptyLine } = parsePrelude(this.prelude);
        if (comment) {
          const dc = doc.contents;
          if (afterDoc) {
            doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
          } else if (afterEmptyLine || doc.directives.docStart || !dc) {
            doc.commentBefore = comment;
          } else if (identity.isCollection(dc) && !dc.flow && dc.items.length > 0) {
            let it = dc.items[0];
            if (identity.isPair(it))
              it = it.key;
            const cb = it.commentBefore;
            it.commentBefore = cb ? `${comment}
${cb}` : comment;
          } else {
            const cb = dc.commentBefore;
            dc.commentBefore = cb ? `${comment}
${cb}` : comment;
          }
        }
        if (afterDoc) {
          Array.prototype.push.apply(doc.errors, this.errors);
          Array.prototype.push.apply(doc.warnings, this.warnings);
        } else {
          doc.errors = this.errors;
          doc.warnings = this.warnings;
        }
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
      }
      /**
       * Current stream status information.
       *
       * Mostly useful at the end of input for an empty stream.
       */
      streamInfo() {
        return {
          comment: parsePrelude(this.prelude).comment,
          directives: this.directives,
          errors: this.errors,
          warnings: this.warnings
        };
      }
      /**
       * Compose tokens into documents.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *compose(tokens, forceDoc = false, endOffset = -1) {
        for (const token of tokens)
          yield* this.next(token);
        yield* this.end(forceDoc, endOffset);
      }
      /** Advance the composer by one CST token. */
      *next(token) {
        if (node_process.env.LOG_STREAM)
          console.dir(token, { depth: null });
        switch (token.type) {
          case "directive":
            this.directives.add(token.source, (offset, message, warning) => {
              const pos = getErrorPos(token);
              pos[0] += offset;
              this.onError(pos, "BAD_DIRECTIVE", message, warning);
            });
            this.prelude.push(token.source);
            this.atDirectives = true;
            break;
          case "document": {
            const doc = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
            if (this.atDirectives && !doc.directives.docStart)
              this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
            this.decorate(doc, false);
            if (this.doc)
              yield this.doc;
            this.doc = doc;
            this.atDirectives = false;
            break;
          }
          case "byte-order-mark":
          case "space":
            break;
          case "comment":
          case "newline":
            this.prelude.push(token.source);
            break;
          case "error": {
            const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
            const error = new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
            if (this.atDirectives || !this.doc)
              this.errors.push(error);
            else
              this.doc.errors.push(error);
            break;
          }
          case "doc-end": {
            if (!this.doc) {
              const msg = "Unexpected doc-end without preceding document";
              this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
              break;
            }
            this.doc.directives.docEnd = true;
            const end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
            this.decorate(this.doc, true);
            if (end.comment) {
              const dc = this.doc.comment;
              this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
            }
            this.doc.range[2] = end.offset;
            break;
          }
          default:
            this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
        }
      }
      /**
       * Call at end of input to yield any remaining document.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *end(forceDoc = false, endOffset = -1) {
        if (this.doc) {
          this.decorate(this.doc, true);
          yield this.doc;
          this.doc = null;
        } else if (forceDoc) {
          const opts = Object.assign({ _directives: this.directives }, this.options);
          const doc = new Document.Document(void 0, opts);
          if (this.atDirectives)
            this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
          doc.range = [0, endOffset, endOffset];
          this.decorate(doc, false);
          yield doc;
        }
      }
    };
    exports.Composer = Composer;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/parse/cst-scalar.js
var require_cst_scalar = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/parse/cst-scalar.js"(exports) {
    "use strict";
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    var errors = require_errors();
    var stringifyString = require_stringifyString();
    function resolveAsScalar(token, strict = true, onError) {
      if (token) {
        const _onError = (pos, code, message) => {
          const offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
          if (onError)
            onError(offset, code, message);
          else
            throw new errors.YAMLParseError([offset, offset + 1], code, message);
        };
        switch (token.type) {
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
          case "block-scalar":
            return resolveBlockScalar.resolveBlockScalar({ options: { strict } }, token, _onError);
        }
      }
      return null;
    }
    function createScalarToken(value2, context) {
      const { implicitKey = false, indent, inFlow = false, offset = -1, type = "PLAIN" } = context;
      const source = stringifyString.stringifyString({ type, value: value2 }, {
        implicitKey,
        indent: indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      const end = context.end ?? [
        { type: "newline", offset: -1, indent, source: "\n" }
      ];
      switch (source[0]) {
        case "|":
        case ">": {
          const he = source.indexOf("\n");
          const head = source.substring(0, he);
          const body = source.substring(he + 1) + "\n";
          const props = [
            { type: "block-scalar-header", offset, indent, source: head }
          ];
          if (!addEndtoBlockProps(props, end))
            props.push({ type: "newline", offset: -1, indent, source: "\n" });
          return { type: "block-scalar", offset, indent, props, source: body };
        }
        case '"':
          return { type: "double-quoted-scalar", offset, indent, source, end };
        case "'":
          return { type: "single-quoted-scalar", offset, indent, source, end };
        default:
          return { type: "scalar", offset, indent, source, end };
      }
    }
    function setScalarValue(token, value2, context = {}) {
      let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
      let indent = "indent" in token ? token.indent : null;
      if (afterKey && typeof indent === "number")
        indent += 2;
      if (!type)
        switch (token.type) {
          case "single-quoted-scalar":
            type = "QUOTE_SINGLE";
            break;
          case "double-quoted-scalar":
            type = "QUOTE_DOUBLE";
            break;
          case "block-scalar": {
            const header = token.props[0];
            if (header.type !== "block-scalar-header")
              throw new Error("Invalid block scalar header");
            type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
            break;
          }
          default:
            type = "PLAIN";
        }
      const source = stringifyString.stringifyString({ type, value: value2 }, {
        implicitKey: implicitKey || indent === null,
        indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      switch (source[0]) {
        case "|":
        case ">":
          setBlockScalarValue(token, source);
          break;
        case '"':
          setFlowScalarValue(token, source, "double-quoted-scalar");
          break;
        case "'":
          setFlowScalarValue(token, source, "single-quoted-scalar");
          break;
        default:
          setFlowScalarValue(token, source, "scalar");
      }
    }
    function setBlockScalarValue(token, source) {
      const he = source.indexOf("\n");
      const head = source.substring(0, he);
      const body = source.substring(he + 1) + "\n";
      if (token.type === "block-scalar") {
        const header = token.props[0];
        if (header.type !== "block-scalar-header")
          throw new Error("Invalid block scalar header");
        header.source = head;
        token.source = body;
      } else {
        const { offset } = token;
        const indent = "indent" in token ? token.indent : -1;
        const props = [
          { type: "block-scalar-header", offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, "end" in token ? token.end : void 0))
          props.push({ type: "newline", offset: -1, indent, source: "\n" });
        for (const key of Object.keys(token))
          if (key !== "type" && key !== "offset")
            delete token[key];
        Object.assign(token, { type: "block-scalar", indent, props, source: body });
      }
    }
    function addEndtoBlockProps(props, end) {
      if (end)
        for (const st of end)
          switch (st.type) {
            case "space":
            case "comment":
              props.push(st);
              break;
            case "newline":
              props.push(st);
              return true;
          }
      return false;
    }
    function setFlowScalarValue(token, source, type) {
      switch (token.type) {
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          token.type = type;
          token.source = source;
          break;
        case "block-scalar": {
          const end = token.props.slice(1);
          let oa = source.length;
          if (token.props[0].type === "block-scalar-header")
            oa -= token.props[0].source.length;
          for (const tok of end)
            tok.offset += oa;
          delete token.props;
          Object.assign(token, { type, source, end });
          break;
        }
        case "block-map":
        case "block-seq": {
          const offset = token.offset + source.length;
          const nl = { type: "newline", offset, indent: token.indent, source: "\n" };
          delete token.items;
          Object.assign(token, { type, source, end: [nl] });
          break;
        }
        default: {
          const indent = "indent" in token ? token.indent : -1;
          const end = "end" in token && Array.isArray(token.end) ? token.end.filter((st) => st.type === "space" || st.type === "comment" || st.type === "newline") : [];
          for (const key of Object.keys(token))
            if (key !== "type" && key !== "offset")
              delete token[key];
          Object.assign(token, { type, indent, source, end });
        }
      }
    }
    exports.createScalarToken = createScalarToken;
    exports.resolveAsScalar = resolveAsScalar;
    exports.setScalarValue = setScalarValue;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/parse/cst-stringify.js
var require_cst_stringify = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/parse/cst-stringify.js"(exports) {
    "use strict";
    var stringify = (cst) => "type" in cst ? stringifyToken(cst) : stringifyItem(cst);
    function stringifyToken(token) {
      switch (token.type) {
        case "block-scalar": {
          let res = "";
          for (const tok of token.props)
            res += stringifyToken(tok);
          return res + token.source;
        }
        case "block-map":
        case "block-seq": {
          let res = "";
          for (const item of token.items)
            res += stringifyItem(item);
          return res;
        }
        case "flow-collection": {
          let res = token.start.source;
          for (const item of token.items)
            res += stringifyItem(item);
          for (const st of token.end)
            res += st.source;
          return res;
        }
        case "document": {
          let res = stringifyItem(token);
          if (token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
        default: {
          let res = token.source;
          if ("end" in token && token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
      }
    }
    function stringifyItem({ start, key, sep, value: value2 }) {
      let res = "";
      for (const st of start)
        res += st.source;
      if (key)
        res += stringifyToken(key);
      if (sep)
        for (const st of sep)
          res += st.source;
      if (value2)
        res += stringifyToken(value2);
      return res;
    }
    exports.stringify = stringify;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/parse/cst-visit.js
var require_cst_visit = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/parse/cst-visit.js"(exports) {
    "use strict";
    var BREAK = Symbol("break visit");
    var SKIP = Symbol("skip children");
    var REMOVE = Symbol("remove item");
    function visit2(cst, visitor) {
      if ("type" in cst && cst.type === "document")
        cst = { start: cst.start, value: cst.value };
      _visit(Object.freeze([]), cst, visitor);
    }
    visit2.BREAK = BREAK;
    visit2.SKIP = SKIP;
    visit2.REMOVE = REMOVE;
    visit2.itemAtPath = (cst, path2) => {
      let item = cst;
      for (const [field, index] of path2) {
        const tok = item?.[field];
        if (tok && "items" in tok) {
          item = tok.items[index];
        } else
          return void 0;
      }
      return item;
    };
    visit2.parentCollection = (cst, path2) => {
      const parent = visit2.itemAtPath(cst, path2.slice(0, -1));
      const field = path2[path2.length - 1][0];
      const coll = parent?.[field];
      if (coll && "items" in coll)
        return coll;
      throw new Error("Parent collection not found");
    };
    function _visit(path2, item, visitor) {
      let ctrl = visitor(item, path2);
      if (typeof ctrl === "symbol")
        return ctrl;
      for (const field of ["key", "value"]) {
        const token = item[field];
        if (token && "items" in token) {
          for (let i = 0; i < token.items.length; ++i) {
            const ci = _visit(Object.freeze(path2.concat([[field, i]])), token.items[i], visitor);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              token.items.splice(i, 1);
              i -= 1;
            }
          }
          if (typeof ctrl === "function" && field === "key")
            ctrl = ctrl(item, path2);
        }
      }
      return typeof ctrl === "function" ? ctrl(item, path2) : ctrl;
    }
    exports.visit = visit2;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/parse/cst.js
var require_cst = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/parse/cst.js"(exports) {
    "use strict";
    var cstScalar = require_cst_scalar();
    var cstStringify = require_cst_stringify();
    var cstVisit = require_cst_visit();
    var BOM = "\uFEFF";
    var DOCUMENT = "";
    var FLOW_END = "";
    var SCALAR = "";
    var isCollection = (token) => !!token && "items" in token;
    var isScalar = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
    function prettyToken(token) {
      switch (token) {
        case BOM:
          return "<BOM>";
        case DOCUMENT:
          return "<DOC>";
        case FLOW_END:
          return "<FLOW_END>";
        case SCALAR:
          return "<SCALAR>";
        default:
          return JSON.stringify(token);
      }
    }
    function tokenType(source) {
      switch (source) {
        case BOM:
          return "byte-order-mark";
        case DOCUMENT:
          return "doc-mode";
        case FLOW_END:
          return "flow-error-end";
        case SCALAR:
          return "scalar";
        case "---":
          return "doc-start";
        case "...":
          return "doc-end";
        case "":
        case "\n":
        case "\r\n":
          return "newline";
        case "-":
          return "seq-item-ind";
        case "?":
          return "explicit-key-ind";
        case ":":
          return "map-value-ind";
        case "{":
          return "flow-map-start";
        case "}":
          return "flow-map-end";
        case "[":
          return "flow-seq-start";
        case "]":
          return "flow-seq-end";
        case ",":
          return "comma";
      }
      switch (source[0]) {
        case " ":
        case "	":
          return "space";
        case "#":
          return "comment";
        case "%":
          return "directive-line";
        case "*":
          return "alias";
        case "&":
          return "anchor";
        case "!":
          return "tag";
        case "'":
          return "single-quoted-scalar";
        case '"':
          return "double-quoted-scalar";
        case "|":
        case ">":
          return "block-scalar-header";
      }
      return null;
    }
    exports.createScalarToken = cstScalar.createScalarToken;
    exports.resolveAsScalar = cstScalar.resolveAsScalar;
    exports.setScalarValue = cstScalar.setScalarValue;
    exports.stringify = cstStringify.stringify;
    exports.visit = cstVisit.visit;
    exports.BOM = BOM;
    exports.DOCUMENT = DOCUMENT;
    exports.FLOW_END = FLOW_END;
    exports.SCALAR = SCALAR;
    exports.isCollection = isCollection;
    exports.isScalar = isScalar;
    exports.prettyToken = prettyToken;
    exports.tokenType = tokenType;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/parse/lexer.js
var require_lexer = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/parse/lexer.js"(exports) {
    "use strict";
    var cst = require_cst();
    function isEmpty(ch) {
      switch (ch) {
        case void 0:
        case " ":
        case "\n":
        case "\r":
        case "	":
          return true;
        default:
          return false;
      }
    }
    var hexDigits = new Set("0123456789ABCDEFabcdef");
    var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
    var flowIndicatorChars = new Set(",[]{}");
    var invalidAnchorChars = new Set(" ,[]{}\n\r	");
    var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
    var Lexer = class {
      constructor() {
        this.atEnd = false;
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        this.buffer = "";
        this.flowKey = false;
        this.flowLevel = 0;
        this.indentNext = 0;
        this.indentValue = 0;
        this.lineEndPos = null;
        this.next = null;
        this.pos = 0;
      }
      /**
       * Generate YAML tokens from the `source` string. If `incomplete`,
       * a part of the last line may be left as a buffer for the next call.
       *
       * @returns A generator of lexical tokens
       */
      *lex(source, incomplete = false) {
        if (source) {
          if (typeof source !== "string")
            throw TypeError("source is not a string");
          this.buffer = this.buffer ? this.buffer + source : source;
          this.lineEndPos = null;
        }
        this.atEnd = !incomplete;
        let next = this.next ?? "stream";
        while (next && (incomplete || this.hasChars(1)))
          next = yield* this.parseNext(next);
      }
      atLineEnd() {
        let i = this.pos;
        let ch = this.buffer[i];
        while (ch === " " || ch === "	")
          ch = this.buffer[++i];
        if (!ch || ch === "#" || ch === "\n")
          return true;
        if (ch === "\r")
          return this.buffer[i + 1] === "\n";
        return false;
      }
      charAt(n) {
        return this.buffer[this.pos + n];
      }
      continueScalar(offset) {
        let ch = this.buffer[offset];
        if (this.indentNext > 0) {
          let indent = 0;
          while (ch === " ")
            ch = this.buffer[++indent + offset];
          if (ch === "\r") {
            const next = this.buffer[indent + offset + 1];
            if (next === "\n" || !next && !this.atEnd)
              return offset + indent + 1;
          }
          return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
        }
        if (ch === "-" || ch === ".") {
          const dt = this.buffer.substr(offset, 3);
          if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
            return -1;
        }
        return offset;
      }
      getLine() {
        let end = this.lineEndPos;
        if (typeof end !== "number" || end !== -1 && end < this.pos) {
          end = this.buffer.indexOf("\n", this.pos);
          this.lineEndPos = end;
        }
        if (end === -1)
          return this.atEnd ? this.buffer.substring(this.pos) : null;
        if (this.buffer[end - 1] === "\r")
          end -= 1;
        return this.buffer.substring(this.pos, end);
      }
      hasChars(n) {
        return this.pos + n <= this.buffer.length;
      }
      setNext(state) {
        this.buffer = this.buffer.substring(this.pos);
        this.pos = 0;
        this.lineEndPos = null;
        this.next = state;
        return null;
      }
      peek(n) {
        return this.buffer.substr(this.pos, n);
      }
      *parseNext(next) {
        switch (next) {
          case "stream":
            return yield* this.parseStream();
          case "line-start":
            return yield* this.parseLineStart();
          case "block-start":
            return yield* this.parseBlockStart();
          case "doc":
            return yield* this.parseDocument();
          case "flow":
            return yield* this.parseFlowCollection();
          case "quoted-scalar":
            return yield* this.parseQuotedScalar();
          case "block-scalar":
            return yield* this.parseBlockScalar();
          case "plain-scalar":
            return yield* this.parsePlainScalar();
        }
      }
      *parseStream() {
        let line = this.getLine();
        if (line === null)
          return this.setNext("stream");
        if (line[0] === cst.BOM) {
          yield* this.pushCount(1);
          line = line.substring(1);
        }
        if (line[0] === "%") {
          let dirEnd = line.length;
          let cs = line.indexOf("#");
          while (cs !== -1) {
            const ch = line[cs - 1];
            if (ch === " " || ch === "	") {
              dirEnd = cs - 1;
              break;
            } else {
              cs = line.indexOf("#", cs + 1);
            }
          }
          while (true) {
            const ch = line[dirEnd - 1];
            if (ch === " " || ch === "	")
              dirEnd -= 1;
            else
              break;
          }
          const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
          yield* this.pushCount(line.length - n);
          this.pushNewline();
          return "stream";
        }
        if (this.atLineEnd()) {
          const sp = yield* this.pushSpaces(true);
          yield* this.pushCount(line.length - sp);
          yield* this.pushNewline();
          return "stream";
        }
        yield cst.DOCUMENT;
        return yield* this.parseLineStart();
      }
      *parseLineStart() {
        const ch = this.charAt(0);
        if (!ch && !this.atEnd)
          return this.setNext("line-start");
        if (ch === "-" || ch === ".") {
          if (!this.atEnd && !this.hasChars(4))
            return this.setNext("line-start");
          const s = this.peek(3);
          if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
            yield* this.pushCount(3);
            this.indentValue = 0;
            this.indentNext = 0;
            return s === "---" ? "doc" : "stream";
          }
        }
        this.indentValue = yield* this.pushSpaces(false);
        if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
          this.indentNext = this.indentValue;
        return yield* this.parseBlockStart();
      }
      *parseBlockStart() {
        const [ch0, ch1] = this.peek(2);
        if (!ch1 && !this.atEnd)
          return this.setNext("block-start");
        if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
          const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
          this.indentNext = this.indentValue + 1;
          this.indentValue += n;
          return yield* this.parseBlockStart();
        }
        return "doc";
      }
      *parseDocument() {
        yield* this.pushSpaces(true);
        const line = this.getLine();
        if (line === null)
          return this.setNext("doc");
        let n = yield* this.pushIndicators();
        switch (line[n]) {
          case "#":
            yield* this.pushCount(line.length - n);
          // fallthrough
          case void 0:
            yield* this.pushNewline();
            return yield* this.parseLineStart();
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel = 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            return "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "doc";
          case '"':
          case "'":
            return yield* this.parseQuotedScalar();
          case "|":
          case ">":
            n += yield* this.parseBlockScalarHeader();
            n += yield* this.pushSpaces(true);
            yield* this.pushCount(line.length - n);
            yield* this.pushNewline();
            return yield* this.parseBlockScalar();
          default:
            return yield* this.parsePlainScalar();
        }
      }
      *parseFlowCollection() {
        let nl, sp;
        let indent = -1;
        do {
          nl = yield* this.pushNewline();
          if (nl > 0) {
            sp = yield* this.pushSpaces(false);
            this.indentValue = indent = sp;
          } else {
            sp = 0;
          }
          sp += yield* this.pushSpaces(true);
        } while (nl + sp > 0);
        const line = this.getLine();
        if (line === null)
          return this.setNext("flow");
        if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
          const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
          if (!atFlowEndMarker) {
            this.flowLevel = 0;
            yield cst.FLOW_END;
            return yield* this.parseLineStart();
          }
        }
        let n = 0;
        while (line[n] === ",") {
          n += yield* this.pushCount(1);
          n += yield* this.pushSpaces(true);
          this.flowKey = false;
        }
        n += yield* this.pushIndicators();
        switch (line[n]) {
          case void 0:
            return "flow";
          case "#":
            yield* this.pushCount(line.length - n);
            return "flow";
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel += 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            this.flowKey = true;
            this.flowLevel -= 1;
            return this.flowLevel ? "flow" : "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "flow";
          case '"':
          case "'":
            this.flowKey = true;
            return yield* this.parseQuotedScalar();
          case ":": {
            const next = this.charAt(1);
            if (this.flowKey || isEmpty(next) || next === ",") {
              this.flowKey = false;
              yield* this.pushCount(1);
              yield* this.pushSpaces(true);
              return "flow";
            }
          }
          // fallthrough
          default:
            this.flowKey = false;
            return yield* this.parsePlainScalar();
        }
      }
      *parseQuotedScalar() {
        const quote = this.charAt(0);
        let end = this.buffer.indexOf(quote, this.pos + 1);
        if (quote === "'") {
          while (end !== -1 && this.buffer[end + 1] === "'")
            end = this.buffer.indexOf("'", end + 2);
        } else {
          while (end !== -1) {
            let n = 0;
            while (this.buffer[end - 1 - n] === "\\")
              n += 1;
            if (n % 2 === 0)
              break;
            end = this.buffer.indexOf('"', end + 1);
          }
        }
        const qb = this.buffer.substring(0, end);
        let nl = qb.indexOf("\n", this.pos);
        if (nl !== -1) {
          while (nl !== -1) {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = qb.indexOf("\n", cs);
          }
          if (nl !== -1) {
            end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
          }
        }
        if (end === -1) {
          if (!this.atEnd)
            return this.setNext("quoted-scalar");
          end = this.buffer.length;
        }
        yield* this.pushToIndex(end + 1, false);
        return this.flowLevel ? "flow" : "doc";
      }
      *parseBlockScalarHeader() {
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        let i = this.pos;
        while (true) {
          const ch = this.buffer[++i];
          if (ch === "+")
            this.blockScalarKeep = true;
          else if (ch > "0" && ch <= "9")
            this.blockScalarIndent = Number(ch) - 1;
          else if (ch !== "-")
            break;
        }
        return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
      }
      *parseBlockScalar() {
        let nl = this.pos - 1;
        let indent = 0;
        let ch;
        loop: for (let i2 = this.pos; ch = this.buffer[i2]; ++i2) {
          switch (ch) {
            case " ":
              indent += 1;
              break;
            case "\n":
              nl = i2;
              indent = 0;
              break;
            case "\r": {
              const next = this.buffer[i2 + 1];
              if (!next && !this.atEnd)
                return this.setNext("block-scalar");
              if (next === "\n")
                break;
            }
            // fallthrough
            default:
              break loop;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("block-scalar");
        if (indent >= this.indentNext) {
          if (this.blockScalarIndent === -1)
            this.indentNext = indent;
          else {
            this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
          }
          do {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = this.buffer.indexOf("\n", cs);
          } while (nl !== -1);
          if (nl === -1) {
            if (!this.atEnd)
              return this.setNext("block-scalar");
            nl = this.buffer.length;
          }
        }
        let i = nl + 1;
        ch = this.buffer[i];
        while (ch === " ")
          ch = this.buffer[++i];
        if (ch === "	") {
          while (ch === "	" || ch === " " || ch === "\r" || ch === "\n")
            ch = this.buffer[++i];
          nl = i - 1;
        } else if (!this.blockScalarKeep) {
          do {
            let i2 = nl - 1;
            let ch2 = this.buffer[i2];
            if (ch2 === "\r")
              ch2 = this.buffer[--i2];
            const lastChar = i2;
            while (ch2 === " ")
              ch2 = this.buffer[--i2];
            if (ch2 === "\n" && i2 >= this.pos && i2 + 1 + indent > lastChar)
              nl = i2;
            else
              break;
          } while (true);
        }
        yield cst.SCALAR;
        yield* this.pushToIndex(nl + 1, true);
        return yield* this.parseLineStart();
      }
      *parsePlainScalar() {
        const inFlow = this.flowLevel > 0;
        let end = this.pos - 1;
        let i = this.pos - 1;
        let ch;
        while (ch = this.buffer[++i]) {
          if (ch === ":") {
            const next = this.buffer[i + 1];
            if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
              break;
            end = i;
          } else if (isEmpty(ch)) {
            let next = this.buffer[i + 1];
            if (ch === "\r") {
              if (next === "\n") {
                i += 1;
                ch = "\n";
                next = this.buffer[i + 1];
              } else
                end = i;
            }
            if (next === "#" || inFlow && flowIndicatorChars.has(next))
              break;
            if (ch === "\n") {
              const cs = this.continueScalar(i + 1);
              if (cs === -1)
                break;
              i = Math.max(i, cs - 2);
            }
          } else {
            if (inFlow && flowIndicatorChars.has(ch))
              break;
            end = i;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("plain-scalar");
        yield cst.SCALAR;
        yield* this.pushToIndex(end + 1, true);
        return inFlow ? "flow" : "doc";
      }
      *pushCount(n) {
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos += n;
          return n;
        }
        return 0;
      }
      *pushToIndex(i, allowEmpty) {
        const s = this.buffer.slice(this.pos, i);
        if (s) {
          yield s;
          this.pos += s.length;
          return s.length;
        } else if (allowEmpty)
          yield "";
        return 0;
      }
      *pushIndicators() {
        switch (this.charAt(0)) {
          case "!":
            return (yield* this.pushTag()) + (yield* this.pushSpaces(true)) + (yield* this.pushIndicators());
          case "&":
            return (yield* this.pushUntil(isNotAnchorChar)) + (yield* this.pushSpaces(true)) + (yield* this.pushIndicators());
          case "-":
          // this is an error
          case "?":
          // this is an error outside flow collections
          case ":": {
            const inFlow = this.flowLevel > 0;
            const ch1 = this.charAt(1);
            if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
              if (!inFlow)
                this.indentNext = this.indentValue + 1;
              else if (this.flowKey)
                this.flowKey = false;
              return (yield* this.pushCount(1)) + (yield* this.pushSpaces(true)) + (yield* this.pushIndicators());
            }
          }
        }
        return 0;
      }
      *pushTag() {
        if (this.charAt(1) === "<") {
          let i = this.pos + 2;
          let ch = this.buffer[i];
          while (!isEmpty(ch) && ch !== ">")
            ch = this.buffer[++i];
          return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
        } else {
          let i = this.pos + 1;
          let ch = this.buffer[i];
          while (ch) {
            if (tagChars.has(ch))
              ch = this.buffer[++i];
            else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
              ch = this.buffer[i += 3];
            } else
              break;
          }
          return yield* this.pushToIndex(i, false);
        }
      }
      *pushNewline() {
        const ch = this.buffer[this.pos];
        if (ch === "\n")
          return yield* this.pushCount(1);
        else if (ch === "\r" && this.charAt(1) === "\n")
          return yield* this.pushCount(2);
        else
          return 0;
      }
      *pushSpaces(allowTabs) {
        let i = this.pos - 1;
        let ch;
        do {
          ch = this.buffer[++i];
        } while (ch === " " || allowTabs && ch === "	");
        const n = i - this.pos;
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos = i;
        }
        return n;
      }
      *pushUntil(test) {
        let i = this.pos;
        let ch = this.buffer[i];
        while (!test(ch))
          ch = this.buffer[++i];
        return yield* this.pushToIndex(i, false);
      }
    };
    exports.Lexer = Lexer;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/parse/line-counter.js
var require_line_counter = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/parse/line-counter.js"(exports) {
    "use strict";
    var LineCounter = class {
      constructor() {
        this.lineStarts = [];
        this.addNewLine = (offset) => this.lineStarts.push(offset);
        this.linePos = (offset) => {
          let low = 0;
          let high = this.lineStarts.length;
          while (low < high) {
            const mid = low + high >> 1;
            if (this.lineStarts[mid] < offset)
              low = mid + 1;
            else
              high = mid;
          }
          if (this.lineStarts[low] === offset)
            return { line: low + 1, col: 1 };
          if (low === 0)
            return { line: 0, col: offset };
          const start = this.lineStarts[low - 1];
          return { line: low, col: offset - start + 1 };
        };
      }
    };
    exports.LineCounter = LineCounter;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/parse/parser.js
var require_parser = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/parse/parser.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var cst = require_cst();
    var lexer = require_lexer();
    function includesToken(list, type) {
      for (let i = 0; i < list.length; ++i)
        if (list[i].type === type)
          return true;
      return false;
    }
    function findNonEmptyIndex(list) {
      for (let i = 0; i < list.length; ++i) {
        switch (list[i].type) {
          case "space":
          case "comment":
          case "newline":
            break;
          default:
            return i;
        }
      }
      return -1;
    }
    function isFlowToken(token) {
      switch (token?.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "flow-collection":
          return true;
        default:
          return false;
      }
    }
    function getPrevProps(parent) {
      switch (parent.type) {
        case "document":
          return parent.start;
        case "block-map": {
          const it = parent.items[parent.items.length - 1];
          return it.sep ?? it.start;
        }
        case "block-seq":
          return parent.items[parent.items.length - 1].start;
        /* istanbul ignore next should not happen */
        default:
          return [];
      }
    }
    function getFirstKeyStartProps(prev) {
      if (prev.length === 0)
        return [];
      let i = prev.length;
      loop: while (--i >= 0) {
        switch (prev[i].type) {
          case "doc-start":
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
          case "newline":
            break loop;
        }
      }
      while (prev[++i]?.type === "space") {
      }
      return prev.splice(i, prev.length);
    }
    function fixFlowSeqItems(fc) {
      if (fc.start.type === "flow-seq-start") {
        for (const it of fc.items) {
          if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
            if (it.key)
              it.value = it.key;
            delete it.key;
            if (isFlowToken(it.value)) {
              if (it.value.end)
                Array.prototype.push.apply(it.value.end, it.sep);
              else
                it.value.end = it.sep;
            } else
              Array.prototype.push.apply(it.start, it.sep);
            delete it.sep;
          }
        }
      }
    }
    var Parser = class {
      /**
       * @param onNewLine - If defined, called separately with the start position of
       *   each new line (in `parse()`, including the start of input).
       */
      constructor(onNewLine) {
        this.atNewLine = true;
        this.atScalar = false;
        this.indent = 0;
        this.offset = 0;
        this.onKeyLine = false;
        this.stack = [];
        this.source = "";
        this.type = "";
        this.lexer = new lexer.Lexer();
        this.onNewLine = onNewLine;
      }
      /**
       * Parse `source` as a YAML stream.
       * If `incomplete`, a part of the last line may be left as a buffer for the next call.
       *
       * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
       *
       * @returns A generator of tokens representing each directive, document, and other structure.
       */
      *parse(source, incomplete = false) {
        if (this.onNewLine && this.offset === 0)
          this.onNewLine(0);
        for (const lexeme of this.lexer.lex(source, incomplete))
          yield* this.next(lexeme);
        if (!incomplete)
          yield* this.end();
      }
      /**
       * Advance the parser by the `source` of one lexical token.
       */
      *next(source) {
        this.source = source;
        if (node_process.env.LOG_TOKENS)
          console.log("|", cst.prettyToken(source));
        if (this.atScalar) {
          this.atScalar = false;
          yield* this.step();
          this.offset += source.length;
          return;
        }
        const type = cst.tokenType(source);
        if (!type) {
          const message = `Not a YAML token: ${source}`;
          yield* this.pop({ type: "error", offset: this.offset, message, source });
          this.offset += source.length;
        } else if (type === "scalar") {
          this.atNewLine = false;
          this.atScalar = true;
          this.type = "scalar";
        } else {
          this.type = type;
          yield* this.step();
          switch (type) {
            case "newline":
              this.atNewLine = true;
              this.indent = 0;
              if (this.onNewLine)
                this.onNewLine(this.offset + source.length);
              break;
            case "space":
              if (this.atNewLine && source[0] === " ")
                this.indent += source.length;
              break;
            case "explicit-key-ind":
            case "map-value-ind":
            case "seq-item-ind":
              if (this.atNewLine)
                this.indent += source.length;
              break;
            case "doc-mode":
            case "flow-error-end":
              return;
            default:
              this.atNewLine = false;
          }
          this.offset += source.length;
        }
      }
      /** Call at end of input to push out any remaining constructions */
      *end() {
        while (this.stack.length > 0)
          yield* this.pop();
      }
      get sourceToken() {
        const st = {
          type: this.type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
        return st;
      }
      *step() {
        const top = this.peek(1);
        if (this.type === "doc-end" && (!top || top.type !== "doc-end")) {
          while (this.stack.length > 0)
            yield* this.pop();
          this.stack.push({
            type: "doc-end",
            offset: this.offset,
            source: this.source
          });
          return;
        }
        if (!top)
          return yield* this.stream();
        switch (top.type) {
          case "document":
            return yield* this.document(top);
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return yield* this.scalar(top);
          case "block-scalar":
            return yield* this.blockScalar(top);
          case "block-map":
            return yield* this.blockMap(top);
          case "block-seq":
            return yield* this.blockSequence(top);
          case "flow-collection":
            return yield* this.flowCollection(top);
          case "doc-end":
            return yield* this.documentEnd(top);
        }
        yield* this.pop();
      }
      peek(n) {
        return this.stack[this.stack.length - n];
      }
      *pop(error) {
        const token = error ?? this.stack.pop();
        if (!token) {
          const message = "Tried to pop an empty stack";
          yield { type: "error", offset: this.offset, source: "", message };
        } else if (this.stack.length === 0) {
          yield token;
        } else {
          const top = this.peek(1);
          if (token.type === "block-scalar") {
            token.indent = "indent" in top ? top.indent : 0;
          } else if (token.type === "flow-collection" && top.type === "document") {
            token.indent = 0;
          }
          if (token.type === "flow-collection")
            fixFlowSeqItems(token);
          switch (top.type) {
            case "document":
              top.value = token;
              break;
            case "block-scalar":
              top.props.push(token);
              break;
            case "block-map": {
              const it = top.items[top.items.length - 1];
              if (it.value) {
                top.items.push({ start: [], key: token, sep: [] });
                this.onKeyLine = true;
                return;
              } else if (it.sep) {
                it.value = token;
              } else {
                Object.assign(it, { key: token, sep: [] });
                this.onKeyLine = !it.explicitKey;
                return;
              }
              break;
            }
            case "block-seq": {
              const it = top.items[top.items.length - 1];
              if (it.value)
                top.items.push({ start: [], value: token });
              else
                it.value = token;
              break;
            }
            case "flow-collection": {
              const it = top.items[top.items.length - 1];
              if (!it || it.value)
                top.items.push({ start: [], key: token, sep: [] });
              else if (it.sep)
                it.value = token;
              else
                Object.assign(it, { key: token, sep: [] });
              return;
            }
            /* istanbul ignore next should not happen */
            default:
              yield* this.pop();
              yield* this.pop(token);
          }
          if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
            const last = token.items[token.items.length - 1];
            if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
              if (top.type === "document")
                top.end = last.start;
              else
                top.items.push({ start: last.start });
              token.items.splice(-1, 1);
            }
          }
        }
      }
      *stream() {
        switch (this.type) {
          case "directive-line":
            yield { type: "directive", offset: this.offset, source: this.source };
            return;
          case "byte-order-mark":
          case "space":
          case "comment":
          case "newline":
            yield this.sourceToken;
            return;
          case "doc-mode":
          case "doc-start": {
            const doc = {
              type: "document",
              offset: this.offset,
              start: []
            };
            if (this.type === "doc-start")
              doc.start.push(this.sourceToken);
            this.stack.push(doc);
            return;
          }
        }
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML stream`,
          source: this.source
        };
      }
      *document(doc) {
        if (doc.value)
          return yield* this.lineEnd(doc);
        switch (this.type) {
          case "doc-start": {
            if (findNonEmptyIndex(doc.start) !== -1) {
              yield* this.pop();
              yield* this.step();
            } else
              doc.start.push(this.sourceToken);
            return;
          }
          case "anchor":
          case "tag":
          case "space":
          case "comment":
          case "newline":
            doc.start.push(this.sourceToken);
            return;
        }
        const bv = this.startBlockValue(doc);
        if (bv)
          this.stack.push(bv);
        else {
          yield {
            type: "error",
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML document`,
            source: this.source
          };
        }
      }
      *scalar(scalar) {
        if (this.type === "map-value-ind") {
          const prev = getPrevProps(this.peek(2));
          const start = getFirstKeyStartProps(prev);
          let sep;
          if (scalar.end) {
            sep = scalar.end;
            sep.push(this.sourceToken);
            delete scalar.end;
          } else
            sep = [this.sourceToken];
          const map = {
            type: "block-map",
            offset: scalar.offset,
            indent: scalar.indent,
            items: [{ start, key: scalar, sep }]
          };
          this.onKeyLine = true;
          this.stack[this.stack.length - 1] = map;
        } else
          yield* this.lineEnd(scalar);
      }
      *blockScalar(scalar) {
        switch (this.type) {
          case "space":
          case "comment":
          case "newline":
            scalar.props.push(this.sourceToken);
            return;
          case "scalar":
            scalar.source = this.source;
            this.atNewLine = true;
            this.indent = 0;
            if (this.onNewLine) {
              let nl = this.source.indexOf("\n") + 1;
              while (nl !== 0) {
                this.onNewLine(this.offset + nl);
                nl = this.source.indexOf("\n", nl) + 1;
              }
            }
            yield* this.pop();
            break;
          /* istanbul ignore next should not happen */
          default:
            yield* this.pop();
            yield* this.step();
        }
      }
      *blockMap(map) {
        const it = map.items[map.items.length - 1];
        switch (this.type) {
          case "newline":
            this.onKeyLine = false;
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              it.start.push(this.sourceToken);
            }
            return;
          case "space":
          case "comment":
            if (it.value) {
              map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              if (this.atIndentedComment(it.start, map.indent)) {
                const prev = map.items[map.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  Array.prototype.push.apply(end, it.start);
                  end.push(this.sourceToken);
                  map.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
        }
        if (this.indent >= map.indent) {
          const atMapIndent = !this.onKeyLine && this.indent === map.indent;
          const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
          let start = [];
          if (atNextItem && it.sep && !it.value) {
            const nl = [];
            for (let i = 0; i < it.sep.length; ++i) {
              const st = it.sep[i];
              switch (st.type) {
                case "newline":
                  nl.push(i);
                  break;
                case "space":
                  break;
                case "comment":
                  if (st.indent > map.indent)
                    nl.length = 0;
                  break;
                default:
                  nl.length = 0;
              }
            }
            if (nl.length >= 2)
              start = it.sep.splice(nl[1]);
          }
          switch (this.type) {
            case "anchor":
            case "tag":
              if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start });
                this.onKeyLine = true;
              } else if (it.sep) {
                it.sep.push(this.sourceToken);
              } else {
                it.start.push(this.sourceToken);
              }
              return;
            case "explicit-key-ind":
              if (!it.sep && !it.explicitKey) {
                it.start.push(this.sourceToken);
                it.explicitKey = true;
              } else if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start, explicitKey: true });
              } else {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: [this.sourceToken], explicitKey: true }]
                });
              }
              this.onKeyLine = true;
              return;
            case "map-value-ind":
              if (it.explicitKey) {
                if (!it.sep) {
                  if (includesToken(it.start, "newline")) {
                    Object.assign(it, { key: null, sep: [this.sourceToken] });
                  } else {
                    const start2 = getFirstKeyStartProps(it.start);
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                    });
                  }
                } else if (it.value) {
                  map.items.push({ start: [], key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start, key: null, sep: [this.sourceToken] }]
                  });
                } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
                  const start2 = getFirstKeyStartProps(it.start);
                  const key = it.key;
                  const sep = it.sep;
                  sep.push(this.sourceToken);
                  delete it.key;
                  delete it.sep;
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start2, key, sep }]
                  });
                } else if (start.length > 0) {
                  it.sep = it.sep.concat(start, this.sourceToken);
                } else {
                  it.sep.push(this.sourceToken);
                }
              } else {
                if (!it.sep) {
                  Object.assign(it, { key: null, sep: [this.sourceToken] });
                } else if (it.value || atNextItem) {
                  map.items.push({ start, key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: [], key: null, sep: [this.sourceToken] }]
                  });
                } else {
                  it.sep.push(this.sourceToken);
                }
              }
              this.onKeyLine = true;
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (atNextItem || it.value) {
                map.items.push({ start, key: fs, sep: [] });
                this.onKeyLine = true;
              } else if (it.sep) {
                this.stack.push(fs);
              } else {
                Object.assign(it, { key: fs, sep: [] });
                this.onKeyLine = true;
              }
              return;
            }
            default: {
              const bv = this.startBlockValue(map);
              if (bv) {
                if (bv.type === "block-seq") {
                  if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                    yield* this.pop({
                      type: "error",
                      offset: this.offset,
                      message: "Unexpected block-seq-ind on same line with key",
                      source: this.source
                    });
                    return;
                  }
                } else if (atMapIndent) {
                  map.items.push({ start });
                }
                this.stack.push(bv);
                return;
              }
            }
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *blockSequence(seq) {
        const it = seq.items[seq.items.length - 1];
        switch (this.type) {
          case "newline":
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                seq.items.push({ start: [this.sourceToken] });
            } else
              it.start.push(this.sourceToken);
            return;
          case "space":
          case "comment":
            if (it.value)
              seq.items.push({ start: [this.sourceToken] });
            else {
              if (this.atIndentedComment(it.start, seq.indent)) {
                const prev = seq.items[seq.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  Array.prototype.push.apply(end, it.start);
                  end.push(this.sourceToken);
                  seq.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
          case "anchor":
          case "tag":
            if (it.value || this.indent <= seq.indent)
              break;
            it.start.push(this.sourceToken);
            return;
          case "seq-item-ind":
            if (this.indent !== seq.indent)
              break;
            if (it.value || includesToken(it.start, "seq-item-ind"))
              seq.items.push({ start: [this.sourceToken] });
            else
              it.start.push(this.sourceToken);
            return;
        }
        if (this.indent > seq.indent) {
          const bv = this.startBlockValue(seq);
          if (bv) {
            this.stack.push(bv);
            return;
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *flowCollection(fc) {
        const it = fc.items[fc.items.length - 1];
        if (this.type === "flow-error-end") {
          let top;
          do {
            yield* this.pop();
            top = this.peek(1);
          } while (top && top.type === "flow-collection");
        } else if (fc.end.length === 0) {
          switch (this.type) {
            case "comma":
            case "explicit-key-ind":
              if (!it || it.sep)
                fc.items.push({ start: [this.sourceToken] });
              else
                it.start.push(this.sourceToken);
              return;
            case "map-value-ind":
              if (!it || it.value)
                fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              return;
            case "space":
            case "comment":
            case "newline":
            case "anchor":
            case "tag":
              if (!it || it.value)
                fc.items.push({ start: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                it.start.push(this.sourceToken);
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (!it || it.value)
                fc.items.push({ start: [], key: fs, sep: [] });
              else if (it.sep)
                this.stack.push(fs);
              else
                Object.assign(it, { key: fs, sep: [] });
              return;
            }
            case "flow-map-end":
            case "flow-seq-end":
              fc.end.push(this.sourceToken);
              return;
          }
          const bv = this.startBlockValue(fc);
          if (bv)
            this.stack.push(bv);
          else {
            yield* this.pop();
            yield* this.step();
          }
        } else {
          const parent = this.peek(2);
          if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
            yield* this.pop();
            yield* this.step();
          } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            fixFlowSeqItems(fc);
            const sep = fc.end.splice(1, fc.end.length);
            sep.push(this.sourceToken);
            const map = {
              type: "block-map",
              offset: fc.offset,
              indent: fc.indent,
              items: [{ start, key: fc, sep }]
            };
            this.onKeyLine = true;
            this.stack[this.stack.length - 1] = map;
          } else {
            yield* this.lineEnd(fc);
          }
        }
      }
      flowScalar(type) {
        if (this.onNewLine) {
          let nl = this.source.indexOf("\n") + 1;
          while (nl !== 0) {
            this.onNewLine(this.offset + nl);
            nl = this.source.indexOf("\n", nl) + 1;
          }
        }
        return {
          type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
      }
      startBlockValue(parent) {
        switch (this.type) {
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return this.flowScalar(this.type);
          case "block-scalar-header":
            return {
              type: "block-scalar",
              offset: this.offset,
              indent: this.indent,
              props: [this.sourceToken],
              source: ""
            };
          case "flow-map-start":
          case "flow-seq-start":
            return {
              type: "flow-collection",
              offset: this.offset,
              indent: this.indent,
              start: this.sourceToken,
              items: [],
              end: []
            };
          case "seq-item-ind":
            return {
              type: "block-seq",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [this.sourceToken] }]
            };
          case "explicit-key-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            start.push(this.sourceToken);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, explicitKey: true }]
            };
          }
          case "map-value-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, key: null, sep: [this.sourceToken] }]
            };
          }
        }
        return null;
      }
      atIndentedComment(start, indent) {
        if (this.type !== "comment")
          return false;
        if (this.indent <= indent)
          return false;
        return start.every((st) => st.type === "newline" || st.type === "space");
      }
      *documentEnd(docEnd) {
        if (this.type !== "doc-mode") {
          if (docEnd.end)
            docEnd.end.push(this.sourceToken);
          else
            docEnd.end = [this.sourceToken];
          if (this.type === "newline")
            yield* this.pop();
        }
      }
      *lineEnd(token) {
        switch (this.type) {
          case "comma":
          case "doc-start":
          case "doc-end":
          case "flow-seq-end":
          case "flow-map-end":
          case "map-value-ind":
            yield* this.pop();
            yield* this.step();
            break;
          case "newline":
            this.onKeyLine = false;
          // fallthrough
          case "space":
          case "comment":
          default:
            if (token.end)
              token.end.push(this.sourceToken);
            else
              token.end = [this.sourceToken];
            if (this.type === "newline")
              yield* this.pop();
        }
      }
    };
    exports.Parser = Parser;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/public-api.js
var require_public_api = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/public-api.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var errors = require_errors();
    var log = require_log();
    var identity = require_identity();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    function parseOptions(options) {
      const prettyErrors = options.prettyErrors !== false;
      const lineCounter$1 = options.lineCounter || prettyErrors && new lineCounter.LineCounter() || null;
      return { lineCounter: lineCounter$1, prettyErrors };
    }
    function parseAllDocuments(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      const docs = Array.from(composer$1.compose(parser$1.parse(source)));
      if (prettyErrors && lineCounter2)
        for (const doc of docs) {
          doc.errors.forEach(errors.prettifyError(source, lineCounter2));
          doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
        }
      if (docs.length > 0)
        return docs;
      return Object.assign([], { empty: true }, composer$1.streamInfo());
    }
    function parseDocument3(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      let doc = null;
      for (const _doc of composer$1.compose(parser$1.parse(source), true, source.length)) {
        if (!doc)
          doc = _doc;
        else if (doc.options.logLevel !== "silent") {
          doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
          break;
        }
      }
      if (prettyErrors && lineCounter2) {
        doc.errors.forEach(errors.prettifyError(source, lineCounter2));
        doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
      }
      return doc;
    }
    function parse2(src, reviver, options) {
      let _reviver = void 0;
      if (typeof reviver === "function") {
        _reviver = reviver;
      } else if (options === void 0 && reviver && typeof reviver === "object") {
        options = reviver;
      }
      const doc = parseDocument3(src, options);
      if (!doc)
        return null;
      doc.warnings.forEach((warning) => log.warn(doc.options.logLevel, warning));
      if (doc.errors.length > 0) {
        if (doc.options.logLevel !== "silent")
          throw doc.errors[0];
        else
          doc.errors = [];
      }
      return doc.toJS(Object.assign({ reviver: _reviver }, options));
    }
    function stringify(value2, replacer, options) {
      let _replacer = null;
      if (typeof replacer === "function" || Array.isArray(replacer)) {
        _replacer = replacer;
      } else if (options === void 0 && replacer) {
        options = replacer;
      }
      if (typeof options === "string")
        options = options.length;
      if (typeof options === "number") {
        const indent = Math.round(options);
        options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
      }
      if (value2 === void 0) {
        const { keepUndefined } = options ?? replacer ?? {};
        if (!keepUndefined)
          return void 0;
      }
      if (identity.isDocument(value2) && !_replacer)
        return value2.toString(options);
      return new Document.Document(value2, _replacer, options).toString(options);
    }
    exports.parse = parse2;
    exports.parseAllDocuments = parseAllDocuments;
    exports.parseDocument = parseDocument3;
    exports.stringify = stringify;
  }
});

// ../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/index.js
var require_dist = __commonJS({
  "../../node_modules/.pnpm/yaml@2.8.1/node_modules/yaml/dist/index.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var Schema = require_Schema();
    var errors = require_errors();
    var Alias = require_Alias();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var cst = require_cst();
    var lexer = require_lexer();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    var publicApi = require_public_api();
    var visit2 = require_visit();
    exports.Composer = composer.Composer;
    exports.Document = Document.Document;
    exports.Schema = Schema.Schema;
    exports.YAMLError = errors.YAMLError;
    exports.YAMLParseError = errors.YAMLParseError;
    exports.YAMLWarning = errors.YAMLWarning;
    exports.Alias = Alias.Alias;
    exports.isAlias = identity.isAlias;
    exports.isCollection = identity.isCollection;
    exports.isDocument = identity.isDocument;
    exports.isMap = identity.isMap;
    exports.isNode = identity.isNode;
    exports.isPair = identity.isPair;
    exports.isScalar = identity.isScalar;
    exports.isSeq = identity.isSeq;
    exports.Pair = Pair.Pair;
    exports.Scalar = Scalar.Scalar;
    exports.YAMLMap = YAMLMap.YAMLMap;
    exports.YAMLSeq = YAMLSeq.YAMLSeq;
    exports.CST = cst;
    exports.Lexer = lexer.Lexer;
    exports.LineCounter = lineCounter.LineCounter;
    exports.Parser = parser.Parser;
    exports.parse = publicApi.parse;
    exports.parseAllDocuments = publicApi.parseAllDocuments;
    exports.parseDocument = publicApi.parseDocument;
    exports.stringify = publicApi.stringify;
    exports.visit = visit2.visit;
    exports.visitAsync = visit2.visitAsync;
  }
});

// src/main.ts
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// ../engine/src/types.ts
var SEVERITY_ORDER = { info: 0, review: 1, block: 2 };
var EMPTY_INTEL = {
  hashes: /* @__PURE__ */ new Set(),
  markers: [],
  packages: /* @__PURE__ */ new Set(),
  domains: []
};

// ../engine/src/version.ts
var VERSION = "0.1.0";

// ../engine/src/config.ts
var import_picomatch = __toESM(require_picomatch2(), 1);
var import_yaml = __toESM(require_dist(), 1);
var EMPTY_CONFIG = { fixtures: [], allow: [], severity: {} };
var CONFIG_PATH = ".dome.yml";
var SEVERITIES = /* @__PURE__ */ new Set(["info", "review", "block"]);
var RULE_ID = /^DOME-[A-Z]{3}-\d{3}$/;
var ConfigError = class extends Error {
  name = "ConfigError";
};
function parseConfig(text) {
  const doc = (0, import_yaml.parseDocument)(text, { strict: true, uniqueKeys: true });
  if (doc.errors.length) throw new ConfigError("invalid YAML");
  const data = doc.toJS({ maxAliasCount: 10 });
  if (data === null || data === void 0) return EMPTY_CONFIG;
  if (typeof data !== "object" || Array.isArray(data)) throw new ConfigError("top level must be a mapping");
  const raw = data;
  for (const key of Object.keys(raw)) {
    if (!["fixtures", "allow", "severity"].includes(key)) throw new ConfigError(`unknown key: ${key}`);
  }
  const fixtures = raw.fixtures ?? [];
  if (!Array.isArray(fixtures) || !fixtures.every((f) => typeof f === "string" && f.length > 0)) {
    throw new ConfigError("fixtures must be a list of glob strings");
  }
  const allowRaw = raw.allow ?? [];
  if (!Array.isArray(allowRaw)) throw new ConfigError("allow must be a list");
  const allow = allowRaw.map((entry, i) => {
    if (!entry || typeof entry !== "object") throw new ConfigError(`allow[${i}] must be a mapping`);
    const { rule, file, sha256, reason } = entry;
    if (typeof rule !== "string" || !RULE_ID.test(rule)) throw new ConfigError(`allow[${i}].rule must be a rule id`);
    if (typeof file !== "string" || !file) throw new ConfigError(`allow[${i}].file is required`);
    if (typeof sha256 !== "string" || !/^[0-9a-f]{64}$/i.test(sha256)) throw new ConfigError(`allow[${i}].sha256 must be a SHA-256 hex digest`);
    if (typeof reason !== "string" || !reason.trim()) throw new ConfigError(`allow[${i}].reason is required`);
    return { rule, file, sha256: sha256.toLowerCase(), reason };
  });
  const severityRaw = raw.severity ?? {};
  if (!severityRaw || typeof severityRaw !== "object" || Array.isArray(severityRaw)) throw new ConfigError("severity must be a mapping");
  const severity = {};
  for (const [rule, level] of Object.entries(severityRaw)) {
    if (!RULE_ID.test(rule)) throw new ConfigError(`severity: ${rule} is not a rule id`);
    if (typeof level !== "string" || !SEVERITIES.has(level)) throw new ConfigError(`severity.${rule} must be info, review or block`);
    severity[rule] = level;
  }
  return { fixtures, allow, severity };
}
function fixtureMatcher(config) {
  if (config.fixtures.length === 0) return () => false;
  return (0, import_picomatch.default)(config.fixtures, { dot: true });
}

// ../engine/src/grade.ts
var AUTORUN_SURFACES = /* @__PURE__ */ new Set([
  "DOME-VSC-001",
  "DOME-NPM-001",
  "DOME-DEV-001",
  "DOME-AGT-001",
  "DOME-GHA-001",
  "DOME-GIT-002"
]);
var PAYLOAD_PARTNERS = /* @__PURE__ */ new Set(["DOME-AST-001", "DOME-CFG-001", "DOME-CFG-003", "DOME-ENV-001"]);
var FULL_SCAN_SURFACES = /* @__PURE__ */ new Set(["DOME-VSC-001"]);
var FULL_SCAN_PARTNERS = /* @__PURE__ */ new Set(["DOME-AST-001"]);
var COMBINED_SUFFIX = " An auto-run surface in the same change can trigger it.";
function isIndicatorRule(ruleId) {
  return ruleId.startsWith("DOME-IOC-");
}
function sameLocation(a, b) {
  return a.path === b.path && a.line === b.line && a.column === b.column;
}
async function grade({ findings, config, allowLowering = true, scope, hashOf }) {
  const isFixture = fixtureMatcher(config);
  const out = [];
  for (const original of findings) {
    const f = { ...original, locations: [...original.locations], relatedRules: [...original.relatedRules] };
    const override = config.severity[f.ruleId];
    const lowers = override !== void 0 && SEVERITY_ORDER[override] < SEVERITY_ORDER[f.severity];
    if (override && !(lowers && (!allowLowering || isIndicatorRule(f.ruleId)))) {
      f.severity = override;
    }
    if (!isIndicatorRule(f.ruleId)) {
      if (f.locations.length > 0 && f.locations.every((l) => isFixture(l.path))) {
        f.fixture = true;
        f.severity = "info";
      } else {
        const primary = f.locations[0]?.path;
        const entry = config.allow.find((a) => a.rule === f.ruleId && a.file === primary);
        if (entry && primary && await hashOf(primary) === entry.sha256) {
          f.allowed = true;
          f.severity = "info";
        }
      }
    }
    out.push(f);
  }
  const active = (f) => !f.fixture && !f.allowed;
  const absorbed = /* @__PURE__ */ new Set();
  for (const font of out) {
    if (font.ruleId !== "DOME-AST-001" || !active(font)) continue;
    const path2 = font.locations[0]?.path;
    const runner = out.find(
      (f) => f !== font && active(f) && f.severity !== "info" && f.locations.slice(1).some((l) => l.path === path2)
    );
    if (!runner) continue;
    runner.relatedRules.push(font.ruleId);
    runner.relatedRules.sort();
    absorbed.add(font);
  }
  const surfaceRules = scope === "diff" ? AUTORUN_SURFACES : FULL_SCAN_SURFACES;
  const partnerRules = scope === "diff" ? PAYLOAD_PARTNERS : FULL_SCAN_PARTNERS;
  const surfaces = out.filter((f) => active(f) && !absorbed.has(f) && surfaceRules.has(f.ruleId) && f.severity !== "info");
  if (surfaces.length > 0) {
    for (const f of out) {
      if (!active(f) || absorbed.has(f) || !partnerRules.has(f.ruleId) || f.severity === "block" || f.severity === "info") continue;
      f.severity = "block";
      f.reason += COMBINED_SUFFIX;
      for (const s of surfaces) {
        if (!f.relatedRules.includes(s.ruleId)) f.relatedRules.push(s.ruleId);
        for (const loc of s.locations) if (!f.locations.some((l) => sameLocation(l, loc))) f.locations.push(loc);
        absorbed.add(s);
      }
      f.relatedRules.sort();
    }
  }
  const byRule = (id) => out.find((f) => active(f) && !absorbed.has(f) && f.ruleId === id && f.severity !== "info");
  const folderOpen = byRule("DOME-VSC-001");
  const autoTasks = byRule("DOME-VSC-002");
  const hidden = byRule("DOME-VSC-003");
  if (folderOpen && autoTasks && hidden) {
    folderOpen.severity = "block";
    folderOpen.relatedRules.push("DOME-VSC-002", "DOME-VSC-003");
    folderOpen.reason = "A task runs on folder open, automatic tasks are turned on so VS Code does not ask, and the .vscode folder is hidden from view.";
    folderOpen.locations.push(...autoTasks.locations, ...hidden.locations);
    absorbed.add(autoTasks);
    absorbed.add(hidden);
  }
  return out.filter((f) => !absorbed.has(f)).sort(
    (a, b) => SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity] || a.ruleId.localeCompare(b.ruleId) || (a.locations[0]?.path ?? "").localeCompare(b.locations[0]?.path ?? "") || (a.locations[0]?.line ?? 0) - (b.locations[0]?.line ?? 0)
  );
}

// ../engine/src/hash.ts
import { createHash } from "node:crypto";
function sha256Hex(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

// ../engine/src/parsers/errors.ts
var UncheckableInput = class extends Error {
  name = "UncheckableInput";
};

// ../engine/src/report/common.ts
var HONESTY_NOTICE = "No known pattern found is not the same as safe.";
var DOCS_BASE = "https://github.com/dome-security/dome-backend/blob/main/docs/rules";
function ruleDocUrl(ruleId) {
  return `${DOCS_BASE}/${ruleId}.md`;
}
var CONTROL = /[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069]/g;
function sanitizePath(path2) {
  return path2.replace(CONTROL, "\uFFFD");
}
function cleanPath(path2) {
  const cleaned = sanitizePath(path2);
  return cleaned.length > 200 ? `${cleaned.slice(0, 197)}...` : cleaned;
}
function ruleLabel(f) {
  return [f.ruleId, ...f.relatedRules].join(" + ");
}
function counts(result) {
  const out = { block: 0, review: 0, info: 0 };
  for (const f of result.findings) out[f.severity]++;
  return out;
}

// ../engine/src/parsers/text.ts
var decoder = new TextDecoder("utf-8", { fatal: false, ignoreBOM: false });
function decodeText(bytes) {
  return decoder.decode(bytes);
}
var LineIndex = class {
  starts = [0];
  constructor(text) {
    for (let i = 0; i < text.length; i++) {
      if (text.charCodeAt(i) === 10) this.starts.push(i + 1);
    }
  }
  position(offset) {
    let lo = 0;
    let hi = this.starts.length - 1;
    while (lo < hi) {
      const mid = lo + hi + 1 >> 1;
      if (this.starts[mid] <= offset) lo = mid;
      else hi = mid - 1;
    }
    return { line: lo + 1, column: offset - this.starts[lo] + 1 };
  }
};
function basename(p) {
  const slash = p.lastIndexOf("/");
  return slash === -1 ? p : p.slice(slash + 1);
}
function dirname(p) {
  const slash = p.lastIndexOf("/");
  return slash === -1 ? "" : p.slice(0, slash);
}
function extname(p) {
  const base = basename(p);
  const dot = base.lastIndexOf(".");
  return dot <= 0 ? "" : base.slice(dot + 1).toLowerCase();
}
function resolveRepoPath(fromDir, ref) {
  let cleaned = ref.replace(/\\/g, "/");
  cleaned = cleaned.replace(/^\$\{(?:workspaceFolder|workspaceRoot|cwd|fileWorkspaceFolder)\}\/?/, "");
  cleaned = cleaned.replace(/^%~dp0\/?/i, "");
  if (cleaned.startsWith("/") || /^[a-z]+:/i.test(cleaned) || cleaned.startsWith("~")) return void 0;
  const parts = fromDir ? fromDir.split("/") : [];
  for (const part of cleaned.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") {
      if (parts.length === 0) return void 0;
      parts.pop();
    } else {
      parts.push(part);
    }
  }
  return parts.length ? parts.join("/") : void 0;
}
var FONT_EXTENSIONS = /* @__PURE__ */ new Set(["woff", "woff2", "ttf", "otf", "eot"]);
var IMAGE_EXTENSIONS = /* @__PURE__ */ new Set(["png", "jpg", "jpeg", "gif", "webp", "bmp", "ico", "svg", "avif", "tif", "tiff"]);
var MEDIA_EXTENSIONS = /* @__PURE__ */ new Set(["mp3", "mp4", "wav", "ogg", "webm", "pdf", "zip"]);
var NODE_SCRIPT_EXTENSIONS = /* @__PURE__ */ new Set(["js", "mjs", "cjs", "ts", "mts", "cts", "jsx", "tsx", "node", "json"]);
function isAssetPath(p) {
  const ext = extname(p);
  return FONT_EXTENSIONS.has(ext) || IMAGE_EXTENSIONS.has(ext) || MEDIA_EXTENSIONS.has(ext);
}
function isNonScriptForNode(p) {
  if (/^[a-z][a-z0-9+.-]+:/i.test(p)) return false;
  const ext = extname(p);
  if (ext === "" || /^\d+$/.test(ext)) return false;
  return !NODE_SCRIPT_EXTENSIONS.has(ext);
}
var JS_EXTENSIONS = /* @__PURE__ */ new Set(["js", "mjs", "cjs", "ts", "mts", "cts", "jsx", "tsx"]);
function isJsLike(p) {
  return JS_EXTENSIONS.has(extname(p));
}
var CONFIG_FILE = /(?:^|\/)(?:[\w.-]+\.config|\.[a-z]+rc|gatsby-(?:node|config|browser|ssr))\.(?:c|m)?[jt]s$/;
function isJsConfigFile(p) {
  return CONFIG_FILE.test(p);
}
var ROUTE_FILE = /(?:^|\/)(?:routes?|api|controllers?|middlewares?|handlers?)\/|(?:^|\/)route\.(?:c|m)?[jt]sx?$|(?:^|\/)(?:server|app|index)\.(?:c|m)?[jt]s$/;
function isRouteFile(p) {
  return isJsLike(p) && ROUTE_FILE.test(p) && !/(?:^|\/)(?:test|tests|__tests__|fixtures)\//.test(p);
}
function isMinifiedName(p) {
  return /[.-]min\.(?:c|m)?js$/.test(p) || /\.bundle\.(?:c|m)?js$/.test(p);
}

// ../../node_modules/.pnpm/jsonc-parser@3.3.1/node_modules/jsonc-parser/lib/esm/impl/scanner.js
function createScanner(text, ignoreTrivia = false) {
  const len = text.length;
  let pos = 0, value2 = "", tokenOffset = 0, token = 16, lineNumber = 0, lineStartOffset = 0, tokenLineStartOffset = 0, prevTokenLineStartOffset = 0, scanError = 0;
  function scanHexDigits(count, exact) {
    let digits = 0;
    let value3 = 0;
    while (digits < count || !exact) {
      let ch = text.charCodeAt(pos);
      if (ch >= 48 && ch <= 57) {
        value3 = value3 * 16 + ch - 48;
      } else if (ch >= 65 && ch <= 70) {
        value3 = value3 * 16 + ch - 65 + 10;
      } else if (ch >= 97 && ch <= 102) {
        value3 = value3 * 16 + ch - 97 + 10;
      } else {
        break;
      }
      pos++;
      digits++;
    }
    if (digits < count) {
      value3 = -1;
    }
    return value3;
  }
  function setPosition(newPosition) {
    pos = newPosition;
    value2 = "";
    tokenOffset = 0;
    token = 16;
    scanError = 0;
  }
  function scanNumber() {
    let start = pos;
    if (text.charCodeAt(pos) === 48) {
      pos++;
    } else {
      pos++;
      while (pos < text.length && isDigit(text.charCodeAt(pos))) {
        pos++;
      }
    }
    if (pos < text.length && text.charCodeAt(pos) === 46) {
      pos++;
      if (pos < text.length && isDigit(text.charCodeAt(pos))) {
        pos++;
        while (pos < text.length && isDigit(text.charCodeAt(pos))) {
          pos++;
        }
      } else {
        scanError = 3;
        return text.substring(start, pos);
      }
    }
    let end = pos;
    if (pos < text.length && (text.charCodeAt(pos) === 69 || text.charCodeAt(pos) === 101)) {
      pos++;
      if (pos < text.length && text.charCodeAt(pos) === 43 || text.charCodeAt(pos) === 45) {
        pos++;
      }
      if (pos < text.length && isDigit(text.charCodeAt(pos))) {
        pos++;
        while (pos < text.length && isDigit(text.charCodeAt(pos))) {
          pos++;
        }
        end = pos;
      } else {
        scanError = 3;
      }
    }
    return text.substring(start, end);
  }
  function scanString() {
    let result = "", start = pos;
    while (true) {
      if (pos >= len) {
        result += text.substring(start, pos);
        scanError = 2;
        break;
      }
      const ch = text.charCodeAt(pos);
      if (ch === 34) {
        result += text.substring(start, pos);
        pos++;
        break;
      }
      if (ch === 92) {
        result += text.substring(start, pos);
        pos++;
        if (pos >= len) {
          scanError = 2;
          break;
        }
        const ch2 = text.charCodeAt(pos++);
        switch (ch2) {
          case 34:
            result += '"';
            break;
          case 92:
            result += "\\";
            break;
          case 47:
            result += "/";
            break;
          case 98:
            result += "\b";
            break;
          case 102:
            result += "\f";
            break;
          case 110:
            result += "\n";
            break;
          case 114:
            result += "\r";
            break;
          case 116:
            result += "	";
            break;
          case 117:
            const ch3 = scanHexDigits(4, true);
            if (ch3 >= 0) {
              result += String.fromCharCode(ch3);
            } else {
              scanError = 4;
            }
            break;
          default:
            scanError = 5;
        }
        start = pos;
        continue;
      }
      if (ch >= 0 && ch <= 31) {
        if (isLineBreak(ch)) {
          result += text.substring(start, pos);
          scanError = 2;
          break;
        } else {
          scanError = 6;
        }
      }
      pos++;
    }
    return result;
  }
  function scanNext() {
    value2 = "";
    scanError = 0;
    tokenOffset = pos;
    lineStartOffset = lineNumber;
    prevTokenLineStartOffset = tokenLineStartOffset;
    if (pos >= len) {
      tokenOffset = len;
      return token = 17;
    }
    let code = text.charCodeAt(pos);
    if (isWhiteSpace(code)) {
      do {
        pos++;
        value2 += String.fromCharCode(code);
        code = text.charCodeAt(pos);
      } while (isWhiteSpace(code));
      return token = 15;
    }
    if (isLineBreak(code)) {
      pos++;
      value2 += String.fromCharCode(code);
      if (code === 13 && text.charCodeAt(pos) === 10) {
        pos++;
        value2 += "\n";
      }
      lineNumber++;
      tokenLineStartOffset = pos;
      return token = 14;
    }
    switch (code) {
      // tokens: []{}:,
      case 123:
        pos++;
        return token = 1;
      case 125:
        pos++;
        return token = 2;
      case 91:
        pos++;
        return token = 3;
      case 93:
        pos++;
        return token = 4;
      case 58:
        pos++;
        return token = 6;
      case 44:
        pos++;
        return token = 5;
      // strings
      case 34:
        pos++;
        value2 = scanString();
        return token = 10;
      // comments
      case 47:
        const start = pos - 1;
        if (text.charCodeAt(pos + 1) === 47) {
          pos += 2;
          while (pos < len) {
            if (isLineBreak(text.charCodeAt(pos))) {
              break;
            }
            pos++;
          }
          value2 = text.substring(start, pos);
          return token = 12;
        }
        if (text.charCodeAt(pos + 1) === 42) {
          pos += 2;
          const safeLength = len - 1;
          let commentClosed = false;
          while (pos < safeLength) {
            const ch = text.charCodeAt(pos);
            if (ch === 42 && text.charCodeAt(pos + 1) === 47) {
              pos += 2;
              commentClosed = true;
              break;
            }
            pos++;
            if (isLineBreak(ch)) {
              if (ch === 13 && text.charCodeAt(pos) === 10) {
                pos++;
              }
              lineNumber++;
              tokenLineStartOffset = pos;
            }
          }
          if (!commentClosed) {
            pos++;
            scanError = 1;
          }
          value2 = text.substring(start, pos);
          return token = 13;
        }
        value2 += String.fromCharCode(code);
        pos++;
        return token = 16;
      // numbers
      case 45:
        value2 += String.fromCharCode(code);
        pos++;
        if (pos === len || !isDigit(text.charCodeAt(pos))) {
          return token = 16;
        }
      // found a minus, followed by a number so
      // we fall through to proceed with scanning
      // numbers
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        value2 += scanNumber();
        return token = 11;
      // literals and unknown symbols
      default:
        while (pos < len && isUnknownContentCharacter(code)) {
          pos++;
          code = text.charCodeAt(pos);
        }
        if (tokenOffset !== pos) {
          value2 = text.substring(tokenOffset, pos);
          switch (value2) {
            case "true":
              return token = 8;
            case "false":
              return token = 9;
            case "null":
              return token = 7;
          }
          return token = 16;
        }
        value2 += String.fromCharCode(code);
        pos++;
        return token = 16;
    }
  }
  function isUnknownContentCharacter(code) {
    if (isWhiteSpace(code) || isLineBreak(code)) {
      return false;
    }
    switch (code) {
      case 125:
      case 93:
      case 123:
      case 91:
      case 34:
      case 58:
      case 44:
      case 47:
        return false;
    }
    return true;
  }
  function scanNextNonTrivia() {
    let result;
    do {
      result = scanNext();
    } while (result >= 12 && result <= 15);
    return result;
  }
  return {
    setPosition,
    getPosition: () => pos,
    scan: ignoreTrivia ? scanNextNonTrivia : scanNext,
    getToken: () => token,
    getTokenValue: () => value2,
    getTokenOffset: () => tokenOffset,
    getTokenLength: () => pos - tokenOffset,
    getTokenStartLine: () => lineStartOffset,
    getTokenStartCharacter: () => tokenOffset - prevTokenLineStartOffset,
    getTokenError: () => scanError
  };
}
function isWhiteSpace(ch) {
  return ch === 32 || ch === 9;
}
function isLineBreak(ch) {
  return ch === 10 || ch === 13;
}
function isDigit(ch) {
  return ch >= 48 && ch <= 57;
}
var CharacterCodes;
(function(CharacterCodes2) {
  CharacterCodes2[CharacterCodes2["lineFeed"] = 10] = "lineFeed";
  CharacterCodes2[CharacterCodes2["carriageReturn"] = 13] = "carriageReturn";
  CharacterCodes2[CharacterCodes2["space"] = 32] = "space";
  CharacterCodes2[CharacterCodes2["_0"] = 48] = "_0";
  CharacterCodes2[CharacterCodes2["_1"] = 49] = "_1";
  CharacterCodes2[CharacterCodes2["_2"] = 50] = "_2";
  CharacterCodes2[CharacterCodes2["_3"] = 51] = "_3";
  CharacterCodes2[CharacterCodes2["_4"] = 52] = "_4";
  CharacterCodes2[CharacterCodes2["_5"] = 53] = "_5";
  CharacterCodes2[CharacterCodes2["_6"] = 54] = "_6";
  CharacterCodes2[CharacterCodes2["_7"] = 55] = "_7";
  CharacterCodes2[CharacterCodes2["_8"] = 56] = "_8";
  CharacterCodes2[CharacterCodes2["_9"] = 57] = "_9";
  CharacterCodes2[CharacterCodes2["a"] = 97] = "a";
  CharacterCodes2[CharacterCodes2["b"] = 98] = "b";
  CharacterCodes2[CharacterCodes2["c"] = 99] = "c";
  CharacterCodes2[CharacterCodes2["d"] = 100] = "d";
  CharacterCodes2[CharacterCodes2["e"] = 101] = "e";
  CharacterCodes2[CharacterCodes2["f"] = 102] = "f";
  CharacterCodes2[CharacterCodes2["g"] = 103] = "g";
  CharacterCodes2[CharacterCodes2["h"] = 104] = "h";
  CharacterCodes2[CharacterCodes2["i"] = 105] = "i";
  CharacterCodes2[CharacterCodes2["j"] = 106] = "j";
  CharacterCodes2[CharacterCodes2["k"] = 107] = "k";
  CharacterCodes2[CharacterCodes2["l"] = 108] = "l";
  CharacterCodes2[CharacterCodes2["m"] = 109] = "m";
  CharacterCodes2[CharacterCodes2["n"] = 110] = "n";
  CharacterCodes2[CharacterCodes2["o"] = 111] = "o";
  CharacterCodes2[CharacterCodes2["p"] = 112] = "p";
  CharacterCodes2[CharacterCodes2["q"] = 113] = "q";
  CharacterCodes2[CharacterCodes2["r"] = 114] = "r";
  CharacterCodes2[CharacterCodes2["s"] = 115] = "s";
  CharacterCodes2[CharacterCodes2["t"] = 116] = "t";
  CharacterCodes2[CharacterCodes2["u"] = 117] = "u";
  CharacterCodes2[CharacterCodes2["v"] = 118] = "v";
  CharacterCodes2[CharacterCodes2["w"] = 119] = "w";
  CharacterCodes2[CharacterCodes2["x"] = 120] = "x";
  CharacterCodes2[CharacterCodes2["y"] = 121] = "y";
  CharacterCodes2[CharacterCodes2["z"] = 122] = "z";
  CharacterCodes2[CharacterCodes2["A"] = 65] = "A";
  CharacterCodes2[CharacterCodes2["B"] = 66] = "B";
  CharacterCodes2[CharacterCodes2["C"] = 67] = "C";
  CharacterCodes2[CharacterCodes2["D"] = 68] = "D";
  CharacterCodes2[CharacterCodes2["E"] = 69] = "E";
  CharacterCodes2[CharacterCodes2["F"] = 70] = "F";
  CharacterCodes2[CharacterCodes2["G"] = 71] = "G";
  CharacterCodes2[CharacterCodes2["H"] = 72] = "H";
  CharacterCodes2[CharacterCodes2["I"] = 73] = "I";
  CharacterCodes2[CharacterCodes2["J"] = 74] = "J";
  CharacterCodes2[CharacterCodes2["K"] = 75] = "K";
  CharacterCodes2[CharacterCodes2["L"] = 76] = "L";
  CharacterCodes2[CharacterCodes2["M"] = 77] = "M";
  CharacterCodes2[CharacterCodes2["N"] = 78] = "N";
  CharacterCodes2[CharacterCodes2["O"] = 79] = "O";
  CharacterCodes2[CharacterCodes2["P"] = 80] = "P";
  CharacterCodes2[CharacterCodes2["Q"] = 81] = "Q";
  CharacterCodes2[CharacterCodes2["R"] = 82] = "R";
  CharacterCodes2[CharacterCodes2["S"] = 83] = "S";
  CharacterCodes2[CharacterCodes2["T"] = 84] = "T";
  CharacterCodes2[CharacterCodes2["U"] = 85] = "U";
  CharacterCodes2[CharacterCodes2["V"] = 86] = "V";
  CharacterCodes2[CharacterCodes2["W"] = 87] = "W";
  CharacterCodes2[CharacterCodes2["X"] = 88] = "X";
  CharacterCodes2[CharacterCodes2["Y"] = 89] = "Y";
  CharacterCodes2[CharacterCodes2["Z"] = 90] = "Z";
  CharacterCodes2[CharacterCodes2["asterisk"] = 42] = "asterisk";
  CharacterCodes2[CharacterCodes2["backslash"] = 92] = "backslash";
  CharacterCodes2[CharacterCodes2["closeBrace"] = 125] = "closeBrace";
  CharacterCodes2[CharacterCodes2["closeBracket"] = 93] = "closeBracket";
  CharacterCodes2[CharacterCodes2["colon"] = 58] = "colon";
  CharacterCodes2[CharacterCodes2["comma"] = 44] = "comma";
  CharacterCodes2[CharacterCodes2["dot"] = 46] = "dot";
  CharacterCodes2[CharacterCodes2["doubleQuote"] = 34] = "doubleQuote";
  CharacterCodes2[CharacterCodes2["minus"] = 45] = "minus";
  CharacterCodes2[CharacterCodes2["openBrace"] = 123] = "openBrace";
  CharacterCodes2[CharacterCodes2["openBracket"] = 91] = "openBracket";
  CharacterCodes2[CharacterCodes2["plus"] = 43] = "plus";
  CharacterCodes2[CharacterCodes2["slash"] = 47] = "slash";
  CharacterCodes2[CharacterCodes2["formFeed"] = 12] = "formFeed";
  CharacterCodes2[CharacterCodes2["tab"] = 9] = "tab";
})(CharacterCodes || (CharacterCodes = {}));

// ../../node_modules/.pnpm/jsonc-parser@3.3.1/node_modules/jsonc-parser/lib/esm/impl/string-intern.js
var cachedSpaces = new Array(20).fill(0).map((_, index) => {
  return " ".repeat(index);
});
var maxCachedValues = 200;
var cachedBreakLinesWithSpaces = {
  " ": {
    "\n": new Array(maxCachedValues).fill(0).map((_, index) => {
      return "\n" + " ".repeat(index);
    }),
    "\r": new Array(maxCachedValues).fill(0).map((_, index) => {
      return "\r" + " ".repeat(index);
    }),
    "\r\n": new Array(maxCachedValues).fill(0).map((_, index) => {
      return "\r\n" + " ".repeat(index);
    })
  },
  "	": {
    "\n": new Array(maxCachedValues).fill(0).map((_, index) => {
      return "\n" + "	".repeat(index);
    }),
    "\r": new Array(maxCachedValues).fill(0).map((_, index) => {
      return "\r" + "	".repeat(index);
    }),
    "\r\n": new Array(maxCachedValues).fill(0).map((_, index) => {
      return "\r\n" + "	".repeat(index);
    })
  }
};

// ../../node_modules/.pnpm/jsonc-parser@3.3.1/node_modules/jsonc-parser/lib/esm/impl/parser.js
var ParseOptions;
(function(ParseOptions2) {
  ParseOptions2.DEFAULT = {
    allowTrailingComma: false
  };
})(ParseOptions || (ParseOptions = {}));
function parseTree(text, errors = [], options = ParseOptions.DEFAULT) {
  let currentParent = { type: "array", offset: -1, length: -1, children: [], parent: void 0 };
  function ensurePropertyComplete(endOffset) {
    if (currentParent.type === "property") {
      currentParent.length = endOffset - currentParent.offset;
      currentParent = currentParent.parent;
    }
  }
  function onValue(valueNode) {
    currentParent.children.push(valueNode);
    return valueNode;
  }
  const visitor = {
    onObjectBegin: (offset) => {
      currentParent = onValue({ type: "object", offset, length: -1, parent: currentParent, children: [] });
    },
    onObjectProperty: (name, offset, length) => {
      currentParent = onValue({ type: "property", offset, length: -1, parent: currentParent, children: [] });
      currentParent.children.push({ type: "string", value: name, offset, length, parent: currentParent });
    },
    onObjectEnd: (offset, length) => {
      ensurePropertyComplete(offset + length);
      currentParent.length = offset + length - currentParent.offset;
      currentParent = currentParent.parent;
      ensurePropertyComplete(offset + length);
    },
    onArrayBegin: (offset, length) => {
      currentParent = onValue({ type: "array", offset, length: -1, parent: currentParent, children: [] });
    },
    onArrayEnd: (offset, length) => {
      currentParent.length = offset + length - currentParent.offset;
      currentParent = currentParent.parent;
      ensurePropertyComplete(offset + length);
    },
    onLiteralValue: (value2, offset, length) => {
      onValue({ type: getNodeType(value2), offset, length, parent: currentParent, value: value2 });
      ensurePropertyComplete(offset + length);
    },
    onSeparator: (sep, offset, length) => {
      if (currentParent.type === "property") {
        if (sep === ":") {
          currentParent.colonOffset = offset;
        } else if (sep === ",") {
          ensurePropertyComplete(offset);
        }
      }
    },
    onError: (error, offset, length) => {
      errors.push({ error, offset, length });
    }
  };
  visit(text, visitor, options);
  const result = currentParent.children[0];
  if (result) {
    delete result.parent;
  }
  return result;
}
function findNodeAtLocation(root, path2) {
  if (!root) {
    return void 0;
  }
  let node = root;
  for (let segment of path2) {
    if (typeof segment === "string") {
      if (node.type !== "object" || !Array.isArray(node.children)) {
        return void 0;
      }
      let found = false;
      for (const propertyNode of node.children) {
        if (Array.isArray(propertyNode.children) && propertyNode.children[0].value === segment && propertyNode.children.length === 2) {
          node = propertyNode.children[1];
          found = true;
          break;
        }
      }
      if (!found) {
        return void 0;
      }
    } else {
      const index = segment;
      if (node.type !== "array" || index < 0 || !Array.isArray(node.children) || index >= node.children.length) {
        return void 0;
      }
      node = node.children[index];
    }
  }
  return node;
}
function visit(text, visitor, options = ParseOptions.DEFAULT) {
  const _scanner = createScanner(text, false);
  const _jsonPath = [];
  let suppressedCallbacks = 0;
  function toNoArgVisit(visitFunction) {
    return visitFunction ? () => suppressedCallbacks === 0 && visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter()) : () => true;
  }
  function toOneArgVisit(visitFunction) {
    return visitFunction ? (arg) => suppressedCallbacks === 0 && visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter()) : () => true;
  }
  function toOneArgVisitWithPath(visitFunction) {
    return visitFunction ? (arg) => suppressedCallbacks === 0 && visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter(), () => _jsonPath.slice()) : () => true;
  }
  function toBeginVisit(visitFunction) {
    return visitFunction ? () => {
      if (suppressedCallbacks > 0) {
        suppressedCallbacks++;
      } else {
        let cbReturn = visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter(), () => _jsonPath.slice());
        if (cbReturn === false) {
          suppressedCallbacks = 1;
        }
      }
    } : () => true;
  }
  function toEndVisit(visitFunction) {
    return visitFunction ? () => {
      if (suppressedCallbacks > 0) {
        suppressedCallbacks--;
      }
      if (suppressedCallbacks === 0) {
        visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter());
      }
    } : () => true;
  }
  const onObjectBegin = toBeginVisit(visitor.onObjectBegin), onObjectProperty = toOneArgVisitWithPath(visitor.onObjectProperty), onObjectEnd = toEndVisit(visitor.onObjectEnd), onArrayBegin = toBeginVisit(visitor.onArrayBegin), onArrayEnd = toEndVisit(visitor.onArrayEnd), onLiteralValue = toOneArgVisitWithPath(visitor.onLiteralValue), onSeparator = toOneArgVisit(visitor.onSeparator), onComment = toNoArgVisit(visitor.onComment), onError = toOneArgVisit(visitor.onError);
  const disallowComments = options && options.disallowComments;
  const allowTrailingComma = options && options.allowTrailingComma;
  function scanNext() {
    while (true) {
      const token = _scanner.scan();
      switch (_scanner.getTokenError()) {
        case 4:
          handleError(
            14
            /* ParseErrorCode.InvalidUnicode */
          );
          break;
        case 5:
          handleError(
            15
            /* ParseErrorCode.InvalidEscapeCharacter */
          );
          break;
        case 3:
          handleError(
            13
            /* ParseErrorCode.UnexpectedEndOfNumber */
          );
          break;
        case 1:
          if (!disallowComments) {
            handleError(
              11
              /* ParseErrorCode.UnexpectedEndOfComment */
            );
          }
          break;
        case 2:
          handleError(
            12
            /* ParseErrorCode.UnexpectedEndOfString */
          );
          break;
        case 6:
          handleError(
            16
            /* ParseErrorCode.InvalidCharacter */
          );
          break;
      }
      switch (token) {
        case 12:
        case 13:
          if (disallowComments) {
            handleError(
              10
              /* ParseErrorCode.InvalidCommentToken */
            );
          } else {
            onComment();
          }
          break;
        case 16:
          handleError(
            1
            /* ParseErrorCode.InvalidSymbol */
          );
          break;
        case 15:
        case 14:
          break;
        default:
          return token;
      }
    }
  }
  function handleError(error, skipUntilAfter = [], skipUntil = []) {
    onError(error);
    if (skipUntilAfter.length + skipUntil.length > 0) {
      let token = _scanner.getToken();
      while (token !== 17) {
        if (skipUntilAfter.indexOf(token) !== -1) {
          scanNext();
          break;
        } else if (skipUntil.indexOf(token) !== -1) {
          break;
        }
        token = scanNext();
      }
    }
  }
  function parseString(isValue) {
    const value2 = _scanner.getTokenValue();
    if (isValue) {
      onLiteralValue(value2);
    } else {
      onObjectProperty(value2);
      _jsonPath.push(value2);
    }
    scanNext();
    return true;
  }
  function parseLiteral() {
    switch (_scanner.getToken()) {
      case 11:
        const tokenValue = _scanner.getTokenValue();
        let value2 = Number(tokenValue);
        if (isNaN(value2)) {
          handleError(
            2
            /* ParseErrorCode.InvalidNumberFormat */
          );
          value2 = 0;
        }
        onLiteralValue(value2);
        break;
      case 7:
        onLiteralValue(null);
        break;
      case 8:
        onLiteralValue(true);
        break;
      case 9:
        onLiteralValue(false);
        break;
      default:
        return false;
    }
    scanNext();
    return true;
  }
  function parseProperty() {
    if (_scanner.getToken() !== 10) {
      handleError(3, [], [
        2,
        5
        /* SyntaxKind.CommaToken */
      ]);
      return false;
    }
    parseString(false);
    if (_scanner.getToken() === 6) {
      onSeparator(":");
      scanNext();
      if (!parseValue()) {
        handleError(4, [], [
          2,
          5
          /* SyntaxKind.CommaToken */
        ]);
      }
    } else {
      handleError(5, [], [
        2,
        5
        /* SyntaxKind.CommaToken */
      ]);
    }
    _jsonPath.pop();
    return true;
  }
  function parseObject() {
    onObjectBegin();
    scanNext();
    let needsComma = false;
    while (_scanner.getToken() !== 2 && _scanner.getToken() !== 17) {
      if (_scanner.getToken() === 5) {
        if (!needsComma) {
          handleError(4, [], []);
        }
        onSeparator(",");
        scanNext();
        if (_scanner.getToken() === 2 && allowTrailingComma) {
          break;
        }
      } else if (needsComma) {
        handleError(6, [], []);
      }
      if (!parseProperty()) {
        handleError(4, [], [
          2,
          5
          /* SyntaxKind.CommaToken */
        ]);
      }
      needsComma = true;
    }
    onObjectEnd();
    if (_scanner.getToken() !== 2) {
      handleError(7, [
        2
        /* SyntaxKind.CloseBraceToken */
      ], []);
    } else {
      scanNext();
    }
    return true;
  }
  function parseArray() {
    onArrayBegin();
    scanNext();
    let isFirstElement = true;
    let needsComma = false;
    while (_scanner.getToken() !== 4 && _scanner.getToken() !== 17) {
      if (_scanner.getToken() === 5) {
        if (!needsComma) {
          handleError(4, [], []);
        }
        onSeparator(",");
        scanNext();
        if (_scanner.getToken() === 4 && allowTrailingComma) {
          break;
        }
      } else if (needsComma) {
        handleError(6, [], []);
      }
      if (isFirstElement) {
        _jsonPath.push(0);
        isFirstElement = false;
      } else {
        _jsonPath[_jsonPath.length - 1]++;
      }
      if (!parseValue()) {
        handleError(4, [], [
          4,
          5
          /* SyntaxKind.CommaToken */
        ]);
      }
      needsComma = true;
    }
    onArrayEnd();
    if (!isFirstElement) {
      _jsonPath.pop();
    }
    if (_scanner.getToken() !== 4) {
      handleError(8, [
        4
        /* SyntaxKind.CloseBracketToken */
      ], []);
    } else {
      scanNext();
    }
    return true;
  }
  function parseValue() {
    switch (_scanner.getToken()) {
      case 3:
        return parseArray();
      case 1:
        return parseObject();
      case 10:
        return parseString(true);
      default:
        return parseLiteral();
    }
  }
  scanNext();
  if (_scanner.getToken() === 17) {
    if (options.allowEmptyContent) {
      return true;
    }
    handleError(4, [], []);
    return false;
  }
  if (!parseValue()) {
    handleError(4, [], []);
    return false;
  }
  if (_scanner.getToken() !== 17) {
    handleError(9, [], []);
  }
  return true;
}
function getNodeType(value2) {
  switch (typeof value2) {
    case "boolean":
      return "boolean";
    case "number":
      return "number";
    case "string":
      return "string";
    case "object": {
      if (!value2) {
        return "null";
      } else if (Array.isArray(value2)) {
        return "array";
      }
      return "object";
    }
    default:
      return "null";
  }
}

// ../../node_modules/.pnpm/jsonc-parser@3.3.1/node_modules/jsonc-parser/lib/esm/main.js
var ScanError;
(function(ScanError2) {
  ScanError2[ScanError2["None"] = 0] = "None";
  ScanError2[ScanError2["UnexpectedEndOfComment"] = 1] = "UnexpectedEndOfComment";
  ScanError2[ScanError2["UnexpectedEndOfString"] = 2] = "UnexpectedEndOfString";
  ScanError2[ScanError2["UnexpectedEndOfNumber"] = 3] = "UnexpectedEndOfNumber";
  ScanError2[ScanError2["InvalidUnicode"] = 4] = "InvalidUnicode";
  ScanError2[ScanError2["InvalidEscapeCharacter"] = 5] = "InvalidEscapeCharacter";
  ScanError2[ScanError2["InvalidCharacter"] = 6] = "InvalidCharacter";
})(ScanError || (ScanError = {}));
var SyntaxKind;
(function(SyntaxKind2) {
  SyntaxKind2[SyntaxKind2["OpenBraceToken"] = 1] = "OpenBraceToken";
  SyntaxKind2[SyntaxKind2["CloseBraceToken"] = 2] = "CloseBraceToken";
  SyntaxKind2[SyntaxKind2["OpenBracketToken"] = 3] = "OpenBracketToken";
  SyntaxKind2[SyntaxKind2["CloseBracketToken"] = 4] = "CloseBracketToken";
  SyntaxKind2[SyntaxKind2["CommaToken"] = 5] = "CommaToken";
  SyntaxKind2[SyntaxKind2["ColonToken"] = 6] = "ColonToken";
  SyntaxKind2[SyntaxKind2["NullKeyword"] = 7] = "NullKeyword";
  SyntaxKind2[SyntaxKind2["TrueKeyword"] = 8] = "TrueKeyword";
  SyntaxKind2[SyntaxKind2["FalseKeyword"] = 9] = "FalseKeyword";
  SyntaxKind2[SyntaxKind2["StringLiteral"] = 10] = "StringLiteral";
  SyntaxKind2[SyntaxKind2["NumericLiteral"] = 11] = "NumericLiteral";
  SyntaxKind2[SyntaxKind2["LineCommentTrivia"] = 12] = "LineCommentTrivia";
  SyntaxKind2[SyntaxKind2["BlockCommentTrivia"] = 13] = "BlockCommentTrivia";
  SyntaxKind2[SyntaxKind2["LineBreakTrivia"] = 14] = "LineBreakTrivia";
  SyntaxKind2[SyntaxKind2["Trivia"] = 15] = "Trivia";
  SyntaxKind2[SyntaxKind2["Unknown"] = 16] = "Unknown";
  SyntaxKind2[SyntaxKind2["EOF"] = 17] = "EOF";
})(SyntaxKind || (SyntaxKind = {}));
var parseTree2 = parseTree;
var findNodeAtLocation2 = findNodeAtLocation;
var ParseErrorCode;
(function(ParseErrorCode2) {
  ParseErrorCode2[ParseErrorCode2["InvalidSymbol"] = 1] = "InvalidSymbol";
  ParseErrorCode2[ParseErrorCode2["InvalidNumberFormat"] = 2] = "InvalidNumberFormat";
  ParseErrorCode2[ParseErrorCode2["PropertyNameExpected"] = 3] = "PropertyNameExpected";
  ParseErrorCode2[ParseErrorCode2["ValueExpected"] = 4] = "ValueExpected";
  ParseErrorCode2[ParseErrorCode2["ColonExpected"] = 5] = "ColonExpected";
  ParseErrorCode2[ParseErrorCode2["CommaExpected"] = 6] = "CommaExpected";
  ParseErrorCode2[ParseErrorCode2["CloseBraceExpected"] = 7] = "CloseBraceExpected";
  ParseErrorCode2[ParseErrorCode2["CloseBracketExpected"] = 8] = "CloseBracketExpected";
  ParseErrorCode2[ParseErrorCode2["EndOfFileExpected"] = 9] = "EndOfFileExpected";
  ParseErrorCode2[ParseErrorCode2["InvalidCommentToken"] = 10] = "InvalidCommentToken";
  ParseErrorCode2[ParseErrorCode2["UnexpectedEndOfComment"] = 11] = "UnexpectedEndOfComment";
  ParseErrorCode2[ParseErrorCode2["UnexpectedEndOfString"] = 12] = "UnexpectedEndOfString";
  ParseErrorCode2[ParseErrorCode2["UnexpectedEndOfNumber"] = 13] = "UnexpectedEndOfNumber";
  ParseErrorCode2[ParseErrorCode2["InvalidUnicode"] = 14] = "InvalidUnicode";
  ParseErrorCode2[ParseErrorCode2["InvalidEscapeCharacter"] = 15] = "InvalidEscapeCharacter";
  ParseErrorCode2[ParseErrorCode2["InvalidCharacter"] = 16] = "InvalidCharacter";
})(ParseErrorCode || (ParseErrorCode = {}));

// ../engine/src/parsers/jsonc.ts
var MAX_NESTING = 256;
function nestingDepth(text) {
  let depth = 0;
  let max = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c === 34) {
      for (i++; i < text.length && text.charCodeAt(i) !== 34; i++) if (text.charCodeAt(i) === 92) i++;
    } else if (c === 47 && text.charCodeAt(i + 1) === 47) {
      while (i < text.length && text.charCodeAt(i) !== 10) i++;
    } else if (c === 47 && text.charCodeAt(i + 1) === 42) {
      const end = text.indexOf("*/", i + 2);
      i = end === -1 ? text.length : end + 1;
    } else if (c === 91 || c === 123) {
      if (++depth > max) max = depth;
    } else if (c === 93 || c === 125) {
      if (depth > 0) depth--;
    }
  }
  return max;
}
function parseJsonc(text) {
  if (nestingDepth(text) > MAX_NESTING) throw new UncheckableInput("JSON nested too deeply");
  const errors = [];
  const root = parseTree2(text, errors, { allowTrailingComma: true, disallowComments: false, allowEmptyContent: true });
  return { root, errors };
}
function child(node, key) {
  if (!node) return void 0;
  return findNodeAtLocation2(node, [key]);
}
function at(node, ...keys) {
  if (!node) return void 0;
  return findNodeAtLocation2(node, keys);
}
function stringValue(node) {
  return node?.type === "string" ? node.value : void 0;
}
function properties(node) {
  if (node?.type !== "object" || !node.children) return [];
  const out = [];
  for (const prop of node.children) {
    const [keyNode, valueNode] = prop.children ?? [];
    if (keyNode && valueNode && typeof keyNode.value === "string") out.push([keyNode.value, valueNode, keyNode]);
  }
  return out;
}
function elements(node) {
  return node?.type === "array" ? node.children ?? [] : [];
}

// ../engine/src/rules/rule.ts
function defineRule(meta, run2) {
  return { meta, run: run2 };
}
function targetsWhere(ctx, match) {
  return ctx.targets.filter((t) => t.kind !== "submodule" && match(t.path));
}

// ../engine/src/parsers/manifests.ts
function isPackageJson(p) {
  return basename(p) === "package.json";
}
var DEPENDENCY_FIELDS = ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies", "bundleDependencies"];
function parsePackageJson(text) {
  const { root } = parseJsonc(text);
  const scripts = [];
  for (const [name, node] of properties(child(root, "scripts"))) {
    const script = stringValue(node);
    if (script !== void 0) scripts.push({ name, text: script, offset: node.offset });
  }
  const dependencies = [];
  for (const field of DEPENDENCY_FIELDS) {
    for (const [name, , keyNode] of properties(child(root, field))) dependencies.push({ name, offset: keyNode.offset });
  }
  return { root, scripts, dependencies };
}
var INSTALL_SCRIPTS = /* @__PURE__ */ new Set(["preinstall", "install", "postinstall", "prepare", "preprepare", "postprepare", "prepublish"]);
function isDevcontainerFile(p) {
  return p === ".devcontainer.json" || p === ".devcontainer/devcontainer.json" || /^\.devcontainer\/[^/]+\/devcontainer\.json$/.test(p);
}
var DEVCONTAINER_COMMANDS = [
  "initializeCommand",
  "onCreateCommand",
  "updateContentCommand",
  "postCreateCommand",
  "postStartCommand",
  "postAttachCommand"
];
function parseDevcontainer(text) {
  const { root } = parseJsonc(text);
  const out = [];
  for (const name of DEVCONTAINER_COMMANDS) {
    const node = child(root, name);
    if (!node) continue;
    for (const cmd of flattenCommand(node)) out.push({ name, text: cmd.text, offset: cmd.offset });
  }
  return out;
}
function flattenCommand(node) {
  if (node.type === "string") return [{ text: node.value, offset: node.offset }];
  if (node.type === "array") {
    const parts = (node.children ?? []).map((c) => stringValue(c) ?? "");
    return [{ text: parts.map((p) => /\s/.test(p) ? `"${p}"` : p).join(" "), offset: node.offset }];
  }
  if (node.type === "object") return properties(node).flatMap(([, v]) => flattenCommand(v));
  return [];
}

// ../engine/src/parsers/vscode.ts
function joinCommandValue(node) {
  if (!node) return void 0;
  if (node.type === "string") return node.value;
  if (node.type === "array") return elements(node).map((e) => quoteArg(stringValue(e) ?? "")).join(" ");
  if (node.type === "object") return joinCommandValue(child(node, "value"));
  return void 0;
}
function quoteArg(arg) {
  return /[\s"']/.test(arg) ? `"${arg.replace(/(["\\$`])/g, "\\$1")}"` : arg;
}
function argsOf(node) {
  return elements(node).map((e) => {
    if (e.type === "string") return quoteArg(e.value);
    if (e.type === "object") return quoteArg(joinCommandValue(child(e, "value")) ?? "");
    return "";
  });
}
function commandFor(scope, fallback) {
  const commandNode = child(scope, "command") ?? (fallback && child(fallback, "command"));
  const command2 = joinCommandValue(commandNode);
  if (command2 === void 0) return void 0;
  const argsNode = child(scope, "args") ?? (fallback && child(fallback, "args"));
  const parts = [command2, ...argsOf(argsNode)];
  const shell = at(scope, "options", "shell") ?? (fallback && at(fallback, "options", "shell"));
  const executable = stringValue(child(shell, "executable"));
  if (executable) parts.unshift(quoteArg(executable), ...argsOf(child(shell, "args")));
  return { text: parts.join(" "), offset: (commandNode ?? scope).offset };
}
function hiddenOutputOffset(task) {
  const reveal = at(task, "presentation", "reveal");
  if (stringValue(reveal) === "never") return reveal.offset;
  const echo = at(task, "presentation", "echo");
  if (echo?.type === "boolean" && echo.value === false) return echo.offset;
  const hide = child(task, "hide");
  if (hide?.type === "boolean" && hide.value === true) return hide.offset;
  return void 0;
}
function tasksFrom(container) {
  const tasks = [];
  for (const task of elements(child(container, "tasks"))) {
    if (task.type !== "object") continue;
    const runOn = at(task, "runOptions", "runOn");
    const commands = [];
    const base = commandFor(task, void 0);
    if (base) commands.push(base);
    for (const platform of ["windows", "linux", "osx"]) {
      const override = child(task, platform);
      if (override?.type !== "object") continue;
      const cmd = commandFor(override, task);
      if (cmd) commands.push(cmd);
    }
    const type = stringValue(child(task, "type"));
    tasks.push({
      offset: task.offset,
      type,
      folderOpenOffset: stringValue(runOn) === "folderOpen" ? runOn.offset : void 0,
      hiddenOutputOffset: hiddenOutputOffset(task),
      npmScript: type === "npm" ? stringValue(child(task, "script")) : void 0,
      commands
    });
  }
  return tasks;
}
function isTasksFile(p) {
  return p === ".vscode/tasks.json" || p.endsWith("/.vscode/tasks.json");
}
function isWorkspaceFile(p) {
  return p.endsWith(".code-workspace");
}
function isSettingsFile(p) {
  return p === ".vscode/settings.json" || p.endsWith("/.vscode/settings.json");
}
function parseTasks(path2, text) {
  const { root } = parseJsonc(text);
  return tasksFrom(isWorkspaceFile(path2) ? child(root, "tasks") : root);
}
function settingsNode(path2, text) {
  const { root } = parseJsonc(text);
  return isWorkspaceFile(path2) ? child(root, "settings") : root;
}
function setting(settings, key) {
  for (const [k, v] of properties(settings)) if (k === key) return v;
  const [head, ...rest] = key.split(".");
  if (!head || rest.length === 0) return void 0;
  for (const [k, v] of properties(settings)) if (k === head) return setting(v, rest.join("."));
  return void 0;
}

// ../engine/src/parsers/workflow.ts
var import_yaml2 = __toESM(require_dist(), 1);
function isWorkflowFile(p) {
  return /^\.github\/workflows\/[^/]+\.ya?ml$/.test(p);
}
function parseWorkflow(text) {
  let data;
  try {
    const doc = (0, import_yaml2.parseDocument)(text, { strict: false, uniqueKeys: false, prettyErrors: false });
    if (doc.errors.length) throw new UncheckableInput("invalid YAML");
    data = doc.toJS({ maxAliasCount: 50 });
  } catch (error) {
    if (error instanceof UncheckableInput) throw error;
    throw new UncheckableInput("YAML could not be read");
  }
  if (!data || typeof data !== "object") return void 0;
  const on = data.on ?? data.true;
  const events = typeof on === "string" ? [on] : Array.isArray(on) ? on.map(String) : on && typeof on === "object" ? Object.keys(on) : [];
  const steps = [];
  const jobs = data.jobs;
  if (jobs && typeof jobs === "object") {
    for (const job of Object.values(jobs)) {
      const jobSteps = job?.steps;
      if (!Array.isArray(jobSteps)) continue;
      for (const step of jobSteps) {
        if (!step || typeof step !== "object") continue;
        const s = step;
        steps.push({
          run: typeof s.run === "string" ? s.run : void 0,
          uses: typeof s.uses === "string" ? s.uses : void 0,
          with: s.with && typeof s.with === "object" ? s.with : void 0
        });
      }
    }
  }
  return { events, steps };
}

// ../engine/src/rules/shared.ts
var REFS = {
  polinRider: { title: "OpenSourceMalware: PolinRider dossier and YARA rule", url: "https://github.com/OpenSourceMalware/PolinRider" },
  microsoftNext: {
    title: "Microsoft: Developer-targeting campaign using malicious Next.js repositories",
    url: "https://www.microsoft.com/en-us/security/blog/2026/02/24/c2-developer-targeting-campaign/"
  },
  abstractTasks: {
    title: "Abstract Security: Tracking the VS Code tasks infection vector",
    url: "https://www.abstract.security/blog/contagious-interview-tracking-the-vs-code-tasks-infection-vector"
  },
  rmgPy: { title: "RMG-Py incident report and hardening advice", url: "https://github.com/ReactionMechanismGenerator/RMG-Py/issues/3008" },
  ghostAction: { title: "Socket: GhostAction workflow injection", url: "https://socket.dev/blog/ghostaction-cloud-credentials" },
  workspaceTrust: { title: "VS Code Workspace Trust", url: "https://code.visualstudio.com/docs/editing/workspaces/workspace-trust" },
  actionsHardening: {
    title: "GitHub Actions security hardening",
    url: "https://docs.github.com/actions/security-guides/security-hardening-for-github-actions"
  },
  npmScripts: { title: "npm scripts and lifecycle events", url: "https://docs.npmjs.com/cli/v10/using-npm/scripts" },
  devcontainerJson: { title: "Dev Container metadata reference", url: "https://containers.dev/implementors/json_reference/" },
  stellarCliKeys: {
    title: "Stellar CLI key storage",
    url: "https://developers.stellar.org/docs/tools/cli/agent-cli/reference/architecture"
  },
  strkey: { title: "SEP-23: Strkey encoding", url: "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0023.md" },
  stellarLight: { title: "Stellar Light repo-security holds", url: "https://github.com/Stellar-Light/stellarlight/pull/1833" }
};
var SHELL_SCRIPT_EXTENSIONS = /* @__PURE__ */ new Set(["sh", "bash", "zsh", "bat", "cmd", "ps1", "command"]);
function isShellScript(p) {
  return SHELL_SCRIPT_EXTENSIONS.has(extname(p));
}
function workspaceRootOf(p) {
  return isWorkspaceFile(p) ? dirname(p) : dirname(dirname(p));
}
async function executableCommands(ctx, origins, npmFilter = () => true) {
  const out = [];
  for (const entry of ctx.targets) {
    if (entry.kind === "submodule") continue;
    const p = entry.path;
    if (origins.has("task") && (isTasksFile(p) || isWorkspaceFile(p))) {
      const text = await ctx.readText(p);
      if (text === void 0) continue;
      const dir = workspaceRootOf(p);
      for (const task of parseTasks(p, text)) {
        for (const cmd of task.commands) out.push({ origin: "task", path: p, dir, text: cmd.text, offset: cmd.offset });
      }
    } else if (origins.has("npm") && isPackageJson(p)) {
      const text = await ctx.readText(p);
      if (text === void 0) continue;
      for (const s of parsePackageJson(text).scripts) {
        if (npmFilter(s.name)) out.push({ origin: "npm", path: p, dir: dirname(p), text: s.text, offset: s.offset, name: s.name });
      }
    } else if (origins.has("devcontainer") && isDevcontainerFile(p)) {
      const text = await ctx.readText(p);
      if (text === void 0) continue;
      for (const c of parseDevcontainer(text)) {
        out.push({ origin: "devcontainer", path: p, dir: "", text: c.text, offset: c.offset, name: c.name });
      }
    } else if (origins.has("workflow") && isWorkflowFile(p)) {
      const text = await ctx.readText(p);
      if (text === void 0) continue;
      let wf;
      try {
        wf = parseWorkflow(text);
      } catch (error) {
        if (!(error instanceof UncheckableInput)) throw error;
        ctx.couldNotCheck(p, "parse-error");
        continue;
      }
      if (!wf) continue;
      for (const step of wf.steps) {
        if (step.run === void 0) continue;
        const firstLine = step.run.split("\n", 1)[0].trim();
        const offset = firstLine ? Math.max(0, text.indexOf(firstLine)) : 0;
        out.push({ origin: "workflow", path: p, dir: "", text: step.run, offset });
      }
    } else if (origins.has("shell") && isShellScript(p)) {
      const text = await ctx.readText(p);
      if (text !== void 0) out.push({ origin: "shell", path: p, dir: dirname(p), text, offset: 0 });
    }
  }
  return out;
}
function locateInCommand(ctx, cmd, needle, fileText) {
  if (fileText !== void 0) {
    const at2 = fileText.indexOf(needle, cmd.offset);
    if (at2 !== -1) return ctx.locate(cmd.path, at2);
  }
  return ctx.locate(cmd.path, cmd.offset);
}
function isServerSideCode(p) {
  return isJsConfigFile(p) || isRouteFile(p);
}
function looksBinary(bytes) {
  const end = Math.min(bytes.length, 8e3);
  for (let i = 0; i < end; i++) if (bytes[i] === 0) return true;
  return false;
}
var VENDORED = /(?:^|\/)(?:node_modules|\.yarn|vendor|third_party|bower_components|dist|build|out|\.next|coverage)\//;
function isVendored(p) {
  return VENDORED.test(p) || isMinifiedName(p);
}
var TEST_PATH = /(?:^|\/)(?:test|tests|__tests__|spec|__mocks__)\/|\.(?:test|spec)\.[cm]?[jt]sx?$/;
function isTestPath(p) {
  return TEST_PATH.test(p);
}

// ../engine/src/rules/agt-001.ts
var CLAUDE_SETTINGS = /(?:^|\/)\.claude\/settings(?:\.local)?\.json$/;
var CURSOR_HOOKS = /(?:^|\/)\.cursor\/hooks\.json$/;
var MCP_CONFIG = /(?:^|\/)(?:\.mcp\.json|\.cursor\/mcp\.json|\.vscode\/mcp\.json)$/;
function hasEntries(node) {
  if (!node) return false;
  if (node.type === "object" || node.type === "array") return (node.children?.length ?? 0) > 0;
  return false;
}
var BROAD_ALLOW = /^(?:Bash|Bash\(\*?\)|Bash\(\*:\*\)|\*)$/;
var agt_001_default = defineRule(
  {
    id: "DOME-AGT-001",
    title: "AI agent hooks or auto-approved tools",
    category: "autorun",
    severity: "review",
    summary: "AI agent hooks and auto-approved tools: `.claude/settings*.json`, `.cursor/hooks.json`, `.mcp.json`, `.cursor/mcp.json`, `.vscode/mcp.json`.",
    reasons: {
      hooks: "Project settings define hooks that an AI coding agent runs automatically.",
      autoApprove: "Project settings let an AI coding agent run any shell command without asking.",
      mcpAutoEnable: "Project settings enable every MCP server in the repository without asking.",
      mcpServer: "A project MCP configuration starts a local command when an AI agent loads the repository."
    },
    doc: {
      why: "AI coding agents read project-level configuration. Hooks and MCP servers are commands that run when the agent starts or uses a tool, and broad auto-approval lets injected instructions run shell commands unchecked.",
      falsePositives: "Teams do share formatter hooks and MCP servers. Review what each command runs when the file is added or changed.",
      references: [REFS.workspaceTrust]
    }
  },
  async (ctx) => {
    for (const { path: path2 } of targetsWhere(ctx, (p) => CLAUDE_SETTINGS.test(p) || CURSOR_HOOKS.test(p) || MCP_CONFIG.test(p))) {
      const text = await ctx.readText(path2);
      if (text === void 0) continue;
      const { root } = parseJsonc(text);
      if (CLAUDE_SETTINGS.test(path2) || CURSOR_HOOKS.test(path2)) {
        const hooks = child(root, "hooks");
        if (hasEntries(hooks)) ctx.report("hooks", ctx.locate(path2, hooks.offset));
      }
      if (CLAUDE_SETTINGS.test(path2)) {
        for (const entry of elements(at(root, "permissions", "allow"))) {
          if (BROAD_ALLOW.test(stringValue(entry) ?? "")) ctx.report("autoApprove", ctx.locate(path2, entry.offset));
        }
        const all = child(root, "enableAllProjectMcpServers");
        if (all?.value === true) ctx.report("mcpAutoEnable", ctx.locate(path2, all.offset));
      }
      if (MCP_CONFIG.test(path2)) {
        for (const key of ["mcpServers", "servers"]) {
          for (const [, server] of properties(child(root, key))) {
            const command2 = child(server, "command");
            if (stringValue(command2)) ctx.report("mcpServer", ctx.locate(path2, command2.offset));
          }
        }
      }
    }
  }
);

// ../engine/src/parsers/font.ts
var MAX_TABLES = 1024;
function u16(b, o) {
  return b[o] << 8 | b[o + 1];
}
function u32(b, o) {
  return (b[o] << 24 >>> 0) + (b[o + 1] << 16) + (b[o + 2] << 8) + b[o + 3];
}
function u16le(b, o) {
  return b[o] | b[o + 1] << 8;
}
function u32le(b, o) {
  return (b[o] | b[o + 1] << 8 | b[o + 2] << 16) + (b[o + 3] << 24 >>> 0);
}
function isTag(b, o) {
  for (let i = 0; i < 4; i++) {
    const c = b[o + i];
    if (c < 32 || c > 126) return false;
  }
  return true;
}
var LFS_POINTER = new TextEncoder().encode("version https://git-lfs.github.com/spec/");
function isLfsPointer(bytes) {
  if (bytes.length > 1024 || bytes.length < LFS_POINTER.length) return false;
  return LFS_POINTER.every((c, i) => bytes[i] === c);
}
function checkWoff(b) {
  if (b.length < 44) return false;
  const length = u32(b, 8);
  const numTables = u16(b, 12);
  if (length !== b.length || u16(b, 14) !== 0) return false;
  if (numTables === 0 || numTables > MAX_TABLES || 44 + numTables * 20 > b.length) return false;
  for (let t = 0; t < numTables; t++) {
    const e = 44 + t * 20;
    if (!isTag(b, e)) return false;
    const offset = u32(b, e + 4);
    const compLength = u32(b, e + 8);
    const origLength = u32(b, e + 12);
    if (offset < 44 || offset + compLength > b.length || compLength > origLength) return false;
  }
  return true;
}
function uintBase128(b, o) {
  let value2 = 0;
  for (let i = 0; i < 5; i++) {
    const byte = b[o + i];
    if (byte === void 0 || i === 0 && byte === 128) return void 0;
    if (value2 > 33554431) return void 0;
    value2 = value2 * 128 + (byte & 127);
    if ((byte & 128) === 0) return [value2, o + i + 1];
  }
  return void 0;
}
function uint255(b, o) {
  const code = b[o];
  if (code === void 0) return void 0;
  if (code === 253) return o + 2 < b.length ? [u16(b, o + 1), o + 3] : void 0;
  if (code === 255) return o + 1 < b.length ? [b[o + 1] + 253, o + 2] : void 0;
  if (code === 254) return o + 1 < b.length ? [b[o + 1] + 506, o + 2] : void 0;
  return [code, o + 1];
}
var WOFF2_FLAVORS = /* @__PURE__ */ new Set([65536, 1330926671, 1953658213, 1953784678]);
var TAG_GLYF = 1735162214;
var TAG_LOCA = 1819239265;
var KNOWN_GLYF = 10;
var KNOWN_LOCA = 11;
function checkWoff2(b) {
  if (b.length < 48) return false;
  const flavor = u32(b, 4);
  const length = u32(b, 8);
  const numTables = u16(b, 12);
  const totalCompressedSize = u32(b, 20);
  if (!WOFF2_FLAVORS.has(flavor) || length !== b.length || u16(b, 14) !== 0) return false;
  if (numTables === 0 || numTables > MAX_TABLES || totalCompressedSize === 0) return false;
  let o = 48;
  for (let t = 0; t < numTables; t++) {
    const flags = b[o];
    if (flags === void 0) return false;
    o++;
    const tagIndex = flags & 63;
    const transform = flags >> 6;
    let tag = 0;
    if (tagIndex === 63) {
      if (o + 4 > b.length || !isTag(b, o)) return false;
      tag = u32(b, o);
      o += 4;
    }
    const orig = uintBase128(b, o);
    if (!orig) return false;
    o = orig[1];
    const isGlyfOrLoca = tagIndex === KNOWN_GLYF || tagIndex === KNOWN_LOCA || tag === TAG_GLYF || tag === TAG_LOCA;
    if (isGlyfOrLoca ? transform !== 3 : transform !== 0) {
      const transformed = uintBase128(b, o);
      if (!transformed) return false;
      o = transformed[1];
    }
  }
  if (flavor === 1953784678) {
    if (o + 4 > b.length) return false;
    const version = u32(b, o);
    if (version !== 65536 && version !== 131072) return false;
    let fonts = uint255(b, o + 4);
    if (!fonts || fonts[0] === 0) return false;
    o = fonts[1];
    for (let f = 0, n = fonts[0]; f < n; f++) {
      const tables = uint255(b, o);
      if (!tables || tables[0] === 0 || tables[0] > numTables) return false;
      o = tables[1] + 4;
      for (let t = 0; t < tables[0]; t++) {
        const index = uint255(b, o);
        if (!index || index[0] >= numTables) return false;
        o = index[1];
      }
      fonts = [n, o];
    }
  }
  if (o + totalCompressedSize > b.length) return false;
  const block = (offset, size) => offset === 0 ? size === 0 : offset >= o + totalCompressedSize && offset + size <= b.length;
  return block(u32(b, 28), u32(b, 32)) && block(u32(b, 40), u32(b, 44));
}
function checkSfnt(b, base = 0) {
  if (b.length < base + 12) return false;
  const numTables = u16(b, base + 4);
  if (numTables === 0 || numTables > MAX_TABLES || base + 12 + numTables * 16 > b.length) return false;
  for (let t = 0; t < numTables; t++) {
    const e = base + 12 + t * 16;
    if (!isTag(b, e)) return false;
    const offset = u32(b, e + 8);
    const length = u32(b, e + 12);
    if (offset < 12 || offset + length > b.length + 3) return false;
  }
  return true;
}
function checkTtc(b) {
  if (b.length < 16) return false;
  const numFonts = u32(b, 8);
  if (numFonts === 0 || numFonts > 256 || 12 + numFonts * 4 > b.length) return false;
  for (let f = 0; f < numFonts; f++) {
    if (!checkSfnt(b, u32(b, 12 + f * 4))) return false;
  }
  return true;
}
function checkEot(b) {
  if (b.length < 82) return false;
  const eotSize = u32le(b, 0);
  const fontDataSize = u32le(b, 4);
  const version = u32le(b, 8);
  if (eotSize !== b.length || fontDataSize === 0 || fontDataSize > eotSize - 82) return false;
  if (![65536, 131073, 131074].includes(version)) return false;
  return u16le(b, 34) === 20556;
}
function checkFont(bytes) {
  if (bytes.length === 0) return { valid: false, problem: "empty" };
  if (isLfsPointer(bytes)) return { valid: false, problem: "lfs-pointer" };
  if (bytes.length < 4) return { valid: false, problem: "unknown-signature" };
  const sig = u32(bytes, 0);
  const result = (ok, format2) => ok ? { valid: true, format: format2 } : { valid: false, problem: "bad-header" };
  switch (sig) {
    case 2001684038:
      return result(checkWoff(bytes), "woff");
    case 2001684018:
      return result(checkWoff2(bytes), "woff2");
    case 65536:
    case 1330926671:
    // 'OTTO'
    case 1953658213:
    // 'true'
    case 1954115633:
      return result(checkSfnt(bytes), "sfnt");
    case 1953784678:
      return result(checkTtc(bytes), "ttc");
    default:
      if (bytes.length >= 82 && u16le(bytes, 34) === 20556) return result(checkEot(bytes), "eot");
      return { valid: false, problem: "unknown-signature" };
  }
}

// ../engine/src/rules/ast-001.ts
var ast_001_default = defineRule(
  {
    id: "DOME-AST-001",
    title: "Font file is not a font",
    category: "payload",
    severity: "review",
    summary: "A file with a font extension whose bytes are not a real font (checked by format header fields, not just magic bytes).",
    reasons: {
      notAFont: "A file named like a font does not have a valid font header."
    },
    doc: {
      why: "PolinRider, GhostAction and the RMG-Py attacker stored their obfuscated JavaScript loader as `public/fonts/fa-solid-*.woff2`. Nobody reviews binary-looking assets in a diff, and the file is later run with `node`. Combined with any auto-run surface in the same change, this becomes a block.",
      falsePositives: "Corrupt or truncated font files. Git LFS pointer files are recognized and skipped.",
      references: [REFS.polinRider, REFS.rmgPy]
    }
  },
  async (ctx) => {
    for (const { path: path2 } of targetsWhere(ctx, (p) => FONT_EXTENSIONS.has(extname(p)) && !p.includes("node_modules/"))) {
      const bytes = await ctx.readBytes(path2);
      if (bytes === void 0) continue;
      const check = checkFont(bytes);
      if (!check.valid && check.problem !== "lfs-pointer" && check.problem !== "empty") ctx.report("notAFont", { path: path2 });
    }
  }
);

// ../engine/src/parsers/js.ts
var REGEX_AFTER_KEYWORD = /* @__PURE__ */ new Set([
  "return",
  "typeof",
  "instanceof",
  "in",
  "of",
  "new",
  "delete",
  "void",
  "throw",
  "case",
  "do",
  "else",
  "yield",
  "await"
]);
function isIdentStart(code) {
  return code >= 65 && code <= 90 || code >= 97 && code <= 122 || code === 36 || code === 95 || code >= 128;
}
function isIdentPart(code) {
  return isIdentStart(code) || code >= 48 && code <= 57;
}
function tokenize(text) {
  const tokens = [];
  const braces = [];
  let lastSig;
  let i = 0;
  const n = text.length;
  const push = (type, start, end, value2 = "") => {
    const token = { type, start, end, value: value2 };
    tokens.push(token);
    if (type !== "ws" && type !== "comment") lastSig = token;
  };
  const readTemplate = (start) => {
    while (i < n) {
      const c = text[i];
      if (c === "\\") {
        i += 2;
      } else if (c === "`") {
        i++;
        push("template", start, i);
        return;
      } else if (c === "$" && text[i + 1] === "{") {
        i += 2;
        push("template", start, i);
        braces.push(true);
        return;
      } else {
        i++;
      }
    }
    push("template", start, n);
  };
  while (i < n) {
    const start = i;
    const c = text[i];
    const code = text.charCodeAt(i);
    if (c === " " || c === "	" || c === "\n" || c === "\r" || c === "\f" || c === "\v" || code === 160 || code === 65279) {
      while (i < n && /[\s\uFEFF\xA0]/.test(text[i])) i++;
      push("ws", start, i);
    } else if (c === "/" && text[i + 1] === "/") {
      const nl = text.indexOf("\n", i);
      i = nl === -1 ? n : nl;
      push("comment", start, i);
    } else if (c === "/" && text[i + 1] === "*") {
      const close = text.indexOf("*/", i + 2);
      i = close === -1 ? n : close + 2;
      push("comment", start, i);
    } else if (c === '"' || c === "'") {
      i++;
      let body = "";
      while (i < n && text[i] !== c && text[i] !== "\n") {
        if (text[i] === "\\") {
          body += text[i + 1] ?? "";
          i += 2;
        } else {
          body += text[i];
          i++;
        }
      }
      i++;
      push("string", start, Math.min(i, n), body);
    } else if (c === "`") {
      i++;
      readTemplate(start);
    } else if (c === "}" && braces.length && braces[braces.length - 1]) {
      braces.pop();
      i++;
      readTemplate(start);
    } else if (isIdentStart(code)) {
      while (i < n && isIdentPart(text.charCodeAt(i))) i++;
      push("ident", start, i, text.slice(start, i));
    } else if (code >= 48 && code <= 57) {
      while (i < n && /[\w.]/.test(text[i])) i++;
      push("number", start, i);
    } else if (c === "/" && regexAllowed(lastSig)) {
      i++;
      let inClass = false;
      while (i < n && text[i] !== "\n") {
        const d = text[i];
        if (d === "\\") {
          i += 2;
          continue;
        }
        if (d === "[") inClass = true;
        else if (d === "]") inClass = false;
        else if (d === "/" && !inClass) break;
        i++;
      }
      i++;
      while (i < n && isIdentPart(text.charCodeAt(i))) i++;
      push("regex", start, Math.min(i, n));
    } else {
      if (c === "{") braces.push(false);
      else if (c === "}") braces.pop();
      i++;
      push("punct", start, i, c);
    }
  }
  return tokens;
}
function regexAllowed(prev) {
  if (!prev) return true;
  if (prev.type === "punct") return !(prev.value === ")" || prev.value === "]" || prev.value === "}");
  if (prev.type === "ident") return REGEX_AFTER_KEYWORD.has(prev.value);
  return false;
}
function significant(tokens) {
  return tokens.filter((t) => t.type !== "ws" && t.type !== "comment");
}
var OPEN = /* @__PURE__ */ new Set(["(", "[", "{"]);
var CLOSE = /* @__PURE__ */ new Set([")", "]", "}"]);
var CONTINUES = /* @__PURE__ */ new Set([".", "(", "[", "?", ",", "+", "-", "*", "/", "%", "=", "&", "|", "^", ":", "<", ">", "!"]);
var CONTINUES_IDENT = /* @__PURE__ */ new Set(["as", "satisfies", "instanceof", "in"]);
var DECLARATION_START = /* @__PURE__ */ new Set(["function", "class", "export", "import", "const", "let", "var", "async", "interface", "type"]);
function findModuleTail(text, tokens = tokenize(text)) {
  const sig = significant(tokens);
  let depth = 0;
  let begin = -1;
  let exportDefault = false;
  for (let k = 0; k < sig.length; k++) {
    const t = sig[k];
    if (t.type === "punct" && OPEN.has(t.value)) depth++;
    else if (t.type === "punct" && CLOSE.has(t.value)) depth = Math.max(0, depth - 1);
    else if (depth === 0 && t.type === "ident" && t.value === "export" && sig[k + 1]?.value === "default") {
      begin = k + 2;
      exportDefault = true;
      break;
    } else if (depth === 0 && t.type === "ident" && t.value === "module" && sig[k + 1]?.value === "." && sig[k + 2]?.value === "exports" && sig[k + 3]?.value === "=") {
      begin = k + 4;
      break;
    }
  }
  if (begin === -1 || begin >= sig.length) return void 0;
  const isDeclaration = exportDefault && ["function", "class", "async"].includes(sig[begin].value);
  let end = -1;
  depth = 0;
  let sawBlock = false;
  for (let k = begin; k < sig.length; k++) {
    const t = sig[k];
    if (t.type === "punct" && OPEN.has(t.value)) {
      depth++;
      if (t.value === "{") sawBlock = true;
      continue;
    }
    if (t.type === "punct" && CLOSE.has(t.value)) {
      depth = Math.max(0, depth - 1);
      if (depth === 0 && isDeclaration && sawBlock && t.value === "}") {
        end = k + 1;
        break;
      }
      continue;
    }
    if (depth !== 0) continue;
    if (t.type === "punct" && t.value === ";") {
      end = k + 1;
      break;
    }
    const prev = sig[k - 1];
    if (k > begin && newlineBetween(text, prev.end, t.start)) {
      const prevEndsExpr = !(prev.type === "punct" && CONTINUES.has(prev.value) && !CLOSE.has(prev.value));
      const tContinues = t.type === "punct" && CONTINUES.has(t.value) || t.type === "ident" && CONTINUES_IDENT.has(t.value);
      if (prevEndsExpr && !tContinues) {
        end = k;
        break;
      }
    }
  }
  while (end !== -1 && end < sig.length && sig[end].value === ";") end++;
  if (end === -1 || end >= sig.length) return void 0;
  const tail = sig[end];
  const gapStart = sig[end - 1].end;
  const declaration = tail.type === "ident" && DECLARATION_START.has(tail.value) || tail.value === "module" && sig[end + 1]?.value === "." && sig[end + 2]?.value === "exports" || tail.value === "exports" && sig[end + 1]?.value === ".";
  return { offset: tail.start, padding: longestBlankRun(text, gapStart, tail.start), declaration };
}
function newlineBetween(text, from, to) {
  for (let i = from; i < to; i++) if (text.charCodeAt(i) === 10) return true;
  return false;
}
function longestBlankRun(text, from, to) {
  let best = 0;
  let run2 = 0;
  for (let i = from; i < to; i++) {
    const c = text[i];
    if (c === " " || c === "	") {
      run2++;
      if (run2 > best) best = run2;
    } else {
      run2 = 0;
    }
  }
  return best;
}
function longestPaddedLine(text) {
  let best;
  let runStart = -1;
  for (let i = 0; i <= text.length; i++) {
    const c = text[i];
    if (c === " " || c === "	") {
      if (runStart === -1) runStart = i;
    } else {
      if (runStart !== -1 && c !== void 0 && c !== "\n" && c !== "\r") {
        const padding = i - runStart;
        if (!best || padding > best.padding) best = { offset: i, padding };
      }
      runStart = -1;
    }
  }
  return best;
}
function findCodeConstruction(tokens) {
  const sig = significant(tokens);
  const out = [];
  let detached = -1;
  let hidden = false;
  let unref = false;
  let spawnLike = false;
  for (let k = 0; k < sig.length; k++) {
    const t = sig[k];
    if (t.type !== "ident") continue;
    const next = sig[k + 1];
    const prev = sig[k - 1];
    const declared = prev?.type === "ident" && (prev.value === "function" || prev.value === "class");
    if (declared) continue;
    if (t.value === "eval" && next?.value === "(") out.push({ kind: "eval", offset: t.start });
    else if (t.value === "Function" && (next?.value === "(" || prev?.value === "new")) out.push({ kind: "function", offset: t.start });
    else if (["runInThisContext", "runInNewContext", "runInContext", "compileFunction"].includes(t.value) && next?.value === "(") {
      out.push({ kind: "vm", offset: t.start });
    } else if (t.value === "Script" && prev?.value === "." && sig[k - 2]?.value === "vm") {
      out.push({ kind: "vm", offset: t.start });
    } else if (t.value === "detached" && next?.value === ":" && sig[k + 2]?.value === "true") {
      detached = t.start;
    } else if (t.value === "windowsHide" || t.value === "stdio" && sig[k + 2]?.type === "string" && sig[k + 2]?.value === "ignore") {
      hidden = true;
    } else if (t.value === "unref" && next?.value === "(") {
      unref = true;
    } else if (["spawn", "exec", "execFile", "fork"].includes(t.value) && next?.value === "(") {
      spawnLike = true;
    }
  }
  if (detached !== -1 && hidden && unref && spawnLike) out.push({ kind: "hiddenSpawn", offset: detached });
  return out;
}
var NETWORK_IDENTS = /* @__PURE__ */ new Set(["fetch", "axios", "got", "XMLHttpRequest", "WebSocket", "superagent", "needle", "ky"]);
function usesNetwork(tokens) {
  const sig = significant(tokens);
  for (let k = 0; k < sig.length; k++) {
    const t = sig[k];
    if (t.type !== "ident") continue;
    if (NETWORK_IDENTS.has(t.value)) return true;
    if ((t.value === "http" || t.value === "https" || t.value === "net" || t.value === "tls") && sig[k + 1]?.value === ".") {
      const member = sig[k + 2]?.value;
      if (member === "request" || member === "get" || member === "connect") return true;
    }
    if (t.type === "ident" && t.value === "require" && sig[k + 2]?.type === "string") {
      const mod = sig[k + 2].value.replace(/^node:/, "");
      if (["http", "https", "net", "tls", "axios", "node-fetch", "request", "got"].includes(mod)) return true;
    }
  }
  return false;
}
function wholeProcessEnv(tokens) {
  const sig = significant(tokens);
  const out = [];
  for (let k = 0; k + 2 < sig.length; k++) {
    if (sig[k].value === "process" && sig[k + 1].value === "." && sig[k + 2].value === "env") {
      const after = sig[k + 3];
      const member = after?.value === "." || after?.value === "[" || after?.value === "?" && sig[k + 4]?.value === ".";
      if (!member && sig[k - 1]?.value !== ".") out.push(sig[k].start);
    }
  }
  return out;
}
function stringCalls(tokens, names) {
  const sig = significant(tokens);
  const out = [];
  for (let k = 0; k + 2 < sig.length; k++) {
    const t = sig[k];
    if (t.type === "ident" && names.has(t.value) && sig[k + 1].value === "(") {
      const arg = sig[k + 2];
      if (arg.type === "string") out.push({ callee: t.value, arg: arg.value, offset: arg.start });
    }
  }
  return out;
}

// ../engine/src/parsers/shell.ts
var ESCAPABLE = /* @__PURE__ */ new Set([" ", "	", '"', "'", "$", "`", "\\", "\n", "|", "&", ";", "<", ">", "(", ")"]);
function matchParen(text, start) {
  let depth = 1;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (c === "(") depth++;
    else if (c === ")" && --depth === 0) return i + 1;
  }
  return text.length;
}
function parseShell(text) {
  const pipelines = [];
  const nested = [];
  let pipeline = { commands: [] };
  let command2 = { words: [] };
  let word = "";
  let inWord = false;
  let pendingRedirect;
  const endWord = () => {
    if (!inWord) return;
    if (pendingRedirect === "in") command2.stdinFrom = word;
    else if (pendingRedirect !== "out") command2.words.push(word);
    pendingRedirect = void 0;
    word = "";
    inWord = false;
  };
  const endCommand = () => {
    endWord();
    if (command2.words.length || command2.stdinFrom) pipeline.commands.push(command2);
    command2 = { words: [] };
  };
  const endPipeline = () => {
    endCommand();
    if (pipeline.commands.length) pipelines.push(pipeline);
    pipeline = { commands: [] };
  };
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    const next = text[i + 1];
    if (c === " " || c === "	" || c === "\r") {
      endWord();
      i++;
    } else if (c === "\n" || c === ";") {
      endPipeline();
      i++;
    } else if (c === "#" && !inWord) {
      while (i < text.length && text[i] !== "\n") i++;
    } else if (c === "'") {
      const close = text.indexOf("'", i + 1);
      const end = close === -1 ? text.length : close;
      word += text.slice(i + 1, end);
      inWord = true;
      i = end + 1;
    } else if (c === '"') {
      inWord = true;
      i++;
      while (i < text.length && text[i] !== '"') {
        const d = text[i];
        if (d === "\\" && i + 1 < text.length && '"\\$`'.includes(text[i + 1])) {
          word += text[i + 1];
          i += 2;
        } else if (d === "$" && text[i + 1] === "(") {
          const end = matchParen(text, i + 2);
          nested.push(text.slice(i + 2, end - 1));
          word += text.slice(i, end);
          i = end;
        } else if (d === "`") {
          const close = text.indexOf("`", i + 1);
          const end = close === -1 ? text.length : close;
          nested.push(text.slice(i + 1, end));
          i = end + 1;
        } else {
          word += d;
          i++;
        }
      }
      i++;
    } else if (c === "\\") {
      if (next !== void 0 && ESCAPABLE.has(next)) {
        if (next !== "\n") word += next;
        i += 2;
      } else {
        word += c;
        i++;
      }
      inWord = true;
    } else if (c === "$" && next === "(") {
      const end = matchParen(text, i + 2);
      nested.push(text.slice(i + 2, end - 1));
      word += text.slice(i, end);
      inWord = true;
      i = end;
    } else if (c === "`") {
      const close = text.indexOf("`", i + 1);
      const end = close === -1 ? text.length : close;
      nested.push(text.slice(i + 1, end));
      inWord = true;
      i = end + 1;
    } else if (c === "<" && next === "(") {
      endWord();
      const end = matchParen(text, i + 2);
      nested.push(text.slice(i + 2, end - 1));
      command2.words.push(text.slice(i, end));
      i = end;
    } else if (c === "<") {
      endWord();
      pendingRedirect = "in";
      i += next === "<" ? 2 : 1;
    } else if (c === ">") {
      if (inWord && /^\d+$/.test(word)) {
        word = "";
        inWord = false;
      }
      endWord();
      i += next === ">" ? 2 : 1;
      if (text[i] === "&") {
        i++;
        while (i < text.length && /\d/.test(text[i])) i++;
      } else {
        pendingRedirect = "out";
      }
    } else if (c === "|") {
      if (next === "|") {
        endPipeline();
        i += 2;
      } else {
        endCommand();
        i++;
      }
    } else if (c === "&") {
      endPipeline();
      i += next === "&" ? 2 : 1;
    } else if ((c === "(" || c === ")" || c === "{" || c === "}") && !inWord) {
      endPipeline();
      i++;
    } else {
      word += c;
      inWord = true;
      i++;
    }
  }
  endPipeline();
  return { pipelines, nested };
}
function programName(word) {
  if (!word) return "";
  const base = word.slice(Math.max(word.lastIndexOf("/"), word.lastIndexOf("\\")) + 1).toLowerCase();
  return base.replace(/\.(?:exe|cmd|bat|com)$/, "");
}
var SHELLS = /* @__PURE__ */ new Set(["sh", "bash", "zsh", "dash", "ksh", "fish", "ash"]);
var POWERSHELLS = /* @__PURE__ */ new Set(["powershell", "pwsh"]);
function parseShellDeep(text, maxDepth = 3) {
  const out = [];
  const visit2 = (t, depth) => {
    const parsed = parseShell(t);
    out.push(parsed);
    if (depth >= maxDepth) return;
    for (const n of parsed.nested) visit2(n, depth + 1);
    for (const p of parsed.pipelines) {
      for (const cmd of p.commands) {
        const inner = innerCommandString(cmd.words);
        if (inner !== void 0) visit2(inner, depth + 1);
      }
    }
  };
  visit2(text, 0);
  return out;
}
function innerCommandString(words) {
  const prog = programName(words[0]);
  if (SHELLS.has(prog)) {
    const idx = words.findIndex((w, i) => i > 0 && /^-[a-z]+$/.test(w) && w.includes("c"));
    return idx === -1 ? void 0 : words[idx + 1];
  }
  if (prog === "cmd") {
    const idx = words.findIndex((w, i) => i > 0 && /^\/[ck]$/i.test(w));
    return idx === -1 ? void 0 : words.slice(idx + 1).join(" ");
  }
  if (POWERSHELLS.has(prog)) {
    const idx = words.findIndex((w, i) => i > 0 && /^-(?:c|command)$/i.test(w));
    return idx === -1 ? void 0 : words.slice(idx + 1).join(" ");
  }
  return void 0;
}
var NODE_LIKE = /* @__PURE__ */ new Set(["node", "nodejs", "bun", "deno", "tsx", "ts-node"]);
var REQUIRE_FLAGS = /* @__PURE__ */ new Set(["-r", "--require", "--import", "--loader", "--experimental-loader"]);
var EVAL_FLAGS = /* @__PURE__ */ new Set(["-e", "--eval", "-p", "--print"]);
var CAT_LIKE = /* @__PURE__ */ new Set(["cat", "type", "get-content", "gc", "more"]);
function nodeInvocations(text) {
  const runs = [];
  const inline = [];
  for (const parsed of parseShellDeep(text)) {
    for (const pipeline of parsed.pipelines) {
      pipeline.commands.forEach((cmd, index) => {
        if (!NODE_LIKE.has(programName(cmd.words[0]))) return;
        let script;
        let readsStdin = false;
        let hasEval = false;
        const words = cmd.words;
        let i = 1;
        if (programName(words[0]) === "deno" || programName(words[0]) === "bun") {
          if (words[1] === "run") i = 2;
        }
        for (; i < words.length; i++) {
          const w = words[i];
          if (w === "-") {
            readsStdin = true;
            break;
          }
          if (w === "--") {
            script = words[i + 1];
            break;
          }
          if (!w.startsWith("-")) {
            script = w;
            break;
          }
          const eq = w.indexOf("=");
          const flag = eq === -1 ? w : w.slice(0, eq);
          if (REQUIRE_FLAGS.has(flag)) {
            const target = eq === -1 ? words[++i] : w.slice(eq + 1);
            if (target) runs.push({ file: target, via: "require" });
          } else if (EVAL_FLAGS.has(flag)) {
            const code = eq === -1 ? words[++i] : w.slice(eq + 1);
            if (code !== void 0) inline.push(code);
            hasEval = true;
          }
        }
        if (script) runs.push({ file: script, via: "script" });
        if ((readsStdin || !script && !hasEval) && cmd.stdinFrom) runs.push({ file: cmd.stdinFrom, via: "stdin" });
        if ((readsStdin || !script && !hasEval) && index > 0) {
          const prev = pipeline.commands[index - 1];
          if (CAT_LIKE.has(programName(prev.words[0]))) {
            for (const w of prev.words.slice(1)) if (!w.startsWith("-")) runs.push({ file: w, via: "stdin" });
          }
        }
      });
    }
  }
  return { runs, inline };
}
var DOWNLOADERS = /* @__PURE__ */ new Set(["curl", "wget", "iwr", "invoke-webrequest", "irm", "invoke-restmethod", "fetch", "aria2c"]);
var INTERPRETERS = /* @__PURE__ */ new Set([
  ...SHELLS,
  ...POWERSHELLS,
  "cmd",
  "iex",
  "invoke-expression",
  "eval",
  "source",
  ".",
  "node",
  "nodejs",
  "bun",
  "deno",
  "python",
  "python3",
  "perl",
  "ruby",
  "php"
]);
var PS_EXEC = /\b(?:iex|invoke-expression)\b/i;
var PS_DOWNLOAD = /\b(?:downloadstring|downloadfile|downloaddata|iwr|invoke-webrequest|irm|invoke-restmethod|net\.webclient)\b/i;
function containsDownloader(text) {
  return parseShell(text).pipelines.some((p) => p.commands.some((c) => DOWNLOADERS.has(programName(c.words[0]))));
}
function downloadsAndRuns(text) {
  if (PS_EXEC.test(text) && PS_DOWNLOAD.test(text)) return true;
  for (const parsed of parseShellDeep(text)) {
    const downloaded = /* @__PURE__ */ new Set();
    for (const pipeline of parsed.pipelines) {
      const progs = pipeline.commands.map((c) => programName(c.words[0]));
      const firstDownload = progs.findIndex((p) => DOWNLOADERS.has(p));
      if (firstDownload !== -1 && progs.slice(firstDownload + 1).some((p) => INTERPRETERS.has(p))) return true;
      for (const cmd of pipeline.commands) {
        const prog = programName(cmd.words[0]);
        if (INTERPRETERS.has(prog)) {
          for (const w of cmd.words.slice(1)) {
            if ((w.startsWith("<(") || w.includes("$(")) && containsDownloader(w.replace(/^[<$]\(|\)$/g, ""))) return true;
            if (downloaded.has(w)) return true;
          }
          if (cmd.stdinFrom && downloaded.has(cmd.stdinFrom)) return true;
        }
        if (downloaded.has(cmd.words[0] ?? "") || downloaded.has((cmd.words[0] ?? "").replace(/^\.\//, ""))) return true;
        if (prog === "curl" || prog === "wget") {
          cmd.words.forEach((w, i) => {
            if ((w === "-o" || w === "--output" || w === "-O" || w === "--output-document") && cmd.words[i + 1]) {
              const target = cmd.words[i + 1];
              downloaded.add(target);
              downloaded.add(target.replace(/^\.\//, ""));
              downloaded.add(`./${target.replace(/^\.\//, "")}`);
            }
          });
        }
      }
    }
  }
  return false;
}

// ../engine/src/rules/vsc-004.ts
var LOADERS = /* @__PURE__ */ new Set(["require", "import", "readFileSync", "readFile"]);
function nonScriptRuns(commandText) {
  const { runs, inline } = nodeInvocations(commandText);
  const files2 = runs.filter((r) => isNonScriptForNode(r.file)).map((r) => r.file);
  for (const code of inline) {
    for (const call of stringCalls(tokenize(code), LOADERS)) if (isAssetPath(call.arg)) files2.push(call.arg);
  }
  return files2;
}
async function npmScriptText(ctx, root, script) {
  const pkgPath = root ? `${root}/package.json` : "package.json";
  const text = await ctx.readText(pkgPath);
  if (text === void 0) return void 0;
  return parsePackageJson(text).scripts.find((s) => s.name === script)?.text;
}
var vsc_004_default = defineRule(
  {
    id: "DOME-VSC-004",
    title: "Task runs a non-script file with Node",
    category: "autorun",
    severity: "block",
    summary: "A task command runs a font, image or other non-script file with `node` (string or array form, `sh -c`, `-r`/`--import`, stdin).",
    reasons: {
      nonScript: "A VS Code task runs a file that is not a script (such as a font or image) with Node.",
      nonScriptViaNpm: "A VS Code task runs an npm script that runs a file that is not a script with Node."
    },
    doc: {
      why: 'Legitimate tasks run JavaScript files. Running `node` on a `.woff2`, `.png` or similar is how PolinRider, GhostAction and the RMG-Py attacker hid their loader: the "font" is really obfuscated JavaScript.',
      falsePositives: "None known. Node has no reason to execute an asset file.",
      references: [REFS.polinRider, REFS.rmgPy, REFS.abstractTasks]
    }
  },
  async (ctx) => {
    for (const { path: path2 } of targetsWhere(ctx, (p) => isTasksFile(p) || isWorkspaceFile(p))) {
      const text = await ctx.readText(path2);
      if (text === void 0) continue;
      const root = workspaceRootOf(path2);
      for (const task of parseTasks(path2, text)) {
        for (const cmd of task.commands) {
          for (const file of nonScriptRuns(cmd.text)) {
            const at2 = text.indexOf(file.replace(/\\/g, "\\\\"), cmd.offset);
            ctx.report("nonScript", [
              ctx.locate(path2, at2 === -1 ? cmd.offset : at2),
              ...referenced(ctx, root, file)
            ]);
          }
        }
        if (task.npmScript) {
          const script = await npmScriptText(ctx, root, task.npmScript);
          if (script && nonScriptRuns(script).length > 0) ctx.report("nonScriptViaNpm", ctx.locate(path2, task.offset));
        }
      }
    }
  }
);
function referenced(ctx, root, file) {
  const resolved = resolveRepoPath(root, file);
  return resolved && ctx.tree.has(resolved) ? [{ path: resolved }] : [];
}

// ../engine/src/rules/ast-002.ts
var SPAWNERS = /* @__PURE__ */ new Set(["fork"]);
var READERS = /* @__PURE__ */ new Set(["readFileSync", "readFile"]);
var ast_002_default = defineRule(
  {
    id: "DOME-AST-002",
    title: "Asset in an execution position",
    category: "payload",
    severity: "block",
    summary: "An image or font asset referenced from an execution position (npm script, dev container hook, workflow step, shell script, `fork`, or read and evaluated).",
    reasons: {
      command: "A script or hook runs an image, font or other non-script file with Node.",
      fork: "Code starts a new Node process from an image or font file.",
      evaluated: "Code reads an image or font file and builds code from it at runtime."
    },
    doc: {
      why: "Assets are never code. When something hands an asset to Node, or reads one and passes it to `eval`, `new Function` or `vm`, the asset is a disguised payload. VS Code tasks are covered by DOME-VSC-004.",
      falsePositives: "None known.",
      references: [REFS.polinRider, REFS.microsoftNext]
    }
  },
  async (ctx) => {
    const commands = await executableCommands(ctx, /* @__PURE__ */ new Set(["npm", "devcontainer", "workflow", "shell"]));
    for (const cmd of commands) {
      const fileText = await ctx.readText(cmd.path);
      for (const file of nonScriptRuns(cmd.text)) ctx.report("command", locateInCommand(ctx, cmd, file, fileText));
    }
    for (const { path: path2 } of targetsWhere(ctx, (p) => isJsLike(p) && !isTestPath(p) && !isVendored(p))) {
      const text = await ctx.readText(path2);
      if (text === void 0 || !/fork|readFile/.test(text)) continue;
      const tokens = tokenize(text);
      for (const call of stringCalls(tokens, SPAWNERS)) {
        if (isAssetPath(call.arg)) ctx.report("fork", ctx.locate(path2, call.offset));
      }
      const reads = stringCalls(tokens, READERS).filter((c) => isAssetPath(c.arg));
      if (reads.length > 0 && findCodeConstruction(tokens).some((c) => c.kind !== "hiddenSpawn")) {
        ctx.report("evaluated", ctx.locate(path2, reads[0].offset));
      }
    }
  }
);

// ../engine/src/rules/cfg-001.ts
var PADDING_THRESHOLD = 80;
var cfg_001_default = defineRule(
  {
    id: "DOME-CFG-001",
    title: "Code after the module body in a config file",
    category: "payload",
    severity: "review",
    summary: "Code after the module body in JS/TS config files, especially after a long run of whitespace.",
    reasons: {
      tail: "A config file has code after its export statement.",
      paddedTail: "A config file has code after its export statement, pushed out of view by a long run of whitespace."
    },
    doc: {
      why: "PolinRider and the Next.js campaign appended an obfuscated loader to `postcss.config.mjs`, `tailwind.config.js` and `next.config.*`, after `export default` and hundreds of spaces so it sits off-screen in editors and diffs. The build tool then runs it on every `npm run dev`.",
      falsePositives: "Declarations after the export (helper functions, constants, more `module.exports` assignments) are ignored unless they are padded or build code at runtime. Other statements after the export are reported for review.",
      references: [REFS.polinRider, REFS.microsoftNext]
    }
  },
  async (ctx) => {
    for (const { path: path2 } of targetsWhere(ctx, (p) => isJsConfigFile(p) && !isVendored(p))) {
      const text = await ctx.readText(path2);
      if (text === void 0) continue;
      const tokens = tokenize(text);
      const tail = findModuleTail(text, tokens);
      if (!tail) continue;
      const constructs = findCodeConstruction(tokens).some((c) => c.offset >= tail.offset);
      if (tail.padding >= PADDING_THRESHOLD || constructs) ctx.report("paddedTail", ctx.locate(path2, tail.offset), "block");
      else if (!tail.declaration) ctx.report("tail", ctx.locate(path2, tail.offset));
    }
  }
);

// ../engine/src/rules/cfg-002.ts
var PADDING = 150;
var LONG_LINE = 4e3;
var cfg_002_default = defineRule(
  {
    id: "DOME-CFG-002",
    title: "Whitespace padding or very long line in source",
    category: "payload",
    severity: "review",
    summary: "Very long lines or heavy whitespace padding in source and config files.",
    reasons: {
      padding: "A source line has code pushed far to the right by a long run of whitespace.",
      longLine: "A source file that is otherwise readable has a single extremely long line."
    },
    doc: {
      why: "Payloads appended to ordinary source files hide past the right edge of the editor or review pane. Minified bundles are expected to have long lines and are skipped by name.",
      falsePositives: "Generated files committed without a `.min.js` name, and data embedded as a long string literal. Test files, dependency folders and build output are skipped.",
      references: [REFS.polinRider]
    }
  },
  async (ctx) => {
    const candidates = (p) => isJsLike(p) && !isJsConfigFile(p) && !isVendored(p) && !isTestPath(p);
    for (const { path: path2 } of targetsWhere(ctx, candidates)) {
      const text = await ctx.readText(path2);
      if (text === void 0) continue;
      const padded = longestPaddedLine(text);
      if (padded && padded.padding >= PADDING) {
        ctx.report("padding", ctx.locate(path2, padded.offset));
        continue;
      }
      const lines2 = text.split("\n");
      if (lines2.length < 10) continue;
      const long = lines2.map((l, i) => [l.length, i]).filter(([len]) => len > LONG_LINE);
      if (long.length > 0 && long.length <= 2) ctx.report("longLine", { path: path2, line: long[0][1] + 1 });
    }
  }
);

// ../engine/src/rules/cfg-003.ts
var cfg_003_default = defineRule(
  {
    id: "DOME-CFG-003",
    title: "Runtime code construction in config or route code",
    category: "payload",
    severity: "review",
    summary: "Runtime code construction (`eval`, `new Function`, `vm.runIn*`, detached hidden `child_process` spawns) in config or route files.",
    reasons: {
      eval: "A config or route file calls eval.",
      function: "A config or route file builds a function from a string with Function.",
      vm: "A config or route file compiles and runs code with the vm module.",
      hiddenSpawn: "A config or route file starts a detached, hidden background process."
    },
    doc: {
      why: "Config files and server routes run with full privileges whenever the project builds or starts. Loaders decode a payload and run it with `eval` or `new Function`, or start a detached hidden process that outlives the dev server.",
      falsePositives: "Some build tooling evaluates code on purpose. Review the call and accept it with a hash-pinned `allow` entry.",
      references: [REFS.microsoftNext, REFS.polinRider]
    }
  },
  async (ctx) => {
    for (const { path: path2 } of targetsWhere(ctx, (p) => isServerSideCode(p) && !isTestPath(p) && !isVendored(p))) {
      const text = await ctx.readText(path2);
      if (text === void 0) continue;
      if (!/eval|Function|runIn|compileFunction|Script|detached/.test(text)) continue;
      for (const hit of findCodeConstruction(tokenize(text))) ctx.report(hit.kind, ctx.locate(path2, hit.offset));
    }
  }
);

// ../engine/src/rules/dev-001.ts
var URL_IN_COMMAND = /https?:\/\/[^\s'"|;&)]+/gi;
var PINNED_RAW_URL = /^https:\/\/raw\.githubusercontent\.com\/[\w.-]+\/[\w.-]+\/[0-9a-f]{40}\/[^\s]+$/;
function fetchesOnlyPinnedFiles(command2) {
  const urls = command2.match(URL_IN_COMMAND) ?? [];
  return urls.length > 0 && urls.every((u) => PINNED_RAW_URL.test(u));
}
var dev_001_default = defineRule(
  {
    id: "DOME-DEV-001",
    title: "Dev container lifecycle command",
    category: "autorun",
    severity: "review",
    summary: "`.devcontainer/devcontainer.json` `initializeCommand`, `onCreateCommand`, `postCreateCommand`, `postStartCommand` or `postAttachCommand` added or changed.",
    reasons: {
      hostCommand: "The initializeCommand hook runs on the host machine, outside the container, before the container starts.",
      lifecycle: "A dev container command runs automatically when the container is created, started or attached.",
      payload: "A dev container command downloads and runs code, or runs a file that is not a script with Node.",
      pinnedDownload: "A dev container command downloads a script pinned to an exact commit and runs it."
    },
    doc: {
      why: "Dev container hooks run without a prompt when someone opens the repository in a container or a Codespace. `initializeCommand` is the most sensitive: it runs on the host, with access to the developer's keys and wallets.",
      falsePositives: "Most dev containers run `npm ci` or similar in `postCreateCommand`. Review the command when it is added or changed. A script downloaded from `raw.githubusercontent.com` at a full commit SHA is reviewed rather than blocked, because it cannot change after review; anyone can pin a commit in their own repository, so check whose it is.",
      references: [REFS.devcontainerJson, REFS.microsoftNext]
    }
  },
  async (ctx) => {
    for (const { path: path2 } of targetsWhere(ctx, isDevcontainerFile)) {
      const text = await ctx.readText(path2);
      if (text === void 0) continue;
      const before = new Set(parseDevcontainer(await ctx.readBaseText(path2) ?? "{}").map((c) => `${c.name}\0${c.text}`));
      for (const cmd of parseDevcontainer(text)) {
        if (ctx.scope === "diff" && before.has(`${cmd.name}\0${cmd.text}`)) continue;
        const location = ctx.locate(path2, cmd.offset);
        if (nonScriptRuns(cmd.text).length > 0) ctx.report("payload", location, "block");
        else if (downloadsAndRuns(cmd.text)) {
          if (fetchesOnlyPinnedFiles(cmd.text)) ctx.report("pinnedDownload", location, "review");
          else ctx.report("payload", location, "block");
        } else ctx.report(cmd.name === "initializeCommand" ? "hostCommand" : "lifecycle", location);
      }
    }
  }
);

// ../engine/src/rules/env-001.ts
var ENV_FILE = /^\.env(?:\..+)?$/;
var BASE64 = /^[A-Za-z0-9+/]{16,}={0,2}$/;
function encodedUrl(value2) {
  const v = value2.trim().replace(/^["']|["']$/g, "");
  if (!BASE64.test(v) || !v.startsWith("aHR0c")) return false;
  return /^https?:\/\//.test(Buffer.from(v, "base64").toString("latin1"));
}
var env_001_default = defineRule(
  {
    id: "DOME-ENV-001",
    title: "Encoded URL in .env with code that sends the environment",
    category: "payload",
    severity: "review",
    summary: "Base64-encoded URLs in `.env` files combined with code that sends `process.env` over the network.",
    reasons: {
      encodedUrl: "An environment file stores a URL encoded as base64.",
      envSent: "Code sends the whole process environment over the network."
    },
    doc: {
      why: "The malicious Next.js repositories Microsoft describes keep their C2 address base64-encoded in `.env` and add a backend route that posts the entire `process.env` (API keys, wallet keys, tokens) to it. Each half alone is a review; together they block.",
      falsePositives: "Telemetry or crash reporters that send a full environment. That is a privacy problem in itself.",
      references: [REFS.microsoftNext]
    }
  },
  async (ctx) => {
    const encoded = [];
    const senders = [];
    for (const { path: path2 } of targetsWhere(ctx, (p) => ENV_FILE.test(basename(p)))) {
      const text = await ctx.readText(path2);
      if (text === void 0) continue;
      text.split(/\r?\n/).forEach((line, i) => {
        const eq = line.indexOf("=");
        if (eq !== -1 && !line.trimStart().startsWith("#") && encodedUrl(line.slice(eq + 1))) encoded.push({ path: path2, line: i + 1 });
      });
    }
    for (const { path: path2 } of targetsWhere(ctx, (p) => isJsLike(p) && !isTestPath(p) && !isVendored(p))) {
      const text = await ctx.readText(path2);
      if (text === void 0 || !text.includes("process")) continue;
      const tokens = tokenize(text);
      const whole = wholeProcessEnv(tokens);
      if (whole.length > 0 && usesNetwork(tokens)) senders.push(ctx.locate(path2, whole[0]));
    }
    const both = encoded.length > 0 && senders.length > 0;
    for (const loc of encoded) ctx.report("encodedUrl", both ? [loc, ...senders] : loc, both ? "block" : "review");
    if (!both) for (const loc of senders) ctx.report("envSent", loc);
  }
);

// ../engine/src/rules/gha-001.ts
var SECRET = /\$\{\{\s*secrets\.|toJSON\(\s*secrets\s*\)/i;
var ALL_SECRETS = /toJSON\(\s*secrets\s*\)|\$\{\{\s*secrets\s*\}\}/i;
var SECRET_AS_URL = /(?:^|\s)["']?\$\{\{\s*secrets\.\w+\s*\}\}[?/]\S*/g;
var HTTPS_HOST_URL = /\bhttps:\/\/(?![\d.]+(?:[:/\s"']|$))[A-Za-z0-9]/;
var NETWORK_TOOL = /\b(?:curl|wget|Invoke-WebRequest|Invoke-RestMethod|iwr|irm|nc|ncat)\b/i;
var RAW_IP_URL = /\bhttps?:\/\/(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(?![\w-]|\.\w)/g;
function isLocalAddress([a, b]) {
  return a === 127 || a === 10 || a === 0 || a === 172 && b >= 16 && b <= 31 || a === 192 && b === 168 || a === 169 && b === 254;
}
function publicIpUrl(run2) {
  for (const m of run2.matchAll(RAW_IP_URL)) {
    const octets = m.slice(1, 5).map(Number);
    if (octets.every((o) => o <= 255) && !isLocalAddress(octets)) return m;
  }
  return void 0;
}
var PR_HEAD_REF = /github\.event\.pull_request\.head\.(?:sha|ref)|github\.head_ref/;
var gha_001_default = defineRule(
  {
    id: "DOME-GHA-001",
    title: "Workflow added, changed or risky",
    category: "autorun",
    severity: "review",
    summary: "New or changed workflow under `.github/workflows/`, weighted up for `pull_request_target`, secrets passed to `curl`/`wget`, or posting to raw IPs.",
    reasons: {
      changed: "A GitHub Actions workflow was added or changed.",
      pullRequestTarget: "The workflow runs on pull_request_target, with write access and secrets, for pull requests from forks.",
      checksOutPrHead: "The workflow runs on pull_request_target and checks out the pull request's own code.",
      secretsToNetwork: "A workflow step sends repository secrets to a network tool.",
      rawIp: "A workflow step contacts a raw IP address."
    },
    doc: {
      why: "GhostAction added workflows that read every repository secret and posted them to an attacker server. `pull_request_target` combined with a checkout of the pull request runs untrusted code with write access.",
      falsePositives: "Every honest workflow change is reported for review in a diff scan. One named secret sent over HTTPS to a named host (an API token for a deployment) is reviewed, not blocked; bulk secret dumps, plain HTTP and raw public IP addresses are blocked. Loopback and private addresses (`127.0.0.1`, `10.x`, `172.16-31.x`, `192.168.x`) are ignored.",
      references: [REFS.ghostAction, REFS.actionsHardening]
    }
  },
  async (ctx) => {
    for (const { path: path2 } of targetsWhere(ctx, isWorkflowFile)) {
      const text = await ctx.readText(path2);
      if (text === void 0) continue;
      let wf;
      try {
        wf = parseWorkflow(text);
      } catch (error) {
        if (!(error instanceof UncheckableInput)) throw error;
        ctx.couldNotCheck(path2, "parse-error");
        continue;
      }
      const loc = (needle) => {
        const index = typeof needle === "string" ? text.indexOf(needle) : text.search(needle);
        return ctx.locate(path2, Math.max(0, index));
      };
      let reported = false;
      if (wf?.events.includes("pull_request_target")) {
        const checksOutHead = wf.steps.some(
          (s) => s.uses?.startsWith("actions/checkout") && PR_HEAD_REF.test(String(s.with?.ref ?? ""))
        );
        if (checksOutHead) ctx.report("checksOutPrHead", loc(PR_HEAD_REF), "block");
        else ctx.report("pullRequestTarget", loc("pull_request_target"));
        reported = true;
      }
      for (const step of wf?.steps ?? []) {
        if (!step.run) continue;
        const firstLine = step.run.split("\n", 1)[0].trim();
        const ipUrl = publicIpUrl(step.run);
        if (SECRET.test(step.run) && NETWORK_TOOL.test(step.run)) {
          const withoutUrlSecrets = step.run.replace(SECRET_AS_URL, " ");
          const namesHost = HTTPS_HOST_URL.test(step.run) || withoutUrlSecrets !== step.run;
          const routine = !ALL_SECRETS.test(step.run) && namesHost && !ipUrl && !/\bhttp:\/\//i.test(step.run);
          ctx.report("secretsToNetwork", loc(firstLine), routine ? "review" : "block");
          reported = true;
        }
        if (ipUrl) {
          ctx.report("rawIp", loc(ipUrl[0]), "block");
          reported = true;
        }
      }
      if (!reported && ctx.scope === "diff") ctx.report("changed", { path: path2 });
    }
  }
);

// ../engine/src/rules/git-001.ts
var IGNORES = /^\/?(?:\*\*\/)?(?:\.vscode|\.env)(?:\/|\*|\.\*)?$/;
var UNIGNORES = /^!\/?(?:\*\*\/)?(?:\.vscode|\.env)(?:\/.*)?$/;
function lines(text) {
  return text.split(/\r?\n/).map((l) => l.trim());
}
var git_001_default = defineRule(
  {
    id: "DOME-GIT-001",
    title: ".gitignore stops ignoring .vscode or .env",
    category: "autorun",
    severity: "info",
    summary: "`.gitignore` change that stops ignoring `.vscode` or `.env`.",
    reasons: {
      unignored: ".gitignore explicitly re-includes .vscode or .env files.",
      removed: ".gitignore no longer ignores .vscode or .env."
    },
    doc: {
      why: "In the RMG-Py incident and RitualPlay analysis, the attacker edited `.gitignore` so the malicious `.vscode` folder would be committed and pushed to other contributors.",
      falsePositives: "Teams that intentionally share `.vscode/settings.json` often un-ignore it. This rule is context only.",
      references: [REFS.rmgPy]
    }
  },
  async (ctx) => {
    for (const { path: path2 } of targetsWhere(ctx, (p) => basename(p) === ".gitignore")) {
      const text = await ctx.readText(path2);
      if (text === void 0) continue;
      const head = lines(text);
      const negation = head.findIndex((l) => UNIGNORES.test(l));
      if (negation !== -1) {
        ctx.report("unignored", { path: path2, line: negation + 1 });
        continue;
      }
      const base = await ctx.readBaseText(path2);
      if (base === void 0) continue;
      const removed = lines(base).filter((l) => IGNORES.test(l) && !head.includes(l));
      if (removed.length > 0) ctx.report("removed", { path: path2 });
    }
  }
);

// ../engine/src/rules/git-002.ts
var HOOK_FILE = /^(?:\.husky\/(?!_\/)[^/]+|\.githooks\/[^/]+)$/;
var HOOK_NAMES = /* @__PURE__ */ new Set([
  "pre-commit",
  "prepare-commit-msg",
  "commit-msg",
  "post-commit",
  "pre-rebase",
  "post-checkout",
  "post-merge",
  "pre-push",
  "post-rewrite",
  "pre-auto-gc"
]);
var git_002_default = defineRule(
  {
    id: "DOME-GIT-002",
    title: "Git hooks committed to the repository",
    category: "autorun",
    severity: "review",
    summary: "Git hooks committed to the repo (`.husky/`, `.githooks/`, `simple-git-hooks`) or a `core.hooksPath` setting.",
    reasons: {
      committedHook: "A git hook is committed to the repository and runs on commits, checkouts or pushes once installed.",
      hooksPath: "A script or config points git at hooks inside the repository with core.hooksPath."
    },
    doc: {
      why: "Hooks committed to the repository are installed by `npm install` (husky, simple-git-hooks) or by `core.hooksPath`, then run on every commit, checkout or push. A changed hook is an easy place to hide a payload.",
      falsePositives: "Husky and lint-staged setups are common and honest. Review hook changes like any other auto-run file.",
      references: [REFS.rmgPy]
    }
  },
  async (ctx) => {
    for (const { path: path2 } of targetsWhere(ctx, (p) => HOOK_FILE.test(p) && HOOK_NAMES.has(basename(p)))) {
      ctx.report("committedHook", { path: path2 });
    }
    for (const { path: path2 } of targetsWhere(ctx, (p) => isPackageJson(p) || basename(p) === ".gitconfig" || p.endsWith(".gitconfig"))) {
      const text = await ctx.readText(path2);
      if (text === void 0) continue;
      if (isPackageJson(path2)) {
        const pkg = parsePackageJson(text);
        const hooksPath = pkg.scripts.find((s) => /core\.hookspath/i.test(s.text));
        if (hooksPath) ctx.report("hooksPath", ctx.locate(path2, hooksPath.offset));
        const simple = properties(pkg.root).find(([k]) => k === "simple-git-hooks");
        if (simple && child(pkg.root, "simple-git-hooks")?.type === "object") {
          ctx.report("committedHook", ctx.locate(path2, simple[2].offset));
        }
      } else {
        const index = text.search(/hookspath/i);
        if (index !== -1) ctx.report("hooksPath", ctx.locate(path2, index));
      }
    }
  }
);

// ../engine/src/rules/ioc-001.ts
var ioc_001_default = defineRule(
  {
    id: "DOME-IOC-001",
    title: "Known-bad file hash",
    category: "intel",
    severity: "block",
    summary: "File hashes on the known-bad list (synced from the Dome Registry and public advisories).",
    reasons: {
      knownHash: "This file is byte-for-byte identical to a known malicious file."
    },
    doc: {
      why: "Campaigns reuse the same loader files across many repositories. An exact hash match needs no interpretation, so it always blocks and cannot be lowered by `.dome.yml`.",
      falsePositives: "None: a match is the same bytes. If an indicator was listed by mistake, it is revoked in the Dome Registry.",
      references: [REFS.polinRider]
    }
  },
  async (ctx) => {
    if (ctx.intel.hashes.size === 0) return;
    for (const { path: path2 } of targetsWhere(ctx, (p) => (ctx.tree.get(p)?.size ?? 0) <= ctx.maxFileBytes)) {
      const bytes = await ctx.readBytes(path2);
      if (bytes && ctx.intel.hashes.has(sha256Hex(bytes))) ctx.report("knownHash", { path: path2 });
    }
  }
);

// ../engine/src/rules/ioc-002.ts
var ioc_002_default = defineRule(
  {
    id: "DOME-IOC-002",
    title: "Published campaign marker",
    category: "intel",
    severity: "block",
    summary: "Published campaign markers (for example the signatures in OpenSourceMalware's PolinRider YARA rule).",
    reasons: {
      marker: "This file contains a byte sequence published as a marker of a known malware campaign."
    },
    doc: {
      why: "Obfuscated loaders change their hash on every copy but keep distinctive strings. Markers come from public research and live in `packages/intel` data files, never in rule code.",
      falsePositives: "Security research repositories that store samples or YARA rules. Mark those paths as `fixtures`; indicator findings still block, so keep samples out of scanned repositories.",
      references: [REFS.polinRider]
    }
  },
  async (ctx) => {
    if (ctx.intel.markers.length === 0) return;
    const markers = ctx.intel.markers.map((m) => Buffer.from(m, "utf8"));
    for (const { path: path2 } of targetsWhere(ctx, (p) => (ctx.tree.get(p)?.size ?? 0) <= ctx.maxFileBytes)) {
      const bytes = await ctx.readBytes(path2);
      if (!bytes) continue;
      const buf = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      for (const marker of markers) {
        const at2 = buf.indexOf(marker);
        if (at2 !== -1) {
          const text = await ctx.readText(path2);
          ctx.report("marker", text === void 0 ? { path: path2 } : ctx.locate(path2, buf.subarray(0, at2).toString("utf8").length));
          break;
        }
      }
    }
  }
);

// ../engine/src/rules/ioc-003.ts
var LOCKFILES = /* @__PURE__ */ new Set(["package-lock.json", "npm-shrinkwrap.json", "pnpm-lock.yaml", "yarn.lock", "bun.lock"]);
var BEFORE = /* @__PURE__ */ new Set(['"', "'", " ", "\n", "	", "/"]);
var AFTER = /* @__PURE__ */ new Set(["@", '"', "'", ":"]);
function findPackageInLockfile(text, name) {
  let from = 0;
  for (; ; ) {
    const at2 = text.indexOf(name, from);
    if (at2 === -1) return -1;
    const before = text[at2 - 1];
    const after = text[at2 + name.length];
    const scopedSuffix = before === "/" && !text.slice(Math.max(0, at2 - 13), at2).endsWith("node_modules/");
    if ((before === void 0 || BEFORE.has(before)) && !scopedSuffix && after !== void 0 && AFTER.has(after)) return at2;
    from = at2 + 1;
  }
}
var ioc_003_default = defineRule(
  {
    id: "DOME-IOC-003",
    title: "Known malicious npm package",
    category: "intel",
    severity: "block",
    summary: "Dependencies on known malicious npm packages.",
    reasons: {
      dependency: "package.json depends on a package published as part of a known malware campaign.",
      lockfile: "The lockfile resolves a package published as part of a known malware campaign."
    },
    doc: {
      why: "PolinRider published look-alike packages such as `tailwindcss-style-animate` whose install scripts ran the loader. A dependency on one runs it on the next `npm install`, even if it was added deep in the lockfile.",
      falsePositives: "None: package names on the list are confirmed malicious.",
      references: [REFS.polinRider]
    }
  },
  async (ctx) => {
    if (ctx.intel.packages.size === 0) return;
    for (const { path: path2 } of targetsWhere(ctx, (p) => isPackageJson(p) || LOCKFILES.has(basename(p)))) {
      const text = await ctx.readText(path2);
      if (text === void 0) continue;
      if (isPackageJson(path2)) {
        for (const dep of parsePackageJson(text).dependencies) {
          if (ctx.intel.packages.has(dep.name)) ctx.report("dependency", ctx.locate(path2, dep.offset));
        }
      } else {
        for (const name of ctx.intel.packages) {
          const at2 = findPackageInLockfile(text, name);
          if (at2 !== -1) ctx.report("lockfile", ctx.locate(path2, at2));
        }
      }
    }
  }
);

// ../engine/src/rules/ioc-004.ts
var LABEL = /[a-z0-9-]/;
function findDomain(text, domain) {
  let from = 0;
  for (; ; ) {
    const at2 = text.indexOf(domain, from);
    if (at2 === -1) return -1;
    const before = text[at2 - 1];
    const after = text[at2 + domain.length];
    if ((before === void 0 || before === "." || !LABEL.test(before)) && (after === void 0 || !LABEL.test(after))) return at2;
    from = at2 + 1;
  }
}
var ioc_004_default = defineRule(
  {
    id: "DOME-IOC-004",
    title: "Known staging or C2 domain in an executable position",
    category: "intel",
    severity: "block",
    summary: "Known staging and C2 domains in executable positions (tasks, scripts, hooks, workflows, config and route code).",
    reasons: {
      domain: "Code that runs automatically contacts a domain known to host malware or command-and-control servers."
    },
    doc: {
      why: "Loaders fetch their second stage from a small set of staging hosts. A known host in a task, script, hook or config file means the repository reaches out to attacker infrastructure.",
      falsePositives: "None for listed domains. Mentions in documentation are not scanned.",
      references: [REFS.polinRider, REFS.microsoftNext]
    }
  },
  async (ctx) => {
    if (ctx.intel.domains.length === 0) return;
    const commands = await executableCommands(ctx, /* @__PURE__ */ new Set(["task", "npm", "devcontainer", "workflow", "shell"]));
    const seen = /* @__PURE__ */ new Set();
    for (const cmd of commands) {
      const lower = cmd.text.toLowerCase();
      for (const domain of ctx.intel.domains) {
        if (findDomain(lower, domain) === -1) continue;
        const key = `${cmd.path}\0${cmd.offset}`;
        if (!seen.has(key)) ctx.report("domain", ctx.locate(cmd.path, cmd.offset));
        seen.add(key);
      }
    }
    for (const { path: path2 } of targetsWhere(ctx, isServerSideCode)) {
      const text = await ctx.readText(path2);
      if (text === void 0) continue;
      const lower = text.toLowerCase();
      for (const domain of ctx.intel.domains) {
        const at2 = findDomain(lower, domain);
        if (at2 !== -1) {
          ctx.report("domain", ctx.locate(path2, at2));
          break;
        }
      }
    }
  }
);

// ../engine/src/rules/npm-001.ts
var npm_001_default = defineRule(
  {
    id: "DOME-NPM-001",
    title: "Install script added or changed",
    category: "autorun",
    severity: "review",
    summary: "`preinstall`, `install`, `postinstall` or `prepare` scripts added or changed (and `binding.gyp`, which npm builds on install).",
    reasons: {
      installScript: "A package.json script that npm runs automatically on install was added or changed.",
      nodeGyp: "A binding.gyp file makes npm run a native build on install."
    },
    doc: {
      why: "Install scripts run with the developer's privileges the moment someone types `npm install`. PolinRider shipped through packages such as `tailwindcss-style-animate` whose install hooks ran the loader.",
      falsePositives: "Many honest packages use `prepare` to build or `postinstall` to set up git hooks. Read the command and check that it only runs tracked source or a known build output.",
      references: [REFS.npmScripts, REFS.polinRider]
    }
  },
  async (ctx) => {
    for (const { path: path2 } of targetsWhere(ctx, isPackageJson)) {
      const text = await ctx.readText(path2);
      if (text === void 0) continue;
      const before = new Map(
        parsePackageJson(await ctx.readBaseText(path2) ?? "{}").scripts.map((s) => [s.name, s.text])
      );
      for (const script of parsePackageJson(text).scripts) {
        if (!INSTALL_SCRIPTS.has(script.name)) continue;
        if (ctx.scope === "diff" && before.get(script.name) === script.text) continue;
        ctx.report("installScript", ctx.locate(path2, script.offset));
      }
    }
    for (const { path: path2 } of targetsWhere(ctx, (p) => basename(p) === "binding.gyp" && !p.includes("node_modules/"))) {
      if (ctx.scope === "diff" && await ctx.readBaseText(path2) !== void 0) continue;
      ctx.report("nodeGyp", { path: path2 });
    }
  }
);

// ../engine/src/rules/npm-002.ts
var BUILD_OUTPUT = /^(?:[^/]+\/)*(?:dist|build|lib|out|bin|\.next|generated)\//;
var SHELLS2 = /* @__PURE__ */ new Set(["sh", "bash", "zsh", "dash", "pwsh", "powershell", "cmd", "python", "python3"]);
function executedFiles(text) {
  const out = nodeInvocations(text).runs.map((r) => ({ file: r.file, byNode: true }));
  for (const parsed of parseShellDeep(text)) {
    for (const p of parsed.pipelines) {
      for (const cmd of p.commands) {
        const prog = programName(cmd.words[0]);
        const first = cmd.words[1];
        if (SHELLS2.has(prog) && first && !first.startsWith("-")) out.push({ file: first, byNode: false });
        else if (cmd.words[0]?.startsWith("./")) out.push({ file: cmd.words[0], byNode: false });
      }
    }
  }
  return out;
}
var npm_002_default = defineRule(
  {
    id: "DOME-NPM-002",
    title: "Install script runs an unexpected file",
    category: "autorun",
    severity: "review",
    summary: "An install script runs a file that is not tracked source or a known build output.",
    reasons: {
      nonScript: "An install script runs a file that is not a script (such as a font or image).",
      missing: "An install script runs a file that is not in the repository and is not a known build output."
    },
    doc: {
      why: "An honest install hook runs code you can read in the repository (`node scripts/setup.js`) or a build output (`node dist/install.js`). A hook that runs an asset, or a file that only appears after something else downloads it, hides what it does.",
      falsePositives: "Hooks that run a file generated by an earlier step outside the usual build folders. Accept them with a hash-pinned `allow` entry.",
      references: [REFS.npmScripts, REFS.polinRider]
    }
  },
  async (ctx) => {
    const commands = await executableCommands(ctx, /* @__PURE__ */ new Set(["npm"]), (name) => INSTALL_SCRIPTS.has(name));
    for (const cmd of commands) {
      if (ctx.scope === "diff") {
        const base = parsePackageJson(await ctx.readBaseText(cmd.path) ?? "{}").scripts;
        if (base.some((s) => s.name === cmd.name && s.text === cmd.text)) continue;
      }
      for (const { file, byNode } of executedFiles(cmd.text)) {
        if (/[$%*`]/.test(file) || file.includes("node_modules")) continue;
        const location = ctx.locate(cmd.path, cmd.offset);
        if (byNode ? isNonScriptForNode(file) : isAssetPath(file)) {
          ctx.report("nonScript", location, "block");
          continue;
        }
        const resolved = resolveRepoPath(cmd.dir, file);
        if (resolved && !ctx.tree.has(resolved) && !BUILD_OUTPUT.test(resolved)) ctx.report("missing", location);
      }
    }
  }
);

// ../engine/src/rules/prp-001.ts
var CLOCK = /git_committer_date|git_author_date|set-date|faketime|libfaketime|\bdate\s+-s\b|\bdate\s+\d|\btime\s+\d|--date[= ]/;
var FORCE = /\s(?:--force(?:-with-lease)?|-f)(?:\s|$)|\s\+\S/;
var prp_001_default = defineRule(
  {
    id: "DOME-PRP-001",
    title: "Propagation script rewrites history",
    category: "payload",
    severity: "review",
    summary: "Propagation scripts that rewind the clock, amend the last commit and force-push.",
    reasons: {
      amendForcePush: "A script amends the last commit and force-pushes it.",
      rewritesHistory: "A script rewinds the clock, amends the last commit and force-pushes, hiding a change inside existing history."
    },
    doc: {
      why: "PolinRider spread with `temp_auto_push.bat`: it set the system clock back, amended the latest commit to include the payload and force-pushed, so the change appears in an old, already-reviewed commit.",
      falsePositives: "Release helpers that amend and force-push to a personal branch. Rewinding the clock has no honest use here.",
      references: [REFS.polinRider, REFS.rmgPy]
    }
  },
  async (ctx) => {
    for (const { path: path2 } of targetsWhere(ctx, isShellScript)) {
      const text = await ctx.readText(path2);
      if (text === void 0) continue;
      let amend = -1;
      let force = -1;
      let clock = false;
      text.toLowerCase().split("\n").forEach((line, i) => {
        if (line.includes("commit") && line.includes("--amend") && amend === -1) amend = i;
        if (line.includes("push") && FORCE.test(line) && force === -1) force = i;
        if (CLOCK.test(line)) clock = true;
      });
      if (amend === -1 || force === -1) continue;
      ctx.report(clock ? "rewritesHistory" : "amendForcePush", { path: path2, line: amend + 1 }, clock ? "block" : "review");
    }
  }
);

// ../engine/src/rules/stl-001.ts
var CODE_EXTENSIONS = /* @__PURE__ */ new Set(["py", "rb", "go", "rs"]);
var IDENTITY_DIRS = /* @__PURE__ */ new Set(["stellar", "soroban"]);
var IDENTITY_PATHS = [...IDENTITY_DIRS].map((dir) => dir + "/identity");
function identityReference(text, tokens) {
  const sig = significant(tokens);
  for (let k = 0; k < sig.length; k++) {
    const t = sig[k];
    if (t.type !== "string" && t.type !== "template") continue;
    const body = t.type === "string" ? t.value : text.slice(t.start, t.end);
    if (!/\s/.test(body) && IDENTITY_PATHS.some((p) => body.replace(/\\/g, "/").includes(p))) {
      return t.start;
    }
    const next = sig[k + 2];
    if (t.type === "string" && IDENTITY_DIRS.has(t.value) && sig[k + 1]?.value === "," && next?.type === "string" && next.value === "identity") {
      return t.start;
    }
  }
  return void 0;
}
var stl_001_default = defineRule(
  {
    id: "DOME-STL-001",
    title: "Code reads Stellar CLI identities",
    category: "stellar",
    severity: "review",
    summary: "Code that reads Stellar CLI identities (`~/.config/stellar/identity/*.toml`, plaintext unless created with `--secure-store`).",
    reasons: {
      reads: "Project code refers to the Stellar CLI identity folder, where secret keys are stored.",
      exfiltrates: "Project code refers to the Stellar CLI identity folder and also makes network requests."
    },
    doc: {
      why: "Stellar CLI identities are stored as plaintext TOML files containing secret keys unless created with `--secure-store`. A project file has no reason to read them, and code that reads them and talks to the network can drain accounts.",
      falsePositives: "Stellar developer tooling that manages identities on purpose.",
      references: [REFS.stellarCliKeys]
    }
  },
  async (ctx) => {
    const candidates = (p) => (isJsLike(p) || isShellScript(p) || CODE_EXTENSIONS.has(extname(p))) && !isTestPath(p) && !isVendored(p);
    for (const { path: path2 } of targetsWhere(ctx, candidates)) {
      const text = await ctx.readText(path2);
      if (text === void 0) continue;
      const tokens = isJsLike(path2) ? tokenize(text) : void 0;
      const hit = tokens ? identityReference(text, tokens) : IDENTITY_PATHS.map((p) => text.replace(/\\/g, "/").indexOf(p)).find((i) => i !== -1);
      if (hit === void 0) continue;
      const network = tokens !== void 0 && usesNetwork(tokens);
      ctx.report(network ? "exfiltrates" : "reads", ctx.locate(path2, hit), network ? "block" : "review");
    }
  }
);

// ../engine/src/rules/stl-002.ts
var WALLET_STORAGE = [
  ["Local Extension", "Settings"].join(" "),
  ["chrome-extension", ""].join("_"),
  ["moz-extension", "/"].join(":/"),
  ["IndexedDB", "chrome-extension"].join("/")
];
var CODE_EXTENSIONS2 = /* @__PURE__ */ new Set(["py", "rb", "go", "rs"]);
var stl_002_default = defineRule(
  {
    id: "DOME-STL-002",
    title: "Code reads browser wallet extension storage",
    category: "stellar",
    severity: "review",
    summary: "Code that reads browser wallet extension storage (Freighter and others) from a project file.",
    reasons: {
      reads: "Project code refers to browser extension storage, where wallet extensions keep their vaults.",
      exfiltrates: "Project code refers to browser extension storage and also makes network requests."
    },
    doc: {
      why: "Developer-targeting malware collects browser extension storage to steal wallet vaults, including Stellar wallets such as Freighter. Application code never needs to read another extension's storage from disk.",
      falsePositives: "Browser automation and extension development tooling.",
      references: [REFS.microsoftNext, REFS.abstractTasks]
    }
  },
  async (ctx) => {
    const candidates = (p) => (isJsLike(p) || isShellScript(p) || CODE_EXTENSIONS2.has(extname(p))) && !isTestPath(p) && !isVendored(p);
    for (const { path: path2 } of targetsWhere(ctx, candidates)) {
      const text = await ctx.readText(path2);
      if (text === void 0) continue;
      const hit = WALLET_STORAGE.map((p) => text.indexOf(p)).find((i) => i !== -1);
      if (hit === void 0) continue;
      const network = isJsLike(path2) && usesNetwork(tokenize(text));
      ctx.report(network ? "exfiltrates" : "reads", ctx.locate(path2, hit), network ? "block" : "review");
    }
  }
);

// ../engine/src/strkey.ts
var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
var SEED_VERSION = 18 << 3;
function base32Decode(input2) {
  const out = [];
  let bits = 0;
  let value2 = 0;
  for (const c of input2) {
    const idx = ALPHABET.indexOf(c);
    if (idx === -1) return void 0;
    value2 = value2 << 5 | idx;
    bits += 5;
    if (bits >= 8) {
      out.push(value2 >>> bits - 8 & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(out);
}
function crc16xmodem(bytes) {
  let crc = 0;
  for (const b of bytes) {
    crc ^= b << 8;
    for (let i = 0; i < 8; i++) crc = crc & 32768 ? (crc << 1 ^ 4129) & 65535 : crc << 1 & 65535;
  }
  return crc;
}
function strkeyIsValidSeed(candidate) {
  if (candidate.length !== 56 || candidate[0] !== "S") return false;
  const raw = base32Decode(candidate);
  if (!raw || raw.length !== 35 || raw[0] !== SEED_VERSION) return false;
  const crc = crc16xmodem(raw.subarray(0, 33));
  return raw[33] === (crc & 255) && raw[34] === crc >> 8;
}

// ../engine/src/rules/stl-003.ts
var CANDIDATE = /\bS[A-Z2-7]{55}\b/g;
var MAX_TEXT_BYTES = 1024 * 1024;
var BINARY_EXTENSIONS = /* @__PURE__ */ new Set(["wasm", "node", "so", "dll", "dylib", "exe", "jar", "gz", "tgz", "xz", "bz2", "7z", "rar"]);
var stl_003_default = defineRule(
  {
    id: "DOME-STL-003",
    title: "Hard-coded Stellar secret key",
    category: "stellar",
    severity: "review",
    summary: "Hard-coded Stellar secret keys (`S\u2026` strkeys with a valid checksum) committed to the repo.",
    reasons: {
      secretKey: "A Stellar secret key is committed to the repository."
    },
    doc: {
      why: "Anyone who can read the repository can sign for the account. Only candidates with a valid SEP-23 checksum are reported, so random 56-character strings do not match.",
      falsePositives: "Throwaway testnet keys in examples. Generate them at runtime instead of committing them.",
      references: [REFS.strkey]
    }
  },
  async (ctx) => {
    const candidates = (p) => !isVendored(p) && !isAssetPath(p) && !BINARY_EXTENSIONS.has(extname(p));
    for (const { path: path2, size } of targetsWhere(ctx, candidates)) {
      if (size < 56 || size > MAX_TEXT_BYTES) continue;
      const bytes = await ctx.readBytes(path2);
      if (!bytes || looksBinary(bytes)) continue;
      const text = await ctx.readText(path2);
      if (text === void 0) continue;
      for (const match of text.matchAll(CANDIDATE)) {
        if (strkeyIsValidSeed(match[0])) {
          ctx.report("secretKey", ctx.locate(path2, match.index));
          break;
        }
      }
    }
  }
);

// ../engine/src/rules/vsc-001.ts
var vsc_001_default = defineRule(
  {
    id: "DOME-VSC-001",
    title: "Task runs on folder open",
    category: "autorun",
    severity: "review",
    summary: "A `.vscode/tasks.json` or `*.code-workspace` task sets `runOptions.runOn` to `folderOpen`.",
    reasons: {
      folderOpen: "A VS Code task is set to run automatically when the folder is opened."
    },
    doc: {
      why: "A folder-open task runs as soon as someone opens the repository in VS Code or Cursor and trusts the workspace. It was the entry point in PolinRider/TasksJacker, Contagious Interview and the RMG-Py incident, where the task launched a script disguised as a font.",
      falsePositives: "Watch tasks (`tsc --watch`, `npm run dev`) are sometimes set to start on folder open. Review the command; if it only runs project code, accept it with a hash-pinned `allow` entry.",
      references: [REFS.abstractTasks, REFS.polinRider, REFS.rmgPy, REFS.workspaceTrust]
    }
  },
  async (ctx) => {
    for (const { path: path2 } of targetsWhere(ctx, (p) => isTasksFile(p) || isWorkspaceFile(p))) {
      const text = await ctx.readText(path2);
      if (text === void 0) continue;
      for (const task of parseTasks(path2, text)) {
        if (task.folderOpenOffset !== void 0) ctx.report("folderOpen", ctx.locate(path2, task.folderOpenOffset));
      }
    }
  }
);

// ../engine/src/rules/vsc-002.ts
var vsc_002_default = defineRule(
  {
    id: "DOME-VSC-002",
    title: "Automatic tasks turned on",
    category: "autorun",
    severity: "review",
    summary: "Workspace settings set `task.allowAutomaticTasks` to `on`.",
    reasons: {
      allowAutomaticTasks: "Turns on automatic tasks so VS Code does not ask first."
    },
    doc: {
      why: "VS Code asks before running a folder-open task for the first time. Setting `task.allowAutomaticTasks` to `on` in the workspace removes that prompt, which is what the RMG-Py attacker did alongside the malicious task.",
      falsePositives: "Rare. A project that wants its watch task to start silently might set it, but that choice belongs in each developer's user settings, not in the repository.",
      references: [REFS.rmgPy, REFS.workspaceTrust]
    }
  },
  async (ctx) => {
    for (const { path: path2 } of targetsWhere(ctx, (p) => isSettingsFile(p) || isWorkspaceFile(p))) {
      const text = await ctx.readText(path2);
      if (text === void 0) continue;
      const node = setting(settingsNode(path2, text), "task.allowAutomaticTasks");
      if (node && (node.value === "on" || node.value === true)) ctx.report("allowAutomaticTasks", ctx.locate(path2, node.offset));
    }
  }
);

// ../engine/src/rules/vsc-003.ts
var EXCLUDE_SETTINGS = ["files.exclude", "search.exclude", "files.watcherExclude"];
var HIDDEN_PATH = /(?:^|[/*])\.vscode(?:$|[/*{])|tasks\.json/;
function hidesVscode(pattern) {
  if (HIDDEN_PATH.test(pattern)) return true;
  for (const group of pattern.split("}")) {
    const open = group.indexOf("{");
    if (open !== -1 && /\bvscode\b/.test(group.slice(open))) return true;
  }
  return false;
}
var vsc_003_default = defineRule(
  {
    id: "DOME-VSC-003",
    title: ".vscode hidden from view",
    category: "autorun",
    severity: "review",
    summary: "`files.exclude` or `search.exclude` hides `.vscode` or `tasks.json`.",
    reasons: {
      hidden: "Workspace settings hide the .vscode folder or tasks.json from the file explorer or search."
    },
    doc: {
      why: "Hiding `.vscode` keeps a malicious task out of sight in the editor. The RMG-Py attacker added `files.exclude` entries for exactly this.",
      falsePositives: "Some projects tidy the explorer by hiding editor folders. Hiding `.vscode` specifically is unusual.",
      references: [REFS.rmgPy]
    }
  },
  async (ctx) => {
    for (const { path: path2 } of targetsWhere(ctx, (p) => isSettingsFile(p) || isWorkspaceFile(p))) {
      const text = await ctx.readText(path2);
      if (text === void 0) continue;
      const settings = settingsNode(path2, text);
      for (const key of EXCLUDE_SETTINGS) {
        for (const [pattern, value2, keyNode] of properties(setting(settings, key))) {
          const enabled = value2.type === "boolean" ? value2.value === true : value2.type === "object";
          if (enabled && hidesVscode(pattern)) ctx.report("hidden", ctx.locate(path2, keyNode.offset));
        }
      }
    }
  }
);

// ../engine/src/rules/vsc-005.ts
var vsc_005_default = defineRule(
  {
    id: "DOME-VSC-005",
    title: "Task downloads and runs code",
    category: "autorun",
    severity: "block",
    summary: "A task command downloads and pipes to a shell (`curl \u2026 | sh`, `wget \u2026 | bash`, PowerShell `iwr | iex`).",
    reasons: {
      downloadAndRun: "A VS Code task downloads something from the network and runs it."
    },
    doc: {
      why: "Contagious Interview and Microsoft's Next.js report describe tasks that fetch a second stage from a staging server and run it in a shell. Nothing about the downloaded code is visible in the repository.",
      falsePositives: "Setup tasks that install a toolchain with `curl | sh`. Those belong in documentation, not in a task that can run automatically.",
      references: [REFS.abstractTasks, REFS.microsoftNext]
    }
  },
  async (ctx) => {
    for (const { path: path2 } of targetsWhere(ctx, (p) => isTasksFile(p) || isWorkspaceFile(p))) {
      const text = await ctx.readText(path2);
      if (text === void 0) continue;
      for (const task of parseTasks(path2, text)) {
        for (const cmd of task.commands) {
          if (downloadsAndRuns(cmd.text)) ctx.report("downloadAndRun", ctx.locate(path2, cmd.offset));
        }
      }
    }
  }
);

// ../engine/src/rules/vsc-006.ts
var vsc_006_default = defineRule(
  {
    id: "DOME-VSC-006",
    title: "Task output hidden",
    category: "autorun",
    severity: "info",
    summary: "Task options hide output (`presentation.reveal: never`, `presentation.echo: false`, `hide: true`) on a task that also runs on folder open or runs a payload.",
    reasons: {
      hiddenOutput: "The task hides its terminal output, so nothing is visible while it runs."
    },
    doc: {
      why: "Malicious folder-open tasks set `reveal: never` so no terminal panel appears. On its own this is harmless; it is reported as context next to other task findings.",
      falsePositives: "Background watch tasks often hide output. That is why this rule is only informational.",
      references: [REFS.abstractTasks, REFS.polinRider]
    }
  },
  async (ctx) => {
    for (const { path: path2 } of targetsWhere(ctx, (p) => isTasksFile(p) || isWorkspaceFile(p))) {
      const text = await ctx.readText(path2);
      if (text === void 0) continue;
      for (const task of parseTasks(path2, text)) {
        if (task.hiddenOutputOffset === void 0) continue;
        const risky = task.folderOpenOffset !== void 0 || task.commands.some((c) => downloadsAndRuns(c.text) || nonScriptRuns(c.text).length > 0);
        if (risky) ctx.report("hiddenOutput", ctx.locate(path2, task.hiddenOutputOffset));
      }
    }
  }
);

// ../engine/src/rules/index.ts
var ALL_RULES = [
  vsc_001_default,
  vsc_002_default,
  vsc_003_default,
  vsc_004_default,
  vsc_005_default,
  vsc_006_default,
  npm_001_default,
  npm_002_default,
  dev_001_default,
  agt_001_default,
  gha_001_default,
  git_001_default,
  git_002_default,
  ast_001_default,
  ast_002_default,
  cfg_001_default,
  cfg_002_default,
  cfg_003_default,
  env_001_default,
  prp_001_default,
  ioc_001_default,
  ioc_002_default,
  ioc_003_default,
  ioc_004_default,
  stl_001_default,
  stl_002_default,
  stl_003_default
];

// ../engine/src/ruleset.ts
import { createHash as createHash2 } from "node:crypto";
function rulesetHash(rules2, intel) {
  const sorted = (values) => [...values].sort();
  const canonical = JSON.stringify({
    engine: VERSION,
    rules: rules2.map(({ meta }) => [meta.id, meta.severity, Object.entries(meta.reasons).sort(([a], [b]) => a < b ? -1 : 1)]).sort(([a], [b]) => a < b ? -1 : 1),
    intel: {
      hashes: sorted(intel.hashes),
      markers: sorted(intel.markers),
      packages: sorted(intel.packages),
      domains: sorted(intel.domains)
    }
  });
  return createHash2("sha256").update(canonical).digest("hex");
}

// ../engine/src/source/links.ts
var MAX_HOPS = 8;
function resolveTarget(linkPath, target) {
  if (target === "" || target.startsWith("/") || /^[A-Za-z]:/.test(target) || target.includes("\0")) return void 0;
  const parts = linkPath.split("/").slice(0, -1);
  for (const part of target.replace(/\\/g, "/").split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") {
      if (parts.length === 0) return void 0;
      parts.pop();
    } else {
      parts.push(part);
    }
  }
  return parts.join("/");
}
async function resolveLinks(source, listed) {
  const byPath = new Map(listed.map((e) => [e.path, e]));
  const links = listed.filter((e) => e.kind === "symlink");
  if (links.length === 0 || !source.readLink) return { entries: listed, aliases: /* @__PURE__ */ new Map() };
  const targets = /* @__PURE__ */ new Map();
  for (const link of links) targets.set(link.path, await source.readLink(link.path).catch(() => void 0));
  const follow = (start) => {
    let current = start;
    for (let hop = 0; hop < MAX_HOPS; hop++) {
      if (!byPath.has(current) || byPath.get(current).kind !== "symlink") {
        const segments = current.split("/");
        let moved = false;
        for (let i = 1; i < segments.length; i++) {
          const prefix = segments.slice(0, i).join("/");
          if (byPath.get(prefix)?.kind === "symlink") {
            const resolved2 = resolveTarget(prefix, targets.get(prefix) ?? "");
            if (resolved2 === void 0) return void 0;
            current = [resolved2, ...segments.slice(i)].filter(Boolean).join("/");
            moved = true;
            break;
          }
        }
        if (!moved) return current;
        continue;
      }
      const resolved = resolveTarget(current, targets.get(current) ?? "");
      if (resolved === void 0) return void 0;
      current = resolved;
    }
    return void 0;
  };
  const entries = [];
  const aliases = /* @__PURE__ */ new Map();
  const real = listed.filter((e) => e.kind !== "symlink");
  const realPaths = new Set(real.map((e) => e.path));
  entries.push(...real);
  for (const link of links) {
    const resolved = follow(link.path);
    if (resolved !== void 0 && realPaths.has(resolved) && byPath.get(resolved).kind === "file") {
      aliases.set(link.path, resolved);
      entries.push({ path: link.path, kind: "file", size: byPath.get(resolved).size });
      continue;
    }
    const prefix = resolved === void 0 ? void 0 : `${resolved}/`;
    const below = prefix === void 0 ? [] : real.filter((e) => e.path.startsWith(prefix) && e.kind === "file");
    if (below.length > 0) {
      for (const e of below) {
        const virtual = `${link.path}/${e.path.slice(prefix.length)}`;
        if (!realPaths.has(virtual)) {
          aliases.set(virtual, e.path);
          entries.push({ path: virtual, kind: "file", size: e.size });
        }
      }
      continue;
    }
    entries.push(link);
  }
  entries.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
  return { entries, aliases };
}

// ../engine/src/scan.ts
var HIDES_AUTORUN = /(?:^|\/)(?:\.vscode|\.devcontainer|\.github|\.husky|\.githooks|\.cursor|\.claude|workflows|\.devcontainer\.json)$/;
var DEFAULT_MAX_FILE_BYTES = 8 * 1024 * 1024;
var FileCache = class {
  constructor(source, tree, maxBytes, incomplete, aliases = /* @__PURE__ */ new Map()) {
    this.source = source;
    this.tree = tree;
    this.maxBytes = maxBytes;
    this.incomplete = incomplete;
    this.aliases = aliases;
  }
  bytes = /* @__PURE__ */ new Map();
  texts = /* @__PURE__ */ new Map();
  lines = /* @__PURE__ */ new Map();
  readBytes(path2) {
    let p = this.bytes.get(path2);
    if (!p) {
      p = this.load(path2);
      this.bytes.set(path2, p);
    }
    return p;
  }
  readText(path2) {
    let p = this.texts.get(path2);
    if (!p) {
      p = this.readBytes(path2).then((b) => {
        if (b === void 0) return void 0;
        const text = decodeText(b);
        this.lines.set(path2, new LineIndex(text));
        return text;
      });
      this.texts.set(path2, p);
    }
    return p;
  }
  locate(path2, offset) {
    const index = this.lines.get(path2);
    if (!index) return { path: path2 };
    return { path: path2, ...index.position(offset) };
  }
  async load(path2) {
    const entry = this.tree.get(path2);
    if (!entry) return void 0;
    if (entry.kind !== "file") {
      if (entry.kind === "symlink") this.incomplete?.set(path2, { path: path2, reason: "unsupported-entry" });
      return void 0;
    }
    if (entry.size > this.maxBytes) {
      this.incomplete?.set(path2, { path: path2, reason: "too-large" });
      return void 0;
    }
    try {
      return await this.source.read(this.aliases.get(path2) ?? path2);
    } catch {
      this.incomplete?.set(path2, { path: path2, reason: "read-error" });
      return void 0;
    }
  }
};
function verdictOf(findings, incomplete) {
  if (findings.some((f) => f.severity === "block")) return "block";
  if (incomplete.length > 0) return "incomplete";
  if (findings.some((f) => f.severity === "review")) return "review";
  return "clean";
}
async function scan(options) {
  const rules2 = options.rules ?? ALL_RULES;
  const intel = options.intel ?? EMPTY_INTEL;
  const maxBytes = options.maxFileBytes ?? DEFAULT_MAX_FILE_BYTES;
  const incomplete = /* @__PURE__ */ new Map();
  const { entries, aliases } = await resolveLinks(options.source, await options.source.list());
  const tree = new Map(entries.map((e) => [e.path, e]));
  const changed = options.diff ? new Set(options.diff.changed) : void 0;
  const touched = (path2) => {
    if (changed.has(path2) || changed.has(aliases.get(path2) ?? "")) return true;
    for (let i = path2.indexOf("/"); i !== -1; i = path2.indexOf("/", i + 1)) if (changed.has(path2.slice(0, i))) return true;
    return false;
  };
  const targets = changed ? entries.filter((e) => touched(e.path)) : entries;
  const files2 = new FileCache(options.source, tree, maxBytes, incomplete, aliases);
  for (const e of entries) {
    if (e.kind === "symlink" && HIDES_AUTORUN.test(e.path)) incomplete.set(e.path, { path: e.path, reason: "unsupported-entry" });
  }
  let baseFiles;
  if (options.diff) {
    const base = await resolveLinks(options.diff.base, await options.diff.base.list());
    baseFiles = new FileCache(options.diff.base, new Map(base.entries.map((e) => [e.path, e])), maxBytes, void 0, base.aliases);
  }
  let config = options.config;
  let trusted = true;
  if (!config) {
    trusted = options.repoConfig === "trusted";
    const configText = await (baseFiles ?? files2).readText(CONFIG_PATH);
    config = EMPTY_CONFIG;
    if (configText !== void 0) {
      try {
        config = parseConfig(configText);
      } catch (error) {
        if (!(error instanceof ConfigError)) throw error;
        if (trusted) incomplete.set(CONFIG_PATH, { path: CONFIG_PATH, reason: "invalid-config" });
      }
    }
    if (!trusted) config = { fixtures: [], allow: [], severity: config.severity };
  }
  const raw = [];
  for (const rule of rules2) {
    let current;
    const ctx = {
      scope: options.diff ? "diff" : "full",
      targets,
      tree,
      intel,
      maxFileBytes: maxBytes,
      readText: (p) => {
        current = p;
        return files2.readText(p);
      },
      readBytes: (p) => {
        current = p;
        return files2.readBytes(p);
      },
      readBaseText: async (p) => baseFiles ? baseFiles.readText(p) : void 0,
      isChanged: (p) => !changed || changed.has(p),
      locate: (p, offset) => files2.locate(p, offset),
      report: (reasonKey, locations, severity) => {
        const reason = rule.meta.reasons[reasonKey];
        if (reason === void 0) throw new Error(`${rule.meta.id} reported unknown reason ${reasonKey}`);
        raw.push({
          ruleId: rule.meta.id,
          relatedRules: [],
          severity: severity ?? rule.meta.severity,
          reasonKey,
          reason,
          locations: Array.isArray(locations) ? locations : [locations]
        });
      },
      couldNotCheck: (path2, reason) => {
        if (!incomplete.has(path2)) incomplete.set(path2, { path: path2, reason });
      }
    };
    try {
      await rule.run(ctx);
    } catch (error) {
      const path2 = current ?? ".";
      const reason = error instanceof UncheckableInput ? "parse-error" : "rule-error";
      if (!incomplete.has(path2)) incomplete.set(path2, { path: path2, reason, ruleId: rule.meta.id });
    }
  }
  const findings = await grade({
    findings: raw,
    config,
    allowLowering: trusted,
    scope: options.diff ? "diff" : "full",
    hashOf: async (p) => {
      const bytes = await files2.readBytes(p);
      return bytes ? sha256Hex(bytes) : void 0;
    }
  });
  await options.source.close?.();
  await options.diff?.base.close?.();
  const incompleteList = [...incomplete.values()].sort((a, b) => a.path.localeCompare(b.path)).map((i) => ({ ...i, path: sanitizePath(i.path) }));
  for (const f of findings) f.locations = f.locations.map((l) => ({ ...l, path: sanitizePath(l.path) }));
  return {
    tool: { name: "dome", version: VERSION, rulesHash: rulesetHash(rules2, intel) },
    target: sanitizePath(options.source.label),
    scope: options.diff ? "diff" : "full",
    verdict: verdictOf(findings, incompleteList),
    findings,
    incomplete: incompleteList,
    stats: { filesInTree: entries.length, filesInScope: targets.length, rulesRun: rules2.length }
  };
}

// ../engine/src/source/git.ts
import { execFile, spawn } from "node:child_process";
import os from "node:os";
var SAFE_CONFIG = [
  "core.fsmonitor=false",
  "core.hooksPath=/dev/null",
  "core.untrackedCache=false",
  "diff.external=",
  "protocol.allow=never",
  "protocol.https.allow=always",
  "protocol.file.allow=never",
  "submodule.recurse=false",
  "credential.helper="
];
function gitArgs(args) {
  return [...SAFE_CONFIG.flatMap((c) => ["-c", c]), ...args];
}
function gitEnv() {
  return {
    PATH: process.env.PATH,
    HOME: os.tmpdir(),
    GIT_TERMINAL_PROMPT: "0",
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_CONFIG_GLOBAL: os.devNull,
    GIT_ASKPASS: "",
    GIT_PAGER: "cat",
    LC_ALL: "C"
  };
}
var GitError = class extends Error {
  constructor(message, stderr) {
    super(message);
    this.stderr = stderr;
    this.name = "GitError";
  }
};
function runGit(cwd, args, timeoutMs = 12e4) {
  return new Promise((resolve, reject) => {
    execFile(
      "git",
      gitArgs(args),
      { cwd, env: gitEnv(), encoding: "buffer", maxBuffer: 256 * 1024 * 1024, timeout: timeoutMs },
      (error, stdout, stderr) => {
        if (error) {
          reject(new GitError(`git ${args[0]} failed`, stderr.toString("utf8")));
        } else {
          resolve(stdout);
        }
      }
    );
  });
}
var CatFileBatch = class {
  proc;
  pending = [];
  buffer = Buffer.alloc(0);
  expected;
  failure;
  constructor(cwd) {
    this.proc = spawn("git", gitArgs(["cat-file", "--batch"]), { cwd, env: gitEnv() });
    this.proc.stdout.on("data", (chunk) => this.onData(chunk));
    this.proc.on("error", (error) => this.fail(error));
    this.proc.on("close", () => this.fail(new GitError("git cat-file exited", "")));
  }
  read(oid) {
    if (this.failure) return Promise.reject(this.failure);
    return new Promise((resolve, reject) => {
      this.pending.push({ resolve, reject });
      this.proc.stdin.write(`${oid}
`);
    });
  }
  close() {
    this.proc.stdin.end();
  }
  fail(error) {
    this.failure ??= error;
    for (const p of this.pending.splice(0)) p.reject(this.failure);
  }
  onData(chunk) {
    this.buffer = this.buffer.length ? Buffer.concat([this.buffer, chunk]) : chunk;
    for (; ; ) {
      if (this.expected === void 0) {
        const nl = this.buffer.indexOf(10);
        if (nl === -1) return;
        const header = this.buffer.subarray(0, nl).toString("utf8");
        this.buffer = this.buffer.subarray(nl + 1);
        if (header.endsWith(" missing")) {
          this.pending.shift()?.resolve(void 0);
          continue;
        }
        const size = Number(header.split(" ")[2]);
        if (!Number.isSafeInteger(size)) {
          this.fail(new GitError("unexpected cat-file header", header));
          return;
        }
        this.expected = size;
      }
      if (this.buffer.length < this.expected + 1) return;
      const data = new Uint8Array(this.buffer.subarray(0, this.expected));
      this.buffer = this.buffer.subarray(this.expected + 1);
      this.expected = void 0;
      this.pending.shift()?.resolve(data);
    }
  }
};
var MAX_LINK_BYTES = 4096;
var GitTreeSource = class {
  constructor(repoDir, rev, label) {
    this.repoDir = repoDir;
    this.rev = rev;
    this.label = label ?? `${repoDir}@${rev}`;
  }
  label;
  entries;
  batch;
  async list() {
    return [...(await this.index()).values()].map(({ path: p, kind, size }) => ({ path: p, kind, size }));
  }
  async read(relPath) {
    const entry = (await this.index()).get(relPath);
    if (entry?.kind !== "file") return void 0;
    this.batch ??= new CatFileBatch(this.repoDir);
    return this.batch.read(entry.oid);
  }
  async readLink(relPath) {
    const entry = (await this.index()).get(relPath);
    if (entry?.kind !== "symlink" || entry.size > MAX_LINK_BYTES) return void 0;
    this.batch ??= new CatFileBatch(this.repoDir);
    const data = await this.batch.read(entry.oid);
    return data && new TextDecoder().decode(data);
  }
  async close() {
    this.batch?.close();
    this.batch = void 0;
  }
  async index() {
    if (this.entries) return this.entries;
    const out = await runGit(this.repoDir, ["ls-tree", "-r", "-z", "--long", "--full-tree", this.rev, "--"]);
    const entries = /* @__PURE__ */ new Map();
    for (const record of out.toString("utf8").split("\0")) {
      if (!record) continue;
      const tab = record.indexOf("	");
      const [mode, , oid, size] = record.slice(0, tab).split(/ +/);
      const relPath = record.slice(tab + 1);
      if (!mode || !oid) continue;
      const kind = mode === "120000" ? "symlink" : mode === "160000" ? "submodule" : "file";
      entries.set(relPath, { path: relPath, kind, size: Number(size) || 0, oid });
    }
    this.entries = entries;
    return entries;
  }
};
async function gitChangedPaths(repoDir, base, head) {
  const out = await runGit(repoDir, [
    "diff",
    "--name-only",
    "-z",
    "--no-renames",
    "--no-ext-diff",
    "--no-textconv",
    `${base}...${head}`,
    "--"
  ]);
  return out.toString("utf8").split("\0").filter(Boolean);
}
async function gitMergeBase(repoDir, base, head) {
  return (await runGit(repoDir, ["merge-base", base, head])).toString("utf8").trim();
}
async function fetchCommit(repoDir, remoteRef, timeoutMs = 3e5) {
  await runGit(repoDir, ["fetch", "--quiet", "--no-tags", "--no-recurse-submodules", "origin", "--", remoteRef], timeoutMs);
}

// ../engine/src/report/json.ts
function formatJson(result) {
  return `${JSON.stringify({ ...result, notice: HONESTY_NOTICE }, null, 2)}
`;
}

// ../engine/src/report/markdown.ts
var ICON = { block: "\u{1F534}", review: "\u{1F7E0}", info: "\u26AA" };
var MAX_ROWS = 100;
function cell(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\|/g, "&#124;").replace(/\n/g, " ");
}
function files(f) {
  const unique = [...new Set(f.locations.map((l) => cleanPath(l.path)))];
  return unique.map((p) => `<code>${cell(p)}</code>`).join(", ");
}
function rules(f) {
  return [f.ruleId, ...f.relatedRules].map((id) => `[${id}](${ruleDocUrl(id)})`).join(" + ");
}
function table(findings) {
  const rows = ["| Level | Rule | File | Why |", "|---|---|---|---|"];
  for (const f of findings.slice(0, MAX_ROWS)) {
    const tag = f.fixture ? " (fixture)" : f.allowed ? " (allowed)" : "";
    rows.push(`| ${ICON[f.severity]} ${f.severity}${tag} | ${rules(f)} | ${files(f)} | ${cell(f.reason)} |`);
  }
  if (findings.length > MAX_ROWS) rows.push(`| | | | ${findings.length - MAX_ROWS} more findings not shown |`);
  return rows;
}
function headline(result) {
  const n = counts(result);
  switch (result.verdict) {
    case "block":
      return `### \u{1F534} Dome: merge blocked (${n.block} ${n.block === 1 ? "payload" : "payloads"})`;
    case "review":
      return `### \u{1F7E0} Dome: review required (${n.review} auto-run ${n.review === 1 ? "change" : "changes"})`;
    case "incomplete":
      return "### \u26AA Dome: could not check every file";
    default:
      return "### \u2705 Dome: no known pattern found";
  }
}
function formatMarkdown(result) {
  const lines2 = [headline(result), ""];
  const main = result.findings.filter((f) => f.severity !== "info");
  const info = result.findings.filter((f) => f.severity === "info");
  if (main.length > 0) lines2.push(...table(main), "");
  if (result.verdict === "block") {
    lines2.push("**Do not check out this branch in VS Code, Cursor, or with `npm install`.** Review the files on GitHub only.", "");
  } else if (result.verdict === "review") {
    lines2.push("A maintainer should read each file above before merging. Review on GitHub rather than checking the branch out.", "");
  }
  if (result.incomplete.length > 0) {
    lines2.push("**Could not check:**", "");
    for (const i of result.incomplete.slice(0, MAX_ROWS)) lines2.push(`- <code>${cell(cleanPath(i.path))}</code> (${i.reason})`);
    lines2.push("");
  }
  if (info.length > 0) {
    lines2.push("<details><summary>Context (" + info.length + ")</summary>", "", ...table(info), "", "</details>", "");
  }
  lines2.push(`<sub>Dome ${result.tool.version} \xB7 ${result.scope} scan \xB7 ${result.stats.filesInScope} files</sub>`, "");
  lines2.push(HONESTY_NOTICE);
  return `${lines2.join("\n")}
`;
}

// ../engine/src/report/sarif.ts
import { createHash as createHash3 } from "node:crypto";
var LEVEL = { block: "error", review: "warning", info: "note" };
function uri(path2) {
  return path2.split("/").map(encodeURIComponent).join("/");
}
function physical(path2, line, column) {
  return {
    physicalLocation: {
      artifactLocation: { uri: uri(path2), uriBaseId: "%SRCROOT%" },
      ...line ? { region: { startLine: line, ...column ? { startColumn: column } : {} } } : {}
    }
  };
}
function fingerprint(f) {
  const key = [f.ruleId, f.reasonKey, ...f.locations.map((l) => l.path)].join("\0");
  return createHash3("sha256").update(key).digest("hex").slice(0, 32);
}
function formatSarif(result) {
  const rules2 = ALL_RULES.map((r) => ({
    id: r.meta.id,
    name: r.meta.title.replace(/[^A-Za-z0-9]+/g, " ").trim().replace(/ (\w)/g, (_m, ch) => ch.toUpperCase()),
    shortDescription: { text: r.meta.title },
    fullDescription: { text: r.meta.summary.replace(/`/g, "") },
    helpUri: ruleDocUrl(r.meta.id),
    help: { text: r.meta.doc.why, markdown: `${r.meta.doc.why}

**False positives:** ${r.meta.doc.falsePositives}` },
    defaultConfiguration: { level: LEVEL[r.meta.severity] },
    properties: { tags: ["security", r.meta.category], "security-severity": r.meta.severity === "block" ? "9.0" : r.meta.severity === "review" ? "5.0" : "1.0" }
  }));
  const ruleIndex = new Map(rules2.map((r, i) => [r.id, i]));
  const results = result.findings.map((f) => {
    const [primary, ...related] = f.locations;
    return {
      ruleId: f.ruleId,
      ruleIndex: ruleIndex.get(f.ruleId),
      level: LEVEL[f.severity],
      message: { text: f.relatedRules.length ? `${f.reason} (combined with ${f.relatedRules.join(", ")})` : f.reason },
      locations: primary ? [physical(primary.path, primary.line, primary.column)] : [],
      ...related.length ? { relatedLocations: related.map((l, id) => ({ id, ...physical(l.path, l.line, l.column) })) } : {},
      partialFingerprints: { "domeFinding/v1": fingerprint(f) },
      ...f.allowed || f.fixture ? { suppressions: [{ kind: "external", justification: f.allowed ? "Hash-pinned allow entry in .dome.yml" : "Fixture path in .dome.yml" }] } : {},
      properties: { verdict: f.severity }
    };
  });
  const sarif = {
    $schema: "https://json.schemastore.org/sarif-2.1.0.json",
    version: "2.1.0",
    runs: [
      {
        tool: {
          driver: {
            name: "Dome",
            semanticVersion: result.tool.version,
            informationUri: "https://github.com/dome-security/dome-backend",
            rules: rules2
          }
        },
        invocations: [
          {
            executionSuccessful: result.verdict !== "incomplete",
            toolExecutionNotifications: result.incomplete.map((i) => ({
              level: "warning",
              message: { text: `Could not check this file (${i.reason}).` },
              locations: [physical(i.path)]
            }))
          }
        ],
        results,
        properties: { verdict: result.verdict, notice: HONESTY_NOTICE }
      }
    ]
  };
  return `${JSON.stringify(sarif, null, 2)}
`;
}

// ../intel/src/data/domains.json
var domains_default = {
  schemaVersion: 1,
  kind: "domain",
  entries: []
};

// ../intel/src/data/hashes.json
var hashes_default = {
  schemaVersion: 1,
  kind: "hash",
  entries: []
};

// ../intel/src/data/markers.json
var markers_default = {
  schemaVersion: 1,
  kind: "marker",
  entries: []
};

// ../intel/src/data/packages.json
var packages_default = {
  schemaVersion: 1,
  kind: "package",
  entries: [
    {
      value: "tailwindcss-style-animate",
      campaign: "PolinRider",
      added: "2026-10-27",
      evidence: ["https://github.com/OpenSourceMalware/PolinRider"]
    }
  ]
};

// ../intel/src/indicators.ts
var INDICATOR_KINDS = ["hash", "marker", "package", "domain"];
var IndicatorError = class extends Error {
  name = "IndicatorError";
};
var VALUE_RULES = {
  hash: /^[0-9a-f]{64}$/,
  // npm names: optional scope, lowercase, URL-safe characters.
  package: /^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/,
  domain: /^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/,
  // Markers must be long enough not to match ordinary code.
  marker: /^[\s\S]{12,512}$/
};
var EVIDENCE = /^(?:https:\/\/\S{4,2000}|sha256:[0-9a-f]{64}|stellar-tx:[0-9a-f]{64})$/;
function validateIndicator(raw, where = "indicator") {
  if (!raw || typeof raw !== "object") throw new IndicatorError(`${where} must be an object`);
  const { kind, value: value2, campaign, evidence, added } = raw;
  if (typeof kind !== "string" || !INDICATOR_KINDS.includes(kind)) throw new IndicatorError(`${where}.kind is invalid`);
  if (typeof value2 !== "string" || !VALUE_RULES[kind].test(value2)) {
    throw new IndicatorError(`${where}.value is not a valid ${kind}`);
  }
  if (typeof campaign !== "string" || !campaign.trim()) throw new IndicatorError(`${where}.campaign is required`);
  if (!Array.isArray(evidence) || evidence.length === 0 || !evidence.every((e) => typeof e === "string" && EVIDENCE.test(e))) {
    throw new IndicatorError(`${where}.evidence must list at least one https:// link, sha256: digest or stellar-tx: hash`);
  }
  if (added !== void 0 && (typeof added !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(added))) {
    throw new IndicatorError(`${where}.added must be an ISO date`);
  }
  return { kind, value: value2, campaign, evidence, ...added ? { added } : {} };
}
function validateIndicatorFile(raw, name) {
  if (!raw || typeof raw !== "object") throw new IndicatorError(`${name} must be an object`);
  const file = raw;
  if (file.schemaVersion !== 1) throw new IndicatorError(`${name}: unsupported schemaVersion`);
  if (!file.kind || !INDICATOR_KINDS.includes(file.kind)) throw new IndicatorError(`${name}: invalid kind`);
  if (!Array.isArray(file.entries)) throw new IndicatorError(`${name}: entries must be a list`);
  const seen = /* @__PURE__ */ new Set();
  return file.entries.map((entry, i) => {
    const indicator = validateIndicator({ ...entry, kind: file.kind }, `${name}.entries[${i}]`);
    if (seen.has(indicator.value)) throw new IndicatorError(`${name}: duplicate value at entries[${i}]`);
    seen.add(indicator.value);
    return indicator;
  });
}

// ../intel/src/index.ts
function bundledIndicators() {
  return [
    ...validateIndicatorFile(hashes_default, "hashes.json"),
    ...validateIndicatorFile(markers_default, "markers.json"),
    ...validateIndicatorFile(packages_default, "packages.json"),
    ...validateIndicatorFile(domains_default, "domains.json")
  ];
}
function toIntelSet(indicators) {
  const set = { hashes: /* @__PURE__ */ new Set(), markers: [], packages: /* @__PURE__ */ new Set(), domains: [] };
  for (const i of indicators) {
    if (i.kind === "hash") set.hashes.add(i.value);
    else if (i.kind === "marker" && !set.markers.includes(i.value)) set.markers.push(i.value);
    else if (i.kind === "package") set.packages.add(i.value);
    else if (i.kind === "domain" && !set.domains.includes(i.value)) set.domains.push(i.value);
  }
  return set;
}

// src/github.ts
import { gzipSync } from "node:zlib";
var GitHubError = class extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "GitHubError";
  }
};
function createClient(token, apiUrl = "https://api.github.com", fetchImpl = fetch) {
  return {
    async request(method, path2, body) {
      const res = await fetchImpl(`${apiUrl}${path2}`, {
        method,
        headers: {
          accept: "application/vnd.github+json",
          authorization: `Bearer ${token}`,
          "x-github-api-version": "2022-11-28",
          "user-agent": "dome-action",
          ...body === void 0 ? {} : { "content-type": "application/json" }
        },
        body: body === void 0 ? void 0 : JSON.stringify(body),
        signal: AbortSignal.timeout(3e4)
      });
      if (!res.ok) throw new GitHubError(res.status, `GitHub API ${method} ${path2.split("?")[0]} failed with HTTP ${res.status}`);
      return res.status === 204 ? void 0 : await res.json();
    }
  };
}
function getPullRequest(gh, repo, number) {
  return gh.request("GET", `/repos/${repo}/pulls/${number}`);
}
async function uploadSarif(gh, repo, sarif, commitSha, ref) {
  await gh.request("POST", `/repos/${repo}/code-scanning/sarifs`, {
    commit_sha: commitSha,
    ref,
    sarif: gzipSync(Buffer.from(sarif)).toString("base64"),
    tool_name: "Dome"
  });
}
var COMMENT_MARKER = "<!-- dome-security:report -->";
async function upsertComment(gh, repo, number, markdown) {
  const body = `${COMMENT_MARKER}
${markdown}`;
  for (let page = 1; page <= 10; page++) {
    const comments = await gh.request("GET", `/repos/${repo}/issues/${number}/comments?per_page=100&page=${page}`);
    const mine = comments.find((c) => c.user?.type === "Bot" && c.body?.startsWith(COMMENT_MARKER));
    if (mine) {
      await gh.request("PATCH", `/repos/${repo}/issues/comments/${mine.id}`, { body });
      return;
    }
    if (comments.length < 100) break;
  }
  await gh.request("POST", `/repos/${repo}/issues/${number}/comments`, { body });
}

// src/workflow.ts
import { appendFileSync } from "node:fs";
function input(env, name, fallback = "") {
  return (env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] ?? fallback).trim();
}
function booleanInput(env, name) {
  const value2 = input(env, name, "false").toLowerCase();
  if (value2 === "true") return true;
  if (value2 === "false" || value2 === "") return false;
  throw new Error(`input ${name} must be true or false`);
}
function escapeData(s) {
  return s.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
}
function escapeProperty(s) {
  return escapeData(s).replace(/:/g, "%3A").replace(/,/g, "%2C");
}
function command(name, properties2, message) {
  const props = Object.entries(properties2).filter(([, v]) => v !== void 0 && v !== "").map(([k, v]) => `${k}=${escapeProperty(String(v))}`).join(",");
  return `::${name}${props ? ` ${props}` : ""}::${escapeData(message)}
`;
}
function setOutput(env, name, value2) {
  const file = env.GITHUB_OUTPUT;
  if (!file) return;
  const delimiter = `dome_${Math.random().toString(36).slice(2)}`;
  appendFileSync(file, `${name}<<${delimiter}
${value2}
${delimiter}
`);
}
function appendSummary(env, markdown) {
  if (env.GITHUB_STEP_SUMMARY) appendFileSync(env.GITHUB_STEP_SUMMARY, markdown);
}

// src/main.ts
var ZERO_SHA = /^0+$/;
function readInputs(env) {
  const mode = input(env, "mode", "enforce");
  const failOn = input(env, "fail-on", "block");
  const scope = input(env, "scope", "diff");
  if (mode !== "enforce" && mode !== "report") throw new Error('input mode must be "enforce" or "report"');
  if (failOn !== "block" && failOn !== "review") throw new Error('input fail-on must be "block" or "review"');
  if (scope !== "diff" && scope !== "full") throw new Error('input scope must be "diff" or "full"');
  const pr = input(env, "pull-request");
  if (pr && !/^[1-9]\d*$/.test(pr)) throw new Error("input pull-request must be a pull request number");
  const expectedHeadSha = input(env, "expected-head-sha");
  if (expectedHeadSha && !/^[0-9a-f]{40}$/.test(expectedHeadSha)) throw new Error("input expected-head-sha must be a full commit SHA");
  return {
    mode,
    failOn,
    scope,
    sarif: booleanInput(env, "sarif"),
    comment: booleanInput(env, "comment"),
    pullRequest: pr ? Number(pr) : void 0,
    expectedHeadSha,
    token: input(env, "token")
  };
}
async function resolveTarget2(env, inputs, workspace, gh) {
  const repo = env.GITHUB_REPOSITORY ?? "";
  if (inputs.pullRequest !== void 0) {
    const pr = await getPullRequest(gh(), repo, inputs.pullRequest);
    if (inputs.expectedHeadSha && pr.head.sha !== inputs.expectedHeadSha) {
      throw new Error("the pull request head moved since the triggering run; not scanning a different commit");
    }
    await fetchCommit(workspace, `refs/pull/${pr.number}/head`);
    await fetchCommit(workspace, pr.base.sha);
    return { head: pr.head.sha, base: pr.base.sha, pullRequest: pr.number, ref: `refs/pull/${pr.number}/head` };
  }
  const event = env.GITHUB_EVENT_PATH ? JSON.parse(await readFile(env.GITHUB_EVENT_PATH, "utf8")) : {};
  if (env.GITHUB_EVENT_NAME === "pull_request" && event.pull_request) {
    return {
      head: event.pull_request.head.sha,
      base: event.pull_request.base.sha,
      pullRequest: event.pull_request.number,
      ref: env.GITHUB_REF
    };
  }
  if (env.GITHUB_EVENT_NAME === "push" && typeof event.after === "string") {
    const before = typeof event.before === "string" && !ZERO_SHA.test(event.before) ? event.before : void 0;
    return { head: event.after, base: before, pullRequest: void 0, ref: env.GITHUB_REF };
  }
  return { head: env.GITHUB_SHA || "HEAD", base: void 0, pullRequest: void 0, ref: env.GITHUB_REF };
}
function annotate(result, log) {
  for (const f of result.findings) {
    if (f.fixture || f.allowed || f.severity === "info") continue;
    const loc = f.locations[0];
    const title = ruleLabel(f);
    log(command(f.severity === "block" ? "error" : "warning", { file: loc?.path, line: loc?.line, col: loc?.column, title }, f.reason));
  }
  for (const i of result.incomplete) {
    log(command("warning", { file: i.path, title: "Dome could not check this file" }, `Not checked (${i.reason}).`));
  }
}
function shouldFail(inputs, verdict) {
  if (inputs.mode === "report") return false;
  if (verdict === "block" || verdict === "incomplete") return true;
  return inputs.failOn === "review" && verdict === "review";
}
async function run(env, deps) {
  const inputs = readInputs(env);
  const workspace = env.GITHUB_WORKSPACE ?? process.cwd();
  const repo = env.GITHUB_REPOSITORY ?? "";
  let client = deps.github;
  const gh = () => client ??= createClient(inputs.token, env.GITHUB_API_URL);
  const target = await resolveTarget2(env, inputs, workspace, gh);
  const source = new GitTreeSource(workspace, target.head, repo || workspace);
  let diff;
  if (inputs.scope === "diff" && target.base) {
    try {
      const mergeBase = await gitMergeBase(workspace, target.base, target.head);
      diff = { base: new GitTreeSource(workspace, mergeBase), changed: await gitChangedPaths(workspace, mergeBase, target.head) };
    } catch {
      throw new Error("could not find the base commit; check out with fetch-depth: 0");
    }
  }
  const result = await scan({ source, diff, intel: toIntelSet(bundledIndicators()), repoConfig: "trusted" });
  const markdown = formatMarkdown(result);
  const sarif = formatSarif(result);
  const outDir = path.join(env.RUNNER_TEMP ?? workspace, "dome");
  await mkdir(outDir, { recursive: true });
  const files2 = { json: path.join(outDir, "report.json"), markdown: path.join(outDir, "report.md"), sarif: path.join(outDir, "report.sarif") };
  await Promise.all([writeFile(files2.json, formatJson(result)), writeFile(files2.markdown, markdown), writeFile(files2.sarif, sarif)]);
  setOutput(env, "verdict", result.verdict);
  setOutput(env, "report-json", files2.json);
  setOutput(env, "report-markdown", files2.markdown);
  setOutput(env, "report-sarif", files2.sarif);
  annotate(result, deps.log);
  appendSummary(env, markdown);
  if (inputs.sarif) {
    try {
      await uploadSarif(gh(), repo, sarif, target.head, target.ref ?? "refs/heads/main");
    } catch (error) {
      const hint = error instanceof GitHubError && error.status === 403 ? " (the job needs security-events: write)" : "";
      deps.log(command("warning", {}, `SARIF upload failed${hint}.`));
    }
  }
  if (inputs.comment && target.pullRequest !== void 0) {
    try {
      await upsertComment(gh(), repo, target.pullRequest, markdown);
    } catch (error) {
      const hint = error instanceof GitHubError && error.status === 403 ? " (fork pull requests get a read-only token; use the workflow_run example)" : "";
      deps.log(command("warning", {}, `Could not comment on the pull request${hint}.`));
    }
  }
  deps.log(`Dome verdict: ${result.verdict} (${result.findings.length} findings, ${result.stats.filesInScope} files in scope)
`);
  if (shouldFail(inputs, result.verdict)) {
    deps.log(command("error", {}, `Dome: ${result.verdict === "incomplete" ? "could not check every file" : `verdict is ${result.verdict}`}.`));
    return 1;
  }
  return 0;
}
var isEntry = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (isEntry) {
  run(process.env, { log: (t) => process.stdout.write(t) }).then(
    (code) => {
      process.exitCode = code;
    },
    (error) => {
      process.stdout.write(command("error", {}, `Dome failed: ${error.message}`));
      process.exitCode = 1;
    }
  );
}
export {
  readInputs,
  run,
  shouldFail
};
