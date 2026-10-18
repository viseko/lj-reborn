"use client";

import { useEffect } from "react";
import Link from "next/link";
import { User as UserIcon } from "lucide-react";
import { useShallow } from "zustand/shallow";

import { type User, useUserStore } from "@/entities/user";
import { Button } from "@/shared/ui/Button/Button";

import styles from "./Header.module.scss";

type HeaderAuthClientProps = {
  initialUser: User | null;
};

export const HeaderAuthClient = ({ initialUser }: HeaderAuthClientProps) => {
  const { user, status, logout, initSession } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      status: state.status,
      logout: state.logout,
      initSession: state.initSession,
    })),
  );

  useEffect(() => {
    initSession(initialUser);
  }, [initSession, initialUser]);

  const currentUser = status === "idle" ? initialUser : user;

  return (
    <>
      {currentUser ? (
        <div className={styles.userInfo}>
          <div className={styles.userName}>
            <UserIcon
              width={16}
              height={16}
            />
            <span>{currentUser.login}</span>
          </div>
          <Button
            variant="secondary"
            onClick={() => logout()}
          >
            Выйти
          </Button>
        </div>
      ) : (
        <div className={styles.actions}>
          <Link href="/login">Войти</Link>
          <Link href="/register">
            <Button variant="primary">Зарегистрироваться</Button>
          </Link>
        </div>
      )}
    </>
  );
};
