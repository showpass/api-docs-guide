import React from "react";
import { cn } from "@/shared/lib/utils.ts";
import { TocItem } from "@/docs-app/data/types.ts";

interface TableOfContentsProps {
  items: TocItem[];
  activeItem?: string;
}

/**
 * Table of Contents component that displays a list of page headings with
 * subtle highlighting for the currently active section.
 * 
 * Features:
 * - Smooth hover transitions
 * - Minimal visual indicator for active section
 * - Keyboard and screen reader accessible
 */
const TableOfContents = ({ items, activeItem }: TableOfContentsProps) => {
  return (
    <div className="space-y-1">
      {items.map((item) => {
        const isActive = activeItem && item.href === `#${activeItem}`;

        const isLevel3 = item.level === 3;
        const isLevel4 = item.level === 4;
        
        return (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 text-sm py-1.5 rounded transition-colors relative",
              isLevel3 && "ml-4 px-2",
              isLevel4 && "ml-8 px-2", 
              !isLevel3 && !isLevel4 && "px-2",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <div className={cn(
                "absolute w-0.5 h-4 bg-primary rounded-full",
                isLevel3 ? "left-4" : isLevel4 ? "left-8" : "left-0"
              )} />
            )}
            <span className={cn(
              isLevel3 || isLevel4 ? "pl-2" : "pl-3"
            )}>{item.title}</span>
          </a>
        );
      })}
    </div>
  );
};

export default TableOfContents;