import type { Env } from "../../config/env.js";
import { COMANDOS_VOLTAR } from "../../shared/constants.js";
import type { IncomingMessage, OutgoingMessage } from "../../shared/types.js";
import type { GroqIaService } from "../ia/index.js";
import { criarMenu, renderMenuPrincipal, type MenuConfig } from "../menu/index.js";
import { normalizarComando } from "../whatsapp/mensagens.js";
import { SessaoStore } from "../sessao/index.js";
import { handleEstado } from "./handlers/estado.handler.js";
import { handleMenu } from "./handlers/menu.handler.js";

export class AtendimentoRouter {
  private readonly menu: MenuConfig;
  private readonly sessoes = new SessaoStore();

  constructor(
    env: Env,
    private readonly ia: GroqIaService,
  ) {
    this.menu = criarMenu(env.BOT_NOME);
  }

  async processar(msg: IncomingMessage): Promise<OutgoingMessage[]> {
    const comando = normalizarComando(msg.text);
    const sessao = this.sessoes.get(msg.jid);

    if ((COMANDOS_VOLTAR as readonly string[]).includes(comando)) {
      this.sessoes.reset(msg.jid);
      return [{ jid: msg.jid, text: renderMenuPrincipal(this.menu, msg.pushName) }];
    }

    if (sessao.estado === "MENU") {
      return handleMenu(msg, comando, this.menu, this.sessoes);
    }

    return handleEstado(msg, sessao.estado, this.menu, this.sessoes, this.ia);
  }
}
