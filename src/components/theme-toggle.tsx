"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  isOpen = true,
  variant = "sidebar",
}: {
  isOpen?: boolean;
  variant?: "sidebar" | "navbar" | "ghost";
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (variant === "navbar" || variant === "ghost") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="text-foreground hover:bg-accent"
      >
        {isDark ? <Sun className="size-5 text-yellow-500" /> : <Moon className="size-5 text-slate-700" />}
        <span className="sr-only">Alternar tema</span>
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      onClick={toggleTheme}
      className={cn(
        "transition-all duration-300",
        isOpen
          ? "justify-start gap-3 px-4 h-11 w-full"
          : "justify-center px-0 h-14 w-14 self-center",
      )}
    >
      {isDark ? (
        <Moon
          className={cn(
            "shrink-0 transition-all",
            isOpen ? "size-4" : "size-5",
          )}
        />
      ) : (
        <Sun
          className={cn(
            "shrink-0 transition-all",
            isOpen ? "size-4" : "size-5",
          )}
        />
      )}
      <span
        className={cn(
          "transition-all duration-300",
          !isOpen ? "opacity-0 w-0 hidden" : "opacity-100",
        )}
      >
        Modo {isDark ? "Escuro" : "Claro"}
      </span>
    </Button>
  );
}
