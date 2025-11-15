import React, { useMemo } from "react";
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
              "block text-sm py-2 px-3 transition-colors text-muted-foreground hover:text-foreground relative",
              "before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0.5 before:h-4 before:rounded-full before:transition-colors",
              isActive && "text-primary font-medium before:bg-primary"
            )}
            style={{
              paddingLeft: isLevel4 ? '2rem' : isLevel3 ? '1.5rem' : '0.75rem'
            }}
          >
            {item.title}
          </a>
        );
      })}
    </div>
  );
};

export default TableOfContents;