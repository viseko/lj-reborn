import type { FastifyInstance } from "fastify";
import { registerSchema } from "./schemas.js";
import { issueTokenPair } from "./tokens.js";
import { ACCESS_TOKEN_TTL_MINUTES, REFRESH_TOKEN_TTL_DAYS } from "./constants.js";
import { hashPassword } from "./password.js";
import { env } from "../env.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (request, reply) => {
    const body = registerSchema.parse(request.body);
    const passwordHash = await hashPassword(body.password);

    const user = await app.prisma.user.create({
      data: {
        email: body.email,
        login: body.login,
        username: body.username,
        passwordHash,
      },
    });

    const { accessToken, refreshToken } = await issueTokenPair(app, user.id);

    reply
      .setCookie("access_token", accessToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: ACCESS_TOKEN_TTL_MINUTES * 60,
      })
      .setCookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/auth",
        maxAge: REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60,
      })
      .status(201)
      .send({
        user: {
          id: user.id,
          login: user.login,
          username: user.username,
        },
      });
  });
}
