const MAX_CARACTERES = 1200;

/** Ajusta texto do modelo para leitura no WhatsApp. */
export function formatarParaWhatsApp(texto: string): string {
  let out = texto
    .replace(/\r\n/g, "\n")
    .replace(/```[\s\S]*?```/g, (bloco) =>
      bloco.replace(/```\w*\n?/g, "").replace(/```/g, "").trim(),
    )
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "*$1*")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (out.length > MAX_CARACTERES) {
    out =
      out.slice(0, MAX_CARACTERES - 40).trimEnd() +
      "\n\n_(Resposta resumida. Peça mais detalhes se precisar.)_";
  }

  return out;
}
