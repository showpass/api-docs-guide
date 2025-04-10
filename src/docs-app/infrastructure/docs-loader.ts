
/**
 * Loads Markdown docs from statically imported files.
 * Used by ContentManager to decouple content source logic.
 */

export interface IDocsLoader {
  loadContent(contentPath: string): Promise<string>;
}

export class DocsLoader implements IDocsLoader {
  // Dynamically built content map using Vite's import.meta.glob
  private static contentMap: Record<string, string> = DocsLoader.initializeContentMap();

  private static initializeContentMap(): Record<string, string> {
    // Use Vite's import.meta.glob to dynamically import all markdown files
    const modules = import.meta.glob('../data/**/*.md', { eager: true, as: 'raw' });
    const map: Record<string, string> = {};
    const basePath = '../data';

    for (const path in modules) {
      // Normalize path from '../data/api/events.md' to '/api/events.md'
      let normalized = path.substring(basePath.length);
      // Ensure leading slash
      if (!normalized.startsWith('/')) {
        normalized = '/' + normalized;
      }
      map[normalized] = modules[path] as string;
    }

    return map;
  }

  /**
   * Returns markdown content for a given relative path.
   * If not found, returns a fallback error message.
   */
  async loadContent(relativePath: string): Promise<string> {
    try {
      // Normalizes the path for consistency
      const normalizedPath = relativePath.startsWith('/')
          ? relativePath
          : `/${relativePath}`;

      const content = DocsLoader.contentMap[normalizedPath];

      if (content) {
        return content;
      }

      console.error(`Content not found: ${relativePath}`);
      return `# Content Not Found\n\nSorry, the requested content at \`${relativePath}\` could not be found.\n\nPlease check the path and try again.`;
    } catch (error) {
      console.error(`Error loading content: ${error}`);
      throw error;
    }
  }
}

// Default export for better module compatibility
export default DocsLoader;
