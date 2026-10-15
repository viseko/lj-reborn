import styles from "./FormCard.module.scss";
import type { FormHTMLAttributes, ReactNode } from "react";
import { Button } from "@/shared/ui/Button/Button";

type FormCardProps = {
  title: string;
  submitLabel: string | null;
  footer?: ReactNode;
  submitError?: string | null;
  children: ReactNode;
} & FormHTMLAttributes<HTMLFormElement>;

export const FormCard = ({
  title,
  submitLabel,
  footer,
  submitError,
  children,
  ...props
}: FormCardProps) => {
  return (
    <form className={styles.form} noValidate {...props}>
      <div className={styles.title}>{title}</div>
      <div className={styles.rows}>{children}</div>
      {submitError && <p className={styles.submitError}>{submitError}</p>}
      {submitLabel && (
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
      )}
      {footer && <div className={styles.footer}>{footer}</div>}
    </form>
  );
};
