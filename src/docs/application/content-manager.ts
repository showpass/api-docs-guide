import { DocsLoader, IDocsLoader } from "@/docs/infrastructure/docs-loader";

/**
 * Content manager responsible for application-specific content operations
 */
export class ContentManager {
  private docsLoader: IDocsLoader;

  constructor(docsLoader: IDocsLoader = new DocsLoader()) {
    this.docsLoader = docsLoader;
  }

  async loadContent(contentPath: string): Promise<string> {
    return this.docsLoader.loadContent(contentPath);
  }

  extractHeadings(content: string): { title: string; href: string }[] {
    const headings: { title: string; href: string }[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      if (line.startsWith('## ')) {
        const title = line.replace('## ', '').trim();
        const href = `#${title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')}`;
        headings.push({ title, href });
      }
    }

    return headings;
  }
}
