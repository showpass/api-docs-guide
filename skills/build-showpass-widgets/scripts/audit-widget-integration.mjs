#!/usr/bin/env node

import { readFile, readdir, stat } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const CANONICAL_SDK_URL = "https://www.showpass.com/static/dist/sdk.js";
const AUDITOR_PATH = resolve(fileURLToPath(import.meta.url));
const SUPPORTED_EXTENSIONS = new Set([
  ".astro",
  ".cjs",
  ".cts",
  ".htm",
  ".html",
  ".js",
  ".jsx",
  ".mjs",
  ".mts",
  ".svelte",
  ".ts",
  ".tsx",
  ".vue",
]);
const IGNORED_DIRECTORIES = new Set([
  ".astro",
  ".git",
  ".next",
  ".nuxt",
  ".svelte-kit",
  "build",
  "coverage",
  "dist",
  "node_modules",
]);

const args = process.argv.slice(2);
const jsonOutput = args.includes("--json");
const strict = args.includes("--strict");
const targets = args.filter((arg) => !arg.startsWith("--"));

if (targets.length === 0) {
  console.error(
    "Usage: audit-widget-integration.mjs [--json] [--strict] <path...>",
  );
  process.exit(2);
}

const rules = [
  {
    id: "obsolete-command-queue",
    severity: "warning",
    pattern: /\b__shwps\b/g,
    message:
      "The current SDK exposes window.showpass; replace the historical __shwps queue with load-event readiness.",
  },
  {
    id: "deprecated-mount-calendar",
    severity: "warning",
    pattern: /\.mountCalendarWidget\s*\(/g,
    message:
      "mountCalendarWidget is deprecated; call calendarWidget with a final containerId.",
  },
  {
    id: "deprecated-login-widget",
    severity: "warning",
    pattern: /\.loginWidget\s*\(/g,
    message:
      "loginWidget is unsupported in SDK v2; let purchase or checkout own authentication.",
  },
  {
    id: "deprecated-cart-widget",
    severity: "warning",
    pattern: /\.(?:basketWidget|shoppingCartWidget)\s*\(/g,
    message:
      "The basket/shopping-cart widget is deprecated; prefer checkoutWidget.",
  },
  {
    id: "falsy-widget-option",
    severity: "warning",
    source: "comments-masked",
    pattern:
      /["'](?:keep-shopping|show-description|theme-dark|prompt-for-quantity)["']\s*:\s*false/g,
    message:
      "The current query serializer omits false; verify this option instead of assuming false reaches the iframe.",
  },
  {
    id: "cart-listener-cleanup",
    severity: "info",
    pattern: /\.addCartCountListener\s*\(/g,
    message:
      "Capture the cleanup function returned by addCartCountListener and call it during teardown.",
  },
  {
    id: "hardcoded-widget-route",
    severity: "warning",
    source: "comments-masked",
    pattern: /https?:\/\/www\.showpass\.com\/widget\//g,
    message:
      "Do not hardcode iframe routes; use the public SDK method so navigation and payment redirects remain intact.",
  },
];

async function collectFiles(target) {
  const absolutePath = resolve(target);
  const targetStat = await stat(absolutePath);

  if (targetStat.isFile()) {
    return SUPPORTED_EXTENSIONS.has(extname(absolutePath))
      ? [absolutePath]
      : [];
  }

  if (!targetStat.isDirectory()) return [];

  const files = [];
  const entries = await readdir(absolutePath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) continue;
    const childPath = resolve(absolutePath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(childPath)));
    } else if (
      entry.isFile() &&
      SUPPORTED_EXTENSIONS.has(extname(entry.name))
    ) {
      files.push(childPath);
    }
  }
  return files;
}

function lineNumberAt(content, index) {
  return content.slice(0, index).split("\n").length;
}

function canStartRegexLiteral(content, slashIndex) {
  if (
    content[slashIndex - 1] === "<" &&
    /[a-z]/i.test(content[slashIndex + 1])
  ) {
    return false;
  }

  let cursor = slashIndex - 1;
  while (cursor >= 0 && /\s/.test(content[cursor])) cursor -= 1;
  if (cursor < 0) return true;

  if ("([{:;,=!?&|+-*%^~<>".includes(content[cursor])) return true;

  const prefix = content.slice(0, cursor + 1);
  const keyword = prefix.match(/([a-z_$][\w$]*)$/i)?.[1];
  return [
    "await",
    "case",
    "delete",
    "instanceof",
    "return",
    "throw",
    "typeof",
    "void",
    "yield",
  ].includes(keyword ?? "");
}

function maskNonExecutableText(content, { maskStrings }) {
  const masked = content.split("");
  let quote;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  let htmlComment = false;
  let regexLiteral = false;
  let regexCharacterClass = false;

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];
    const nextCharacter = content[index + 1];

    if (htmlComment) {
      if (character !== "\n") masked[index] = " ";
      if (content.startsWith("-->", index)) {
        masked[index + 1] = " ";
        masked[index + 2] = " ";
        htmlComment = false;
        index += 2;
      }
      continue;
    }

    if (lineComment) {
      if (character === "\n") {
        lineComment = false;
      } else {
        masked[index] = " ";
      }
      continue;
    }

    if (blockComment) {
      if (character !== "\n") masked[index] = " ";
      if (character === "*" && nextCharacter === "/") {
        masked[index + 1] = " ";
        blockComment = false;
        index += 1;
      }
      continue;
    }

    if (regexLiteral) {
      if (character !== "\n") masked[index] = " ";
      if (character === "\n") {
        regexLiteral = false;
        regexCharacterClass = false;
        escaped = false;
      } else if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === "[") {
        regexCharacterClass = true;
      } else if (character === "]") {
        regexCharacterClass = false;
      } else if (character === "/" && !regexCharacterClass) {
        regexLiteral = false;
      }
      continue;
    }

    if (quote) {
      if (maskStrings && character !== "\n") masked[index] = "_";
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === quote) {
        quote = undefined;
      }
      continue;
    }

    if (character === "/" && nextCharacter === "/") {
      masked[index] = " ";
      masked[index + 1] = " ";
      lineComment = true;
      index += 1;
      continue;
    }

    if (character === "/" && nextCharacter === "*") {
      masked[index] = " ";
      masked[index + 1] = " ";
      blockComment = true;
      index += 1;
      continue;
    }

    if (content.startsWith("<!--", index)) {
      masked[index] = " ";
      masked[index + 1] = " ";
      masked[index + 2] = " ";
      masked[index + 3] = " ";
      htmlComment = true;
      index += 3;
      continue;
    }

    if (character === "/" && canStartRegexLiteral(content, index)) {
      masked[index] = " ";
      regexLiteral = true;
      regexCharacterClass = false;
      escaped = false;
      continue;
    }

    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      if (maskStrings) masked[index] = "_";
    }
  }

  return masked.join("");
}

function findMatchingParenthesis(content, openIndex) {
  let depth = 0;
  let quote;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let index = openIndex; index < content.length; index += 1) {
    const character = content[index];
    const nextCharacter = content[index + 1];

    if (lineComment) {
      if (character === "\n") lineComment = false;
      continue;
    }

    if (blockComment) {
      if (character === "*" && nextCharacter === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === quote) {
        quote = undefined;
      }
      continue;
    }

    if (character === "/" && nextCharacter === "/") {
      lineComment = true;
      index += 1;
      continue;
    }

    if (character === "/" && nextCharacter === "*") {
      blockComment = true;
      index += 1;
      continue;
    }

    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      continue;
    }

    if (character === "(") {
      depth += 1;
    } else if (character === ")") {
      depth -= 1;
      if (depth === 0) return index;
    }
  }

  return -1;
}

function findPollingReadinessChecks(file, content) {
  const findings = [];
  const intervalPattern = /setInterval\s*\(/g;

  for (const match of content.matchAll(intervalPattern)) {
    const openIndex = content.indexOf("(", match.index);
    const closeIndex = findMatchingParenthesis(content, openIndex);
    if (closeIndex === -1) continue;

    const intervalCall = content.slice(openIndex, closeIndex + 1);
    const checksSdkReadiness =
      /\bcheckSdkLoaded\b/.test(intervalCall) ||
      /\b(?:if|while)\s*\([^)]{0,240}\b(?:showpass|__shwps)\b/i.test(
        intervalCall,
      );

    if (!checksSdkReadiness) continue;

    findings.push({
      rule: "polling-sdk-readiness",
      severity: "warning",
      file,
      line: lineNumberAt(content, match.index ?? 0),
      message:
        "Avoid polling SDK readiness; resolve a shared promise from the script load event.",
    });
  }

  return findings;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findTicketsAliases(content) {
  const aliases = new Set();
  const assignmentPatterns = [
    /\b(?:const|let|var)\s+([a-z_$][\w$]*)\s*=\s*await\s+loadShowpassSdk\s*\(/gi,
    /\b(?:const|let|var)\s+([a-z_$][\w$]*)\s*=\s*(?:window\s*(?:\?\.|\.)\s*)?showpass\s*(?:\?\.|\.)\s*tickets\b/gi,
    /loadShowpassSdk\s*\(\s*\)\s*\.then\s*\(\s*(?:async\s*)?\(?\s*([a-z_$][\w$]*)/gi,
  ];

  for (const pattern of assignmentPatterns) {
    for (const match of content.matchAll(pattern)) aliases.add(match[1]);
  }

  return aliases;
}

function findMissingParams(file, content) {
  const aliases = findTicketsAliases(content);
  const receivers = [
    "(?:window\\s*(?:\\?\\.|\\.)\\s*)?showpass\\s*(?:\\?\\.|\\.)\\s*tickets",
    ...[...aliases].map(
      (alias) => `(?<![.\\w$])${escapeRegex(alias)}(?![\\w$])`,
    ),
  ];
  const receiver = `(?:${receivers.join("|")})`;
  const checks = [
    {
      rule: "missing-widget-params",
      pattern: new RegExp(
        `${receiver}\\s*(?:\\?\\.|\\.)\\s*(?:productPurchaseWidget|membershipPurchaseWidget|calendarWidget)\\s*\\(\\s*[^,()\\n]+\\s*\\)`,
        "g",
      ),
      message:
        "Pass a params object (use {}) because this current SDK method requires it.",
    },
    {
      rule: "missing-checkout-params",
      pattern: new RegExp(
        `${receiver}\\s*(?:\\?\\.|\\.)\\s*checkoutWidget\\s*\\(\\s*\\)`,
        "g",
      ),
      message:
        "Pass a params object to checkoutWidget (use {} when no options are needed).",
    },
  ];
  const findings = [];

  for (const check of checks) {
    for (const match of content.matchAll(check.pattern)) {
      findings.push({
        rule: check.rule,
        severity: "error",
        file,
        line: lineNumberAt(content, match.index ?? 0),
        message: check.message,
      });
    }
  }

  return findings;
}

function scanFile(file, content) {
  const codeOnlyContent = maskNonExecutableText(content, {
    maskStrings: true,
  });
  const commentsMaskedContent = maskNonExecutableText(content, {
    maskStrings: false,
  });
  const findings = [
    ...findPollingReadinessChecks(file, codeOnlyContent),
    ...findMissingParams(file, codeOnlyContent),
  ];

  for (const rule of rules) {
    const scanContent =
      rule.source === "comments-masked"
        ? commentsMaskedContent
        : codeOnlyContent;
    const pattern = new RegExp(rule.pattern.source, rule.pattern.flags);
    for (const match of scanContent.matchAll(pattern)) {
      findings.push({
        rule: rule.id,
        severity: rule.severity,
        file,
        line: lineNumberAt(content, match.index ?? 0),
        message: rule.message,
      });
    }
  }

  const sdkUrlPattern =
    /https?:\/\/(?:[a-z0-9-]+\.)*showpass\.com\/[^\s"'`]*sdk\.js/g;
  for (const match of commentsMaskedContent.matchAll(sdkUrlPattern)) {
    if (match[0] === CANONICAL_SDK_URL) continue;
    findings.push({
      rule: "noncanonical-sdk-url",
      severity: "warning",
      file,
      line: lineNumberAt(content, match.index ?? 0),
      message: `Prefer the stable SDK URL ${CANONICAL_SDK_URL} instead of ${match[0]}.`,
    });
  }

  return findings;
}

let files;
try {
  const groups = await Promise.all(targets.map(collectFiles));
  files = [...new Set(groups.flat())]
    .filter((file) => resolve(file) !== AUDITOR_PATH)
    .sort();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(2);
}

if (files.length === 0) {
  console.error(
    "No supported browser source files found. Expected HTML, JavaScript, TypeScript, Vue, Svelte, or Astro files.",
  );
  process.exit(2);
}

const findings = [];
for (const file of files) {
  const content = await readFile(file, "utf8");
  findings.push(...scanFile(file, content));
}

const counts = findings.reduce(
  (result, finding) => {
    result[finding.severity] += 1;
    return result;
  },
  { error: 0, warning: 0, info: 0 },
);

if (jsonOutput) {
  console.log(
    JSON.stringify({ filesScanned: files.length, counts, findings }, null, 2),
  );
} else {
  for (const finding of findings) {
    console.log(
      `${finding.severity.toUpperCase()} ${finding.rule} ${finding.file}:${finding.line} - ${finding.message}`,
    );
  }
  console.log(
    `Scanned ${files.length} file(s): ${counts.error} error(s), ${counts.warning} warning(s), ${counts.info} info.`,
  );
}

if (counts.error > 0 || (strict && counts.warning > 0)) {
  process.exitCode = 1;
}
