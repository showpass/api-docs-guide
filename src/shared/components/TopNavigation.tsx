import React from "react";
import { useTheme } from "next-themes";
import { Star, Briefcase } from "lucide-react";
import logoRedSrc from "@/shared/assets/images/showpass-logo-red.svg";
import logoWhiteSrc from "@/shared/assets/images/showpass-logo-white.svg";
import { Button } from "@/shared/components/button.tsx";
import DocSearch from "@/docs-app/ui/components/search/DocSearch.tsx";

const TopNavigation = () => {
  const { resolvedTheme } = useTheme();
  const currentLogo = resolvedTheme === "dark" ? logoWhiteSrc : logoRedSrc;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center">
        {/* Logo - Flush left with padding */}
        <div className="flex items-center flex-shrink-0 pl-4 lg:pl-6">
          <img
            src={currentLogo}
            alt="Showpass Documentation"
            className="h-8 w-auto"
          />
        </div>

        {/* Spacer and Search - Center area */}
        <div className="flex-1 flex justify-center px-8 hidden md:flex">
          <div className="w-full max-w-md">
            <DocSearch />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 pr-4 lg:pr-6">
          <div className="hidden md:flex items-center gap-1">
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
                <Star className="h-4 w-4" />
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