import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/shared/components/button.tsx";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="w-full justify-start px-1 py-0 h-5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent leading-none"
    >
      {resolvedTheme === "dark" ? (
        <>
          <Sun className="h-3 w-3 mr-1" />
          <span>Light</span>
        </>
      ) : (
        <>
          <Moon className="h-3 w-3 mr-1" />
          <span>Dark</span>
        </>
      )}
    </Button>
  );
}
