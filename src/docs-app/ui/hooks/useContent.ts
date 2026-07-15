import { useEffect, useMemo, useState } from "react";
import { ContentManager } from "@/docs-app/application/content-manager.ts";
import type { TocItem } from "@/docs-app/data/types.ts";

interface ContentState {
  path: string;
  content: string;
  isLoading: boolean;
  error: Error | null;
  tableOfContents: TocItem[];
  pageTitle?: string;
}

const createLoadingState = (path: string): ContentState => ({
  path,
  content: "",
  isLoading: true,
  error: null,
  tableOfContents: [],
  pageTitle: undefined,
});

const normalizeError = (error: unknown): Error =>
  error instanceof Error ? error : new Error(String(error));

const createErrorState = (path: string, error: unknown): ContentState => ({
  ...createLoadingState(path),
  isLoading: false,
  error: normalizeError(error),
});

const createLoadedState = (
  path: string,
  content: string,
  contentManager: ContentManager
): ContentState => {
  const titleMatch = content.match(/^#\s+(.+?)\s*$/m);

  return {
    path,
    content,
    isLoading: false,
    error: null,
    tableOfContents: contentManager.extractHeadings(content),
    pageTitle: titleMatch?.[1]?.replace(/[`*_]/g, "").trim(),
  };
};

/**
 * Fetch documentation content as one route-keyed state snapshot. Keeping the
 * path with its data prevents a newly selected route from painting the
 * previous document while its Markdown is loading.
 */
export const useContent = (contentPath: string) => {
  const contentManager = useMemo(() => new ContentManager(), []);
  const routeState = useMemo(
    () => {
      try {
        const bundledContent = contentManager.loadContentSync(contentPath);

        return bundledContent === undefined
          ? createLoadingState(contentPath)
          : createLoadedState(contentPath, bundledContent, contentManager);
      } catch (error) {
        return createErrorState(contentPath, error);
      }
    },
    [contentManager, contentPath]
  );
  const [state, setState] = useState<ContentState>(routeState);

  useEffect(() => {
    let didCancel = false;

    if (!routeState.isLoading) {
      setState((current) =>
        current.path === routeState.path &&
        current.content === routeState.content
          ? current
          : routeState
      );
      return;
    }

    setState((current) =>
      current.path === contentPath && current.isLoading
        ? current
        : routeState
    );

    const fetchContent = async () => {
      try {
        const loadedContent = await contentManager.loadContent(contentPath);
        if (didCancel) return;

        setState(createLoadedState(contentPath, loadedContent, contentManager));
      } catch (error) {
        if (didCancel) return;

        const contentError = normalizeError(error);
        console.error("Failed to load content:", contentError);

        setState(createErrorState(contentPath, contentError));
      }
    };

    fetchContent();

    return () => {
      didCancel = true;
    };
  }, [contentManager, contentPath, routeState]);

  const visibleState = state.path === contentPath ? state : routeState;

  return {
    content: visibleState.content,
    isLoading: visibleState.isLoading,
    error: visibleState.error,
    tableOfContents: visibleState.tableOfContents,
    pageTitle: visibleState.pageTitle,
  };
};
