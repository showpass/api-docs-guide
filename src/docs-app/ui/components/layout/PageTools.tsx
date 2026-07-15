import React from "react";
import { Braces, ListTree } from "lucide-react";
import ApiExamples from "@/docs-app/ui/components/api/ApiExamples.tsx";
import TableOfContents from "@/docs-app/ui/components/navigation/TableOfContents.tsx";
import type { ApiExamplesData, TocItem } from "@/docs-app/data/types.ts";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/tabs.tsx";

interface PageToolsProps {
  tocItems?: TocItem[];
  apiExamplesData?: ApiExamplesData;
  activeSection?: string;
  onNavigate?: () => void;
  outlineVariant?: "default" | "floating";
}

const toolTabClass =
  "relative h-9 flex-1 gap-2 rounded-none border-b-2 border-transparent bg-transparent px-3 text-xs font-medium text-muted-foreground shadow-none transition-colors hover:text-foreground focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring focus-visible:ring-offset-0 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none";

/**
 * A single presentation for page-local tools. API pages expose both their
 * section outline and examples; prose pages keep the quieter outline-only UI.
 */
const PageTools = ({
  tocItems = [],
  apiExamplesData,
  activeSection,
  onNavigate,
  outlineVariant = "default",
}: PageToolsProps) => {
  const hasOutline = tocItems.length > 0;

  if (apiExamplesData && hasOutline) {
    return (
      <Tabs defaultValue="examples" className="min-w-0">
        <TabsList className="grid h-9 w-full grid-cols-2 rounded-none border-b border-border bg-transparent p-0">
          <TabsTrigger value="outline" className={toolTabClass}>
            <ListTree className="h-3.5 w-3.5" />
            Outline
          </TabsTrigger>
          <TabsTrigger value="examples" className={toolTabClass}>
            <Braces className="h-3.5 w-3.5" />
            Examples
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="outline"
          className="mt-3 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <TableOfContents
            items={tocItems}
            activeItem={activeSection}
            onItemClick={onNavigate}
            variant={outlineVariant}
          />
        </TabsContent>
        <TabsContent
          value="examples"
          className="mt-3 min-w-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <ApiExamples {...apiExamplesData} />
        </TabsContent>
      </Tabs>
    );
  }

  if (apiExamplesData) {
    return <ApiExamples {...apiExamplesData} />;
  }

  if (hasOutline) {
    return (
      <TableOfContents
        items={tocItems}
        activeItem={activeSection}
        onItemClick={onNavigate}
        variant={outlineVariant}
      />
    );
  }

  return null;
};

export default PageTools;
