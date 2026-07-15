import React from "react";
import { useTheme } from "next-themes";
import {
  Braces,
  Briefcase,
  ListTree,
  Menu,
  MoreHorizontal,
  Newspaper,
  Search,
  X,
  Zap,
} from "lucide-react";
import logoRedSrc from "@/shared/assets/images/showpass-logo-red.svg";
import logoWhiteSrc from "@/shared/assets/images/showpass-logo-white.svg";
import { Button } from "@/shared/components/button.tsx";
import { DocSearchTrigger } from "@/docs-app/ui/components/search/DocSearch.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/dropdown-menu.tsx";

interface TopNavigationProps {
  navigationOpen: boolean;
  navigationControlsId: string;
  onNavigationToggle: () => void;
  showNavigationToggle: boolean;
  pageToolsOpen: boolean;
  pageToolsControlsId: string;
  pageToolsLabel: string;
  pageToolsKind: "examples" | "outline";
  onPageToolsToggle: () => void;
  showPageTools: boolean;
  searchOpen: boolean;
  onSearchOpen: () => void;
}

const TopNavigation = ({
  navigationOpen,
  navigationControlsId,
  onNavigationToggle,
  showNavigationToggle,
  pageToolsOpen,
  pageToolsControlsId,
  pageToolsLabel,
  pageToolsKind,
  onPageToolsToggle,
  showPageTools,
  searchOpen,
  onSearchOpen,
}: TopNavigationProps) => {
  const { resolvedTheme } = useTheme();
  const currentLogo =
    resolvedTheme === "forest" || resolvedTheme === "ocean"
      ? logoWhiteSrc
      : logoRedSrc;
  const navigationLabel = navigationOpen
    ? "Close navigation"
    : "Open navigation";
  const pageToolsAriaLabel = pageToolsOpen
    ? `Close ${pageToolsLabel.toLowerCase()}`
    : `Open ${pageToolsLabel.toLowerCase()}`;
  const PageToolsIcon = pageToolsKind === "examples" ? Braces : ListTree;

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/90">
      <div className="flex h-16 min-w-0 items-center">
        <div className="flex min-w-0 shrink-0 items-center pl-2 sm:pl-4 lg:pl-6">
          {showNavigationToggle && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onNavigationToggle}
              className="mr-1 h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground sm:mr-2 sm:h-9 sm:w-9"
              aria-label={navigationLabel}
              aria-expanded={navigationOpen}
              aria-controls={navigationControlsId}
            >
              {navigationOpen ? (
                <X className="h-[18px] w-[18px]" />
              ) : (
                <Menu className="h-[18px] w-[18px]" />
              )}
            </Button>
          )}

          <a
            href="https://dev.showpass.com/"
            className="flex min-w-0 items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <img
              src={currentLogo}
              alt="Showpass developer documentation"
              className="h-7 w-auto sm:h-8"
            />
          </a>
        </div>

        <div className="min-w-2 flex-1" />

        <div className="flex shrink-0 items-center gap-1 pr-2 sm:gap-2 sm:pr-4 lg:pr-6">
          <div className="hidden items-center gap-1 xl:flex">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-sm hover:bg-accent hover:text-accent-foreground"
            >
              <a
                href="https://www.showpass.com/sell/ticketing-features"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                <span>Platform</span>
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-sm hover:bg-accent hover:text-accent-foreground"
            >
              <a
                href="https://www.showpass.com/sell/about-opportunities"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Briefcase className="h-4 w-4" />
                <span>Careers</span>
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-sm hover:bg-accent hover:text-accent-foreground"
            >
              <a
                href="https://www.showpass.com/sell/ticketing-proof"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Newspaper className="h-4 w-4" />
                <span>News</span>
              </a>
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-foreground xl:hidden"
                aria-label="Showpass links"
              >
                <MoreHorizontal className="h-[18px] w-[18px]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem asChild>
                <a
                  href="https://www.showpass.com/sell/ticketing-features"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Platform
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href="https://www.showpass.com/sell/about-opportunities"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  Careers
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href="https://www.showpass.com/sell/ticketing-proof"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Newspaper className="h-4 w-4" />
                  News
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {showPageTools && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onPageToolsToggle}
              className="h-9 gap-2 px-2 text-muted-foreground hover:text-foreground sm:px-3"
              aria-label={pageToolsAriaLabel}
              aria-expanded={pageToolsOpen}
              aria-controls={pageToolsControlsId}
            >
              <PageToolsIcon className="h-[18px] w-[18px]" />
              <span className="hidden sm:inline">{pageToolsLabel}</span>
            </Button>
          )}

          <div className="hidden md:block">
            <DocSearchTrigger open={searchOpen} onOpen={onSearchOpen} />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onSearchOpen}
            className="h-9 w-9 text-muted-foreground hover:text-foreground md:hidden"
            aria-label="Search documentation"
            aria-haspopup="dialog"
            aria-expanded={searchOpen}
          >
            <Search className="h-[18px] w-[18px]" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
