import { DocsLoader, IDocsLoader } from "@/docs-app/infrastructure/docs-loader";
import { extractHeadingsFromMarkdown } from "@/docs-app/utils/heading-utils";

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
    return extractHeadingsFromMarkdown(content);
  }
}