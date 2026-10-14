import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.scss";
import clsx from "clsx";

type ButtonProps = {
  variant?: "primary" | "secondary";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ variant = "primary", className, ...props }: ButtonProps) => {
  const cn = clsx(styles.button, styles[variant], className);

  return <button className={cn} {...props} />;
};
