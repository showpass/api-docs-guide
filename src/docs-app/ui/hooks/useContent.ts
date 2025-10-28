
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
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load content directly from file
        const loadedContent = await contentManager.loadContent(contentPath);
        
        // Extract headings for table of contents
        const headings = contentManager.extractHeadings(loadedContent);
        
        setContent(loadedContent);
        setTableOfContents(headings);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load content:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [contentPath]);

  return {
    content,
    isLoading,
    error,
    tableOfContents
  };
};
