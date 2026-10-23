import type { FormHTMLAttributes, ReactNode } from "react";

import { Button } from "@/shared/ui/Button/Button";

import styles from "./FormCard.module.scss";

type FormCardProps = {
  title: string;
  submitLabel: string | null;
  footer?: ReactNode;
  submitError?: string | null;
  children: ReactNode;
  titleLevel?: "h1" | "h2";
} & FormHTMLAttributes<HTMLFormElement>;

export const FormCard = ({
  title,
  submitLabel,
  footer,
  submitError,
  children,
  titleLevel = "h2",
  ...props
}: FormCardProps) => {
  const TitleTag = titleLevel;

  return (
    <form
      className={styles.form}
      noValidate
      {...props}
    >
      <TitleTag className={styles.title}>{title}</TitleTag>
      <div className={styles.rows}>{children}</div>
      {submitError && (
        <p
          className={styles.submitError}
          role="alert"
        >
          {submitError}
        </p>
      )}
      {submitLabel && (
        <Button
          type="submit"
          variant="primary"
        >
          {submitLabel}
        </Button>
      )}
      {footer && <div className={styles.footer}>{footer}</div>}
    </form>
  );
};
