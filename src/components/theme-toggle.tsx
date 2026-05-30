"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ isOpen = true }: { isOpen?: boolean }) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="secondary"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "transition-all duration-300",
        isOpen ? "justify-start gap-3 px-4 h-11 w-full" : "justify-center px-0 h-14 w-14 self-center"
      )}
    >
      {theme === "light" ? (
        <Sun className={cn("shrink-0 transition-all", isOpen ? "size-4" : "size-5")} />
      ) : (
        <Moon className={cn("shrink-0 transition-all", isOpen ? "size-4" : "size-5")} />
      )}
      <span className={cn(
        "transition-all duration-300",
        !isOpen ? "opacity-0 w-0 hidden" : "opacity-100"
      )}>
        Modo {theme === "light" ? "Escuro" : "Claro"}
      </span>
    </Button>
  );
}
