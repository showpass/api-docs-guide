/**
 * Dynamic Theme Styles Component
 * Injects theme-specific CSS for syntax highlighting and API badges
 */

import { useEffect } from 'react';
import { getAllThemes, generateSyntaxCSS, generateBadgeCSS } from './theme-registry';
import { generateWarningBoxCSS, generatePlaygroundNavCSS, generateFeatureBadgeCSS } from './theme-config';

export function ThemeStyles() {
  useEffect(() => {
    const styleId = 'dynamic-theme-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    // Generate CSS for all themes
    const allThemes = getAllThemes();
    const css = allThemes.map(theme => {
      const syntaxCSS = generateSyntaxCSS(theme.id);
      const badgeCSS = generateBadgeCSS(theme.id);
      return `${syntaxCSS}\n\n${badgeCSS}`;
    }).join('\n\n');
    
    // Add all custom CSS
    const warningBoxCSS = generateWarningBoxCSS();
    const playgroundNavCSS = generatePlaygroundNavCSS();
    const featureBadgeCSS = generateFeatureBadgeCSS();
    const finalCSS = `${css}\n\n  /* Warning Box Styles */\n${warningBoxCSS}\n\n  /* Playground Navigation Styles */\n${playgroundNavCSS}\n\n  /* Feature Badge Styles */\n${featureBadgeCSS}`;
    
    styleElement.textContent = finalCSS;
    
    return () => {
      // Cleanup on unmount
      styleElement?.remove();
    };
  }, []);
  
  return null;
}
