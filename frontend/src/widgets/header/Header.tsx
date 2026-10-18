import { Suspense } from "react";
import Link from "next/link";
import clsx from "clsx";

import { ThemeSwitcher } from "@/features/theme-switcher";

import { HeaderAuth } from "./HeaderAuth";

import styles from "./Header.module.scss";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={clsx(["container", styles.container])}>
        <Link
          href="/"
          className={styles.logo}
        >
          LJ Reborn
        </Link>

        <Suspense fallback={null}>
          <HeaderAuth />
        </Suspense>

        <div className={styles.controls}>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};
