import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
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
    <CommandDialog open={open} onOpenChange={handleOpenChange}>
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder="Type a command or search..."
      />
      <CommandList ref={listRef}>
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
          <CommandGroup heading="Documents">
            {searchDocs.map((doc) => (
              <CommandItem
                key={doc.id}
                value={`${doc.title} ${doc.content.substring(0, 100)}`} // Value for cmdk filtering
                onSelect={() => handleSelect(doc.path)}
                className="flex cursor-pointer items-center"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>{doc.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default DocSearch;
