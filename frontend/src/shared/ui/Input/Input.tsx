import { type InputHTMLAttributes, useId, useState } from "react";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";

import styles from "./Input.module.scss";

type InputProps = {
  label: string;
  error?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder">;

export const Input = ({ label, error, type, id, ...props }: InputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword && isPasswordVisible ? "text" : type;

  return (
    <div className={styles.field}>
      <div className={styles.inputWrapper}>
        <label
          className={styles.label}
          htmlFor={inputId}
        >
          {label}
        </label>
        <input
          id={inputId}
          type={resolvedType}
          className={clsx(styles.input, isPassword && styles.inputWithToggle)}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          placeholder=" "
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.toggle}
            aria-label={isPasswordVisible ? "Скрыть пароль" : "Показать пароль"}
            onClick={() => setIsPasswordVisible((prev) => !prev)}
          >
            {isPasswordVisible ? <EyeOff /> : <Eye />}
          </button>
        )}
        {error && (
          <span
            id={errorId}
            className={styles.error}
          >
            {error}
          </span>
        )}
      </div>
    </div>
  );
};
