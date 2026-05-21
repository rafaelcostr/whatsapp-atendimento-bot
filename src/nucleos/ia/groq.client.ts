import Groq from "groq-sdk";
import type { Env } from "../../config/env.js";
import type { Logger } from "../../shared/logger.js";
import { formatarParaWhatsApp } from "./format.js";
import { systemPrompt } from "./prompts.js";
import type { MensagemHistorico } from "./types.js";

export type RespostaIa = {
  texto: string;
  historico: MensagemHistorico[];
};

export class GroqIaService {
  private readonly client: Groq;

  constructor(
    private readonly env: Env,
    private readonly log: Logger,
  ) {
    this.client = new Groq({ apiKey: env.GROQ_API_KEY });
  }

  async responder(
    pergunta: string,
    historico: MensagemHistorico[],
    nomeUsuario?: string,
  ): Promise<RespostaIa> {
    const userContent = nomeUsuario
      ? `${nomeUsuario}: ${pergunta}`
      : pergunta;

    const mensagens: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt(this.env) },
      ...historico.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: userContent },
    ];

    try {
      const completion = await this.client.chat.completions.create({
        model: this.env.GROQ_MODEL,
        temperature: 0.35,
        top_p: 0.9,
        max_tokens: this.env.GROQ_MAX_TOKENS,
        messages: mensagens,
      });

      const bruto = completion.choices[0]?.message?.content?.trim();
      if (!bruto) {
        return {
          texto:
            "Não consegui gerar uma resposta agora. Tente reformular ou digite *menu*.",
          historico,
        };
      }

      const texto = formatarParaWhatsApp(bruto);
      const historicoAtualizado = [
        ...historico,
        { role: "user" as const, content: userContent },
        { role: "assistant" as const, content: texto },
      ].slice(-this.env.GROQ_HISTORICO_MAX) satisfies MensagemHistorico[];

      return { texto, historico: historicoAtualizado };
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      const message = err instanceof Error ? err.message : String(err);

      this.log.error({ status, message }, "Erro ao chamar Groq");

      if (status === 401) {
        return {
          texto: [
            "A chave da Groq está inválida.",
            "",
            "Atualize *GROQ_API_KEY* no .env e reinicie o bot.",
          ].join("\n"),
          historico,
        };
      }

      if (status === 429) {
        return {
          texto:
            "Limite de uso da IA atingido. Aguarde um momento ou digite *menu*.",
          historico,
        };
      }

      return {
        texto:
          "A IA está temporariamente indisponível. Digite *menu* ou escolha outra opção.",
        historico,
      };
    }
  }
}
