import { config } from "dotenv";
import z from "zod";

// Читаем .env и заполняем process.env
config();

// Схема валидации
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3001),
  LOG_LEVEL: z.string().default("info"),
  DATABASE_URL: z.string().min(1),
  DATABASE_URL_TEST: z.string().min(1),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
});

// Парсим и экспортируем значения переменных окружения
export const env = schema.parse(process.env);
