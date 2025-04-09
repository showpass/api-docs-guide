
/**
 * Type declarations for non-code file imports
 */

// Markdown files import declaration
declare module '*.md' {
  const content: string;
  export default content;
}
