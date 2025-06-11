import { ThemeProvider } from "next-themes";
import { Toaster } from "./shared/components/toaster";
import { Toaster as Sonner } from "./shared/components/sonner";
import { TooltipProvider } from "./shared/components/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout and Pages
// Import DocLayout directly. DocLayoutDataProvider will be used by child page components.
import DocLayout, {
  DocLayoutDataProvider,
} from "./docs-app/ui/components/layout/DocLayout.tsx";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DynamicDocPage from "./docs-app/ui/components/DynamicDocPage";
import WidgetPlayground from "./pages/WidgetPlayground";

const queryClient = new QueryClient();
const basename = "/";

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={basename}>
          <Routes>
            {/* DocLayout is the parent layout route component */}
            <Route
              element={
                // Parent route that provides the layout and context
                <DocLayoutDataProvider>
                  {" "}
                  {/* Provider sets up the context and state */}
                  <DocLayout />{" "}
                  {/* Layout consumes context and renders Outlet */}
                </DocLayoutDataProvider>
              }
            >
              {/* Child routes - their elements will render in DocLayout's Outlet */}
              {/* These children will use a hook to update the context data */}
              <Route path="/" element={<Index />} />
              <Route
                path="/api/:slug"
                element={<DynamicDocPage section="api" />}
              />
              <Route
                path="/sdk/:slug"
                element={<DynamicDocPage section="sdk" />}
              />
              <Route
                path="/webhooks/:slug"
                element={<DynamicDocPage section="webhooks" />}
              />
              <Route
                path="/google-tag-manager/:slug"
                element={<DynamicDocPage section="google-tag-manager" />}
              />
              <Route
                path="/facebook/:slug"
                element={<DynamicDocPage section="facebook" />}
              />
              <Route path="/widget-playground" element={<WidgetPlayground />} />
              <Route
                path="/wordpress/:slug"
                element={<DynamicDocPage section="wordpress" />}
              />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
