import { PrismaClient } from "../generated/prisma/client.js";
import type { Postman } from "../plugins/postman.js";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    postman: Postman;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    namespaces: "access" | "refresh";
  }
}
