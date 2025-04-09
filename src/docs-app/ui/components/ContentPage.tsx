
import React, { useEffect, useState } from "react";
import MarkdownContent from "./MarkdownContent";
import DocLayout from "./DocLayout";
import Navigation from "./Navigation";
import ApiExamples from "./ApiExamples";
import { useContent } from "@/docs-app/ui/hooks/useContent";
import { toast } from "@/shared/components/use-toast";
import { useScrollSpy } from "@/docs-app/ui/hooks/useScrollSpy";
import { ApiResponse } from "./ApiExamples";

interface ContentPageProps {
  contentPath: string;
  currentPath: string;
  apiExamples?: {
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    description?: string;
    examples: {
      curl: string;
      python: string;
      node: string;
    };
    response: ApiResponse;
  };
}

const ContentPage: React.FC<ContentPageProps> = ({ contentPath, currentPath, apiExamples }) => {
  const { content, isLoading, error, tableOfContents } = useContent(contentPath);
  const activeSection = useScrollSpy("h2[id], h3[id]", 100);

  // Show error toast if content failed to load
  useEffect(() => {
    if (error) {
      toast({
        title: "Content Error",
        description: `Failed to load document: ${error.message}`,
        variant: "destructive",
      });
    }
  }, [error]);

  // Handle anchor clicks and fix scroll behavior
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            // Scroll to element with offset for header
            window.scrollTo({
              top: element.getBoundingClientRect().top + window.scrollY - 100,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    };

    // Initial check for hash in URL
    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isLoading]);

  // Scroll to top when content changes (new page)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [contentPath]);

  // Determine what to show in the right column
  const rightColumnContent = apiExamples ? (
    <ApiExamples {...apiExamples} />
  ) : null;

  return (
    <DocLayout 
      navigation={<Navigation currentPath={currentPath} />}
      tableOfContents={rightColumnContent}
      tocItems={!apiExamples ? tableOfContents : undefined}
    >
      <div className="mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-pulse text-primary">Loading documentation...</div>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/30 rounded-md p-6">
            <h1 className="text-2xl font-bold text-destructive mb-2">Error Loading Content</h1>
            <p className="text-destructive/90">{error.message}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              Please check that the document exists and build configuration is correct.
            </p>
          </div>
        ) : (
          <MarkdownContent content={content} />
        )}
      </div>
    </DocLayout>
  );
};

export default ContentPage;
