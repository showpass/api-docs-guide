/**
 * Utility functions for consistent heading ID generation and extraction
 * across the documentation system.
 */

/**
 * Generates a URL-safe ID from heading text.
 * Converts text to lowercase, removes special characters, and creates kebab-case format.
 * 
 * @param text - The heading text to convert
 * @returns A URL-safe string suitable for use as an HTML ID
 * 
 * @example
 * generateHeadingId("Getting Started Guide") // returns "getting-started-guide"
 * generateHeadingId("API Reference (v2.0)") // returns "api-reference-v20"
 */
export const generateHeadingId = (text: string): string => {
  const result = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters except word chars, spaces, hyphens
    .replace(/[\s_-]+/g, "-") // Replace spaces/underscores/multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  
  return result;
};

/**
 * Extracts heading information from markdown content.
 * Processes H2, H3, and H4 headings to create table of contents data.
 * 
 * @param content - Raw markdown content
 * @returns Array of heading objects with title, href, and level information
 */
export const extractHeadingsFromMarkdown = (content: string): { title: string; href: string; level: number }[] => {
  const headings: { title: string; href: string; level: number }[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    // Match H2 (##), H3 (###), and H4 (####) headings with content
    const match = line.match(/^(#{2,4})\s+(.+)$/);
    if (match && match[2] && match[2].trim()) {
      const level = match[1].length; // 2, 3, or 4
      const title = match[2].trim();
      const id = generateHeadingId(title);
      
      // Only include headings that generate valid IDs
      if (id) {
        const href = `#${id}`;
        headings.push({ title, href, level });
      }
    }
  }

  return headings;
};