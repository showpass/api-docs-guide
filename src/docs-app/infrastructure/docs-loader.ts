
/**
 * Loads Markdown docs from statically imported files.
 * Used by ContentManager to decouple content source logic.
 */

import sdkProductSelection from '../data/sdk/product-selection.md';
import sdkTicketSelection from '../data/sdk/ticket-selection.md';
import sdkLogin from '../data/sdk/login.md';
import sdkCheckOut from '../data/sdk/check-out.md';
import sdkCartCounter from '../data/sdk/cart-counter.md';
import sdkShoppingCart from '../data/sdk/shopping-cart.md';
import sdkGettingStarted from '../data/sdk/getting-started.md';
import sdkCalendar from '../data/sdk/calendar.md';
import sdkEmbeddedCalendar from '../data/sdk/embedded-calendar.md';
import apiEvents from '../data/api/events.md';
import apiEventList from '../data/api/event-list.md';
import apiQueryEvent from '../data/api/query-event.md';
import advancedGoogleAnalytics from '../data/advanced/google-analytics.md';
import advancedWebhooks from '../data/advanced/webhooks.md';

export interface IDocsLoader {
  loadContent(contentPath: string): Promise<string>;
}

export class DocsLoader implements IDocsLoader {
  // Maps relative paths to statically imported content
  private static contentMap: Record<string, string> = {
    // SDK content
    '/sdk/product-selection.md': sdkProductSelection,
    '/sdk/ticket-selection.md': sdkTicketSelection,
    '/sdk/login.md': sdkLogin,
    '/sdk/check-out.md': sdkCheckOut,
    '/sdk/cart-counter.md': sdkCartCounter,
    '/sdk/shopping-cart.md': sdkShoppingCart,
    '/sdk/getting-started.md': sdkGettingStarted,
    '/sdk/calendar.md': sdkCalendar,
    '/sdk/embedded-calendar.md': sdkEmbeddedCalendar,

    // API content
    '/api/events.md': apiEvents,
    '/api/event-list.md': apiEventList,
    '/api/query-event.md': apiQueryEvent,

    // Advanced content
    '/advanced/google-analytics.md': advancedGoogleAnalytics,
    '/advanced/webhooks.md': advancedWebhooks
  };

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
