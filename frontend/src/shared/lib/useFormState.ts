import { type ChangeEvent, useEffect, useState } from "react";

// Собирает значения полей и ошибки формы
export function useFormState<T extends Record<string, string>>(
  initialValues: T,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Очистка формы на выходе.
  // * Next 16 с cacheComponents прячет форму через Activity и сохраняет её состояние без очистки
  // * пароль и логин остаются в value в скрытом DOM
  useEffect(() => {
    return () => {
      setValues(initialValues);
      setErrors(undefined);
      setSubmitError(null);
    };
  }, [initialValues]);

  return {
    values,
    setValues,
    handleChange,
    errors,
    setErrors,
    submitError,
    setSubmitError,
  };
}
