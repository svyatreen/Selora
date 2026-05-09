import { useMemo } from 'react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BookingAddon } from '@/lib/extended-types';

const CATEGORY_LABELS_RU: Record<string, string> = {
  food: 'Еда',
  transfer: 'Трансфер',
  service: 'Услуги',
  experience: 'Впечатления',
  transport: 'Трансфер',
  services: 'Услуги',
  wellness: 'Здоровье и спа',
  leisure: 'Досуг',
  comfort: 'Комфорт',
};
const CATEGORY_LABELS_EN: Record<string, string> = {
  food: 'Food',
  transfer: 'Transfer',
  service: 'Services',
  experience: 'Experiences',
  transport: 'Transport',
  services: 'Services',
  wellness: 'Wellness',
  leisure: 'Leisure',
  comfort: 'Comfort',
};

const UNIT_LABELS_RU: Record<string, string> = {
  per_booking: 'за бронь',
  per_night: 'за ночь',
  per_guest: 'за гостя',
  per_hour: 'за час',
  per_day: 'в день',
  per_pair: 'за пару',
  per_bag: 'за сумку',
  per_person: 'за человека',
  per_session: 'за сеанс',
};
const UNIT_LABELS_EN: Record<string, string> = {
  per_booking: 'per booking',
  per_night: 'per night',
  per_guest: 'per guest',
  per_hour: 'per hour',
  per_day: 'per day',
  per_pair: 'per pair',
  per_bag: 'per bag',
  per_person: 'per person',
  per_session: 'per session',
};

type Strings = {
  title: string;
  subtitle: string;
};

export type AddonSelection = { addonId: number; quantity: number };

export function AddonsSelector({
  addons,
  selections,
  onChange,
  formatPrice,
  lang,
  s,
}: {
  addons: BookingAddon[];
  selections: AddonSelection[];
  onChange: (next: AddonSelection[]) => void;
  formatPrice: (n: number) => string;
  lang: 'ru' | 'en';
  s: Strings;
}) {
  const visibleAddons = useMemo(
    () => addons.filter((addon) => addon.code !== 'room_upgrade'),
    [addons],
  );

  const grouped = useMemo(() => {
    const out: Record<string, BookingAddon[]> = {};
    for (const a of visibleAddons) {
      const cat = a.category || 'service';
      if (!out[cat]) out[cat] = [];
      out[cat].push(a);
    }
    return out;
  }, [visibleAddons]);

  if (!visibleAddons || visibleAddons.length === 0) return null;

  const getQty = (id: number) =>
    selections.find((s) => s.addonId === id)?.quantity ?? 0;

  const setQty = (addon: BookingAddon, q: number) => {
    const clamped = Math.max(0, Math.min(addon.maxQuantity, q));
    const others = selections.filter((s) => s.addonId !== addon.id);
    if (clamped === 0) {
      onChange(others);
    } else {
      onChange([...others, { addonId: addon.id, quantity: clamped }]);
    }
  };

  const catLabel = (cat: string) =>
    lang === 'ru' ? CATEGORY_LABELS_RU[cat] || cat : CATEGORY_LABELS_EN[cat] || cat;
  const unitLabel = (u: string) => {
    const fallback = u.replace(/_/g, ' ').replace(/\*/g, ' ');
    return lang === 'ru' ? UNIT_LABELS_RU[u] || fallback : UNIT_LABELS_EN[u] || fallback;
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-semibold text-sm">{s.title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{s.subtitle}</p>
      </div>
      <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1 custom-scrollbar">
        {Object.entries(grouped).map(([cat, list]) => (
          <div key={cat}>
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wide mb-1.5">
              {catLabel(cat)}
            </p>
            <div className="space-y-1.5">
              {list.map((a) => {
                const qty = getQty(a.id);
                const sel = qty > 0;
                return (
                  <div
                    key={a.id}
                    className={cn(
                      'rounded-lg border p-3 transition-colors',
                      sel
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border bg-background',
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{a.name}</p>
                        {a.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {a.description}
                          </p>
                        )}
                        <p className="text-xs font-semibold text-primary mt-1">
                          {formatPrice(a.price)}{' '}
                          <span className="text-[10px] text-muted-foreground font-normal">
                            {unitLabel(a.unit)}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {a.code === 'extra_bed' ? (
                          <button
                            type="button"
                            onClick={() => setQty(a, sel ? 0 : 1)}
                            className={cn(
                              'h-7 px-2.5 rounded-md text-xs font-semibold transition-colors',
                              sel
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary hover:bg-secondary/80',
                            )}
                          >
                            {sel
                              ? lang === 'ru' ? 'Убрать' : 'Remove'
                              : lang === 'ru' ? 'Добавить' : 'Add'}
                          </button>
                        ) : a.maxQuantity > 1 ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setQty(a, qty - 1)}
                              disabled={qty <= 0}
                              className="h-6 w-6 rounded-md border border-border bg-background hover:bg-secondary disabled:opacity-40 flex items-center justify-center"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-5 text-center text-sm font-semibold">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQty(a, qty + 1)}
                              disabled={qty >= a.maxQuantity}
                              className="h-6 w-6 rounded-md border border-border bg-background hover:bg-secondary disabled:opacity-40 flex items-center justify-center"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setQty(a, sel ? 0 : 1)}
                            className={cn(
                              'h-7 px-2.5 rounded-md text-xs font-semibold transition-colors',
                              sel
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary hover:bg-secondary/80',
                            )}
                          >
                            {sel
                              ? lang === 'ru' ? 'Убрать' : 'Remove'
                              : lang === 'ru' ? 'Добавить' : 'Add'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
