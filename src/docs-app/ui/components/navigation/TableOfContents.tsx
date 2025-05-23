import React from "react";
import { cn } from "@/shared/lib/utils.ts";
import { ChevronRight } from "lucide-react";
import { TocItem } from "@/docs-app/data/types.ts";

interface TableOfContentsProps {
  items: TocItem[];
  activeItem?: string;
}

const TableOfContents = ({ items, activeItem }: TableOfContentsProps) => {
  return (
    <div className="space-y-1">
      {items.map((item, index) => {
        const isActive = activeItem === item.href;

        return (
          <a
            key={index}
            href={item.href}
            className={cn(
              "flex items-center gap-2 text-sm py-2 px-3 rounded-md transition-colors",
              isActive
                ? "bg-slate-100 text-primary font-medium dark:bg-[hsl(var(--primary))] dark:text-[hsl(var(--primary-foreground))]"
                : "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900 dark:text-[hsl(var(--muted-foreground))] dark:hover:bg-[hsl(var(--secondary))] dark:hover:text-[hsl(var(--foreground))]"
            )}
          >
            {isActive && (
              <ChevronRight className="h-3.5 w-3.5 text-primary dark:text-[hsl(var(--primary-foreground))]" />
            )}
            <span className={isActive ? "ml-0" : "ml-5.5"}>{item.title}</span>
          </a>
        );
      })}
    </div>
  );
};

export default TableOfContents;
