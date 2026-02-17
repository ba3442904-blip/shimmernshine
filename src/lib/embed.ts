export function normalizeInstagramEmbedUrl(url?: string | null) {
  if (!url) return "";

  const trimmed = url.trim();
  if (!trimmed) return "";

  if (!trimmed.includes("snapwidget.com/embed/")) {
    return trimmed;
  }

  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

