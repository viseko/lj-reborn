"use client";

import { useEffect } from "react";
import { User as UserIcon } from "lucide-react";
import { useShallow } from "zustand/shallow";

import { type User, useUserStore } from "@/entities/user";
import { Button } from "@/shared/ui/Button/Button";

import styles from "./Header.module.scss";

type HeaderAuthClientProps = {
  initialUser: User | null;
  sessionExpired: boolean;
};

export const HeaderAuthClient = ({
  initialUser,
  sessionExpired,
}: HeaderAuthClientProps) => {
  const { user, status, logout, initSession, refreshSession } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      status: state.status,
      logout: state.logout,
      initSession: state.initSession,
      refreshSession: state.refreshSession,
    })),
  );

  useEffect(() => {
    initSession(initialUser);
    if (sessionExpired) refreshSession();
  }, [initSession, initialUser, sessionExpired, refreshSession]);

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
          <Button
            variant="ghost"
            href="/login"
          >
            Войти
          </Button>

          <Button
            variant="primary"
            href="/register"
          >
            Зарегистрироваться
          </Button>
        </div>
      )}
    </>
  );
};
