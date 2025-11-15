
import { useState, useEffect, useMemo } from "react";
import { ContentManager } from "@/docs-app/application/content-manager.ts";

/**
 * Hook for fetching content directly from markdown files
 */
export const useContent = (contentPath: string) => {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [tableOfContents, setTableOfContents] = useState<{title: string; href: string; level: number}[]>([]);

  // Memoize so it is only created once
  const contentManager = useMemo(() => {
    return new ContentManager();
  }, []);

  useEffect(() => {
    let didCancel = false;
    const path = contentPath;

    const fetchContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Clear previous TOC and content immediately to prevent stale data between routes
        setTableOfContents([]);
        setContent("");
        
        // Load content directly from file
        const loadedContent = await contentManager.loadContent(path);
        if (didCancel) return;
        
        // Extract headings for table of contents
        const headings = contentManager.extractHeadings(loadedContent);
        
        setContent(loadedContent);
        setTableOfContents(headings);
      } catch (err) {
        if (didCancel) return;
        console.error("Failed to load content:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (!didCancel) setIsLoading(false);
      }
    };

    fetchContent();

    // Cancel any in-flight load when path changes/unmounts to avoid race conditions
    return () => {
      didCancel = true;
    };
  }, [contentPath, contentManager]);

  return {
    content,
    isLoading,
    error,
    tableOfContents
  };
};
