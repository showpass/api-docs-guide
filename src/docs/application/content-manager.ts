
import { ContentService } from "../infrastructure/content-service";

/**
 * Content manager responsible for application-specific content operations
 */
export class ContentManager {
  /**
   * Loads content from a given path
   */
  static async loadContent(contentPath: string): Promise<string> {
    return await ContentService.loadContent(contentPath);
  }
  
  /**
   * Extracts headings from markdown content for table of contents
   */
  static extractHeadings(content: string): { title: string; href: string }[] {
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
