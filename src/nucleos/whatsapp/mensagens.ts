import type { proto, WAMessage } from "@whiskeysockets/baileys";
import {
  areJidsSameUser,
  isJidGroup,
  isJidNewsletter,
  isJidStatusBroadcast,
  jidNormalizedUser,
} from "@whiskeysockets/baileys";

function conteudoInterno(
  content: proto.IMessage | null | undefined,
): proto.IMessage | null | undefined {
  if (!content) return null;
  return (
    content.ephemeralMessage?.message ??
    content.viewOnceMessage?.message ??
    content.viewOnceMessageV2?.message ??
    content.documentWithCaptionMessage?.message ??
    content.editedMessage?.message ??
    content
  );
}

export function extrairTexto(message: WAMessage): string | null {
  const content = conteudoInterno(message.message);
  if (!content) return null;

  const texto =
    content.conversation ??
    content.extendedTextMessage?.text ??
    content.imageMessage?.caption ??
    content.videoMessage?.caption ??
    content.documentMessage?.caption ??
    content.buttonsResponseMessage?.selectedDisplayText ??
    content.buttonsResponseMessage?.selectedButtonId ??
    content.listResponseMessage?.title ??
    content.templateButtonReplyMessage?.selectedDisplayText;

  return texto?.trim() ?? null;
}

export function resolverJidConversa(remoteJid: string): string {
  return jidNormalizedUser(remoteJid) || remoteJid;
}

export function deveIgnorarJid(jid: string): boolean {
  return (
    isJidGroup(jid) ||
    isJidStatusBroadcast(jid) ||
    isJidNewsletter(jid) ||
    jid.endsWith("@broadcast")
  );
}

export type MotivoIgnorar =
  | "sem_jid"
  | "grupo_ou_canal"
  | "enviada_por_mim"
  | "auto_conversa_nao_permitida"
  | "sem_texto";

export function avaliarMensagem(
  message: WAMessage,
  meId: string | undefined,
  permitirAutoTeste: boolean,
): { aceita: boolean; jid?: string; motivo?: MotivoIgnorar } {
  const key = message.key;
  if (!key.remoteJid) {
    return { aceita: false, motivo: "sem_jid" };
  }

  const jid = resolverJidConversa(key.remoteJid);
  if (deveIgnorarJid(jid)) {
    return { aceita: false, motivo: "grupo_ou_canal" };
  }

  if (key.fromMe) {
    if (!permitirAutoTeste || !meId) {
      return { aceita: false, motivo: "enviada_por_mim" };
    }
    const eu = resolverJidConversa(meId);
    if (!areJidsSameUser(jid, eu)) {
      return { aceita: false, motivo: "auto_conversa_nao_permitida" };
    }
  }

  const text = extrairTexto(message);
  if (!text) {
    return { aceita: false, jid, motivo: "sem_texto" };
  }

  return { aceita: true, jid };
}

export function normalizarComando(texto: string): string {
  return texto.trim().toLowerCase();
}

export function resumoPayload(message: proto.IWebMessageInfo): string {
  const inner = conteudoInterno(message.message);
  const keys = inner ? Object.keys(inner) : [];
  return keys.join(", ") || "vazio";
}
