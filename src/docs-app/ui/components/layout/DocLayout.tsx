import React, { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { cn } from "@/shared/lib/utils.ts";
import { Button } from "@/shared/components/button.tsx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/shared/components/sheet.tsx";
import Navigation from "@/docs-app/ui/components/navigation/Navigation.tsx";
import TableOfContents from "@/docs-app/ui/components/navigation/TableOfContents.tsx";
import ApiExamples from "@/docs-app/ui/components/api/ApiExamples.tsx";
import { TocItem, ApiExamplesData } from "@/docs-app/data/types.ts";
import DocSearch from "@/docs-app/ui/components/search/DocSearch.tsx";
import BreadcrumbNavigation from "@/shared/components/BreadcrumbNavigation.tsx";
import { Separator } from "@/shared/components/separator.tsx";
import TopNavigation from "@/shared/components/TopNavigation.tsx";

const DESKTOP_NAVIGATION_QUERY = "(min-width: 1280px)";
const WIDE_DESKTOP_QUERY = "(min-width: 1440px)";
const DESKTOP_NAVIGATION_STORAGE_KEY = "showpass-docs-navigation";
const OVERLAY_NAVIGATION_ID = "docs-navigation-overlay";
const DESKTOP_NAVIGATION_ID = "docs-navigation-desktop";

type DesktopNavigationPreference = "expanded" | "collapsed" | null;

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
};

const getStoredDesktopNavigationPreference = (): DesktopNavigationPreference => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedPreference = window.localStorage.getItem(
      DESKTOP_NAVIGATION_STORAGE_KEY
    );

    return storedPreference === "expanded" || storedPreference === "collapsed"
      ? storedPreference
      : null;
  } catch {
    return null;
  }
};

export interface DocLayoutContextProps {
  tocItems?: TocItem[];
  apiExamplesData?: ApiExamplesData;
  activeSection?: string;
  hideRightSidebar?: boolean;
}

// Define the shape of the context value including the updater function
interface FullDocLayoutContextProps extends DocLayoutContextProps {
  setPageData: React.Dispatch<React.SetStateAction<DocLayoutContextProps>>;
}

export const DocLayoutContext =
  React.createContext<FullDocLayoutContextProps | null>(null);

export const useDocLayoutData = () => {
  const context = React.useContext(DocLayoutContext);
  if (!context) {
    throw new Error(
      "useDocLayoutData must be used within a DocLayoutDataProvider"
    );
  }
  return context;
};

// This Provider will be used ONCE in App.tsx, wrapping DocLayout
export const DocLayoutDataProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [pageData, setPageData] = useState<DocLayoutContextProps>({
    tocItems: [],
    apiExamplesData: undefined,
    activeSection: undefined,
    hideRightSidebar: false,
  });

  return (
    <DocLayoutContext.Provider value={{ ...pageData, setPageData }}>
      {children}
    </DocLayoutContext.Provider>
  );
};

const DocLayout = () => {
  const [overlayNavigationOpen, setOverlayNavigationOpen] = useState(false);
  const [desktopNavigationPreference, setDesktopNavigationPreference] =
    useState<DesktopNavigationPreference>(getStoredDesktopNavigationPreference);
  const overlayNavigationTriggerRef = useRef<HTMLElement | null>(null);
  const layoutContentRef = useRef<HTMLDivElement | null>(null);
  const isDesktop = useMediaQuery(DESKTOP_NAVIGATION_QUERY);
  const isWideDesktop = useMediaQuery(WIDE_DESKTOP_QUERY);
  const location = useLocation();
  const currentPath = location.pathname;
  const desktopNavigationOpen =
    desktopNavigationPreference === null
      ? isWideDesktop
      : desktopNavigationPreference === "expanded";
  const navigationOpen = isDesktop
    ? desktopNavigationOpen
    : overlayNavigationOpen;
  const navigationControlsId = isDesktop
    ? DESKTOP_NAVIGATION_ID
    : OVERLAY_NAVIGATION_ID;

  // Consume the context provided by DocLayoutDataProvider in App.tsx
  const { tocItems, apiExamplesData, activeSection, hideRightSidebar } =
    useDocLayoutData();

  useEffect(() => {
    setOverlayNavigationOpen(false);
  }, [currentPath, isDesktop]);

  useEffect(() => {
    if (!overlayNavigationOpen || isDesktop) {
      return;
    }

    const layoutContent = layoutContentRef.current;
    const layoutWasInert = layoutContent?.inert ?? false;
    const originalBodyOverflow = document.body.style.overflow;

    if (layoutContent) {
      layoutContent.inert = true;
    }
    document.body.style.overflow = "hidden";

    return () => {
      if (layoutContent) {
        layoutContent.inert = layoutWasInert;
      }
      document.body.style.overflow = originalBodyOverflow;
    };
  }, [overlayNavigationOpen, isDesktop]);

  const openOverlayNavigation = () => {
    overlayNavigationTriggerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setOverlayNavigationOpen(true);
  };

  const handleNavigationToggle = () => {
    if (!isDesktop) {
      if (overlayNavigationOpen) {
        setOverlayNavigationOpen(false);
      } else {
        openOverlayNavigation();
      }
      return;
    }

    const nextPreference: DesktopNavigationPreference = desktopNavigationOpen
      ? "collapsed"
      : "expanded";

    setDesktopNavigationPreference(nextPreference);
    try {
      window.localStorage.setItem(
        DESKTOP_NAVIGATION_STORAGE_KEY,
        nextPreference
      );
    } catch {
      // The preference is optional when storage is unavailable.
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation - Consistent across all pages */}
      <TopNavigation
        navigationOpen={navigationOpen}
        navigationControlsId={navigationControlsId}
        onNavigationToggle={handleNavigationToggle}
      />

      <button
        type="button"
        aria-label="Close navigation"
        aria-hidden={!overlayNavigationOpen || isDesktop}
        tabIndex={overlayNavigationOpen && !isDesktop ? 0 : -1}
        onClick={() => setOverlayNavigationOpen(false)}
        className={cn(
          "fixed inset-x-0 bottom-0 top-16 z-40 bg-background/60 backdrop-blur-sm transition-opacity motion-reduce:transition-none",
          overlayNavigationOpen && !isDesktop
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        )}
        style={{ transitionDuration: "180ms" }}
      />
      
      <div
        ref={layoutContentRef}
        className={cn(
          "flex flex-1 flex-col xl:grid xl:transition-[grid-template-columns] xl:ease-out xl:motion-reduce:transition-none",
          desktopNavigationOpen
            ? "xl:grid-cols-[330px_minmax(0,1fr)]"
            : "xl:grid-cols-[0px_minmax(0,1fr)]"
        )}
        style={{ transitionDuration: "180ms" }}
      >
        {/* Mobile Menu Button - Only visible on mobile */}
        <div className="sticky top-16 z-30 flex items-center justify-between border-b bg-background/95 p-4 backdrop-blur md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={openOverlayNavigation}
            className="mr-2"
            aria-expanded={overlayNavigationOpen}
            aria-controls={OVERLAY_NAVIGATION_ID}
          >
            <Menu className="h-5 w-5" />
            <span>Menu</span>
          </Button>
          <div className="flex-1 flex justify-center sm:hidden">
            <DocSearch />
          </div>
        </div>

        {/* Overlay navigation for phones and tablets */}
        <Sheet
          modal={false}
          open={overlayNavigationOpen && !isDesktop}
          onOpenChange={setOverlayNavigationOpen}
        >
          <SheetContent
            id={OVERLAY_NAVIGATION_ID}
            side="left"
            onInteractOutside={(event) => {
              const target = event.target;
              if (
                target instanceof Element &&
                target.closest(`[aria-controls="${OVERLAY_NAVIGATION_ID}"]`)
              ) {
                event.preventDefault();
              }
            }}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              overlayNavigationTriggerRef.current?.focus();
            }}
            className="bottom-0 top-16 flex h-auto w-[min(22rem,calc(100vw-2rem))] max-w-none flex-col gap-0 border-sidebar-border bg-sidebar p-0 shadow-2xl motion-reduce:animate-none sm:max-w-none"
            style={{ animationDuration: "180ms", transitionDuration: "180ms" }}
          >
            <div className="flex h-14 shrink-0 items-center border-b border-sidebar-border px-5 pr-14">
              <SheetTitle className="text-sm text-sidebar-foreground">
                Documentation
              </SheetTitle>
              <SheetDescription className="sr-only">
                Browse the Showpass developer documentation.
              </SheetDescription>
            </div>
            <Navigation
              currentPath={currentPath}
              onNavigate={() => setOverlayNavigationOpen(false)}
            />
          </SheetContent>
        </Sheet>

        {/* Persistent desktop navigation */}
        <aside
          id={DESKTOP_NAVIGATION_ID}
          aria-label="Documentation navigation"
          aria-hidden={!desktopNavigationOpen}
          className={cn(
            "sticky top-16 hidden h-[calc(100vh-4rem)] min-w-0 self-start flex-col overflow-hidden bg-sidebar opacity-0 transition-opacity motion-reduce:transition-none xl:flex",
            desktopNavigationOpen
              ? "visible border-r border-sidebar-border opacity-100"
              : "invisible pointer-events-none border-r-0"
          )}
          style={{ transitionDuration: "180ms" }}
        >
          <Navigation currentPath={currentPath} />
        </aside>

        {/* Main Content & Right Sidebar */}
        <div
          className={cn(
            "flex flex-col min-w-0",
            !hideRightSidebar &&
              "xl:grid xl:grid-cols-[minmax(0,1fr)_auto]"
          )}
        >
          {/* Main Content */}
          <div
            className={cn(
              "px-5 py-8 pt-3 lg:px-10 xl:px-12 prose dark:prose-invert prose-slate prose-pre:overflow-x-auto prose-table:overflow-x-auto",
              hideRightSidebar 
                ? "max-w-none" 
                : apiExamplesData
                  ? "max-w-[1200px] mx-auto xl:mx-0"
                  : "max-w-[820px]"
            )}
          >
            <BreadcrumbNavigation />
            <Outlet />
          </div>

          {/* Right Sidebar - API Examples or Table of Contents */}
          {!hideRightSidebar && (
            <div className={cn(
              "hidden xl:block border-l border-sidebar-border bg-sidebar",
              apiExamplesData ? "w-[600px]" : "w-72"
            )}>
              <div className="sticky top-16 p-6 pt-2 self-start max-h-[calc(100vh-4rem)] overflow-y-auto">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                  <p className="text-sm font-medium text-muted-foreground">
                    {apiExamplesData ? "API Reference" : "On This Page"}
                  </p>
                </div>
                {apiExamplesData ? (
                  <ApiExamples {...apiExamplesData} />
                ) : (
                  tocItems &&
                  tocItems.length > 0 && (
                    <TableOfContents
                      key={currentPath}
                      items={tocItems}
                      activeItem={activeSection}
                    />
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocLayout;
