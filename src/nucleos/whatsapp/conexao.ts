import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  jidNormalizedUser,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  type WASocket,
} from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import type { Env } from "../../config/env.js";
import type { Logger } from "../../shared/logger.js";
import type { IncomingMessage } from "../../shared/types.js";
import { avaliarMensagem, extrairTexto, resumoPayload } from "./mensagens.js";

export type MensagemHandler = (msg: IncomingMessage) => Promise<void>;

export class WhatsAppGateway {
  private socket?: WASocket;

  constructor(
    private readonly env: Env,
    private readonly log: Logger,
    private readonly onMessage: MensagemHandler,
  ) {}

  async iniciar(): Promise<void> {
    const { state, saveCreds } = await useMultiFileAuthState(this.env.AUTH_DIR);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, this.log as never),
      },
      printQRInTerminal: false,
      logger: this.log as never,
      markOnlineOnConnect: true,
      syncFullHistory: false,
    });

    this.socket = sock;

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
      if (qr) {
        this.log.info("Escaneie o QR Code abaixo com o WhatsApp:");
        qrcode.generate(qr, { small: true });
      }

      if (connection === "open") {
        const me = jidNormalizedUser(sock.authState.creds.me?.id);
        this.log.info(
          {
            numero: me,
            modoTeste: this.env.BOT_MODO_TESTE,
          },
          "WhatsApp conectado — use OUTRO WhatsApp para testar, ou BOT_MODO_TESTE=true na conversa consigo mesmo",
        );
      }

      if (connection === "close") {
        const status = (lastDisconnect?.error as { output?: { statusCode?: number } })
          ?.output?.statusCode;
        const deveReconectar = status !== DisconnectReason.loggedOut;
        this.log.warn({ status }, "Conexão encerrada");

        if (deveReconectar) {
          this.log.info("Reconectando...");
          void this.iniciar();
        } else {
          this.log.error("Sessão encerrada. Apague a pasta .auth e escaneie o QR novamente.");
        }
      }
    });

    sock.ev.on("messages.upsert", async ({ messages, type }) => {
      if (type !== "notify") return;

      const meId = sock.authState.creds.me?.id;

      for (const message of messages) {
        const { aceita, jid, motivo } = avaliarMensagem(
          message,
          meId,
          this.env.BOT_MODO_TESTE,
        );

        if (!aceita || !jid) {
          this.log.info(
            {
              motivo,
              fromMe: message.key.fromMe,
              remoteJid: message.key.remoteJid,
              payload: resumoPayload(message),
            },
            "Mensagem ignorada",
          );
          continue;
        }

        const text = extrairTexto(message);
        if (!text) continue;

        this.log.info({ jid, fromMe: message.key.fromMe }, "Mensagem recebida");

        await this.onMessage({
          jid,
          pushName: message.pushName ?? undefined,
          text,
          isGroup: false,
        });
      }
    });
  }

  async enviar(jid: string, texto: string): Promise<void> {
    if (!this.socket) {
      throw new Error("WhatsApp ainda não conectado");
    }
    await this.socket.sendMessage(jid, { text: texto });
  }
}
