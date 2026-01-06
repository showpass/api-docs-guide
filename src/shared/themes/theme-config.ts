/**
 * Centralized Theme Configuration
 * All theme colors and syntax highlighting in one place
 */

import { ThemeDefinition } from './theme-types';

export const themes: Record<string, ThemeDefinition> = {
  light: {
    id: 'light',
    name: 'Light',
    colors: {
      background: '210 20% 98%',
      foreground: '222.2 84% 4.9%',
      card: '0 0% 100%',
      cardForeground: '222.2 84% 4.9%',
      popover: '0 0% 100%',
      popoverForeground: '222.2 84% 4.9%',
      sitePrimary: '186 55% 31%',
      sitePrimaryForeground: '210 40% 98%',
      secondary: '210 40% 96.1%',
      secondaryForeground: '222.2 47.4% 11.2%',
      muted: '210 40% 96.1%',
      mutedForeground: '215 20% 50%',
      accent: '210 40% 96.1%',
      accentForeground: '222.2 47.4% 11.2%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '210 40% 98%',
      success: '142 76% 36%',
      successForeground: '210 40% 98%',
      warning: '38 92% 50%',
      warningForeground: '222.2 84% 4.9%',
      error: '0 84.2% 60.2%',
      errorForeground: '210 40% 98%',
      border: '214.3 31.8% 91.4%',
      input: '214.3 31.8% 91.4%',
      ring: '186 55% 31%',
      sidebarBackground: '210 20% 98%',
      sidebarForeground: '222.2 84% 4.9%',
      sidebarPrimary: '186 55% 31%',
      sidebarPrimaryForeground: '210 40% 98%',
      sidebarAccent: '210 40% 96.1%',
      sidebarAccentForeground: '222.2 47.4% 11.2%',
      sidebarBorder: '214.3 31.8% 88%',
      sidebarRing: '186 55% 31%',
      proseBody: '222.2 84% 4.9%',
      proseHeadings: '222.2 84% 4.9%',
      proseLinks: '186 55% 31%',
      proseCodeFg: '0 0% 15%',
      proseCodeBg: '0 0% 90%',
      prosePreBg: '0 0% 96%',
      warningBox: '38 92% 50%',
      warningBoxForeground: '38 92% 40%',
      warningBoxBackground: '38 92% 50% / 0.1',
      warningBoxBorder: '38 92% 50% / 0.2',
      playgroundNav: '217 91% 60%',
      playgroundNavForeground: '0 0% 100%',
      playgroundNavHover: '217 91% 65%',
      featureBadgeBackground: '210 40% 96.1% / 0.5',
      featureBadgeForeground: '215 20% 50%',
      featureBadgeBorder: '214.3 31.8% 91.4% / 0.5',
    },
    syntax: {
      keyword: '220 90% 45%',      // Deep blue for keywords
      operator: '200 80% 40%',     // Medium blue for operators
      string: '120 60% 35%',       // Forest green for strings
      function: '280 65% 50%',     // Purple for functions
      punctuation: '0 0% 40%',     // Dark grey for punctuation
      plain: '0 0% 20%',           // Near black for plain text
      comment: '0 0% 55%',         // Medium grey for comments
      number: '15 80% 45%',        // Orange for numbers
      className: '260 60% 50%',    // Purple-blue for classes
      property: '180 60% 35%',     // Cyan for properties
      constant: '25 80% 45%',      // Warm orange for constants
    },
    badges: {
      GET: {
        bg: '217 91% 60% / 0.1',
        text: '217 91% 45%',
        border: '217 91% 60% / 0.2',
      },
      POST: {
        bg: '142 76% 36% / 0.1',
        text: '142 76% 30%',
        border: '142 76% 36% / 0.2',
      },
      PUT: {
        bg: '38 92% 50% / 0.1',
        text: '38 92% 40%',
        border: '38 92% 50% / 0.2',
      },
      PATCH: {
        bg: '25 95% 53% / 0.1',
        text: '25 95% 43%',
        border: '25 95% 53% / 0.2',
      },
      DELETE: {
        bg: '0 72% 51% / 0.1',
        text: '0 72% 41%',
        border: '0 72% 51% / 0.2',
      },
    },
  },
  
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      background: '222 47% 11%',
      foreground: '0 0% 98%',
      card: '222 47% 14%',
      cardForeground: '0 0% 98%',
      popover: '222 47% 14%',
      popoverForeground: '0 0% 98%',
      sitePrimary: '186 55% 35%',
      sitePrimaryForeground: '0 0% 98%',
      secondary: '217 33% 17%',
      secondaryForeground: '0 0% 98%',
      muted: '217 33% 17%',
      mutedForeground: '215 18% 70%',
      accent: '183 62% 30%',
      accentForeground: '0 0% 98%',
      destructive: '0 60% 50%',
      destructiveForeground: '0 0% 98%',
      success: '142 70% 45%',
      successForeground: '0 0% 98%',
      warning: '45 90% 55%',
      warningForeground: '222 47% 11%',
      error: '0 70% 55%',
      errorForeground: '0 0% 98%',
      border: '217 33% 17%',
      input: '217 33% 17%',
      ring: '186 55% 35%',
      sidebarBackground: '222 47% 13%',
      sidebarForeground: '0 0% 98%',
      sidebarPrimary: '186 55% 35%',
      sidebarPrimaryForeground: '0 0% 98%',
      sidebarAccent: '183 62% 30%',
      sidebarAccentForeground: '0 0% 98%',
      sidebarBorder: '217 33% 17%',
      sidebarRing: '186 55% 35%',
      proseBody: '0 0% 98%',
      proseHeadings: '0 0% 98%',
      proseLinks: '186 55% 35%',
      proseCodeFg: '190 25% 88%',
      proseCodeBg: '210 70% 11%',
      prosePreBg: '210 65% 8%',
      warningBox: '45 90% 55%',
      warningBoxForeground: '45 90% 70%',
      warningBoxBackground: '45 90% 55% / 0.15',
      warningBoxBorder: '45 90% 55% / 0.25',
      playgroundNav: '190 80% 50%',
      playgroundNavForeground: '222 47% 11%',
      playgroundNavHover: '190 80% 55%',
      featureBadgeBackground: '200 20% 25% / 0.5',
      featureBadgeForeground: '195 18% 62%',
      featureBadgeBorder: '200 18% 35% / 0.4',
    },
    syntax: {
      keyword: '190 85% 60%',        // Bright cyan for keywords (distinct from forest)
      operator: '200 70% 65%',       // Sky blue for operators
      string: '160 75% 55%',         // Aqua green for strings (more blue than forest)
      function: '45 100% 65%',       // Bright yellow for functions
      punctuation: '195 20% 70%',    // Light blue-grey for punctuation
      plain: '190 25% 88%',          // Slightly blue-tinted white for plain text
      comment: '200 18% 50%',        // Blue-grey for comments
      number: '30 95% 62%',          // Orange-amber for numbers
      className: '210 80% 65%',      // Blue for classes
      property: '175 70% 60%',       // Teal for properties
      constant: '35 90% 65%',        // Warm orange for constants
      parameter: '190 25% 88%',      // Same as plain
      import: '280 70% 65%',         // Purple for imports
      decorator: '320 75% 60%',      // Pink-purple for decorators
      type: '210 80% 65%',           // Blue for types
      tag: '190 85% 60%',            // Same as keyword
      attribute: '175 70% 60%',      // Same as property
    },
    badges: {
      GET: {
        bg: '190 80% 50% / 0.15',
        text: '190 80% 70%',
        border: '190 80% 50% / 0.3',
      },
      POST: {
        bg: '190 80% 50% / 0.15',
        text: '190 80% 70%',
        border: '190 80% 50% / 0.3',
      },
      PUT: {
        bg: '45 90% 55% / 0.15',
        text: '45 90% 70%',
        border: '45 90% 55% / 0.3',
      },
      PATCH: {
        bg: '30 85% 55% / 0.15',
        text: '30 85% 70%',
        border: '30 85% 55% / 0.3',
      },
      DELETE: {
        bg: '0 70% 55% / 0.15',
        text: '0 70% 70%',
        border: '0 70% 55% / 0.3',
      },
    },
  },
  
  forest: {
    id: 'forest',
    name: 'Forest',
    colors: {
      background: '200 25% 12%',
      foreground: '180 10% 95%',
      card: '200 25% 15%',
      cardForeground: '180 10% 95%',
      popover: '200 25% 15%',
      popoverForeground: '180 10% 95%',
      sitePrimary: '168 76% 42%',
      sitePrimaryForeground: '180 20% 98%',
      secondary: '200 20% 20%',
      secondaryForeground: '180 10% 95%',
      muted: '200 20% 20%',
      mutedForeground: '180 15% 68%',
      accent: '168 76% 36%',
      accentForeground: '180 10% 98%',
      destructive: '0 60% 50%',
      destructiveForeground: '0 0% 98%',
      success: '142 70% 50%',
      successForeground: '180 10% 95%',
      warning: '50 85% 55%',
      warningForeground: '200 25% 12%',
      error: '0 65% 50%',
      errorForeground: '180 10% 95%',
      border: '200 20% 20%',
      input: '200 20% 20%',
      ring: '168 76% 42%',
      sidebarBackground: '200 25% 14%',
      sidebarForeground: '180 10% 95%',
      sidebarPrimary: '168 76% 42%',
      sidebarPrimaryForeground: '180 20% 98%',
      sidebarAccent: '168 76% 36%',
      sidebarAccentForeground: '180 10% 98%',
      sidebarBorder: '200 20% 20%',
      sidebarRing: '168 76% 42%',
      proseBody: '180 10% 95%',
      proseHeadings: '180 10% 95%',
      proseLinks: '168 76% 42%',
      proseCodeFg: '180 10% 95%',
      proseCodeBg: '200 20% 20%',
      prosePreBg: '200 28% 10%',
      warningBox: '50 85% 55%',
      warningBoxForeground: '50 90% 70%',
      warningBoxBackground: '50 85% 55% / 0.15',
      warningBoxBorder: '50 85% 55% / 0.25',
      playgroundNav: '168 76% 42%',
      playgroundNavForeground: '180 20% 98%',
      playgroundNavHover: '168 76% 48%',
      featureBadgeBackground: '180 15% 24% / 0.5',
      featureBadgeForeground: '175 15% 60%',
      featureBadgeBorder: '180 14% 32% / 0.4',
    },
    syntax: {
      keyword: '168 85% 58%',        // Emerald green for keywords
      operator: '145 65% 60%',       // Green for operators
      string: '142 70% 55%',         // Forest green for strings
      function: '50 85% 60%',        // Muted yellow for functions
      punctuation: '150 15% 65%',    // Grey-green for punctuation
      plain: '155 20% 85%',          // Green-tinted white for plain text
      comment: '150 15% 48%',        // Muted green for comments
      number: '35 85% 62%',          // Orange for numbers
      className: '168 75% 62%',      // Teal-green for classes
      property: '160 70% 58%',       // Aqua-green for properties
      constant: '38 85% 62%',        // Warm orange for constants
      import: '280 60% 60%',         // Purple for imports
      decorator: '310 65% 58%',      // Pink for decorators
      type: '168 75% 62%',           // Same as className
      tag: '168 85% 58%',            // Same as keyword
      attribute: '160 70% 58%',      // Same as property
    },
    badges: {
      GET: {
        bg: '168 76% 42% / 0.15',
        text: '168 76% 60%',
        border: '168 76% 42% / 0.3',
      },
      POST: {
        bg: '155 65% 45% / 0.15',
        text: '155 65% 60%',
        border: '155 65% 45% / 0.3',
      },
      PUT: {
        bg: '50 90% 55% / 0.15',
        text: '50 90% 70%',
        border: '50 90% 55% / 0.3',
      },
      PATCH: {
        bg: '35 85% 55% / 0.15',
        text: '35 85% 70%',
        border: '35 85% 55% / 0.3',
      },
      DELETE: {
        bg: '0 65% 50% / 0.15',
        text: '0 65% 65%',
        border: '0 65% 50% / 0.3',
      },
    },
  },
};

export const defaultTheme = 'light';

/**
 * Generate warning box CSS classes for all themes
 */
export function generateWarningBoxCSS(): string {
  return Object.entries(themes).map(([themeId, theme]) => {
    const className = themeId === 'light' ? '' : `.${themeId}`;
    return `  ${className} .warning-box {
    color: hsl(${theme.colors.warningBoxForeground});
    background-color: hsl(${theme.colors.warningBoxBackground});
    border-color: hsl(${theme.colors.warningBoxBorder});
  }`;
  }).join('\n\n');
}

/**
 * Generate playground navigation CSS classes for all themes
 */
export function generatePlaygroundNavCSS(): string {
  return Object.entries(themes).map(([themeId, theme]) => {
    const className = themeId === 'light' ? '' : `.${themeId}`;
    return `  ${className} .playground-nav-active {
    background-color: hsl(${theme.colors.playgroundNav});
    color: hsl(${theme.colors.playgroundNavForeground});
  }
  
  ${className} .playground-nav-active:hover {
    background-color: hsl(${theme.colors.playgroundNavHover});
  }`;
  }).join('\n\n');
}

/**
 * Generate feature badge CSS classes for all themes
 */
export function generateFeatureBadgeCSS(): string {
  return Object.entries(themes).map(([themeId, theme]) => {
    const className = themeId === 'light' ? '' : `.${themeId}`;
    return `  ${className} .feature-badge {
    background-color: hsl(${theme.colors.featureBadgeBackground});
    color: hsl(${theme.colors.featureBadgeForeground});
    border-color: hsl(${theme.colors.featureBadgeBorder});
  }`;
  }).join('\n\n');
}
