import { config } from "dotenv";
import z from "zod";

// Читаем .env и заполняем process.env
config();

const DEFAULT_CORS_ORIGIN = "http://localhost:3000";

// Схема валидации
const schema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().int().positive().default(3001),
    LOG_LEVEL: z.string().default("info"),
    DATABASE_URL: z.string().min(1),
    DATABASE_URL_TEST: z.string().min(1),
    CORS_ORIGIN: z.string().default(DEFAULT_CORS_ORIGIN),
    JWT_ACCESS_PRIVATE_KEY: z
      .string()
      .startsWith("-----BEGIN PRIVATE KEY-----")
      .endsWith("-----END PRIVATE KEY-----"),
    JWT_ACCESS_PUBLIC_KEY: z
      .string()
      .startsWith("-----BEGIN PUBLIC KEY-----")
      .endsWith("-----END PUBLIC KEY-----"),
    JWT_REFRESH_SECRET: z.string().min(32),
    COOKIE_DOMAIN: z.string().optional(),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().int().positive().default(1025),
    MAIL_FROM: z.string().default("LJ Reborn <no-reply@lj.local>"),
    ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  })
  .refine((data) => data.NODE_ENV !== "production" || Boolean(data.SMTP_HOST), {
    error: "SMTP_HOST не задан",
    path: ["SMTP_HOST"],
  })
  .refine(
    (data) => data.NODE_ENV !== "production" || Boolean(data.COOKIE_DOMAIN),
    {
      error: "COOKIE_DOMAIN не задан",
      path: ["COOKIE_DOMAIN"],
    },
  )
  .refine(
    (data) =>
      data.NODE_ENV !== "production" ||
      data.CORS_ORIGIN !== DEFAULT_CORS_ORIGIN,
    {
      error: "CORS_ORIGIN не задан",
      path: ["CORS_ORIGIN"],
    },
  );

// Парсим и экспортируем значения переменных окружения
export const env = schema.parse(process.env);
