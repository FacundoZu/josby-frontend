
/**
 * Devuelve un ícono (emoji) según el tipo de entregable.
 * @param {string} type
 * @returns {string}
 */
export function getDeliverableIcon(type) {
  if (!type) return "📎";

  const t = type.toLowerCase().trim();

  if (t.includes("doc")) return "📄"; // Documento, docx, etc.
  if (t.includes("imagen") || t.includes("image") || t.includes("png") || t.includes("jpg")) {
    return "🖼️";
  }
  if (t.includes("video") || t.includes("mp4") || t.includes("mov")) {
    return "🎬";
  }
  if (t.includes("link") || t.includes("enlace") || t.includes("url")) {
    return "🔗";
  }
  if (t.includes("zip") || t.includes("rar") || t.includes("comprimido")) {
    return "📦";
  }
  if (t.includes("audio") || t.includes("mp3") || t.includes("wav")) {
    return "🎧";
  }

  // fallback genérico
  return "📎";
}
