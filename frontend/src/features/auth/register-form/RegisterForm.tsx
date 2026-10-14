"use client";

import { useState, type FormHTMLAttributes, type ChangeEvent, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";

import { registerSchema } from "@lj/shared";

import { Input } from "@/shared/ui/Input/Input";
import { Button } from "@/shared/ui/Button/Button";
import { ApiError } from "@/shared/api/clients";
import { useUserStore } from "@/entities/user/model/store";

import styles from "./RegisterForm.module.scss";

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

type FormErrors = Partial<Record<keyof FormValues, string>>;

export const RegisterForm = ({ ...props }: FormHTMLAttributes<HTMLFormElement>) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const register = useUserStore((state) => state.register);

  const router = useRouter();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (values.password !== values.passwordRepeat) {
      setErrors({ passwordRepeat: "Пароли не совпадают" });
      return;
    }

    const result = registerSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors: FormErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormValues;
        fieldErrors[field] = issue.message;
      }

      setErrors(fieldErrors);
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

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate {...props}>
      <div className={styles.title}>Регистрация</div>
      <div className={styles.rows}>
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
          error={errors?.username}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="E-mail"
          onChange={handleChange}
          error={errors?.email}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Пароль"
          error={errors?.password}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="passwordRepeat"
          placeholder="Повторите пароль"
          error={errors?.passwordRepeat}
          onChange={handleChange}
          required
        />
      </div>
      {submitError && <p className={styles.submitError}>{submitError}</p>}
      <Button type="submit" variant="primary">
        Зарегистрироваться
      </Button>
      <div className={styles.links}>
        <a href="/login">Уже есть аккаунт? Войти</a>
      </div>
    </form>
  );
};
