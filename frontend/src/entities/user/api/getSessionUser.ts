import "server-only";

import { cookies } from "next/headers";
import { errors, importSPKI, type JWTPayload, jwtVerify } from "jose";

import { accessTokenPayloadSchema } from "@lj/shared";

let keyPromise: Promise<CryptoKey> | undefined;

// Ключ импортируется один раз при первом вызове, затем переиспользуется
function getPublicKey() {
  const pem = process.env.JWT_ACCESS_PUBLIC_KEY;
  if (!pem) {
    throw new Error("Отсутствует публичный ключ JWT_ACCESS_PUBLIC_KEY");
  }

  keyPromise ??= importSPKI(pem, "EdDSA");
  return keyPromise;
}

function toSessionUser(payload: JWTPayload) {
  const result = accessTokenPayloadSchema.safeParse(payload);

  if (!result.success) {
    return null;
  }

  return {
    id: result.data.sub,
    login: result.data.login,
  };
}

export const getSessionUser = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return null;

  const key = await getPublicKey();

  try {
    const { payload } = await jwtVerify(accessToken, key, {
      algorithms: ["EdDSA"],
    });

    const user = toSessionUser(payload);
    return user ? { user, expired: false } : null;
  } catch (error) {
    if (error instanceof errors.JWTExpired) {
      const user = toSessionUser(error.payload);
      return user ? { user, expired: true } : null;
    }

    return null;
  }
};
