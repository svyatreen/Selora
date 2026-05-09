import { Check } from 'lucide-react';
import {
  ROOM_CATEGORY_LABELS, ROOM_AMENITY_LABELS, tCode,
} from '@/lib/amenity-codes';

type Props = {
  amenities: Record<string, string[]> | null | undefined;
  lang: 'ru' | 'en';
  title: string;
  showMore?: string;
  showLess?: string;
};

const MAX_PER_CAT = 4;
// Categories explicitly hidden
const HIDDEN_CATS = new Set(['view_features']);

export function RoomDetailedAmenities({
  amenities, lang, title,
}: Props) {
  if (!amenities || Object.keys(amenities).length === 0) return null;

  const entries = Object.entries(amenities).filter(
    ([cat, items]) => !HIDDEN_CATS.has(cat) && items && items.length > 0,
  );
  if (entries.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-serif font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.map(([cat, items]) => {
          const meta = ROOM_CATEGORY_LABELS[cat];
          const Icon = meta?.icon;
          const label = meta ? (lang === 'ru' ? meta.ru : meta.en) : cat;
          const visible = items.slice(0, MAX_PER_CAT);
          return (
            <div
              key={cat}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                {Icon && (
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                )}
                <h3 className="font-semibold text-sm">{label}</h3>
                <span className="text-xs text-muted-foreground ml-auto">
                  {visible.length}
                </span>
              </div>
              <ul className="space-y-1.5">
                {visible.map((code) => (
                  <li
                    key={code}
                    className="flex items-start gap-2 text-sm"
                  >
                    <Check className="h-3.5 w-3.5 text-primary mt-1 flex-shrink-0" />
                    <span>{tCode(ROOM_AMENITY_LABELS, code, lang)}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
