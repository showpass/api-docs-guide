
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// API Reference Pages
import PublicEventAPI from "./pages/api/events";
import EventListPage from "./pages/api/event-list";
import QueryEventPage from "./pages/api/query-event";

// SDK Pages
import GettingStarted from "./pages/sdk/getting-started";
import TicketSelectionPage from "./pages/sdk/ticket-selection";
import ProductSelectionPage from "./pages/sdk/product-selection";
import ShoppingCartPage from "./pages/sdk/shopping-cart";
import CheckOutPage from "./pages/sdk/check-out";
import LoginWidgetPage from "./pages/sdk/login";
import CalendarWidgetPage from "./pages/sdk/calendar";
import CartCounterPage from "./pages/sdk/cart-counter";

// Advanced Pages
import GoogleAnalyticsPage from "./pages/advanced/google-analytics";
import WebhooksPage from "./pages/advanced/webhooks";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Introduction Routes */}
          <Route path="/" element={<Index />} />
          
          {/* API Reference Routes */}
          <Route path="/api/events" element={<PublicEventAPI />} />
          <Route path="/api/event-list" element={<EventListPage />} />
          <Route path="/api/query-event" element={<QueryEventPage />} />
          
          {/* SDK Routes */}
          <Route path="/sdk/getting-started" element={<GettingStarted />} />
          <Route path="/sdk/ticket-selection" element={<TicketSelectionPage />} />
          <Route path="/sdk/product-selection" element={<ProductSelectionPage />} />
          <Route path="/sdk/shopping-cart" element={<ShoppingCartPage />} />
          <Route path="/sdk/check-out" element={<CheckOutPage />} />
          <Route path="/sdk/login" element={<LoginWidgetPage />} />
          <Route path="/sdk/calendar" element={<CalendarWidgetPage />} />
          <Route path="/sdk/cart-counter" element={<CartCounterPage />} />
          
          {/* Advanced Routes */}
          <Route path="/advanced/google-analytics" element={<GoogleAnalyticsPage />} />
          <Route path="/advanced/webhooks" element={<WebhooksPage />} />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
