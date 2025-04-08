
import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Navigation from "./Navigation";
import TableOfContents from "./TableOfContents";

interface DocLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
  tocItems?: { title: string; href: string }[];
  navigation?: React.ReactNode;
  tableOfContents?: React.ReactNode;
}

const DocLayout = ({ 
  children, 
  currentPath, 
  tocItems, 
  navigation, 
  tableOfContents 
}: DocLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
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
          "fixed inset-0 z-50 bg-background lg:static lg:block lg:w-64 lg:border-r",
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
          <ScrollArea className="flex-1 p-4 pb-12">
            {navigation || (currentPath && <Navigation currentPath={currentPath} />)}
          </ScrollArea>
        </div>
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1">
        <div className="container max-w-screen-xl mx-auto">
          <div className="flex flex-col lg:flex-row">
            {/* Main Content */}
            <div className="flex-1 px-4 py-6 lg:px-8 prose prose-blue max-w-none">
              {children}
            </div>
            
            {/* Right Sidebar (Table of Contents) */}
            <div className="hidden xl:block w-64 shrink-0">
              <div className="sticky top-16 p-4">
                {tableOfContents || (tocItems && tocItems.length > 0 && (
                  <>
                    <p className="text-sm font-medium mb-4">On this page</p>
                    <TableOfContents items={tocItems} />
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocLayout;
