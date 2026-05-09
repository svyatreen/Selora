import { Gift } from 'lucide-react';
import { POLICY_CODE_LABELS, tCode } from '@/lib/amenity-codes';

type Props = {
  items?: string[] | null;
  lang: 'ru' | 'en';
  title: string;
};

export function FreeItemsList({ items, lang, title }: Props) {
  if (!items || items.length === 0) return null;
  const normalizeItemCode = (value: string) => {
    const normalized = value.trim().toLowerCase().replace(/\s+/g, '_');
    const aliases: Record<string, string> = {
      'toiletries_set': 'toiletries_set',
      'daily_housekeeping': 'daily_housekeeping',
      'mineral_water_unlimited': 'mineral_water_unlimited',
    };
    return aliases[normalized] ?? normalized;
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Gift className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-2xl font-serif font-bold">{title}</h2>
      </div>
      <div className="bg-emerald-500/5 border border-emerald-500/30 rounded-2xl p-4">
        <div className="flex flex-wrap gap-2">
          {items.map((rawItem) => (
            <span
              key={rawItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-sm text-emerald-800 dark:text-emerald-200 font-medium"
            >
              <Gift className="h-3.5 w-3.5" />
              {tCode(POLICY_CODE_LABELS, normalizeItemCode(rawItem), lang)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
