import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

import styles from "./Button.module.scss";

type ButtonProps = {
  variant?: "primary" | "secondary";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  variant = "primary",
  className,
  ...props
}: ButtonProps) => {
  const cn = clsx(styles.button, styles[variant], className);

  return (
    <button
      className={cn}
      {...props}
    />
  );
};
