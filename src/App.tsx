import { ThemeProvider } from "next-themes";
import { Toaster } from "./shared/components/toaster";
import { Toaster as Sonner } from "./shared/components/sonner";
import { TooltipProvider } from "./shared/components/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DynamicDocPage from "./docs-app/ui/components/DynamicDocPage";
import WidgetPlayground from "./pages/WidgetPlayground";

const queryClient = new QueryClient();
const basename =
  import.meta.env.MODE === "production" ? "/api-docs-guide" : "/";

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={basename}>
          <Routes>
            {/* Introduction Routes */}
            <Route path="/" element={<Index />} />

            {/* Dynamic API Reference Routes */}
            <Route
              path="/api/:slug"
              element={<DynamicDocPage section="api" />}
            />

            {/* Dynamic SDK Routes */}
            <Route
              path="/sdk/:slug"
              element={<DynamicDocPage section="sdk" />}
            />

            {/* Dynamic Webhook Routes */}
            <Route
              path="/webhooks/:slug"
              element={<DynamicDocPage section="webhooks" />}
            />

            {/* Widget Playground Route */}
            <Route path="/widgets" element={<WidgetPlayground />} />

            {/* Dynamic Wordpress Routes */}
            <Route
              path="/wordpress/:slug"
              element={<DynamicDocPage section="wordpress" />}
            />

            {/* Dynamic Webhook Routes */}
            <Route
              path="/google-tag-manager/:slug"
              element={<DynamicDocPage section="google-tag-manager" />}
            />

            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
