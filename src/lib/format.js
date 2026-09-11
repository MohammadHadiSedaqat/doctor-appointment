export function formatPrice(amount, lang) {
  const n = Number(amount || 0);
  const formatted = new Intl.NumberFormat(lang === "fa" ? "fa-IR" : lang === "ar" ? "ar-EG" : "en-US").format(n);
  return formatted;
}

export function formatDate(dateStr, lang) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat(lang === "fa" ? "fa-IR" : lang === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function genHumanId(prefix, seq) {
  const year = new Date().getFullYear();
  const padded = String(seq).padStart(6, "0");
  return `${prefix}-${year}-${padded}`;
}