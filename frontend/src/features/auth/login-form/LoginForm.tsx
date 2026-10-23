"use client";

import type { FormHTMLAttributes, SubmitEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { loginSchema } from "@lj/shared";

import { useUserStore } from "@/entities/user";
import { ApiError } from "@/shared/api/clients";
import { useFormState } from "@/shared/lib/useFormState";
import { zodErrorsToFields } from "@/shared/lib/zodErrorsToFields";
import { FormCard } from "@/shared/ui/FormCard/FormCard";
import { Input } from "@/shared/ui/Input/Input";

type FormValues = {
  login: string;
  password: string;
};

const initialValues: FormValues = {
  login: "",
  password: "",
};

export const LoginForm = ({
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
  const login = useUserStore((state) => state.login);
  const router = useRouter();

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitError(null);

    const result = loginSchema.safeParse(values);
    if (!result.success) {
      setErrors(zodErrorsToFields<FormValues>(result.error));
      return;
    }

    setErrors({});

    try {
      await login(result.data.login, result.data.password);
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitError(err.message);
      }
    }
  };

  const formFooter = (
    <>
      <Link href="/register">Зарегистрироваться</Link>
      <Link href="/forgot">Забыли пароль?</Link>
    </>
  );

  return (
    <FormCard
      title="Вход"
      submitLabel="Войти"
      submitError={submitError}
      onSubmit={handleSubmit}
      footer={formFooter}
      titleLevel="h1"
      {...props}
    >
      <Input
        type="text"
        name="login"
        label="Логин"
        value={values.login}
        error={errors?.login}
        onChange={handleChange}
        required
      />
      <Input
        type="password"
        name="password"
        label="Пароль"
        value={values.password}
        error={errors?.password}
        onChange={handleChange}
        required
      />
    </FormCard>
  );
};
