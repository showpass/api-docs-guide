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

        return (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 text-sm py-1.5 px-2 rounded transition-colors relative",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <div className="absolute left-0 w-0.5 h-4 bg-primary rounded-full" />
            )}
            <span className="pl-3">{item.title}</span>
          </a>
        );
      })}
    </div>
  );
};

export default TableOfContents;