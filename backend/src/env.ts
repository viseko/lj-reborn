import { config } from "dotenv";
import { z } from "zod";

// Читаем .env и заполняем process.env
config();

// Схема валидации
const schema = z.object({
  nodeEnv: z.enum(["development", "test", "production"]).default("development"),
  port: z.coerce.number().int().positive().default(3001),
  logLevel: z.string().default("info"),
});

// Парсим и экспортируем значения переменных окружения
export const env = schema.parse(process.env);
