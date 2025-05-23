import React, { useEffect } from "react";
import MarkdownContent from "@/docs-app/ui/components/content/MarkdownContent.tsx";
import { useDocLayoutData } from "@/docs-app/ui/components/layout/DocLayout.tsx";
import { useContent } from "@/docs-app/ui/hooks/useContent.ts";
import { toast } from "@/shared/components/use-toast.ts";
import { useScrollSpy } from "@/docs-app/ui/hooks/useScrollSpy.ts";
import { ApiExamplesData } from "@/docs-app/data/types.ts";
import { useHashScroll } from "@/docs-app/ui/hooks/useHashScroll.ts";

interface ContentPageProps {
  contentPath: string;
  currentPath: string;
  apiExamples?: ApiExamplesData;
}

const ContentPage: React.FC<ContentPageProps> = ({
  contentPath,
  currentPath,
  apiExamples,
}) => {
  const { content, isLoading, error, tableOfContents } =
    useContent(contentPath);
  const activeSection = useScrollSpy("h2[id], h3[id]", 100);
  const { setPageData } = useDocLayoutData();

  // Use the hash scroll hook
  useHashScroll(100);

  // Update layout context when page-specific data changes
  useEffect(() => {
    if (setPageData) {
      setPageData({
        tocItems: tableOfContents,
        apiExamplesData: apiExamples,
        activeSection: activeSection,
        hideRightSidebar: !tableOfContents && !apiExamples,
      });
    }
    // Cleanup function to reset data when component unmounts (optional, but good practice)
    return () => {
      if (setPageData) {
        setPageData({
          tocItems: [],
          apiExamplesData: undefined,
          activeSection: undefined,
          hideRightSidebar: false,
        });
      }
    };
  }, [setPageData, tableOfContents, apiExamples, activeSection]);

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

  // Scroll to top when content changes (new page)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [contentPath]);

  return (
    <div className="mx-auto">
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-pulse text-primary">
            Loading documentation...
          </div>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/30 rounded-md p-6">
          <h1 className="text-2xl font-bold text-destructive mb-2">
            Error Loading Content
          </h1>
          <p className="text-destructive/90">{error.message}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Please check that the document exists and build configuration is
            correct.
          </p>
        </div>
      ) : (
        <MarkdownContent content={content} />
      )}
    </div>
  );
};

export default ContentPage;
