export const CARD_BADGE_PALETTE = [
  "bg-orange-500 text-white dark:bg-orange-500/90",
  "bg-rose-500 text-white dark:bg-rose-500/90",
  "bg-amber-500 text-white dark:bg-amber-500/90",
  "bg-emerald-500 text-white dark:bg-emerald-500/90",
  "bg-sky-500 text-white dark:bg-sky-500/90",
  "bg-violet-500 text-white dark:bg-violet-500/90",
  "bg-fuchsia-500 text-white dark:bg-fuchsia-500/90",
  "bg-teal-500 text-white dark:bg-teal-500/90",
  "bg-indigo-500 text-white dark:bg-indigo-500/90",
  "bg-pink-500 text-white dark:bg-pink-500/90",
];

export function getCardColorByIndex(index: number): string {
  const i = ((index % CARD_BADGE_PALETTE.length) + CARD_BADGE_PALETTE.length) % CARD_BADGE_PALETTE.length;
  return CARD_BADGE_PALETTE[i];
}

export function buildCardColorMap<T extends { id: number }>(cards: T[]): Record<number, string> {
  const sorted = [...cards].sort((a, b) => a.id - b.id);
  const map: Record<number, string> = {};
  sorted.forEach((card, idx) => {
    map[card.id] = getCardColorByIndex(idx);
  });
  return map;
}
