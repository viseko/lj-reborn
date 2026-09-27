// Импортирует app.ts, и вызывает у него .listen()
import { buildApp } from "./app";
import { env } from "./env";

const app = buildApp();

app
  .listen({
    port: env.port,
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
