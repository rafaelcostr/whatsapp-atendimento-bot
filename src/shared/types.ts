export type IncomingMessage = {
  jid: string;
  pushName?: string;
  text: string;
  isGroup: boolean;
};

export type OutgoingMessage = {
  jid: string;
  text: string;
};

export type MensagemHistorico = {
  role: "user" | "assistant";
  content: string;
};
