import type { ReactNode } from "react";

import styles from "./layout.module.scss";

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return <div className={styles.layout}>{children}</div>;
};

export default AuthLayout;
