import { DocsLoader, IDocsLoader } from "@/docs-app/infrastructure/docs-loader";

/**
 * ContentManager provides a clean interface for loading and processing documentation content.
 * It abstracts the content source (DocsLoader) from the application logic and provides
 * consistent content processing capabilities.
 */
export class ContentManager {
  private docsLoader: IDocsLoader;

  /**
   * Creates a new ContentManager instance.
   * 
   * @param docsLoader - Content loader implementation. Defaults to DocsLoader if not provided.
   */
  constructor(docsLoader: IDocsLoader = new DocsLoader()) {
    this.docsLoader = docsLoader;
  }

  /**
   * Loads raw markdown content from the specified path.
   * 
   * @param contentPath - Relative path to the markdown file
   * @returns Promise resolving to the raw markdown content
   */
  async loadContent(contentPath: string): Promise<string> {
    return this.docsLoader.loadContent(contentPath);
  }

  /**
   * Extracts heading information from markdown content for table of contents generation.
   * 
   * @param content - Raw markdown content
   * @returns Array of heading objects with title, href, and level properties
   */
  extractHeadings(content: string): { title: string; href: string; level: number }[] {
    return this.extractHeadingsFromMarkdown(content);
  }

  /**
   * Generates a URL-safe ID from heading text.
   * Converts text to lowercase, removes special characters, and creates kebab-case format.
   */
  private generateHeadingId(text: string): string {
    const result = text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    
    return result;
  }

  /**
   * Cleans up heading text for display in the TOC.
   * Handles parameter-style headings (e.g., `param="value"`) by extracting just the parameter name.
   * Removes backticks, excessive quotes, and cleans up formatting.
   */
  private cleanHeadingTitle(title: string): string {
    // Remove backticks first
    let cleaned = title.replace(/`/g, '');
    
    // Check if this is a parameter-style heading: something="value"
    const paramMatch = cleaned.match(/^([a-z_][a-z0-9_-]*)\s*=/i);
    if (paramMatch) {
      // Return just the parameter name
      return paramMatch[1];
    }
    
    // Otherwise, general cleanup
    return cleaned
      .replace(/\s*\(or\s+.*?\)\s*$/i, '') // Remove "(or ...)" suffixes
      .replace(/^["']|["']$/g, '') // Remove leading/trailing quotes
      .trim();
  }

  /**
   * Extract headings (H2–H4) from markdown, ignoring fenced code blocks and blockquotes.
   * Also de-duplicates by href to prevent duplicate items.
   */
  private extractHeadingsFromMarkdown(content: string): { title: string; href: string; level: number }[] {
    const headings: { title: string; href: string; level: number }[] = [];
    const seen = new Set<string>();
    const lines = content.split('\n');

    let inFence = false;
    let fenceMarker: string | null = null; // ``` or ~~~

    for (let raw of lines) {
      const line = raw.trimEnd();

      // Toggle fenced code block state
      const fenceMatch = line.match(/^(```|~~~)/);
      if (fenceMatch) {
        const marker = fenceMatch[1];
        if (!inFence) {
          inFence = true;
          fenceMarker = marker;
        } else if (fenceMarker === marker) {
          inFence = false;
          fenceMarker = null;
        }
        continue; // Skip fence lines
      }

      if (inFence) continue; // Ignore lines inside code fences
      if (/^>\s*/.test(line)) continue; // Ignore blockquotes

      // Match H2 (##), H3 (###), H4 (####) with content
      const match = line.match(/^(#{2,4})\s+(.+?)\s*$/);
      if (match) {
        const level = match[1].length; // 2, 3, or 4
        const rawTitle = match[2].trim();
        const id = this.generateHeadingId(rawTitle);
        if (!id) continue;
        const href = `#${id}`;
        if (seen.has(href)) continue; // de-dupe across sections
        seen.add(href);
        // Clean the title for display in TOC
        const cleanTitle = this.cleanHeadingTitle(rawTitle);
        headings.push({ title: cleanTitle, href, level });
      }
    }

    return headings;
  }
}