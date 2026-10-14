import z from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Пароль должен быть не короче 8 символов")
  .max(128, "Пароль слишком длинный");

export const registerSchema = z.object({
  email: z.email("Тут что-то не то"),
  login: z
    .string()
    .min(3, "Слишком короткий логин (минимум 3 символа)")
    .max(20, "Зачем вам такой длинный логин?")
    .regex(/^[a-z0-9_-]+$/, "Допускаются только строчные латинские буквы, цифры и символы '-, _' "),
  username: z.string().min(3, "Минимум 3 символа").max(50, "Слишком длинное имя пользователя"),
  password: passwordSchema,
});

// Берём только нужные поля из схемы регистрации
export const loginSchema = z.object({
  login: z.string().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
});

export const forgotPasswordSchema = z.object({
  identifier: z.string().min(1),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: passwordSchema,
});
