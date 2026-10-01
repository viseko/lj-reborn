import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import fp from "fastify-plugin";
import { env } from "../env.js";

const connectionString = env.NODE_ENV === "test" ? env.DATABASE_URL_TEST : env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export default fp(async (fastify) => {
  // Присваеваем объекту fastify новое поле prisma со значением PrismaClient
  // decorate дополнительно проверяет, что поля с таким именем ещё не существует
  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
});
