
/**
 * Custom Vite plugin to import markdown files as modules during build time
 */
import { Plugin } from 'vite';
import fs from 'fs';

// Define the plugin function
export function markdownImport(): Plugin {
  return {
    name: 'vite-plugin-md-import',
    transform(code: string, id: string) {
      // Only process .md files
      if (!id.endsWith('.md')) {
        return null;
      }

      // Read the markdown file content during build time
      const content = fs.readFileSync(id, 'utf-8');
      
      // Export as a JS module that provides the content as a string
      return `export default ${JSON.stringify(content)};`;
    },
    configureServer(server) {
      // Add watcher for markdown files
      server.watcher.add('**/*.md');
    }
  };
}

// Default export for better module compatibility
export default markdownImport;
