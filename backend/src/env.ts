import { config } from "dotenv";
import z from "zod";

// Читаем .env и заполняем process.env
config();

const DEFAULT_CORS_ORIGIN = "http://localhost:3000";
const DEFAULT_MAIL_FROM = "LJ Reborn <no-reply@lj.local>";

const REQUIRED_IN_PROD = [
  "SMTP_HOST",
  "COOKIE_DOMAIN",
  "SMTP_PASS",
  "SMTP_USER",
] as const;

// Схема валидации
const schema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().int().positive().default(3001),
    LOG_LEVEL: z.string().default("info"),
    DATABASE_URL: z.string().min(1),
    DATABASE_URL_TEST: z.string().optional(),
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
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    MAIL_FROM: z.string().default(DEFAULT_MAIL_FROM),
    ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV === "test" && !data.DATABASE_URL_TEST) {
      ctx.addIssue({
        code: "custom",
        path: ["DATABASE_URL_TEST"],
        message: `DATABASE_URL_TEST не задан`,
      });
    }

    if (data.NODE_ENV !== "production") return;
    for (const key of REQUIRED_IN_PROD) {
      if (!data[key]) {
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: `${key} не задан`,
        });
      }
    }
  })
  .refine(
    (data) =>
      data.NODE_ENV !== "production" ||
      data.CORS_ORIGIN !== DEFAULT_CORS_ORIGIN,
    {
      error: "CORS_ORIGIN не задан",
      path: ["CORS_ORIGIN"],
    },
  )
  .refine(
    (data) =>
      data.NODE_ENV !== "production" || data.MAIL_FROM !== DEFAULT_MAIL_FROM,
    {
      error: "MAIL_FROM не задан",
      path: ["MAIL_FROM"],
    },
  );

// Парсим и экспортируем значения переменных окружения
export const env = schema.parse(process.env);
