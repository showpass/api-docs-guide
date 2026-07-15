import React from "react";
import { cn } from "@/shared/lib/utils.ts";
import { TocItem } from "@/docs-app/data/types.ts";

interface TableOfContentsProps {
  items: TocItem[];
  activeItem?: string;
  onItemClick?: () => void;
  variant?: "default" | "floating";
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
const TableOfContents = ({
  items,
  activeItem,
  onItemClick,
  variant = "default",
}: TableOfContentsProps) => {
  const isFloating = variant === "floating";

  return (
    <nav
      aria-label="On this page"
      className={cn(isFloating && "border-l border-border/70")}
    >
      {items.map((item, index) => {
        const isActive = Boolean(
          activeItem && item.href === `#${activeItem}`
        );
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

        const paddingLeft = isFloating
          ? isLevel4
            ? "1.75rem"
            : isLevel3
              ? "1.25rem"
              : "0.75rem"
          : isLevel4
            ? "2rem"
            : isLevel3
              ? "1.5rem"
              : "0.75rem";
        const paddingTop = isFloating
          ? isTopLevel
            ? "0.45rem"
            : "0.25rem"
          : isTopLevel
            ? "0.625rem"
            : isFirstChild
              ? "0.375rem"
              : "0.25rem";
        const paddingBottom = isFloating
          ? isTopLevel && hasChildrenAfter
            ? "0.25rem"
            : isLastChildBeforeParent
              ? "0.45rem"
              : isTopLevel
                ? "0.45rem"
                : "0.25rem"
          : isTopLevel && hasChildrenAfter
            ? "0.375rem"
            : isLastChildBeforeParent
              ? "0.5rem"
              : isTopLevel
                ? "0.625rem"
                : "0.25rem";

        return (
          <a
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            aria-current={isActive ? "location" : undefined}
            className={cn(
              "relative block text-sm leading-5 text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isFloating
                ? "-ml-px border-l border-transparent pr-1 hover:border-border"
                : "px-3 before:absolute before:left-0 before:top-1/2 before:h-4 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:transition-colors before:content-['']",
              isActive &&
                (isFloating
                  ? "border-primary font-medium text-foreground"
                  : "font-medium text-primary before:bg-primary")
            )}
            style={{
              paddingLeft,
              paddingTop,
              paddingBottom,
            }}
          >
            {item.title}
          </a>
        );
      })}
    </nav>
  );
};

export default TableOfContents;
