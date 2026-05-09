import { useState } from "react";
import { useTranslation } from "react-i18next";
import { format, differenceInCalendarDays, startOfDay } from "date-fns";
import { ru as ruLocale } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";

export type DateRange = { from: Date | undefined; to: Date | undefined };

interface DateRangePopoverProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  triggerClassName?: string;
  align?: "start" | "center" | "end";
  pricePerNight?: number;
  totalWithTaxes?: number;
}

export function DateRangePopover({ value, onChange, triggerClassName, align = "center", pricePerNight, totalWithTaxes }: DateRangePopoverProps) {
  const { t, i18n } = useTranslation();
  const { formatPrice } = useCurrency();
  const [open, setOpen] = useState(false);
  const nights = value.from && value.to ? differenceInCalendarDays(value.to, value.from) : 0;

  const dateLocale = i18n.resolvedLanguage === "ru" ? ruLocale : undefined;

  const handleSelect = (v: any) => {
    if (!v) {
      onChange({ from: undefined, to: undefined });
      return;
    }
    onChange({
      from: v.from ? startOfDay(v.from) : undefined,
      to: v.to ? startOfDay(v.to) : undefined,
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-12 bg-background",
            !value.from && "text-muted-foreground",
            triggerClassName
          )}
        >
          <CalendarDays className="mr-2 h-5 w-5 text-primary" />
          {value.from ? (
            value.to ? (
              <>{format(value.from, "LLL dd, y", { locale: dateLocale })} — {format(value.to, "LLL dd, y", { locale: dateLocale })}</>
            ) : (
              format(value.from, "LLL dd, y", { locale: dateLocale })
            )
          ) : (
            <span>{t("dateRange.pickDates")}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-border" align={align}>
        <div className="p-7 border-b bg-secondary/30 rounded-t-2xl">
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-muted-foreground uppercase text-xs tracking-wider mb-2">{t("dateRange.checkIn")}</p>
              <p className="font-semibold text-lg">
                {value.from ? format(value.from, "EEE, LLL dd", { locale: dateLocale }) : t("dateRange.selectDate")}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground uppercase text-xs tracking-wider mb-2">{t("dateRange.checkOut")}</p>
              <p className="font-semibold text-lg">
                {value.to ? format(value.to, "EEE, LLL dd", { locale: dateLocale }) : t("dateRange.selectDate")}
              </p>
            </div>
            {nights > 0 && (
              <>
                <div>
                  <p className="text-muted-foreground uppercase text-xs tracking-wider mb-2">{t("dateRange.nights")}</p>
                  <p className="font-semibold text-lg">
                    {t("dateRange.stay", { count: nights })}
                  </p>
                </div>
                {(typeof totalWithTaxes === "number" || typeof pricePerNight === "number") && (
                  <div>
                    <p className="text-muted-foreground uppercase text-xs tracking-wider mb-2">{t("dateRange.total")}</p>
                    <p className="font-semibold text-lg">
                      {formatPrice(typeof totalWithTaxes === "number" ? totalWithTaxes : (pricePerNight as number) * nights)}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={value.from}
          selected={value as any}
          onSelect={handleSelect}
          numberOfMonths={2}
          showOutsideDays={false}
          weekStartsOn={1}
          locale={dateLocale}
          disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
          className="[--cell-size:4rem] p-7 gap-6 [&_.rdp-months]:gap-10 [&_button]:text-base [&_.rdp-weekday]:text-sm [&_.rdp-caption_label]:text-lg [&_.rdp-month_caption]:mb-2"
        />
        <div className="flex items-center justify-between gap-2 p-5 border-t bg-secondary/20 rounded-b-2xl">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => onChange({ from: undefined, to: undefined })}
          >
            {t("dateRange.clear")}
          </Button>
          <Button size="lg" onClick={() => setOpen(false)}>
            {t("dateRange.close")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
