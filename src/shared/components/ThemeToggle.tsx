import * as React from "react";
import { Trees, Sun, Droplets, Check } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/shared/components/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/dropdown-menu.tsx";
import { getAllThemes } from "@/shared/themes/theme-registry";

// Icon mapping for themes
const themeIcons: Record<string, typeof Sun> = {
  light: Sun,
  ocean: Droplets,
  forest: Trees,
};

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const themes = getAllThemes();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        disabled
        className="h-9 w-full justify-start gap-2 bg-transparent px-2 text-sm text-muted-foreground"
      >
        <Sun className="h-4 w-4" />
        <span>Theme</span>
      </Button>
    );
  }

  const currentThemeData = themes.find(t => t.id === theme) || themes[0];
  const CurrentIcon = themeIcons[currentThemeData.id] || Sun;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 w-full justify-start gap-2 bg-transparent px-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <CurrentIcon className="h-4 w-4" />
          <span>{currentThemeData.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[120px]">
        {themes.map((t) => {
          const Icon = themeIcons[t.id] || Sun;
          const isActive = theme === t.id;
          return (
            <DropdownMenuItem
              key={t.id}
              onClick={() => setTheme(t.id)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Icon className="h-3 w-3" />
                {t.name}
              </span>
              {isActive && <Check className="h-3 w-3 ml-2" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
