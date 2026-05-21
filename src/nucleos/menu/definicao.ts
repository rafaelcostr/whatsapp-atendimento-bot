export type OpcaoMenu = {
  id: string;
  rotulo: string;
  estadoDestino: "IA" | "HORARIO" | "HUMANO" | "FAQ";
};

export function criarMenu(nomeBot: string) {
  const opcoes: OpcaoMenu[] = [
    { id: "1", rotulo: "Falar com a IA", estadoDestino: "IA" },
    { id: "2", rotulo: "Horário de atendimento", estadoDestino: "HORARIO" },
    { id: "3", rotulo: "Falar com atendente humano", estadoDestino: "HUMANO" },
    { id: "4", rotulo: "Perguntas frequentes", estadoDestino: "FAQ" },
  ];

  return { nomeBot, opcoes };
}

export type MenuConfig = ReturnType<typeof criarMenu>;
