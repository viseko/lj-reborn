import jwt from "@fastify/jwt";
import fp from "fastify-plugin";
import { env } from "../env.js";

export default fp(async (fastify) => {
  await fastify.register(jwt, {
    namespace: "access",
    secret: env.JWT_ACCESS_SECRET,
    sign: { expiresIn: "15m" },
  });

  await fastify.register(jwt, {
    namespace: "refresh",
    secret: env.JWT_REFRESH_SECRET,
    sign: { expiresIn: "30d" },
  });
});
