import { getSessionUser } from "@/entities/user/server";

import { HeaderAuthClient } from "./HeaderAuthClient";

export const HeaderAuth = async () => {
  const user = await getSessionUser();

  return <HeaderAuthClient initialUser={user} />;
};
