import type { IncomingMessage, OutgoingMessage } from "../../../shared/types.js";
import { renderFaq, renderHorario, renderMenuPrincipal, type MenuConfig } from "../../menu/index.js";
import type { SessaoStore } from "../../sessao/index.js";
import type { EstadoSessao } from "../../sessao/types.js";
import type { GroqIaService } from "../../ia/index.js";
import { handleIa } from "./ia.handler.js";

export async function handleEstado(
  msg: IncomingMessage,
  estado: EstadoSessao,
  menu: MenuConfig,
  sessoes: SessaoStore,
  ia: GroqIaService,
): Promise<OutgoingMessage[]> {
  switch (estado) {
    case "IA":
      return handleIa(msg, ia, sessoes);
    case "HORARIO":
      return [{ jid: msg.jid, text: renderHorario() }];
    case "FAQ":
      return [{ jid: msg.jid, text: renderFaq() }];
    case "HUMANO":
      return [
        {
          jid: msg.jid,
          text: [
            "✅ Mensagem recebida. Nossa equipe foi notificada.",
            "",
            `*Resumo:* ${msg.text}`,
            "",
            "Digite *menu* para outras opções.",
          ].join("\n"),
        },
      ];
    default:
      sessoes.reset(msg.jid);
      return [{ jid: msg.jid, text: renderMenuPrincipal(menu, msg.pushName) }];
  }
}
