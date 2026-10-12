"use client";

import { useThemeStore } from "@/shared/theme/store";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useThemeStore();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return <button onClick={toggleTheme}>{theme === "dark" ? "🌙" : "☀️"}</button>;
}
