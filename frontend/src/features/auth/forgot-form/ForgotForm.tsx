"use client";

import type { FormHTMLAttributes, SubmitEvent } from "react";
import { useState } from "react";
import Link from "next/link";

import { forgotPasswordSchema } from "@lj/shared";

import { apiFetch } from "@/shared/api/clients";
import { getErrorMessage } from "@/shared/api/getErrorMessage";
import { useFormState } from "@/shared/lib/useFormState";
import { zodErrorsToFields } from "@/shared/lib/zodErrorsToFields";
import { FormCard } from "@/shared/ui/FormCard/FormCard";
import { Input } from "@/shared/ui/Input/Input";

type FormValues = {
  identifier: string;
};

const initialValues: FormValues = {
  identifier: "",
};

export const ForgotForm = ({
  ...props
}: FormHTMLAttributes<HTMLFormElement>) => {
  const {
    values,
    handleChange,
    errors,
    setErrors,
    submitError,
    setSubmitError,
  } = useFormState<FormValues>(initialValues);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitError(null);

    const result = forgotPasswordSchema.safeParse(values);
    if (!result.success) {
      setErrors(zodErrorsToFields<FormValues>(result.error));
      return;
    }

    setErrors({});

    try {
      await apiFetch<{ message: string }>("/auth/forgot-password", {
        method: "POST",
        body: {
          identifier: values.identifier,
        },
      });

      setIsSent(true);
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    }
  };

  const formFooter = isSent ? (
    <Link href="/login">Вернуться ко входу</Link>
  ) : (
    <>
      <Link href="/register">Зарегистрироваться</Link>
      <Link href="/login">Вспомнили пароль? Войти</Link>
    </>
  );

  return (
    <FormCard
      title="Восстановление пароля"
      submitLabel={isSent ? null : "Восстановить"}
      submitError={submitError}
      onSubmit={handleSubmit}
      titleLevel="h1"
      footer={formFooter}
      {...props}
    >
      {isSent ? (
        <p>
          Если такой email зарегистрирован, на&nbsp;него отправлена ссылка для
          сброса пароля.
        </p>
      ) : (
        <Input
          type="text"
          name="identifier"
          label="Логин или email"
          value={values.identifier}
          error={errors?.identifier}
          onChange={handleChange}
          required
        />
      )}
    </FormCard>
  );
};
