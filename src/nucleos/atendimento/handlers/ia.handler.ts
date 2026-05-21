import type { IncomingMessage, OutgoingMessage } from "../../../shared/types.js";
import type { GroqIaService } from "../../ia/index.js";
import type { SessaoStore } from "../../sessao/index.js";

export async function handleIa(
  msg: IncomingMessage,
  ia: GroqIaService,
  sessoes: SessaoStore,
): Promise<OutgoingMessage[]> {
  const sessao = sessoes.get(msg.jid);
  const { texto, historico } = await ia.responder(
    msg.text,
    sessao.historicoIa,
    sessao.nome ?? msg.pushName,
  );

  sessoes.salvarHistoricoIa(msg.jid, historico);

  const saidas: OutgoingMessage[] = [{ jid: msg.jid, text: texto }];
  if (!sessao.iaMostrouDicaMenu) {
    sessoes.marcarDicaMenuIa(msg.jid);
    saidas.push({
      jid: msg.jid,
      text: "_Digite *menu* para voltar ao menu principal._",
    });
  }

  return saidas;
}
