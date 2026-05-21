export type EstadoSessao =
  | "MENU"
  | "IA"
  | "HORARIO"
  | "HUMANO"
  | "FAQ";

import type { MensagemHistorico } from "../../shared/types.js";

export type SessaoUsuario = {
  jid: string;
  estado: EstadoSessao;
  nome?: string;
  historicoIa: MensagemHistorico[];
  iaMostrouDicaMenu: boolean;
  atualizadoEm: number;
};
