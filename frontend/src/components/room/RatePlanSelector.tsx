import { Check, Coffee, Shield, Clock, Tag, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RatePlan } from '@/lib/extended-types';

type Strings = {
  title: string;
  perNight: string;
  refundable: string;
  nonRefundable: string;
  freeCancellation: string;
  hours: string;
  breakfast: string;
  dinner: string;
  lateCheckout: string;
  save: string;
  selected: string;
};

export function RatePlanSelector({
  plans,
  selected,
  onSelect,
  formatPrice,
  s,
}: {
  plans: RatePlan[];
  selected: string;
  onSelect: (code: string) => void;
  formatPrice: (n: number) => string;
  s: Strings;
}) {
  if (!plans || plans.length === 0) return null;

  const minPrice = Math.min(...plans.map((p) => p.pricePerNight));

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm">{s.title}</h3>
      <div className="space-y-2">
        {plans.map((plan) => {
          const isSel = plan.code === selected;
          return (
            <button
              key={plan.code}
              type="button"
              onClick={() => onSelect(plan.code)}
              className={cn(
                'w-full text-left rounded-xl border p-3 transition-all',
                isSel
                  ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/30'
                  : 'border-border bg-background hover:border-primary/40',
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{plan.name}</span>
                  </div>
                  {plan.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {plan.description}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-sm">
                    {formatPrice(plan.pricePerNight)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {s.perNight}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {plan.refundable ? (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded font-medium">
                    <Shield className="h-3 w-3" />
                    {plan.freeCancellationHours
                      ? `${s.freeCancellation} ${plan.freeCancellationHours}${lowerH(s)}`
                      : s.refundable}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-rose-500/10 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded font-medium">
                    <Tag className="h-3 w-3" />
                    {s.nonRefundable}
                  </span>
                )}
                {plan.includesBreakfast && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded font-medium">
                    <Coffee className="h-3 w-3" />
                    {s.breakfast}
                  </span>
                )}
                {plan.includesDinner && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-orange-500/10 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded font-medium">
                    <Utensils className="h-3 w-3" />
                    {s.dinner}
                  </span>
                )}
                {plan.lateCheckoutIncluded && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-violet-500/10 text-violet-700 dark:text-violet-300 px-1.5 py-0.5 rounded font-medium">
                    <Clock className="h-3 w-3" />
                    {s.lateCheckout}
                  </span>
                )}
              </div>
              {isSel && (
                <div className="flex items-center gap-1 text-xs text-primary font-medium mt-2 pt-2 border-t border-primary/20">
                  <Check className="h-3.5 w-3.5" />
                  {s.selected}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function lowerH(s: Strings) {
  return s.hours;
}
