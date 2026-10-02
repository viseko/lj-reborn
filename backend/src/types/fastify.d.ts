import { PrismaClient } from "../generated/prisma/client.js";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    namespaces: "access" | "refresh";
  }
}
