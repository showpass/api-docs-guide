import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/shared/components/command"; // Assuming this path is correct for your command components
import { Button } from "@/shared/components/button";
import { Search, FileText } from "lucide-react";

interface SearchDoc {
  id: string;
  title: string;
  path: string;
  content: string; // For searching, not necessarily for display
}

const DocSearch = () => {
  const [open, setOpen] = useState(false);
  const [searchDocs, setSearchDocs] = useState<SearchDoc[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Toggle the command menu
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prevOpen) => !prevOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback(
    (path: string) => {
      navigate(path);
      setOpen(false);
    },
    [navigate]
  );

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="flex items-center text-sm text-muted-foreground px-3 py-2 h-9 w-full"
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Search docs...</span>
        <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
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
                  className="flex items-center cursor-pointer"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>{doc.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default DocSearch;
