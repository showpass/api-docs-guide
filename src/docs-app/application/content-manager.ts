import { DocsLoader, IDocsLoader } from "@/docs-app/infrastructure/docs-loader";

/**
 * ContentManager acts as the main interface for loading and processing documentation content.
 * It decouples the markdown content source (DocsLoader) from the rest of the application logic.
 */
export class ContentManager {
  private docsLoader: IDocsLoader;

  /**
   * @param docsLoader - Optional custom loader implementing IDocsLoader. Defaults to a static DocsLoader.
   */
  constructor(docsLoader: IDocsLoader = new DocsLoader()) {
    this.docsLoader = docsLoader;
  }

  /**
   * Loads raw markdown content based on a relative path.
   * This delegates the actual loading logic to the injected docsLoader implementation.
   *
   * @param contentPath - Path to the markdown file (relative to the docs base).
   * @returns A promise that resolves with the raw markdown content as a string.
   */
  async loadContent(contentPath: string): Promise<string> {
    return this.docsLoader.loadContent(contentPath);
  }

  /**
   * Parses markdown content to extract second-level headings (`## `).
   * These are used to build a table of contents (TOC) for in-page navigation.
   *
   * @param content - Raw markdown content.
   * @returns An array of heading objects with title and anchor href.
   */
  extractHeadings(content: string): { title: string; href: string }[] {
    const headings: { title: string; href: string }[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      if (line.startsWith('## ')) {
        const title = line.replace('## ', '').trim();

        // Converts the title to a URL-friendly anchor ID (e.g. 'My Heading' → '#my-heading')
        const href = `#${title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')}`;

        headings.push({ title, href });
      }
    }

    return headings;
  }
}
