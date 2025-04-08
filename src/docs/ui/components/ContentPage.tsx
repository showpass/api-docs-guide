
import React, { useEffect, useState } from "react";
import MarkdownContent from "./MarkdownContent";
import DocLayout from "./DocLayout";
import Navigation from "./Navigation";
import TableOfContents from "./TableOfContents";
import { useContent } from "@/docs/ui/hooks/useContent";
import { toast } from "@/shared/hooks/use-toast.ts";

interface ContentPageProps {
  contentPath: string;
  currentPath: string;
}

const ContentPage: React.FC<ContentPageProps> = ({ contentPath, currentPath }) => {
  const { content, isLoading, error, tableOfContents } = useContent(contentPath);
  const [activeSection, setActiveSection] = useState("");

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

  // Handle scroll to update the active section
  useEffect(() => {
    if (!isLoading && content) {
      const handleScroll = () => {
        const sections = document.querySelectorAll("h2[id], h3[id]");
        
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i] as HTMLElement;
          const rect = section.getBoundingClientRect();
          
          if (rect.top <= 100) {
            setActiveSection(`#${section.id}`);
            break;
          }
        }
      };
      
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll(); // Initialize active section on load
      
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isLoading, content]);

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
            setActiveSection(hash);
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

  return (
    <DocLayout 
      navigation={<Navigation currentPath={currentPath} />}
      tableOfContents={<TableOfContents items={tableOfContents} activeItem={activeSection} />}
    >
      <div className="max-w-3xl mx-auto py-8 px-4">
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
