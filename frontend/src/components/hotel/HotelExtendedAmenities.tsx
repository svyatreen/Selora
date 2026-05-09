import { Check } from 'lucide-react';
import {
  HOTEL_CATEGORY_LABELS,
  HOTEL_AMENITY_LABELS,
  tCode,
} from '@/lib/amenity-codes';

type Props = {
  amenitiesExtended: Record<string, string[]> | null | undefined;
  lang: 'ru' | 'en';
  title: string;
  showLessLabel?: string;
  showAllLabel?: string;
};

const MAX_PER_CAT = 6;
// Categories explicitly hidden from the page
const HIDDEN_CATS = new Set(['tech', 'sustainability']);

export function HotelExtendedAmenities({
  amenitiesExtended,
  lang,
  title,
}: Props) {
  if (!amenitiesExtended || Object.keys(amenitiesExtended).length === 0) {
    return null;
  }

  const entries = Object.entries(amenitiesExtended).filter(
    ([cat, items]) => !HIDDEN_CATS.has(cat) && items && items.length > 0,
  );
  if (entries.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-serif font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entries.map(([cat, items]) => {
          const meta = HOTEL_CATEGORY_LABELS[cat];
          const Icon = meta?.icon;
          const label = meta ? (lang === 'ru' ? meta.ru : meta.en) : cat;
          const visible = items.slice(0, MAX_PER_CAT);
          return (
            <div
              key={cat}
              className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2 mb-1">
                {Icon && (
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                )}
                <h3 className="font-semibold text-base">{label}</h3>
                <span className="text-xs text-muted-foreground ml-auto">
                  {visible.length}
                </span>
              </div>
              <ul className="space-y-2">
                {visible.map((code) => (
                  <li
                    key={code}
                    className="flex items-start gap-2 text-sm text-foreground/90"
                  >
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{tCode(HOTEL_AMENITY_LABELS, code, lang)}</span>
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
