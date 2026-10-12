import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.scss";

type ButtonProps = {
  variant?: "primary" | "secondary";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ variant = "primary", className, ...props }: ButtonProps) => (
  <button className={`${styles.button} ${styles[variant]} ${className ?? ""}`} {...props} />
);
