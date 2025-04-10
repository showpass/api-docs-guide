
import React, { useState } from 'react';
import { ScrollArea } from "@/shared/components/scroll-area";
import { Menu, X, BookOpen, Book, LayoutGrid } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/button";
import Navigation from "./Navigation";
import TableOfContents from "./TableOfContents";
import ApiExamples from "./ApiExamples";
import { TocItem, ApiExamplesData } from "@/docs-app/data/types.ts";

interface DocLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
  tocItems?: TocItem[];
  navigation?: React.ReactNode;
  apiExamplesData?: ApiExamplesData;
  activeSection?: string;
}

const DocLayout = ({ 
  children, 
  currentPath, 
  tocItems, 
  navigation, 
  apiExamplesData,
  activeSection 
}: DocLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[330px_minmax(0,1fr)] min-h-screen">
      {/* Mobile Navigation Toggle */}
      <div className="sticky top-0 z-50 flex items-center border-b bg-background p-4 lg:hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSidebarOpen(true)} 
          className="mr-2"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
        <div className="flex-1 text-center font-semibold">Showpass Documentation</div>
      </div>
      
      {/* Left Sidebar (Navigation) */}
      <div 
        className={cn(
          "fixed inset-0 z-50 bg-background lg:static lg:block lg:border-r border-slate-200",
          sidebarOpen ? "block" : "hidden"
        )}
      >
        <div className="sticky top-0 flex h-full flex-col">
          <div className="flex items-center border-b p-4 lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
            </Button>
            <span className="ml-2 font-semibold">Navigation</span>
          </div>
          <div className="border-b border-slate-200 p-5 hidden lg:flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="font-semibold text-xl">Showpass Documentation</h1>
          </div>
          <ScrollArea className="flex-1 px-5 py-6 pb-12">
            {navigation || (currentPath && <Navigation currentPath={currentPath} />)}
          </ScrollArea>
        </div>
      </div>
      
      {/* Main Content & Right Sidebar Grid Layout */}
      <div className="lg:col-span-1 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Main Content */}
        <div className="px-5 py-8 lg:px-10 xl:px-12 prose prose-blue prose-pre:overflow-x-auto prose-table:overflow-x-auto max-w-4xl mx-auto xl:mx-0">
          {children}
        </div>

        {/* Right Sidebar - API Examples or Table of Contents */}
        <div className="hidden xl:block border-l border-slate-200 bg-slate-50/50">
          <div className="sticky top-0 p-6 self-start max-h-screen overflow-y-auto">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
              <LayoutGrid className="h-4 w-4 text-slate-600" />
              <p className="text-sm font-medium text-slate-700">
                {apiExamplesData ? 'API Reference' : 'On This Page'}
              </p>
            </div>
            {apiExamplesData ? (
              <ApiExamples {...apiExamplesData} />
            ) : (
              tocItems && tocItems.length > 0 && (
                <TableOfContents items={tocItems} activeItem={activeSection} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocLayout;
