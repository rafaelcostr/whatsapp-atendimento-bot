import type { IncomingMessage, OutgoingMessage } from "../../../shared/types.js";
import {
  renderEncaminhamentoHumano,
  renderFaq,
  renderHorario,
  renderMenuPrincipal,
  renderModoIa,
  type MenuConfig,
} from "../../menu/index.js";
import type { SessaoStore } from "../../sessao/index.js";
import type { EstadoSessao } from "../../sessao/types.js";

const TEXTO_POR_ESTADO: Record<
  Exclude<EstadoSessao, "MENU">,
  () => string
> = {
  IA: renderModoIa,
  HORARIO: renderHorario,
  HUMANO: renderEncaminhamentoHumano,
  FAQ: renderFaq,
};

export function handleMenu(
  msg: IncomingMessage,
  comando: string,
  menu: MenuConfig,
  sessoes: SessaoStore,
): OutgoingMessage[] {
  const opcao = menu.opcoes.find((o) => o.id === comando);

  if (!opcao) {
    const boasVindas = renderMenuPrincipal(menu, msg.pushName);
    const hint =
      comando.length > 0
        ? "\n\n_Não entendi. Use um número de 1 a 4 ou digite *menu*._"
        : "";
    return [{ jid: msg.jid, text: boasVindas + hint }];
  }

  if (opcao.estadoDestino === "IA") {
    sessoes.entrarModoIa(msg.jid, msg.pushName);
  } else {
    sessoes.setEstado(msg.jid, opcao.estadoDestino, msg.pushName);
  }

  return [{ jid: msg.jid, text: TEXTO_POR_ESTADO[opcao.estadoDestino]() }];
}
