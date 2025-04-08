
/**
 * Content service responsible for loading content from static files
 * This version loads content statically at build time
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

export class ContentService {
  // Map of path to static content
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
   * Loads markdown content from static imports (loaded during build time)
   */
  static async loadContent(relativePath: string): Promise<string> {
    try {
      // Normalize the path for consistency
      const normalizedPath = relativePath.startsWith('/')
        ? relativePath
        : `/${relativePath}`;

      // Get the content from our static map
      const content = this.contentMap[normalizedPath];

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
