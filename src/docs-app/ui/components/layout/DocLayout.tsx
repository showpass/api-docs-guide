import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ScrollArea } from "@/shared/components/scroll-area.tsx";
import { Menu, X } from "lucide-react";
import { cn } from "@/shared/lib/utils.ts";
import { Button } from "@/shared/components/button.tsx";
import Navigation from "@/docs-app/ui/components/navigation/Navigation.tsx";
import TableOfContents from "@/docs-app/ui/components/navigation/TableOfContents.tsx";
import ApiExamples from "@/docs-app/ui/components/api/ApiExamples.tsx";
import { TocItem, ApiExamplesData } from "@/docs-app/data/types.ts";
import DocSearch from "@/docs-app/ui/components/search/DocSearch.tsx";
import BreadcrumbNavigation from "@/shared/components/BreadcrumbNavigation.tsx";
import { Separator } from "@/shared/components/separator.tsx";
import TopNavigation from "@/shared/components/TopNavigation.tsx";

export interface DocLayoutContextProps {
  tocItems?: TocItem[];
  apiExamplesData?: ApiExamplesData;
  activeSection?: string;
  hideRightSidebar?: boolean;
}

// Define the shape of the context value including the updater function
interface FullDocLayoutContextProps extends DocLayoutContextProps {
  setPageData: React.Dispatch<React.SetStateAction<DocLayoutContextProps>>;
}

export const DocLayoutContext =
  React.createContext<FullDocLayoutContextProps | null>(null);

export const useDocLayoutData = () => {
  const context = React.useContext(DocLayoutContext);
  if (!context) {
    throw new Error(
      "useDocLayoutData must be used within a DocLayoutDataProvider"
    );
  }
  return context;
};

// This Provider will be used ONCE in App.tsx, wrapping DocLayout
export const DocLayoutDataProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [pageData, setPageData] = useState<DocLayoutContextProps>({
    tocItems: [],
    apiExamplesData: undefined,
    activeSection: undefined,
    hideRightSidebar: false,
  });

  return (
    <DocLayoutContext.Provider value={{ ...pageData, setPageData }}>
      {children}
    </DocLayoutContext.Provider>
  );
};

const DocLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  // Consume the context provided by DocLayoutDataProvider in App.tsx
  const { tocItems, apiExamplesData, activeSection, hideRightSidebar } =
    useDocLayoutData();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation - Consistent across all pages */}
      <TopNavigation />
      
      <div className="flex flex-col flex-1 lg:grid lg:grid-cols-[330px_minmax(0,1fr)]">
        {/* Mobile Menu Button - Only visible on mobile */}
        <div className="flex items-center justify-between border-b bg-background p-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="mr-2"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
          <div className="flex-1 flex justify-center sm:hidden">
            <DocSearch />
          </div>
        </div>

        {/* Left Sidebar (Navigation) */}
        <div
          className={cn(
            "fixed inset-0 z-40 bg-background lg:static lg:block lg:border-r border-border lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]",
            sidebarOpen ? "block" : "hidden"
          )}
        >
          <div className="flex h-full flex-col">
            {/* Mobile Sidebar Header */}
            <div className="flex items-center justify-between border-b p-4 lg:hidden">
              <span className="ml-2 font-semibold">Navigation</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close sidebar</span>
              </Button>
            </div>
            <ScrollArea className="flex-1 px-5 pb-12">
              <Navigation currentPath={currentPath} />
            </ScrollArea>
          </div>
        </div>

        {/* Main Content & Right Sidebar */}
        <div
          className={cn(
            "flex flex-col min-w-0",
            !hideRightSidebar &&
              "xl:grid xl:grid-cols-[minmax(0,1fr)_auto]"
          )}
        >
          {/* Main Content */}
          <div
            className={cn(
              "px-5 py-8 pt-3 lg:px-10 xl:px-12 prose dark:prose-invert prose-slate prose-pre:overflow-x-auto prose-table:overflow-x-auto",
              hideRightSidebar ? "max-w-none" : "max-w-[1200px] mx-auto xl:mx-0"
            )}
          >
            <BreadcrumbNavigation />
            <Outlet />
          </div>

          {/* Right Sidebar - API Examples or Table of Contents */}
          {!hideRightSidebar && (
            <div className={cn(
              "hidden xl:block border-l border-border",
              apiExamplesData ? "w-[600px]" : "w-72"
            )}>
              <div className="sticky top-16 p-6 pt-2 self-start max-h-[calc(100vh-4rem)] overflow-y-auto">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                  <p className="text-sm font-medium text-muted-foreground">
                    {apiExamplesData ? "API Reference" : "On This Page"}
                  </p>
                </div>
                {apiExamplesData ? (
                  <ApiExamples {...apiExamplesData} />
                ) : (
                  tocItems &&
                  tocItems.length > 0 && (
                    <TableOfContents
                      items={tocItems}
                      activeItem={activeSection}
                    />
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocLayout;
