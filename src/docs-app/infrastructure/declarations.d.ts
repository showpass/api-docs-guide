// Enables importing .md files as raw strings in TypeScript

declare module '*.md' {
  const content: string;
  export default content;
}
