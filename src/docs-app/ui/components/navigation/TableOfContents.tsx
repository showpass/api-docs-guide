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
    <div>
      {items.map((item, index) => {
        const isActive = activeItem && item.href === `#${activeItem}`;
        const isLevel3 = item.level === 3;
        const isLevel4 = item.level === 4;
        const isTopLevel = !isLevel3 && !isLevel4;
        
        // Check if next item is a child (for bottom spacing)
        const nextItem = items[index + 1];
        const hasChildrenAfter = nextItem && nextItem.level > item.level;
        
        // Check if this is the first child after a parent (for top spacing)
        const prevItem = items[index - 1];
        const isFirstChild = (isLevel3 || isLevel4) && prevItem && prevItem.level < item.level;
        
        // Check if this is the last child before a new parent section
        const isLastChildBeforeParent = (isLevel3 || isLevel4) && nextItem && nextItem.level < item.level;
        
        return (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "block text-sm px-3 transition-colors text-muted-foreground hover:text-foreground relative",
              "before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0.5 before:h-4 before:rounded-full before:transition-colors",
              isActive && "text-primary font-medium before:bg-primary"
            )}
            style={{
              paddingLeft: isLevel4 ? '2rem' : isLevel3 ? '1.5rem' : '0.75rem',
              paddingTop: isTopLevel ? '0.625rem' : isFirstChild ? '0.375rem' : '0.25rem',
              paddingBottom: isTopLevel && hasChildrenAfter ? '0.375rem' : isLastChildBeforeParent ? '0.5rem' : isTopLevel ? '0.625rem' : '0.25rem',
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