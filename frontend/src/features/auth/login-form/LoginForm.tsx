"use client";

import type { FormHTMLAttributes, SubmitEvent } from "react";
import { useRouter } from "next/navigation";

import { loginSchema } from "@lj/shared";

import { Input } from "@/shared/ui/Input/Input";
import { ApiError } from "@/shared/api/clients";
import { useUserStore } from "@/entities/user";

import { useFormState } from "@/shared/lib/useFormState";
import { FormCard } from "@/shared/ui/FormCard/FormCard";
import { zodErrorsToFields } from "@/shared/lib/zodErrorsToFields";

type FormValues = {
  login: string;
  password: string;
};

const initialValues: FormValues = {
  login: "",
  password: "",
};

export const LoginForm = ({ ...props }: FormHTMLAttributes<HTMLFormElement>) => {
  const { values, handleChange, errors, setErrors, submitError, setSubmitError } =
    useFormState<FormValues>(initialValues);
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
      <a href="/register">Зарегистрироваться</a>
      <a href="/forgot">Забыли пароль?</a>
    </>
  );

  return (
    <FormCard
      title="Вход"
      submitLabel="Войти"
      submitError={submitError}
      onSubmit={handleSubmit}
      footer={formFooter}
      {...props}
    >
      <Input
        type="text"
        name="login"
        placeholder="Логин"
        value={values.login}
        error={errors?.login}
        onChange={handleChange}
        required
      />
      <Input
        type="password"
        name="password"
        placeholder="Пароль"
        value={values.password}
        error={errors?.password}
        onChange={handleChange}
        required
      />
    </FormCard>
  );
};
