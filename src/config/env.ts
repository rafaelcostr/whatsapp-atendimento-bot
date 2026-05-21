import { config as loadEnv } from "dotenv";
import { z } from "zod";

loadEnv();

const envSchema = z.object({
  BOT_NOME: z.string().default("Assistente Virtual"),
  BOT_EMPRESA: z.string().optional(),
  BOT_CONTEXTO: z.string().optional(),
  GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY é obrigatória"),
  GROQ_MODEL: z.string().default("llama-3.3-70b-versatile"),
  GROQ_MAX_TOKENS: z.coerce.number().int().min(64).max(1024).default(400),
  GROQ_HISTORICO_MAX: z.coerce.number().int().min(2).max(24).default(12),
  AUTH_DIR: z.string().default(".auth"),
  /** Permite testar enviando mensagem para você mesmo (conversa "Mensagens para você") */
  BOT_MODO_TESTE: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
  LOG_LEVEL: z
    .enum(["trace", "debug", "info", "warn", "error", "fatal"])
    .default("info"),
});

export type Env = z.infer<typeof envSchema>;

const CHAVES_PLACEHOLDER = [
  "sua_chave_aqui",
  "gsk_sua_chave",
  "changeme",
  "your_api_key",
];

export function loadConfig(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Variáveis de ambiente inválidas:\n${issues}`);
  }

  const key = parsed.data.GROQ_API_KEY.trim();
  const parecePlaceholder =
    CHAVES_PLACEHOLDER.some((p) => key.toLowerCase() === p) ||
    key.length < 20;

  if (parecePlaceholder) {
    throw new Error(
      "GROQ_API_KEY inválida ou ainda é o exemplo do .env.example.\n" +
        "Crie uma chave em https://console.groq.com/keys e cole no arquivo .env",
    );
  }

  const data = parsed.data;
  if (data.BOT_CONTEXTO) {
    data.BOT_CONTEXTO = data.BOT_CONTEXTO.replace(/\\n/g, "\n");
  }
  return data;
}
