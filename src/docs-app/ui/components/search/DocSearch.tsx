import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/shared/components/command.tsx";
import { Button } from "@/shared/components/button.tsx";
import { Search, FileText } from "lucide-react";

interface SearchDoc {
  id: string;
  title: string;
  path: string;
  content: string; // For searching, not necessarily for display
}

interface DocSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DocSearchTriggerProps {
  open: boolean;
  onOpen: () => void;
}

const sectionLabels: Record<string, string> = {
  api: "API Reference",
  sdk: "JavaScript SDK",
  cli: "CLI",
  wordpress: "WordPress",
  webhooks: "Webhooks",
  "google-tag-manager": "Google Tag Manager",
  facebook: "Facebook",
  security: "Security",
};

const getSectionLabel = (path: string) => {
  const section = path.split("/").filter(Boolean)[0];
  return sectionLabels[section] ?? "Documentation";
};

const getSearchSnippet = (content: string, query: string) => {
  const normalizedContent = content.replace(/\s+/g, " ").trim();
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return "";
  }

  const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);
  const contentLower = normalizedContent.toLowerCase();
  let matchIndex = contentLower.indexOf(normalizedQuery);

  if (matchIndex < 0) {
    matchIndex = queryTerms.reduce((firstMatch, term) => {
      if (firstMatch >= 0) return firstMatch;
      return contentLower.indexOf(term);
    }, -1);
  }

  if (matchIndex < 0) {
    return normalizedContent.slice(0, 150);
  }

  const start = Math.max(0, matchIndex - 55);
  const end = Math.min(normalizedContent.length, matchIndex + 120);
  return `${start > 0 ? "…" : ""}${normalizedContent.slice(start, end)}${
    end < normalizedContent.length ? "…" : ""
  }`;
};

export const DocSearchTrigger = ({ open, onOpen }: DocSearchTriggerProps) => (
  <Button
    type="button"
    variant="outline"
    onClick={onOpen}
    className="group flex h-9 w-full items-center px-3 py-2 text-sm text-muted-foreground"
    aria-haspopup="dialog"
    aria-expanded={open}
  >
    <Search className="mr-2 h-4 w-4" />
    <span>Search docs...</span>
    <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 group-hover:border-primary-foreground group-hover:bg-primary-foreground group-hover:text-primary md:flex">
      <span className="text-xs">⌘</span>K
    </kbd>
  </Button>
);

const DocSearch = ({ open, onOpenChange }: DocSearchProps) => {
  const [searchDocs, setSearchDocs] = useState<SearchDoc[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const filteredDocs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return searchDocs;
    }

    const terms = normalizedQuery.split(/\s+/).filter(Boolean);

    return searchDocs
      .map((doc) => {
        const title = doc.title.toLowerCase();
        const content = doc.content.toLowerCase();
        const haystack = `${title} ${content}`;
        const contentMatch = content.indexOf(normalizedQuery);
        const score =
          title === normalizedQuery
            ? 0
            : title.startsWith(normalizedQuery)
              ? 1
              : title.includes(normalizedQuery)
                ? 2
                : 10 + (contentMatch >= 0 ? contentMatch / 1000 : 10);

        return { doc, haystack, score };
      })
      .filter(({ haystack }) => terms.every((term) => haystack.includes(term)))
      .sort((a, b) => a.score - b.score || a.doc.title.localeCompare(b.doc.title))
      .slice(0, 40)
      .map(({ doc }) => doc);
  }, [query, searchDocs]);

  useEffect(() => {
    // Load the search index
    fetch("/search-index.json")
      .then((res) => res.json())
      .then((data) => {
        setSearchDocs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load search index:", error);
        setLoading(false);
        // Potentially set an error state here to inform the user
      });
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setQuery("");
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange]
  );

  // Keep the highest-ranked result visible whenever filtering changes.
  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (listRef.current) {
        listRef.current.scrollTop = 0;
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [query]);

  // Toggle the single shared command menu.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [handleOpenChange, open]);

  const handleSelect = useCallback(
    (path: string) => {
      navigate(path);
      handleOpenChange(false);
    },
    [handleOpenChange, navigate]
  );

  return (
    <CommandDialog
      open={open}
      onOpenChange={handleOpenChange}
      shouldFilter={false}
    >
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder="Type a command or search..."
      />
      <CommandList ref={listRef} className="max-h-[min(60vh,28rem)]">
        {loading ? (
          <CommandEmpty>Loading documents...</CommandEmpty>
        ) : searchDocs.length === 0 && !loading ? (
          <CommandEmpty>
            No documents found. Ensure search index is built.
          </CommandEmpty>
        ) : (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {searchDocs.length > 0 && (
          <CommandGroup heading="Documentation">
            {filteredDocs.map((doc) => (
              <CommandItem
                key={doc.id}
                value={doc.id}
                onSelect={() => handleSelect(doc.path)}
                className="flex cursor-pointer items-start gap-3 py-3 data-[selected=true]:bg-accent data-[selected=true]:text-foreground"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/70 bg-muted/40">
                  <FileText className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex min-w-0 items-baseline gap-2">
                    <span className="truncate font-medium">{doc.title}</span>
                    <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
                      {getSectionLabel(doc.path)}
                    </span>
                  </span>
                  {query.trim() && (
                    <span className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                      {getSearchSnippet(doc.content, query)}
                    </span>
                  )}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default DocSearch;
