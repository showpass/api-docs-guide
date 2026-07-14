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
    id: "falsy-widget-option",
    severity: "warning",
    source: "comments-masked",
    pattern:
      /["'](?:keep-shopping|show-description|theme-dark|prompt-for-quantity)["']\s*:\s*false/g,
    message:
      "The current query serializer omits false; verify this option instead of assuming false reaches the iframe.",
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
      /\b(?:if|while)\s*\([^)]{0,240}\bshowpass\b/i.test(intervalCall);

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

function findEnclosingBlocks(content, index) {
  const blockStack = [];

  for (let cursor = 0; cursor < index; cursor += 1) {
    if (content[cursor] === "{") blockStack.push(cursor);
    if (content[cursor] === "}") blockStack.pop();
  }

  return blockStack;
}

function findEnclosingBlock(content, index) {
  return findEnclosingBlocks(content, index).at(-1) ?? -1;
}

function findMatchingBrace(content, openIndex) {
  if (openIndex === -1) return content.length;

  let depth = 0;
  for (let cursor = openIndex; cursor < content.length; cursor += 1) {
    if (content[cursor] === "{") depth += 1;
    if (content[cursor] === "}") {
      depth -= 1;
      if (depth === 0) return cursor;
    }
  }

  return content.length;
}

function findEnclosingClassBlock(content, index) {
  const enclosingBlocks = findEnclosingBlocks(content, index);

  for (let cursor = enclosingBlocks.length - 1; cursor >= 0; cursor -= 1) {
    const blockStart = enclosingBlocks[cursor];
    if (/\bclass\s+[a-z_$][\w$]*/i.test(findBlockOwnerPrefix(content, blockStart))) {
      return blockStart;
    }
  }

  return -1;
}

function findVisibleDeclaration(content, identifier, position) {
  const declarationPattern = new RegExp(
    `\\b(?:const|let|var)\\s+${escapeRegex(identifier)}\\b`,
    "g",
  );
  let visibleDeclaration;

  for (const match of content.matchAll(declarationPattern)) {
    const declarationIndex = match.index ?? 0;
    if (declarationIndex > position) break;

    const scopeStart = findEnclosingBlock(content, declarationIndex);
    const scopeEnd = findMatchingBrace(content, scopeStart);
    if (position <= scopeEnd) {
      visibleDeclaration = {
        kind: "declaration",
        index: declarationIndex,
        scopeStart,
        scopeEnd,
      };
    }
  }

  return visibleDeclaration;
}

function findBlockOwnerPrefix(content, blockStart) {
  const ownerStart = Math.max(
    content.lastIndexOf(";", blockStart - 1),
    content.lastIndexOf("{", blockStart - 1),
    content.lastIndexOf("}", blockStart - 1),
  );
  return content.slice(ownerStart + 1, blockStart).trim();
}

function getFunctionParameters(ownerPrefix) {
  const owner = ownerPrefix.trim();
  const isArrow = owner.endsWith("=>");
  const isFunction = /\bfunction\b/.test(owner);
  const isCatch = /\bcatch\s*\(/.test(owner);
  let parameterSource = isArrow ? owner.slice(0, -2).trim() : owner;

  if (isArrow && /[a-z_$][\w$]*$/i.test(parameterSource)) {
    return parameterSource.match(/([a-z_$][\w$]*)$/i)?.[1];
  }

  if (!parameterSource.endsWith(")")) return undefined;

  let depth = 0;
  let openIndex = -1;
  for (let cursor = parameterSource.length - 1; cursor >= 0; cursor -= 1) {
    if (parameterSource[cursor] === ")") depth += 1;
    if (parameterSource[cursor] === "(") {
      depth -= 1;
      if (depth === 0) {
        openIndex = cursor;
        break;
      }
    }
  }

  if (openIndex === -1) return undefined;

  const beforeParameters = parameterSource.slice(0, openIndex).trim();
  const methodOwner = beforeParameters.match(
    /^(?:(?:public|private|protected|static|async|get|set)\s+)*([a-z_$][\w$]*)$/i,
  );
  const isMethod =
    methodOwner &&
    !["if", "for", "while", "switch", "with"].includes(methodOwner[1]);

  if (!isArrow && !isFunction && !isCatch && !isMethod) return undefined;
  return parameterSource.slice(openIndex + 1, -1);
}

function findVisibleParameter(content, identifier, position) {
  const identifierPattern = new RegExp(`\\b${escapeRegex(identifier)}\\b`);
  const enclosingBlocks = findEnclosingBlocks(content, position);

  for (let cursor = enclosingBlocks.length - 1; cursor >= 0; cursor -= 1) {
    const scopeStart = enclosingBlocks[cursor];
    const parameters = getFunctionParameters(
      findBlockOwnerPrefix(content, scopeStart),
    );
    if (!parameters || !identifierPattern.test(parameters)) continue;

    return {
      kind: "parameter",
      index: scopeStart,
      scopeStart,
      scopeEnd: findMatchingBrace(content, scopeStart),
    };
  }

  return undefined;
}

function findVisibleBinding(content, identifier, position) {
  const candidates = [
    findVisibleDeclaration(content, identifier, position),
    findVisibleParameter(content, identifier, position),
  ].filter(Boolean);

  return candidates.sort(
    (left, right) =>
      right.scopeStart - left.scopeStart || right.index - left.index,
  )[0];
}

function isSameBindingUse(content, identifier, originalBinding, position) {
  const candidateBinding = findVisibleBinding(content, identifier, position);

  if (originalBinding) {
    return (
      candidateBinding?.kind === originalBinding.kind &&
      candidateBinding.index === originalBinding.index
    );
  }

  return candidateBinding === undefined;
}

function isLifecycleCallback(ownerPrefix) {
  const lifecycleName =
    "(?:(?:React\\s*\\.\\s*)?(?:useEffect|useLayoutEffect|useInsertionEffect)|onMount)";
  const lifecyclePattern = new RegExp(
    `\\b${lifecycleName}\\s*\\((?:[\\s\\S]*=>\\s*|\\s*function(?:\\s+[a-z_$][\\w$]*)?\\s*\\([^)]*\\)\\s*)$`,
    "i",
  );
  const isAsyncCallback =
    new RegExp(`\\b${lifecycleName}\\s*\\(\\s*async\\b`, "i").test(
      ownerPrefix,
    );
  return lifecyclePattern.test(ownerPrefix) && !isAsyncCallback;
}

function isNamedCleanupProducer(ownerPrefix) {
  const namedFunction = /^(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s+[a-z_$][\w$]*\s*\(/i.test(
    ownerPrefix,
  );
  const assignedFunction =
    /^(?:export\s+)?(?:const|let|var)\s+[a-z_$][\w$]*\s*=\s*(?:async\s+)?function\b/i.test(
      ownerPrefix,
    );
  const assignedArrow =
    /^(?:export\s+)?(?:const|let|var)\s+[a-z_$][\w$]*\s*=\s*(?:async\s+)?(?:\([^)]*\)|[a-z_$][\w$]*)\s*=>\s*$/i.test(
      ownerPrefix,
    );

  return namedFunction || assignedFunction || assignedArrow;
}

function isCleanupProducer(ownerPrefix) {
  return (
    isLifecycleCallback(ownerPrefix) || isNamedCleanupProducer(ownerPrefix)
  );
}

function isLifecycleTeardownMethod(ownerPrefix) {
  return /^(?:(?:public|private|protected|static|async)\s+)*(?:beforeUnmount|componentWillUnmount|destroy|disconnect|disconnectedCallback|dispose|ngOnDestroy|unmount)\s*\(/i.test(
    ownerPrefix,
  );
}

function findStatementPrefix(content, index) {
  const statementStart = Math.max(
    content.lastIndexOf(";", index),
    content.lastIndexOf("{", index),
    content.lastIndexOf("}", index),
  );
  return content.slice(statementStart + 1, index).trim();
}

function returnsCleanupToOwner(content, matchIndex, statementPrefix) {
  if (/=>\s*$/.test(statementPrefix)) {
    return isCleanupProducer(statementPrefix);
  }

  if (!/\breturn\s*$/.test(statementPrefix)) return false;

  const blockStart = findEnclosingBlock(content, matchIndex);
  const ownerPrefix = findBlockOwnerPrefix(content, blockStart);
  return isCleanupProducer(ownerPrefix);
}

function cleanupUseHasValidOwner(
  content,
  candidateIndex,
  candidateKind,
  bindingScopeStart,
  cleanupTarget,
) {
  const blockStart = findEnclosingBlock(content, candidateIndex);
  const ownerPrefix = findBlockOwnerPrefix(content, blockStart);
  const enclosingBlocks = findEnclosingBlocks(content, candidateIndex);

  if (candidateKind === "return") {
    return isCleanupProducer(ownerPrefix);
  }

  const statementPrefix = findStatementPrefix(content, candidateIndex);
  if (/\breturn[\s\S]*=>\s*$/.test(statementPrefix)) {
    return isCleanupProducer(ownerPrefix);
  }

  if (/(?:^|\n)\s*return\b[\s\S]*(?:=>|\bfunction\b)/.test(ownerPrefix)) {
    const parentBlock = findEnclosingBlock(content, blockStart);
    return isCleanupProducer(findBlockOwnerPrefix(content, parentBlock));
  }

  for (let cursor = enclosingBlocks.length - 1; cursor >= 0; cursor -= 1) {
    const enclosingBlock = enclosingBlocks[cursor];
    const enclosingOwner = findBlockOwnerPrefix(content, enclosingBlock);

    if (
      cleanupTarget.startsWith("this.") &&
      isLifecycleTeardownMethod(enclosingOwner)
    ) {
      return true;
    }

    if (
      /(?:^|\n)\s*return\b[\s\S]*(?:=>|\bfunction\b)/.test(
        enclosingOwner,
      )
    ) {
      const parentBlock = findEnclosingBlock(content, enclosingBlock);
      if (isCleanupProducer(findBlockOwnerPrefix(content, parentBlock))) {
        return true;
      }
    }

    if (enclosingBlock === bindingScopeStart) break;
  }

  return (
    blockStart === bindingScopeStart &&
    isNamedCleanupProducer(ownerPrefix)
  );
}

function isAsyncListenerInstall(content, matchIndex, statementPrefix, scopeStart) {
  if (/\.(?:then|catch|finally)\s*\([\s\S]*=>\s*$/.test(statementPrefix)) {
    return true;
  }

  return findEnclosingBlocks(content, matchIndex).some((blockStart) => {
    if (blockStart < scopeStart) return false;
    const ownerPrefix = findBlockOwnerPrefix(content, blockStart);
    return (
      /\basync\b/.test(ownerPrefix) ||
      /\.(?:then|catch|finally)\s*\(/.test(ownerPrefix) ||
      /\b(?:setTimeout|queueMicrotask|requestAnimationFrame)\s*\(/.test(
        ownerPrefix,
      )
    );
  });
}

function findAsyncGuardFloor(content, matchIndex, statementPrefix, scopeStart) {
  if (/\.(?:then|catch|finally)\s*\([\s\S]*=>\s*$/.test(statementPrefix)) {
    return matchIndex;
  }

  let floor = Math.max(0, scopeStart);
  for (const blockStart of findEnclosingBlocks(content, matchIndex)) {
    if (blockStart < floor) continue;
    const ownerPrefix = findBlockOwnerPrefix(content, blockStart);
    if (
      /\basync\b/.test(ownerPrefix) ||
      /\.(?:then|catch|finally)\s*\(/.test(ownerPrefix) ||
      /\b(?:setTimeout|queueMicrotask|requestAnimationFrame)\s*\(/.test(
        ownerPrefix,
      )
    ) {
      floor = blockStart;
    }
  }

  const suspensionStart = floor;
  const suspensionSource = content.slice(suspensionStart, matchIndex);
  for (const suspension of suspensionSource.matchAll(/\bawait\b/g)) {
    floor = Math.max(
      floor,
      suspensionStart + (suspension.index ?? 0) + suspension[0].length,
    );
  }

  return floor;
}

function hasAsyncInstallGuard(
  content,
  matchIndex,
  scopeStart,
  guardFloor,
  scopeEnd,
) {
  const beforeInstall = content.slice(guardFloor, matchIndex);
  const declarationSource = content.slice(Math.max(0, scopeStart), matchIndex);
  const afterInstall = content.slice(matchIndex, scopeEnd);
  const guardPattern =
    /\bif\s*\(\s*(!?)\s*([a-z_$][\w$]*)\s*\)\s*(?:return\b|\{\s*return\b)/gi;

  for (const guard of beforeInstall.matchAll(guardPattern)) {
    const isActiveGuard = guard[1] === "!";
    const flag = guard[2];
    const initialValue = isActiveGuard ? "true" : "false";
    const teardownValue = isActiveGuard ? "false" : "true";
    const declarationPattern = new RegExp(
      `\\b(?:let|var)\\s+${escapeRegex(flag)}(?:\\s*:[^=;]+)?\\s*=\\s*${initialValue}\\b`,
    );
    const teardownPattern = new RegExp(
      `\\b${escapeRegex(flag)}\\s*=\\s*${teardownValue}\\b`,
      "g",
    );
    const flagBinding = findVisibleBinding(
      content,
      flag,
      guardFloor + (guard.index ?? 0),
    );
    const teardownAssignments = [...afterInstall.matchAll(teardownPattern)];
    const hasOwnedTeardownAssignment = teardownAssignments.some(
      (assignment) => {
        const assignmentIndex = matchIndex + (assignment.index ?? 0);
        return (
          isSameBindingUse(content, flag, flagBinding, assignmentIndex) &&
          cleanupUseHasValidOwner(
            content,
            assignmentIndex,
            "call",
            flagBinding?.scopeStart ?? scopeStart,
            flag,
          )
        );
      },
    );

    if (
      declarationPattern.test(declarationSource) &&
      hasOwnedTeardownAssignment
    ) {
      return true;
    }
  }

  return false;
}

function isBindingReassigned(
  content,
  target,
  rootIdentifier,
  originalBinding,
  start,
  end,
) {
  const targetPattern = escapeRegex(target);
  const assignmentPattern = new RegExp(
    `\\b${targetPattern}\\s*(?:\\?\\?=|&&=|\\|\\|=|[+*/%&|^-]=|=(?!=|>))`,
    "g",
  );
  const segment = content.slice(start, end);

  return [...segment.matchAll(assignmentPattern)].some((match) =>
    isSameBindingUse(
      content,
      rootIdentifier,
      originalBinding,
      start + (match.index ?? 0),
    ),
  );
}

function asyncHelperReturnsCapturedCleanup(
  content,
  candidateIndex,
  candidateKind,
  scopeStart,
) {
  const scopeOwner = findBlockOwnerPrefix(content, scopeStart);
  if (!/\basync\b/.test(scopeOwner) || !isNamedCleanupProducer(scopeOwner)) {
    return false;
  }

  const enclosingBlocks = findEnclosingBlocks(content, candidateIndex);

  if (candidateKind === "return") {
    return !enclosingBlocks.some((blockStart) => {
      if (blockStart <= scopeStart) return false;
      return getFunctionParameters(findBlockOwnerPrefix(content, blockStart)) !== undefined;
    });
  }

  const statementPrefix = findStatementPrefix(content, candidateIndex);
  if (
    findEnclosingBlock(content, candidateIndex) === scopeStart &&
    /\breturn[\s\S]*=>\s*$/.test(statementPrefix)
  ) {
    return true;
  }

  return enclosingBlocks.some((blockStart) => {
    const ownerPrefix = findBlockOwnerPrefix(content, blockStart);
    if (!/(?:^|\n)\s*return\b[\s\S]*(?:=>|\bfunction\b)/.test(ownerPrefix)) {
      return false;
    }
    return findEnclosingBlock(content, blockStart) === scopeStart;
  });
}

function findCartListenerCleanup(file, content) {
  const findings = [];
  const listenerPattern =
    /(?:\([^;{}\n]*\)|\b(?!(?:await|delete|new|return|throw|typeof|void|yield)\b)[a-z_$][\w$]*(?:\s*(?:\?\.|\.)\s*[a-z_$][\w$]*)*(?:\s*\([^;{}\n]*\))?)\s*(?:\?\.|\.)\s*addCartCountListener\s*\(/gi;

  for (const match of content.matchAll(listenerPattern)) {
    const matchIndex = match.index ?? 0;
    const openIndex = content.indexOf("(", matchIndex);
    const closeIndex = findMatchingParenthesis(content, openIndex);
    if (closeIndex === -1) continue;

    const prefix = findStatementPrefix(content, matchIndex);

    if (returnsCleanupToOwner(content, matchIndex, prefix)) continue;

    const typedDeclaration = prefix.match(
      /\b(?:const|let|var)\s+([a-z_$][\w$]*)\s*:[^;\n]+=\s*$/i,
    );
    const assignment = prefix.match(
      /([a-z_$][\w$]*(?:\s*\.\s*[a-z_$][\w$]*)*)\s*=\s*$/i,
    );
    const cleanupTarget = (typedDeclaration?.[1] ?? assignment?.[1])?.replace(
      /\s+/g,
      "",
    );

    if (cleanupTarget) {
      const rootIdentifier = cleanupTarget.split(".")[0];
      const originalBinding = findVisibleBinding(
        content,
        rootIdentifier,
        matchIndex,
      );
      const classScopeStart = cleanupTarget.startsWith("this.")
        ? findEnclosingClassBlock(content, matchIndex)
        : -1;
      const scopeStart =
        originalBinding?.scopeStart ??
        (classScopeStart !== -1
          ? classScopeStart
          : findEnclosingBlock(content, matchIndex));
      const scopeEnd = findMatchingBrace(content, scopeStart);
      const remainingContent = content.slice(closeIndex + 1, scopeEnd);
      const escapedTarget = escapeRegex(cleanupTarget);
      const cleanupCallPattern = new RegExp(
        `\\b${escapedTarget}\\s*(?:\\?\\.)?\\s*\\(`,
        "g",
      );
      const cleanupReturnPattern = new RegExp(
        `\\breturn\\s+${escapedTarget}\\b`,
        "g",
      );
      const candidates = [
        ...[...remainingContent.matchAll(cleanupCallPattern)].map((match) => ({
          kind: "call",
          match,
        })),
        ...[...remainingContent.matchAll(cleanupReturnPattern)].map((match) => ({
          kind: "return",
          match,
        })),
      ].sort(
        (left, right) =>
          (left.match.index ?? 0) - (right.match.index ?? 0),
      );

      const capturedCleanupUse = candidates.find((candidate) => {
        const candidateIndex =
          closeIndex + 1 + (candidate.match.index ?? 0);
        if (
          !isSameBindingUse(
            content,
            rootIdentifier,
            originalBinding,
            candidateIndex,
          )
        ) {
          return false;
        }

        if (
          !cleanupUseHasValidOwner(
            content,
            candidateIndex,
            candidate.kind,
            scopeStart,
            cleanupTarget,
          )
        ) {
          return false;
        }

        return !isBindingReassigned(
          content,
          cleanupTarget,
          rootIdentifier,
          originalBinding,
          closeIndex + 1,
          candidateIndex,
        );
      });
      const usesCapturedCleanup = capturedCleanupUse !== undefined;
      const capturedCleanupReturnedByAsyncHelper =
        capturedCleanupUse !== undefined &&
        asyncHelperReturnsCapturedCleanup(
          content,
          closeIndex + 1 + (capturedCleanupUse.match.index ?? 0),
          capturedCleanupUse.kind,
          scopeStart,
        );

      const unsafeAsyncInstall =
        usesCapturedCleanup &&
        !capturedCleanupReturnedByAsyncHelper &&
        isAsyncListenerInstall(content, matchIndex, prefix, scopeStart) &&
        !hasAsyncInstallGuard(
          content,
          matchIndex,
          scopeStart,
          findAsyncGuardFloor(content, matchIndex, prefix, scopeStart),
          scopeEnd,
        );

      if (usesCapturedCleanup && !unsafeAsyncInstall) continue;

      if (unsafeAsyncInstall) {
        findings.push({
          rule: "cart-listener-cleanup",
          severity: "warning",
          file,
          line: lineNumberAt(content, matchIndex),
          message:
            "Async cart-listener setup needs a teardown flag checked before subscribing, plus cleanup during teardown.",
        });
        continue;
      }
    }

    findings.push({
      rule: "cart-listener-cleanup",
      severity: "warning",
      file,
      line: lineNumberAt(content, matchIndex),
      message:
        "Return or store the cleanup from addCartCountListener, then invoke it during teardown.",
    });
  }

  return findings;
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
    ...findCartListenerCleanup(file, codeOnlyContent),
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
