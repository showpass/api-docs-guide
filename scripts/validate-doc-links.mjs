import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

const docsRoot = path.resolve("src/docs-app/data");
const publicRoot = path.resolve("public");

const extraInternalRoutes = new Set(["/", "/widget-playground"]);

const isExternalHref = (href) =>
  /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//");

const generateHeadingId = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeRoutePath = (routePath) => {
  const normalizedSegments = [];

  routePath.split("/").forEach((segment) => {
    if (!segment || segment === ".") return;
    if (segment === "..") {
      normalizedSegments.pop();
      return;
    }
    normalizedSegments.push(segment);
  });

  return `/${normalizedSegments.join("/")}`.replace(/\.md$/, "");
};

const walkMarkdownFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  entries.forEach((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(entryPath);
    }
  });

  return files.sort();
};

const routeForFile = (filePath) =>
  `/${path.relative(docsRoot, filePath).replace(/\\/g, "/").replace(/\.md$/, "")}`;

const findApproximateLine = (content, href) => {
  const lines = content.split(/\r?\n/);
  const markdownLinkNeedle = `](${href}`;

  const index = lines.findIndex(
    (line) => line.includes(markdownLinkNeedle) || line.includes(href)
  );

  return index >= 0 ? index + 1 : 1;
};

const collectMarkdownLinks = (value, links = []) => {
  if (Array.isArray(value)) {
    value.forEach((item) => collectMarkdownLinks(item, links));
    return links;
  }

  if (!value || typeof value !== "object") {
    return links;
  }

  if (
    (value.type === "link" || value.type === "image") &&
    typeof value.href === "string"
  ) {
    links.push({
      href: value.href,
      isImage: value.type === "image",
    });
  }

  Object.entries(value).forEach(([key, child]) => {
    if (["href", "raw", "text", "title"].includes(key)) return;
    collectMarkdownLinks(child, links);
  });

  return links;
};

const extractAnchors = (content) => {
  const anchors = new Set();
  const lines = content.split(/\r?\n/);
  let inFence = false;
  let fenceMarker = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const fenceMatch = line.match(/^(```|~~~)/);

    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!inFence) {
        inFence = true;
        fenceMarker = marker;
      } else if (fenceMarker === marker) {
        inFence = false;
        fenceMarker = null;
      }
      continue;
    }

    if (inFence || /^>\s*/.test(line)) {
      continue;
    }

    const headingMatch = line.match(/^(#{1,4})\s+(.+?)\s*$/);
    if (headingMatch) {
      const id = generateHeadingId(headingMatch[2]);
      if (id) anchors.add(id);
    }
  }

  for (const htmlIdMatch of content.matchAll(/\bid=["']([^"']+)["']/g)) {
    anchors.add(htmlIdMatch[1]);
  }

  return anchors;
};

const parseHref = (href, sourceRoute) => {
  if (!href || isExternalHref(href)) {
    return null;
  }

  const hashIndex = href.indexOf("#");
  const beforeHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const rawHash = hashIndex >= 0 ? href.slice(hashIndex + 1) : "";
  const queryIndex = beforeHash.indexOf("?");
  const rawPath = queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash;

  const routePath = rawPath
    ? rawPath.startsWith("/")
      ? normalizeRoutePath(rawPath)
      : normalizeRoutePath(
          `${sourceRoute.slice(0, sourceRoute.lastIndexOf("/"))}/${rawPath}`
        )
    : sourceRoute;

  return {
    routePath,
    hash: rawHash ? decodeURIComponent(rawHash) : "",
  };
};

const publicAssetExists = (routePath) => {
  const assetPath = path.join(publicRoot, routePath);
  return assetPath.startsWith(publicRoot) && fs.existsSync(assetPath);
};

const files = walkMarkdownFiles(docsRoot);
const routeSet = new Set(files.map(routeForFile));
const anchorsByRoute = new Map();
const contentByFile = new Map();

files.forEach((filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  contentByFile.set(filePath, content);
  anchorsByRoute.set(routeForFile(filePath), extractAnchors(content));
});

const issues = [];
let checkedLinks = 0;

files.forEach((filePath) => {
  const content = contentByFile.get(filePath);
  const sourceRoute = routeForFile(filePath);
  const tokens = marked.lexer(content);
  const links = collectMarkdownLinks(tokens);

  links.forEach(({ href, isImage }) => {
    const parsed = parseHref(href, sourceRoute);
    if (!parsed) return;

    checkedLinks += 1;

    const source = `${path.relative(process.cwd(), filePath)}:${findApproximateLine(
      content,
      href
    )}`;
    const isKnownRoute =
      routeSet.has(parsed.routePath) || extraInternalRoutes.has(parsed.routePath);
    const isKnownAsset = publicAssetExists(parsed.routePath);

    if (isImage && !isKnownAsset) {
      issues.push({
        source,
        href,
        reason: `Image target does not exist: ${parsed.routePath}`,
      });
      return;
    }

    if (!isImage && !isKnownRoute && !isKnownAsset) {
      issues.push({
        source,
        href,
        reason: `Internal target does not exist: ${parsed.routePath}`,
      });
      return;
    }

    if (parsed.hash && isKnownRoute) {
      const anchors = anchorsByRoute.get(parsed.routePath) ?? new Set();
      if (!anchors.has(parsed.hash)) {
        issues.push({
          source,
          href,
          reason: `Anchor does not exist on ${parsed.routePath}: #${parsed.hash}`,
        });
      }
    }
  });
});

if (issues.length > 0) {
  console.error(`Found ${issues.length} broken internal documentation link(s):`);
  issues.forEach((issue) => {
    console.error(`- ${issue.source} ${issue.href}`);
    console.error(`  ${issue.reason}`);
  });
  process.exit(1);
}

console.log(
  `Validated ${checkedLinks} internal documentation link(s) across ${files.length} markdown file(s).`
);
