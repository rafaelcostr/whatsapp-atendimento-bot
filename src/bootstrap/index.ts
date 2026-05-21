import { loadConfig } from "../config/env.js";
import { criarContainer } from "./container.js";

export async function bootstrap(): Promise<void> {
  const env = loadConfig();
  const { log, whatsapp } = criarContainer(env);

  log.info({ bot: env.BOT_NOME, empresa: env.BOT_EMPRESA }, "Iniciando bot de atendimento");
  await whatsapp.iniciar();
}
