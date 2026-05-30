"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ForceTheme({ theme }: { theme: "dark" | "light" }) {
  const { setTheme } = useTheme();
  
  useEffect(() => {
    setTheme(theme);
  }, [setTheme, theme]);
  
  return null;
}
