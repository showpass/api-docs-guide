const DOC_ROUTE_PREFIXES = [
  "/api",
  "/sdk",
  "/cli",
  "/webhooks",
  "/google-tag-manager",
  "/facebook",
  "/security",
  "/wordpress",
];

const isExternalHref = (href: string): boolean =>
  /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//");

const isDocRoute = (routePath: string): boolean =>
  DOC_ROUTE_PREFIXES.some(
    (prefix) => routePath === prefix || routePath.startsWith(`${prefix}/`)
  );

const normalizeRoutePath = (routePath: string): string => {
  const normalizedSegments: string[] = [];

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

export const resolveMarkdownDocLink = (
  href: string | undefined,
  currentPath: string
): string | null => {
  if (!href || href.startsWith("#") || isExternalHref(href)) {
    return null;
  }

  const hashIndex = href.indexOf("#");
  const beforeHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const queryIndex = beforeHash.indexOf("?");
  const rawPath = queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash;
  const query = queryIndex >= 0 ? beforeHash.slice(queryIndex) : "";

  if (!rawPath) {
    return null;
  }

  const resolvedPath = rawPath.startsWith("/")
    ? normalizeRoutePath(rawPath)
    : normalizeRoutePath(
        `${currentPath.slice(0, currentPath.lastIndexOf("/"))}/${rawPath}`
      );

  if (!isDocRoute(resolvedPath)) {
    return null;
  }

  return `${resolvedPath}${query}${hash}`;
};
