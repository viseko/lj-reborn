import z from "zod";

export const passwordSchema = z.string().min(8).max(128);

export const registerSchema = z.object({
  email: z.email(),
  login: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-z0-9_-]+$/, "Допускаются только строчные латинские буквы, цифры и символы '-, _' "),
  username: z.string().min(3).max(50),
  password: passwordSchema,
});

// Берём только нужные поля из схемы регистрации
export const loginSchema = registerSchema.pick({
  login: true,
  password: true,
});

export const forgotPasswordSchema = z.object({
  identifier: z.string().min(1),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: passwordSchema,
});
