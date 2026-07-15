import React from "react";
import { useTheme } from "next-themes";
import {
  Briefcase,
  Menu,
  Newspaper,
  X,
  Zap,
} from "lucide-react";
import logoRedSrc from "@/shared/assets/images/showpass-logo-red.svg";
import logoWhiteSrc from "@/shared/assets/images/showpass-logo-white.svg";
import { Button } from "@/shared/components/button.tsx";
import { DocSearchTrigger } from "@/docs-app/ui/components/search/DocSearch.tsx";

interface TopNavigationProps {
  navigationOpen: boolean;
  navigationControlsId: string;
  onNavigationToggle: () => void;
  showNavigationToggle: boolean;
  searchOpen: boolean;
  onSearchOpen: () => void;
}

const TopNavigation = ({
  navigationOpen,
  navigationControlsId,
  onNavigationToggle,
  showNavigationToggle,
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

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-sidebar/95">
      <div className="flex h-16 items-center">
        <div className="flex flex-shrink-0 items-center pl-4 lg:pl-6">
          {showNavigationToggle && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onNavigationToggle}
              className="mr-2 hidden h-9 w-9 text-muted-foreground hover:text-foreground md:inline-flex"
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

          <a href="https://dev.showpass.com/" className="flex items-center">
            <img
              src={currentLogo}
              alt="Showpass Documentation"
              className="h-8 w-auto"
            />
          </a>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        <div className="flex flex-shrink-0 items-center gap-2 pr-4 lg:pr-6">
          <div className="hidden items-center gap-1 lg:flex">
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

          <div className="hidden md:block">
            <DocSearchTrigger open={searchOpen} onOpen={onSearchOpen} />
          </div>

          {/* Mobile dropdown for links */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-9 w-9 hover:bg-accent hover:text-accent-foreground"
            >
              <a
                href="https://www.showpass.com/sell/about-opportunities"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Showpass Careers"
              >
                <Briefcase className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
