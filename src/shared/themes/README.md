# Centralized Theme System

This directory contains the centralized theme configuration for the application. All theme colors, syntax highlighting, and metadata are defined here in TypeScript for type safety and ease of maintenance.

## File Structure

- **theme-types.ts** - TypeScript type definitions for themes
- **theme-config.ts** - Single source of truth for all theme definitions
- **theme-registry.ts** - Theme metadata and utility functions

## How to Add a New Theme

### 1. Define the Theme in `theme-config.ts`

Add a new theme object to the `themes` record:

```typescript
export const themes: Record<string, ThemeDefinition> = {
  // ... existing themes
  
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    colors: {
      background: '...',  // HSL values without hsl() wrapper
      foreground: '...',
      // ... all other color properties
    },
    syntax: {
      keyword: '...',     // HSL values for syntax highlighting
      operator: '...',
      // ... all other syntax properties
    },
  },
};
```

### 2. Add Theme Metadata to `theme-registry.ts`

Register the theme in the `themeRegistry` array:

```typescript
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

// ... rest of file

### 4. Add CSS Variables to `index.css`

Add a new CSS class for your theme:

```css
.sunset {
  --background: [value from theme-config];
  --foreground: [value from theme-config];
  /* ... all other CSS variables */
}

/* Syntax highlighting for sunset theme */
.sunset pre {
  background-color: hsl([prosePreBg from theme-config]) !important;
}

.sunset pre code .token.keyword {
  color: hsl([keyword from theme-config]) !important;
}
/* ... other token rules */
```

## Current Themes

The application includes three nature-inspired themes:

- **Light** ☀️ - Clean, bright theme for daytime use
- **Ocean** 🌊 - Deep blue ocean-inspired theme
- **Forest** 🌲 - Deep forest theme with emerald-teal accents
```

### 4. Add CSS Variables to `index.css`

Add a new CSS class for your theme:

```css
.sunset {
  --background: [value from theme-config];
  --foreground: [value from theme-config];
  /* ... all other CSS variables */
}

/* Syntax highlighting for sunset theme */
.sunset pre {
  background-color: hsl([prosePreBg from theme-config]) !important;
}

.sunset pre code .token.keyword {
  color: hsl([keyword from theme-config]) !important;
}
/* ... other token rules */
```

## Benefits of This System

✅ **Single Source of Truth** - All theme data in one TypeScript file  
✅ **Type Safety** - TypeScript ensures all required properties are defined  
✅ **Easy to Compare** - See all themes side-by-side  
✅ **Simple to Add** - Adding a theme is just adding one object  
✅ **Maintainable** - Change colors in one place, propagate everywhere  
✅ **Extensible** - Easy to add new color properties or syntax tokens  

## Color Format

All colors use HSL format **without** the `hsl()` wrapper:

- ✅ Correct: `'200 50% 50%'`
- ❌ Wrong: `'hsl(200 50% 50%)'`
- ❌ Wrong: `'hsl(200, 50%, 50%)'`

The CSS variables will wrap these with `hsl()` when used.

## Theme Properties

### Required Color Properties

All themes must define these color properties (see `ThemeColors` interface):

- Base: `background`, `foreground`
- Components: `card`, `cardForeground`, `popover`, `popoverForeground`
- Brand: `sitePrimary`, `sitePrimaryForeground`
- States: `secondary`, `muted`, `accent`, `destructive` (with foregrounds)
- Inputs: `border`, `input`, `ring`
- Sidebar: All sidebar-specific colors
- Prose: Typography and code block colors

### Required Syntax Properties

All themes must define these syntax highlighting properties (see `SyntaxColors` interface):

- `keyword`, `operator`, `string`, `function`, `punctuation`
- `plain`, `comment`, `number`, `className`, `property`, `constant`
- Optional: `parameter`

## Example: Complete Theme Definition

```typescript
myTheme: {
  id: 'my-theme',
  name: 'My Theme',
  colors: {
    background: '210 20% 98%',
    foreground: '222 84% 5%',
    card: '0 0% 100%',
    cardForeground: '222 84% 5%',
    popover: '0 0% 100%',
    popoverForeground: '222 84% 5%',
    sitePrimary: '186 55% 31%',
    sitePrimaryForeground: '210 40% 98%',
    // ... etc
  },
  syntax: {
    keyword: '168 85% 65%',
    operator: '175 75% 68%',
    string: '142 70% 65%',
    // ... etc
  },
}
```
