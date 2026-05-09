export function splitIntoParagraphs(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  // Paragraphs are separated by an empty line (double newline).
  const parts = normalized
    .split(/\n\s*\n/g)
    .map((p) => p.trim())
    .filter(Boolean);

  // Fallback: if there are no blank lines, treat the whole text as one paragraph.
  return parts.length > 0 ? parts : [normalized];
}

export function paragraphsWithoutLast(text: string): string[] {
  const parts = splitIntoParagraphs(text);
  if (parts.length <= 1) return parts;
  return parts.slice(0, -1);
}

export function removeLastParagraphPreview(text: string): string {
  const parts = splitIntoParagraphs(text);
  if (parts.length <= 1) return parts[0] ?? "";
  // For compact cards we prefer a single block to keep `line-clamp` predictable.
  return parts.slice(0, -1).join(" ");
}

