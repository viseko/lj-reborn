import type { FastifyInstance } from "fastify";
import { loginSchema, registerSchema } from "./schemas.js";
import { issueTokenPair, setAuthCookies } from "./tokens.js";
import { DUMMY_PASSWORD_HASH, hashPassword, verifyPassword } from "./password.js";

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

    setAuthCookies(reply, accessToken, refreshToken)
      .status(201)
      .send({
        user: {
          id: user.id,
          login: user.login,
          username: user.username,
        },
      });
  });

  app.post("/login", async (request, reply) => {
    const body = loginSchema.parse(request.body);

    const user = await app.prisma.user.findUnique({
      where: {
        login: body.login,
      },
    });

    const passwordHash = user?.passwordHash ?? DUMMY_PASSWORD_HASH;
    const isValid = await verifyPassword(passwordHash, body.password);

    if (!user || !isValid) {
      return reply.status(401).send({
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid login or password",
        },
      });
    }

    const { accessToken, refreshToken } = await issueTokenPair(app, user.id);

    setAuthCookies(reply, accessToken, refreshToken)
      .status(200)
      .send({
        user: {
          id: user.id,
          login: user.login,
          username: user.username,
        },
      });
  });
}
