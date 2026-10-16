"use client";

import { useUserStore } from "@/entities/user";
import styles from "./Header.module.scss";
import clsx from "clsx";
import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/shared/ui/Button/Button";
import { ThemeSwitcher } from "@/features/theme-switcher";

export const Header = () => {
  const user = useUserStore((state) => state.user);
  const status = useUserStore((state) => state.status);
  const logout = useUserStore((state) => state.logout);

  return (
    <header className={styles.header}>
      <div className={clsx(["container", styles.container])}>
        <Link href="/" className={styles.logo}>
          LJ Reborn
        </Link>

        {status === "authenticated" && user && (
          <div className={styles.userInfo}>
            <div className={styles.userName}>
              <User width={16} height={16} />
              <span>{user.login}</span>
            </div>
            <Button variant="secondary" onClick={() => logout()}>
              Выйти
            </Button>
          </div>
        )}

        {status === "unauthenticated" && (
          <div className={styles.actions}>
            <Link href="/login">Войти</Link>
            <Link href="/register">
              <Button variant="primary">Зарегистрироваться</Button>
            </Link>
          </div>
        )}

        <div className={styles.controls}>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};
