import React, { useState } from "react";
import { ScrollArea } from "@/shared/components/scroll-area.tsx";
import { Menu, X } from "lucide-react";
import { cn } from "@/shared/lib/utils.ts";
import { Button } from "@/shared/components/button.tsx";
import Navigation from "@/docs-app/ui/components/navigation/Navigation.tsx";
import TableOfContents from "@/docs-app/ui/components/navigation/TableOfContents.tsx";
import ApiExamples from "@/docs-app/ui/components/api/ApiExamples.tsx";
import { TocItem, ApiExamplesData } from "@/docs-app/data/types.ts";
import DocSearch from "@/docs-app/ui/components/search/DocSearch.tsx";
import logoSrc from "@/shared/assets/images/showpass-logo-red.svg";

interface DocLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
  tocItems?: TocItem[];
  navigation?: React.ReactNode;
  apiExamplesData?: ApiExamplesData;
  activeSection?: string;
  hideRightSidebar?: boolean;
}

const DocLayout = ({
  children,
  currentPath,
  tocItems,
  navigation,
  apiExamplesData,
  activeSection,
  hideRightSidebar = false,
}: DocLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[330px_minmax(0,1fr)] min-h-screen">
      {/* Mobile Navigation Toggle & Search */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-background p-4 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="mr-2"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
        <div className="flex-1 flex justify-center">
          <img
            src={logoSrc}
            alt="Showpass Documentation Logo"
            className="h-12"
          />
        </div>
        <div className="w-12" />
      </div>

      {/* Left Sidebar (Navigation) */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background lg:static lg:block lg:border-r border-slate-200 lg:sticky lg:top-0 lg:h-screen",
          sidebarOpen ? "block" : "hidden"
        )}
      >
        {" "}
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
          {/* Desktop Sidebar Header & Search */}
          <div className="border-b border-slate-200 p-5 hidden lg:flex items-center justify-center">
            <div className="flex items-center gap-2">
              <img
                src={logoSrc}
                alt="Showpass Documentation Logo"
                className="h-12"
              />
            </div>
          </div>
          <div className="border-b border-slate-200 p-5">
            <DocSearch />
          </div>
          <ScrollArea className="flex-1 px-5 pb-12">
            {navigation ||
              (currentPath && <Navigation currentPath={currentPath} />)}
          </ScrollArea>
        </div>
      </div>

      {/* Main Content & Right Sidebar Grid Layout */}
      <div
        className={cn(
          "lg:col-span-1",
          !hideRightSidebar &&
            apiExamplesData &&
            "xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,600px)]",
          !hideRightSidebar &&
            !apiExamplesData &&
            "xl:grid xl:grid-cols-[minmax(0,1fr)_288px]"
        )}
      >
        {/* Main Content */}
        <div
          className={cn(
            "px-5 py-8 lg:px-10 xl:px-12 prose prose-blue prose-pre:overflow-x-auto prose-table:overflow-x-auto",
            hideRightSidebar ? "max-w-none" : "max-w-[1200px] mx-auto xl:mx-0"
          )}
        >
          {children}
        </div>

        {/* Right Sidebar - API Examples or Table of Contents */}
        {!hideRightSidebar && (
          <div className="hidden xl:block border-l border-slate-200 bg-slate-50/50">
            <div className="sticky top-0 p-6 self-start max-h-screen overflow-y-auto">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
                <p className="text-sm font-medium text-slate-700">
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
  );
};

export default DocLayout;
