"use client";

import clsx from "clsx";
import { Moon, Sun } from "lucide-react";
import { useShallow } from "zustand/shallow";

import { useThemeStore } from "@/shared/theme/store";

import styles from "./ThemeSwitcher.module.scss";

export function ThemeSwitcher() {
  const { theme, setTheme } = useThemeStore(
    useShallow((state) => ({ theme: state.theme, setTheme: state.setTheme })),
  );

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      className={styles.button}
      onClick={toggleTheme}
      aria-label="Переключить тему"
    >
      <Sun
        className={clsx(styles.icon, styles.sun)}
        width={24}
        height={24}
        aria-hidden
      />
      <Moon
        className={clsx(styles.icon, styles.moon)}
        width={24}
        height={24}
        aria-hidden
      />
    </button>
  );
}
