/**
 * Theme Registry and Utilities
 * Provides access to theme metadata and helper functions
 */

import { ThemeMetadata } from './theme-types';
import { themes } from './theme-config';

export const themeRegistry: ThemeMetadata[] = [
  {
    id: 'light',
    name: 'Light',
    description: 'Clean, bright theme for daytime use',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep blue ocean-inspired theme',
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Deep forest theme with emerald-teal accents',
  },
];

export function getTheme(id: string) {
  return themes[id];
}

export function getAllThemes() {
  return themeRegistry;
}

export function isValidTheme(id: string): boolean {
  return id in themes;
}

/**
 * Generate CSS custom properties for a theme
 */
export function generateThemeCSS(themeId: string): string {
  const theme = themes[themeId];
  if (!theme) return '';
  
  const colorVars = Object.entries(theme.colors)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `    --${cssKey}: ${value};`;
    })
    .join('\n');
  
  return colorVars;
}

/**
 * Generate syntax highlighting CSS for a theme
 */
export function generateSyntaxCSS(themeId: string): string {
  const theme = themes[themeId];
  if (!theme) return '';
  
  const className = themeId === 'light' ? '' : `.${themeId}`;
  
  const rules: string[] = [
    `  /* ${theme.name} theme code blocks */`,
    `  ${className} pre {`,
    `    background-color: hsl(${theme.colors.prosePreBg}) !important;`,
    `  }`,
    ``,
    `  /* ${theme.name} theme syntax highlighting */`,
  ];
  
  const tokenRules = Object.entries(theme.syntax).map(([token, color]) => {
    const selectors: string[] = [];
    
    switch (token) {
      case 'keyword':
        selectors.push('.token.keyword');
        break;
      case 'operator':
        selectors.push('.token.operator');
        break;
      case 'string':
        selectors.push('.token.string');
        break;
      case 'function':
        selectors.push('.token.function', '.token.method');
        break;
      case 'punctuation':
        selectors.push('.token.punctuation');
        break;
      case 'plain':
        selectors.push('.token.plain');
        break;
      case 'comment':
        selectors.push('.token.comment');
        break;
      case 'number':
        selectors.push('.token.number', '.token.boolean');
        break;
      case 'className':
        selectors.push('.token.class-name', '.token.builtin');
        break;
      case 'property':
        selectors.push('.token.property', '.token.attr-name');
        break;
      case 'constant':
        selectors.push('.token.constant');
        break;
      case 'parameter':
        if (color) selectors.push('.token.parameter');
        break;
    }
    
    if (selectors.length === 0) return '';
    
    const selectorStr = selectors.map(s => `${className} pre code ${s}`).join(',\n  ');
    let rule = `  ${selectorStr} {\n    color: hsl(${color}) !important;`;
    
    if (token === 'comment') {
      rule += '\n    font-style: italic;';
    }
    
    rule += '\n  }';
    
    return rule;
  }).filter(Boolean);
  
  return [...rules, ...tokenRules].join('\n');
}
