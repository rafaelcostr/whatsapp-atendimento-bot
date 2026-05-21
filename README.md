# WhatsApp Atendimento Bot

Bot de atendimento automático para WhatsApp com **menu interativo**, **respostas por IA (Groq)** e arquitetura modular por **núcleos** — projeto de portfólio com foco em manutenção e extensão.

**Caso de uso:** [Interconnect Imports](docs/contexto/interconnect-imports.txt) — importação de produtos chineses para e-commerce.

## Portfólio

| Projeto | Repositório | Demo |
|---------|-------------|------|
| **Este bot** | [github.com/rafaelcostr/whatsapp-atendimento-bot](https://github.com/rafaelcostr/whatsapp-atendimento-bot) | — |
| **Crypto Dashboard** | [github.com/rafaelcostr/Crypto-Dashboard](https://github.com/rafaelcostr/Crypto-Dashboard) | [crypto-dashboard-iota-peach.vercel.app](https://crypto-dashboard-iota-peach.vercel.app) |

## Funcionalidades

- Conexão via **Baileys** (QR Code)
- Menu numérico (1–4): IA, horário, humano, FAQ
- IA com **Groq** + histórico de conversa
- Contexto da empresa via `BOT_CONTEXTO`
- Sessão em memória (24h), reconexão automática
- Modo teste para WhatsApp Web (`BOT_MODO_TESTE`)

## Stack

- Node.js 20+, TypeScript, Zod, Pino
- [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys)
- [Groq API](https://console.groq.com/)

## Arquitetura

```
src/
├── bootstrap/          # Inicialização e injeção de dependências
├── config/             # Variáveis de ambiente
├── shared/             # Tipos, logger, constantes
└── nucleos/
    ├── whatsapp/       # Gateway Baileys
    ├── sessao/         # Estado por usuário
    ├── menu/           # Textos do menu
    ├── ia/             # Cliente Groq
    └── atendimento/    # Router + handlers por fluxo
```

Documentação detalhada: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Instalação

```bash
git clone https://github.com/rafaelcostr/whatsapp-atendimento-bot.git
cd whatsapp-atendimento-bot
npm install
cp .env.example .env
# Edite .env: GROQ_API_KEY, BOT_CONTEXTO, etc.
npm run dev
```

Escaneie o QR Code no terminal. Sessão salva em `.auth/` (não commitar).

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `BOT_NOME` | Nome no menu |
| `BOT_EMPRESA` | Empresa no prompt da IA |
| `BOT_CONTEXTO` | Conhecimento da empresa (`\n` para quebras) |
| `GROQ_API_KEY` | Chave Groq |
| `GROQ_MODEL` | Modelo (padrão: `llama-3.3-70b-versatile`) |
| `GROQ_HISTORICO_MAX` | Mensagens lembradas no modo IA |
| `BOT_MODO_TESTE` | `true` = teste em "Mensagens para você" |
| `AUTH_DIR` | Pasta sessão WhatsApp |

Exemplos de contexto: [docs/contexto/](docs/contexto/)

## Scripts

| Comando | Ação |
|---------|------|
| `npm run dev` | Desenvolvimento com hot reload |
| `npm run build` | Compila TypeScript |
| `npm start` | Produção (`dist/`) |
| `npm run typecheck` | Verifica tipos |

## Manutenção rápida

| Tarefa | Onde |
|--------|------|
| Novo item de menu | `src/nucleos/menu/` |
| Novo fluxo de atendimento | `src/nucleos/atendimento/handlers/` |
| Prompt / tom da IA | `src/nucleos/ia/prompts.ts` |
| Filtros WhatsApp | `src/nucleos/whatsapp/mensagens.ts` |

## WhatsApp Web não responde?

| Cenário | Solução |
|---------|---------|
| Mesmo WhatsApp do bot | Use outro número **ou** `BOT_MODO_TESTE=true` + "Mensagens para você" |
| Grupo | Ignorado de propósito |
| Log `enviada_por_mim` | Mensagem enviada por você para clientes — não dispara bot |

## Aviso legal

Uso de biblioteca não oficial (Baileys). Para produção em escala, considere a **WhatsApp Business API** (Meta).

## Licença

MIT — veja [LICENSE](LICENSE).
