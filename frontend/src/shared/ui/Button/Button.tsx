import type { ButtonHTMLAttributes, ComponentProps } from "react";
import Link from "next/link";
import clsx from "clsx";

import styles from "./Button.module.scss";

type BaseProps = {
  variant?: "primary" | "secondary" | "ghost";
};

type AsButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type AsLinkProps = BaseProps & ComponentProps<typeof Link>;

type ButtonProps = AsButtonProps | AsLinkProps;

export const Button = ({
  variant = "primary",
  className,
  ...props
}: ButtonProps) => {
  const cn = clsx(styles.button, styles[variant], className);

  return props.href !== undefined ? (
    <Link
      className={cn}
      {...props}
    />
  ) : (
    <button
      className={cn}
      {...props}
    />
  );
};
