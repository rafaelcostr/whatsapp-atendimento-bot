# Arquitetura

## Visão geral

Monólito Node.js com **núcleos** desacoplados. Cada núcleo tem responsabilidade única e exporta API pública via `index.ts`.

```
src/
├── index.ts                 # Entry
├── bootstrap/               # Composição (DI manual)
│   ├── container.ts
│   └── index.ts
├── config/                  # Env + validação Zod
├── shared/                  # Tipos, logger, constantes
└── nucleos/
    ├── whatsapp/            # Infra: Baileys
    ├── sessao/              # Estado por JID
    ├── menu/                # UX textual (menu/FAQ)
    ├── ia/                  # Provedor Groq
    └── atendimento/         # Orquestração + handlers
```

## Fluxo de uma mensagem

1. `WhatsAppGateway` recebe evento `messages.upsert`
2. `avaliarMensagem()` filtra grupo, fromMe, sem texto
3. `AtendimentoRouter.processar()` decide menu vs estado
4. Handlers em `atendimento/handlers/` produzem `OutgoingMessage[]`
5. Gateway envia cada resposta ao JID

## Onde alterar cada coisa

| Necessidade | Arquivo |
|-------------|---------|
| Novo item de menu | `nucleos/menu/definicao.ts` + `render.ts` |
| Novo estado/fluxo | `sessao/types.ts` + handler em `atendimento/handlers/` |
| Trocar IA (OpenAI etc.) | Novo client em `nucleos/ia/` + `container.ts` |
| Regras WhatsApp | `nucleos/whatsapp/mensagens.ts` |
| Contexto empresa | `.env` → `BOT_CONTEXTO` |

## Dependências entre núcleos

- `atendimento` → `menu`, `sessao`, `ia`, `whatsapp` (só normalizarComando)
- `ia` → `config`, `shared`
- `whatsapp` → `config`, `shared`
- `sessao` → `shared`
- Nenhum núcleo importa `bootstrap`
