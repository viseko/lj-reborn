import cron from "node-cron";
import fp from "fastify-plugin";
import { cleanupExpiredTokens } from "../auth/cleanup.js";

export default fp(async (app) => {
  const task = cron.schedule("0 3 * * *", async () => {
    try {
      const result = await cleanupExpiredTokens(app);
      app.log.info(result, "Cleaned up expired/revoked tokens");
    } catch (err) {
      app.log.error(err, "Token cleanup failed");
    }
  });

  app.addHook("onClose", () => {
    task.stop();
  });
});
