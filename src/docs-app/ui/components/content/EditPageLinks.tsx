import React from "react";
import { Pencil, Bug } from "lucide-react";
import { Separator } from "@/shared/components/separator.tsx";

interface EditPageLinksProps {
  /** The content path like /sdk/01-sdk-getting-started.md */
  contentPath: string;
}

const GITHUB_REPO = "showpass/api-docs-guide";
const GITHUB_BRANCH = "master";
const DOCS_BASE_PATH = "src/docs-app/data";

/**
 * Generates the GitHub edit URL for a documentation page
 */
const getEditUrl = (contentPath: string): string => {
  // contentPath is like /sdk/01-sdk-getting-started.md
  // We need: https://github.com/showpass/api-docs-guide/edit/master/src/docs-app/data/sdk/01-sdk-getting-started.md
  const relativePath = contentPath.startsWith("/")
    ? contentPath.slice(1)
    : contentPath;
  return `https://github.com/${GITHUB_REPO}/edit/${GITHUB_BRANCH}/${DOCS_BASE_PATH}/${relativePath}`;
};

/**
 * Generates the GitHub new issue URL for reporting a documentation issue
 */
const getIssueUrl = (contentPath: string): string => {
  const pageTitle = contentPath.split("/").pop()?.replace(".md", "") || "page";
  const issueTitle = encodeURIComponent(`Documentation issue: ${pageTitle}`);
  const issueBody = encodeURIComponent(
    `## Page\n\`${contentPath}\`\n\n## Issue Description\n\n<!-- Please describe what's incorrect or needs to be updated -->\n\n## Suggested Fix\n\n<!-- If you have a suggestion for how to fix it -->\n`
  );
  return `https://github.com/${GITHUB_REPO}/issues/new?title=${issueTitle}&body=${issueBody}&labels=documentation`;
};

const EditPageLinks: React.FC<EditPageLinksProps> = ({ contentPath }) => {
  const editUrl = getEditUrl(contentPath);
  const issueUrl = getIssueUrl(contentPath);

  return (
    <div className="mt-16 not-prose">
      <Separator className="mb-6 opacity-40" />
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="text-muted-foreground/70">Help us improve this page</span>
        <div className="flex items-center gap-3">
          <a
            href={editUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group"
          >
            <Pencil className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
            <span>Edit this page</span>
          </a>
          <span className="text-muted-foreground/30">•</span>
          <a
            href={issueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors group"
          >
            <Bug className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
            <span>Report an issue</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default EditPageLinks;
