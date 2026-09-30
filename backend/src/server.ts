// Импортирует app.ts, и вызывает у него .listen()
import { buildApp } from "./app.js";
import { env } from "./env.js";

const app = buildApp();

app
  .listen({
    port: env.PORT,
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
