import jwt from "@fastify/jwt";
import fp from "fastify-plugin";
import { env } from "../env.js";
import { ACCESS_TOKEN_TTL_MINUTES, REFRESH_TOKEN_TTL_DAYS } from "../auth/constants.js";

export default fp(async (fastify) => {
  await fastify.register(jwt, {
    namespace: "access",
    secret: {
      private: env.JWT_ACCESS_PRIVATE_KEY,
      public: env.JWT_ACCESS_PUBLIC_KEY,
    },
    sign: { algorithm: "EdDSA", expiresIn: `${ACCESS_TOKEN_TTL_MINUTES}m` },
  });

  await fastify.register(jwt, {
    namespace: "refresh",
    secret: env.JWT_REFRESH_SECRET,
    sign: { expiresIn: `${REFRESH_TOKEN_TTL_DAYS}d` },
  });
});
