
import { useState, useEffect } from "react";
import { ContentManager } from "../content-manager";

/**
 * Hook for fetching content directly from markdown files
 */
export const useContent = (contentPath: string) => {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [tableOfContents, setTableOfContents] = useState<{title: string; href: string}[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load content directly from file
        const loadedContent = await ContentManager.loadContent(contentPath);
        
        // Extract headings for table of contents
        const headings = ContentManager.extractHeadings(loadedContent);
        
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
