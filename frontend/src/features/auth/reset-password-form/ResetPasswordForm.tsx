"use client";

import type { FormHTMLAttributes, SubmitEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { resetPasswordSchema } from "@lj/shared";

import { ApiError, apiFetch } from "@/shared/api/clients";
import { useFormState } from "@/shared/lib/useFormState";
import { zodErrorsToFields } from "@/shared/lib/zodErrorsToFields";
import { FormCard } from "@/shared/ui/FormCard/FormCard";
import { Input } from "@/shared/ui/Input/Input";

type FormValues = {
  newPassword: string;
  newPasswordRepeat: string;
};

const initialValues: FormValues = {
  newPassword: "",
  newPasswordRepeat: "",
};

export const ResetPasswordForm = ({
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

  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const router = useRouter();

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitError(null);

    const result = resetPasswordSchema.safeParse({ ...values, token });
    const passwordMistmatch = values.newPassword !== values.newPasswordRepeat;

    const fieldErrors = result.success
      ? {}
      : zodErrorsToFields<FormValues>(result.error);

    if (passwordMistmatch) {
      fieldErrors.newPasswordRepeat = "Пароли не совпадают";
    }

    if (!result.success || passwordMistmatch) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: {
          token,
          newPassword: result.data.newPassword,
        },
      });
      router.push("/login");
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitError(err.message);
      }
    }
  };

  return (
    <FormCard
      title="Новый пароль"
      submitLabel="Готово"
      submitError={submitError}
      onSubmit={handleSubmit}
      {...props}
    >
      <Input
        type="password"
        name="newPassword"
        placeholder="Пароль"
        value={values.newPassword}
        error={errors?.newPassword}
        onChange={handleChange}
        required
      />
      <Input
        type="password"
        name="newPasswordRepeat"
        placeholder="Повторите пароль"
        value={values.newPasswordRepeat}
        error={errors?.newPasswordRepeat}
        onChange={handleChange}
        required
      />
    </FormCard>
  );
};
