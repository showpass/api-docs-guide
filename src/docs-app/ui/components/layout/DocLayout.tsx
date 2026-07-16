import React, { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Braces, ListTree } from "lucide-react";
import { cn } from "@/shared/lib/utils.ts";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/shared/components/sheet.tsx";
import Navigation from "@/docs-app/ui/components/navigation/Navigation.tsx";
import PageTools from "@/docs-app/ui/components/layout/PageTools.tsx";
import type { TocItem, ApiExamplesData } from "@/docs-app/data/types.ts";
import DocSearch from "@/docs-app/ui/components/search/DocSearch.tsx";
import BreadcrumbNavigation from "@/shared/components/BreadcrumbNavigation.tsx";
import TopNavigation from "@/shared/components/TopNavigation.tsx";

const PERSISTENT_NAVIGATION_QUERY = "(min-width: 1536px)";
const PERSISTENT_PAGE_TOOLS_QUERY = "(min-width: 1280px)";
const OVERLAY_NAVIGATION_ID = "docs-navigation-overlay";
const PAGE_TOOLS_ID = "docs-page-tools";

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
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

export interface DocLayoutContextProps {
  tocItems?: TocItem[];
  apiExamplesData?: ApiExamplesData;
  activeSection?: string;
  hideRightSidebar?: boolean;
  pageTitle?: string;
}

interface FullDocLayoutContextProps extends DocLayoutContextProps {
  setPageData: React.Dispatch<React.SetStateAction<DocLayoutContextProps>>;
}

export const DocLayoutContext =
  React.createContext<FullDocLayoutContextProps | null>(null);

export const useDocLayoutData = () => {
  const context = React.useContext(DocLayoutContext);
  if (!context) {
    throw new Error(
      "useDocLayoutData must be used within a DocLayoutDataProvider",
    );
  }
  return context;
};

export const DocLayoutDataProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [pageData, setPageData] = useState<DocLayoutContextProps>({
    tocItems: [],
    apiExamplesData: undefined,
    activeSection: undefined,
    hideRightSidebar: false,
    pageTitle: undefined,
  });

  return (
    <DocLayoutContext.Provider value={{ ...pageData, setPageData }}>
      {children}
    </DocLayoutContext.Provider>
  );
};

const DocLayout = () => {
  const [overlayNavigationOpen, setOverlayNavigationOpen] = useState(false);
  const [pageToolsOpen, setPageToolsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const overlayNavigationTriggerRef = useRef<HTMLElement | null>(null);
  const pageToolsTriggerRef = useRef<HTMLElement | null>(null);
  const layoutContentRef = useRef<HTMLDivElement | null>(null);
  const hasPersistentNavigation = useMediaQuery(PERSISTENT_NAVIGATION_QUERY);
  const hasPersistentPageTools = useMediaQuery(PERSISTENT_PAGE_TOOLS_QUERY);
  const location = useLocation();
  const currentPath = location.pathname;
  const normalizedPath =
    currentPath === "/" ? currentPath : currentPath.replace(/\/+$/, "");
  const isHomepage = normalizedPath === "/";
  const isWideCanvas = normalizedPath === "/widget-playground";

  const {
    tocItems,
    apiExamplesData,
    activeSection,
    hideRightSidebar,
    pageTitle,
  } = useDocLayoutData();
  const hasPageTools =
    !hideRightSidebar &&
    Boolean(apiExamplesData || (tocItems && tocItems.length > 0));
  const spansWorkspace = isWideCanvas || !hasPageTools;
  const pageToolsLabel = apiExamplesData ? "Examples" : "On this page";
  const pageToolsHeading = apiExamplesData ? "API reference" : "On this page";

  useEffect(() => {
    setOverlayNavigationOpen(false);
    setPageToolsOpen(false);
    setSearchOpen(false);
  }, [currentPath, hasPersistentNavigation, hasPersistentPageTools]);

  useEffect(() => {
    if (!overlayNavigationOpen || hasPersistentNavigation) {
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
  }, [overlayNavigationOpen, hasPersistentNavigation]);

  const rememberTrigger = (ref: React.MutableRefObject<HTMLElement | null>) => {
    ref.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
  };

  const openOverlayNavigation = () => {
    rememberTrigger(overlayNavigationTriggerRef);
    setOverlayNavigationOpen(true);
  };

  const handleOverlayNavigationToggle = () => {
    if (overlayNavigationOpen) {
      setOverlayNavigationOpen(false);
    } else {
      openOverlayNavigation();
    }
  };

  const handlePageToolsToggle = () => {
    if (pageToolsOpen) {
      setPageToolsOpen(false);
      return;
    }

    rememberTrigger(pageToolsTriggerRef);
    setPageToolsOpen(true);
  };

  return (
    <div className="flex min-h-screen min-w-0 flex-col">
      <TopNavigation
        navigationOpen={overlayNavigationOpen}
        navigationControlsId={OVERLAY_NAVIGATION_ID}
        onNavigationToggle={handleOverlayNavigationToggle}
        showNavigationToggle={!hasPersistentNavigation}
        pageToolsOpen={pageToolsOpen}
        pageToolsControlsId={PAGE_TOOLS_ID}
        pageToolsLabel={pageToolsLabel}
        pageToolsKind={apiExamplesData ? "examples" : "outline"}
        onPageToolsToggle={handlePageToolsToggle}
        showPageTools={hasPageTools && !hasPersistentPageTools}
        searchOpen={searchOpen}
        onSearchOpen={() => setSearchOpen(true)}
      />
      <DocSearch open={searchOpen} onOpenChange={setSearchOpen} />

      <div
        aria-hidden="true"
        onClick={() => setOverlayNavigationOpen(false)}
        className={cn(
          "fixed inset-x-0 bottom-0 top-16 z-40 bg-background/60 backdrop-blur-sm transition-opacity motion-reduce:transition-none",
          overlayNavigationOpen && !hasPersistentNavigation
            ? "opacity-100"
            : "pointer-events-none opacity-0",
        )}
        style={{ transitionDuration: "180ms" }}
      />

      <div
        ref={layoutContentRef}
        className="grid min-w-0 flex-1 grid-cols-1 2xl:grid-cols-[304px_minmax(0,1fr)]"
      >
        <Sheet
          modal={false}
          open={overlayNavigationOpen && !hasPersistentNavigation}
          onOpenChange={setOverlayNavigationOpen}
        >
          <SheetContent
            id={OVERLAY_NAVIGATION_ID}
            side="left"
            showOverlay={false}
            closeButtonClassName="right-2 top-2 inline-flex h-10 w-10 items-center justify-center rounded-md"
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

        <Sheet
          open={pageToolsOpen && hasPageTools && !hasPersistentPageTools}
          onOpenChange={setPageToolsOpen}
        >
          <SheetContent
            id={PAGE_TOOLS_ID}
            side="right"
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              pageToolsTriggerRef.current?.focus();
            }}
            className={cn(
              "flex max-w-none flex-col gap-0 bg-sidebar p-0 sm:max-w-none",
              apiExamplesData ? "w-[min(100vw,42rem)]" : "w-[min(100vw,25rem)]",
            )}
          >
            <div className="flex min-h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-5 pr-14 sm:px-6">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background/50 text-muted-foreground">
                {apiExamplesData ? (
                  <Braces className="h-4 w-4" />
                ) : (
                  <ListTree className="h-4 w-4" />
                )}
              </span>
              <div className="min-w-0">
                <SheetTitle className="text-sm">{pageToolsHeading}</SheetTitle>
                <SheetDescription className="mt-0.5 text-xs">
                  {apiExamplesData
                    ? "Browse this page or inspect working request examples."
                    : "Jump directly to a section on this page."}
                </SheetDescription>
              </div>
            </div>
            <div className="page-tools-scroll min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              <PageTools
                key={currentPath}
                tocItems={tocItems}
                apiExamplesData={apiExamplesData}
                activeSection={activeSection}
                onNavigate={() => setPageToolsOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>

        <aside
          aria-label="Documentation navigation"
          className="sticky top-16 hidden h-[calc(100vh-4rem-1px)] min-w-0 self-start flex-col overflow-hidden border-r border-sidebar-border bg-sidebar 2xl:flex"
        >
          <Navigation currentPath={currentPath} />
        </aside>

        <div
          className={cn(
            "docs-workspace min-w-0",
            !isWideCanvas && "docs-workspace-document",
          )}
        >
          <main
            className={cn(
              "min-w-0",
              spansWorkspace && "docs-workspace-main-wide",
            )}
          >
            <div
              className={cn(
                "docs-content mx-auto w-full min-w-0 px-4 pb-16 pt-3 sm:px-6 lg:px-10 xl:px-12",
                isWideCanvas && "docs-content-wide",
                isHomepage &&
                  "!max-w-[86rem] !pb-0 xl:!px-8 2xl:!max-w-[96rem]",
                !isWideCanvas && !hasPageTools && "docs-content-no-tools",
              )}
            >
              <BreadcrumbNavigation currentPageTitle={pageTitle} />
              <Outlet />
            </div>
          </main>

          {hasPageTools && !isWideCanvas && (
            <aside
              aria-label={pageToolsHeading}
              className={cn(
                "hidden min-w-0 xl:block",
                apiExamplesData && "border-l border-sidebar-border bg-sidebar",
              )}
            >
              {apiExamplesData ? (
                <div className="docs-api-tools-inner page-tools-scroll sticky top-16 max-h-[calc(100vh-4rem)] w-full overflow-y-auto px-5 pb-8 pt-3">
                  <div className="flex h-9 items-center gap-2 border-b border-border">
                    <Braces className="h-4 w-4 text-muted-foreground" />
                    <p className="m-0 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      {pageToolsHeading}
                    </p>
                  </div>
                  <PageTools
                    key={currentPath}
                    tocItems={tocItems}
                    apiExamplesData={apiExamplesData}
                    activeSection={activeSection}
                  />
                </div>
              ) : (
                <div className="docs-floating-toc sticky top-24 pr-4">
                  <div className="mb-3 flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="h-px w-5 shrink-0 bg-primary/70"
                    />
                    <p className="m-0 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      {pageToolsHeading}
                    </p>
                  </div>
                  <div className="page-tools-scroll max-h-[calc(100vh-10rem)] overflow-y-auto overscroll-contain pb-4 pr-2">
                    <PageTools
                      key={currentPath}
                      tocItems={tocItems}
                      activeSection={activeSection}
                      outlineVariant="floating"
                    />
                  </div>
                </div>
              )}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocLayout;
