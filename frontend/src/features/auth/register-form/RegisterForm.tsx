"use client";

import type { FormHTMLAttributes, SubmitEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { registerSchema } from "@lj/shared";

import { useUserStore } from "@/entities/user";
import { getErrorMessage } from "@/shared/api/getErrorMessage";
import { useFormState } from "@/shared/lib/useFormState";
import { zodErrorsToFields } from "@/shared/lib/zodErrorsToFields";
import { FormCard } from "@/shared/ui/FormCard/FormCard";
import { Input } from "@/shared/ui/Input/Input";

type FormValues = {
  login: string;
  username: string;
  email: string;
  password: string;
  passwordRepeat: string;
};

const initialValues: FormValues = {
  login: "",
  username: "",
  email: "",
  password: "",
  passwordRepeat: "",
};

export const RegisterForm = ({
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

  const register = useUserStore((state) => state.register);

  const router = useRouter();

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (values.password !== values.passwordRepeat) {
      setErrors({ passwordRepeat: "Пароли не совпадают" });
      return;
    }

    const result = registerSchema.safeParse(values);

    if (!result.success) {
      setErrors(zodErrorsToFields<FormValues>(result.error));
      return;
    }

    setErrors({});

    try {
      await register(result.data);
      router.push("/");
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    }
  };

  const formFooter = <Link href="/login">Уже есть аккаунт? Войти</Link>;

  return (
    <FormCard
      title="Регистрация"
      submitLabel="Зарегистрироваться"
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
        type="text"
        name="username"
        label="Отображаемое имя"
        value={values.username}
        error={errors?.username}
        onChange={handleChange}
        required
      />
      <Input
        type="email"
        name="email"
        label="E-mail"
        value={values.email}
        onChange={handleChange}
        error={errors?.email}
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
      <Input
        type="password"
        name="passwordRepeat"
        label="Повторите пароль"
        value={values.passwordRepeat}
        error={errors?.passwordRepeat}
        onChange={handleChange}
        required
      />
    </FormCard>
  );
};
