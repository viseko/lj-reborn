import { Suspense } from "react";

import { ResetPasswordForm } from "@/features/auth/reset-password-form";

export const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<p>Загрузка..</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
};
