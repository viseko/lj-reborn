import { ResetPasswordForm } from "@/features/auth/reset-password-form";
import { Suspense } from "react";

export const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<p>Загрузка..</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
};
