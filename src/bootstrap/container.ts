import type { Env } from "../config/env.js";
import { AtendimentoRouter } from "../nucleos/atendimento/index.js";
import { GroqIaService } from "../nucleos/ia/index.js";
import { WhatsAppGateway } from "../nucleos/whatsapp/index.js";
import { createLogger, type Logger } from "../shared/logger.js";

export type AppContainer = {
  env: Env;
  log: Logger;
  ia: GroqIaService;
  router: AtendimentoRouter;
  whatsapp: WhatsAppGateway;
};

export function criarContainer(env: Env): AppContainer {
  const log = createLogger(env.LOG_LEVEL);
  const ia = new GroqIaService(env, log);
  const router = new AtendimentoRouter(env, ia);
  const whatsapp = new WhatsAppGateway(env, log, async (incoming) => {
    log.info({ jid: incoming.jid, nome: incoming.pushName }, "Mensagem recebida");
    const respostas = await router.processar(incoming);
    for (const resposta of respostas) {
      await whatsapp.enviar(resposta.jid, resposta.text);
    }
  });

  return { env, log, ia, router, whatsapp };
}
