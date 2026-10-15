"use client";

import type { FormHTMLAttributes, SubmitEvent } from "react";
import { useRouter } from "next/navigation";

import { registerSchema } from "@lj/shared";

import { Input } from "@/shared/ui/Input/Input";
import { ApiError } from "@/shared/api/clients";
import { useUserStore } from "@/entities/user/model/store";

import { useFormState } from "@/shared/lib/useFormState";
import { FormCard } from "@/shared/ui/FormCard/FormCard";
import { zodErrorsToFields } from "@/shared/lib/zodErrorsToFields";

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

export const RegisterForm = ({ ...props }: FormHTMLAttributes<HTMLFormElement>) => {
  const { values, handleChange, errors, setErrors, submitError, setSubmitError } =
    useFormState<FormValues>(initialValues);

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
      if (err instanceof ApiError) {
        setSubmitError(err.message);
      }
    }
  };

  const formFooter = <a href="/login">Уже есть аккаунт? Войти</a>;

  return (
    <FormCard
      title="Регистрация"
      submitLabel="Зарегистрироваться"
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
        type="text"
        name="username"
        placeholder="Отображаемое имя"
        value={values.username}
        error={errors?.username}
        onChange={handleChange}
        required
      />
      <Input
        type="email"
        name="email"
        placeholder="E-mail"
        value={values.email}
        onChange={handleChange}
        error={errors?.email}
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
      <Input
        type="password"
        name="passwordRepeat"
        placeholder="Повторите пароль"
        value={values.passwordRepeat}
        error={errors?.passwordRepeat}
        onChange={handleChange}
        required
      />
    </FormCard>
  );
};
