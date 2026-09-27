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

// Промежуточный объект с переменными окружения
const values = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  logLevel: process.env.LOG_LEVEL,
};

// Парсим и экспортируем значения переменных окружения
export const env = schema.parse(values);
