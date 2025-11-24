/**
 * Theme System Type Definitions
 * Single source of truth for theme structure
 */

export interface ThemeColors {
  // Base colors
  background: string;
  foreground: string;
  
  // Component colors
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  
  // Brand colors
  sitePrimary: string;
  sitePrimaryForeground: string;
  
  // UI states
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  
  // Borders and inputs
  border: string;
  input: string;
  ring: string;
  
  // Sidebar specific
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
  
  // Typography/prose colors
  proseBody: string;
  proseHeadings: string;
  proseLinks: string;
  proseCodeFg: string;
  proseCodeBg: string;
  prosePreBg: string;
}

export interface SyntaxColors {
  keyword: string;
  operator: string;
  string: string;
  function: string;
  punctuation: string;
  plain: string;
  comment: string;
  number: string;
  className: string;
  property: string;
  constant: string;
  parameter?: string;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  colors: ThemeColors;
  syntax: SyntaxColors;
}

export interface ThemeMetadata {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}
