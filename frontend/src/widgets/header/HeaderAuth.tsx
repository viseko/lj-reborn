import { getSessionUser } from "@/entities/user/server";

import { HeaderAuthClient } from "./HeaderAuthClient";

export const HeaderAuth = async () => {
  const session = await getSessionUser();

  return (
    <HeaderAuthClient
      initialUser={session?.user ?? null}
      sessionExpired={session?.expired ?? false}
    />
  );
};
