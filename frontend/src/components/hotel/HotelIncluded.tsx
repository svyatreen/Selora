import { Check, X } from 'lucide-react';
import { POLICY_CODE_LABELS, tCode } from '@/lib/amenity-codes';

type Props = {
  included?: string[] | null;
  notIncluded?: string[] | null;
  lang: 'ru' | 'en';
  title: string;
  includedLabel: string;
  notIncludedLabel: string;
};

export function HotelIncluded({
  included, notIncluded, lang, title, includedLabel, notIncludedLabel,
}: Props) {
  const hasInc = included && included.length > 0;
  const hasNot = notIncluded && notIncluded.length > 0;
  if (!hasInc && !hasNot) return null;

  return (
    <section>
      <h2 className="text-2xl font-serif font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hasInc && (
          <div className="bg-emerald-500/5 border border-emerald-500/30 rounded-2xl p-5">
            <h3 className="font-semibold mb-3 text-emerald-700 dark:text-emerald-300">
              ✓ {includedLabel}
            </h3>
            <ul className="space-y-2">
              {included!.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{tCode(POLICY_CODE_LABELS, c, lang)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {hasNot && (
          <div className="bg-rose-500/5 border border-rose-500/30 rounded-2xl p-5">
            <h3 className="font-semibold mb-3 text-rose-700 dark:text-rose-300">
              ✕ {notIncludedLabel}
            </h3>
            <ul className="space-y-2">
              {notIncluded!.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <X className="h-4 w-4 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
                  <span>{tCode(POLICY_CODE_LABELS, c, lang)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
