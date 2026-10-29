import type { Postman } from "../plugins/postman.js";

export async function sendPasswordResetEmail(
  postman: Postman,
  to: string,
  resetLink: string,
) {
  await postman.send({
    to,
    subject: "Восстановление пароля",
    text: `Перейдите по ссылке, чтобы восстановить пароль: ${resetLink}`,
  });
}
