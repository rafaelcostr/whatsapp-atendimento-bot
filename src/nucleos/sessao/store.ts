import type { MensagemHistorico } from "../../shared/types.js";
import type { EstadoSessao, SessaoUsuario } from "./types.js";

const TTL_MS = 1000 * 60 * 60 * 24; // 24h

export class SessaoStore {
  private readonly sessions = new Map<string, SessaoUsuario>();

  get(jid: string): SessaoUsuario {
    const existente = this.sessions.get(jid);
    if (existente && Date.now() - existente.atualizadoEm < TTL_MS) {
      return existente;
    }

    const nova: SessaoUsuario = {
      jid,
      estado: "MENU",
      historicoIa: [],
      iaMostrouDicaMenu: false,
      atualizadoEm: Date.now(),
    };
    this.sessions.set(jid, nova);
    return nova;
  }

  setEstado(jid: string, estado: EstadoSessao, nome?: string): SessaoUsuario {
    const sessao = this.get(jid);
    sessao.estado = estado;
    sessao.atualizadoEm = Date.now();
    if (nome) sessao.nome = nome;
    this.sessions.set(jid, sessao);
    return sessao;
  }

  reset(jid: string): SessaoUsuario {
    const sessao = this.setEstado(jid, "MENU");
    sessao.historicoIa = [];
    sessao.iaMostrouDicaMenu = false;
    this.sessions.set(jid, sessao);
    return sessao;
  }

  entrarModoIa(jid: string, nome?: string): SessaoUsuario {
    const sessao = this.setEstado(jid, "IA", nome);
    sessao.historicoIa = [];
    sessao.iaMostrouDicaMenu = false;
    this.sessions.set(jid, sessao);
    return sessao;
  }

  salvarHistoricoIa(jid: string, historico: MensagemHistorico[]): void {
    const sessao = this.get(jid);
    sessao.historicoIa = historico;
    sessao.atualizadoEm = Date.now();
    this.sessions.set(jid, sessao);
  }

  marcarDicaMenuIa(jid: string): void {
    const sessao = this.get(jid);
    sessao.iaMostrouDicaMenu = true;
    this.sessions.set(jid, sessao);
  }
}
