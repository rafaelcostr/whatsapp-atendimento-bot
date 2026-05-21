import type { MenuConfig } from "./definicao.js";

export function renderMenuPrincipal(menu: MenuConfig, nomeUsuario?: string): string {
  const saudacao = nomeUsuario ? `Olá, *${nomeUsuario}*!` : "Olá!";
  const linhasOpcoes = menu.opcoes
    .map((o) => `*${o.id}* — ${o.rotulo}`)
    .join("\n");

  return [
    `${saudacao} Sou o *${menu.nomeBot}*.`,
    "",
    "Como posso ajudar? Escolha uma opção:",
    "",
    linhasOpcoes,
    "",
    "_Digite o número da opção ou escreva *menu* a qualquer momento._",
  ].join("\n");
}

export function renderHorario(): string {
  return [
    "🕐 *Horário de atendimento — Interconnect Imports*",
    "",
    "Segunda a sexta: 09h às 18h (atendente humano)",
    "Sábado, domingo e feriados: fechado para humano",
    "",
    "A IA (opção *1*) pode ajudar com dúvidas gerais a qualquer hora.",
    "",
    "Digite *menu* para voltar.",
  ].join("\n");
}

export function renderFaq(): string {
  return [
    "❓ *Perguntas frequentes — Interconnect Imports*",
    "",
    "• *O que vocês importam?* — Eletrônicos, brinquedos e produtos para casa, da China para revenda/e-commerce.",
    "• *Como pedir orçamento?* — Opção *3* (atendente humano) com produto e quantidade.",
    "• *Prazo de entrega?* — Varia; estimativa comum até 7 dias úteis após confirmação.",
    "• *Formas de pagamento?* — PIX e cartão (confirmar com atendente).",
    "",
    "Digite *menu* para voltar.",
  ].join("\n");
}

export function renderEncaminhamentoHumano(): string {
  return [
    "👤 *Atendimento humano*",
    "",
    "Sua solicitação foi registrada. Um atendente responderá em breve.",
    "Enquanto isso, descreva brevemente o que precisa.",
    "",
    "Digite *menu* para voltar ao menu principal.",
  ].join("\n");
}

export function renderModoIa(): string {
  return [
    "🤖 *Modo IA ativado*",
    "",
    "Envie sua pergunta em texto livre. Para sair, digite *menu*.",
  ].join("\n");
}
