import styles from "./Header.module.scss";
import clsx from "clsx";
import Link from "next/link";
import { ThemeSwitcher } from "@/features/theme-switcher";
import { Suspense } from "react";
import { HeaderAuth } from "./HeaderAuth";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={clsx(["container", styles.container])}>
        <Link href="/" className={styles.logo}>
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
