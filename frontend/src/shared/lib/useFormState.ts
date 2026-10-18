import { type ChangeEvent, useState } from "react";

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
