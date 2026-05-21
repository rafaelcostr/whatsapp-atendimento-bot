import { bootstrap } from "./bootstrap/index.js";

bootstrap().catch((err) => {
  console.error("Falha ao iniciar o bot:", err);
  process.exit(1);
});
