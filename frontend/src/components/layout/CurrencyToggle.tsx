import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Check, Search } from "lucide-react";
import { CURRENCIES, useCurrency } from "@/contexts/CurrencyContext";
import { cn } from "@/lib/utils";

export function CurrencyToggle() {
  const { t } = useTranslation();
  const { currency, setCurrencyCode, isLoadingRates } = useCurrency();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return CURRENCIES;
    return CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setSearch("");
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 gap-1.5 px-3 font-medium text-base"
          aria-label={t("currency.ariaChange")}
        >
          <span className="hidden sm:inline">{currency.code}</span>
          <span className="text-muted-foreground hidden md:inline">{currency.symbol}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>{t("currency.title")}</DialogTitle>
          <DialogDescription>
            {t("currency.description")}
            {isLoadingRates ? t("currency.loading") : ""}
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              placeholder={t("currency.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="max-h-[55vh] overflow-y-auto border-t">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              {t("currency.noResults", { query: search })}
            </div>
          ) : (
            <ul className="py-1">
              {filtered.map((c) => {
                const selected = c.code === currency.code;
                return (
                  <li key={c.code}>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrencyCode(c.code);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-secondary/60 transition-colors",
                        selected && "bg-secondary/40"
                      )}
                    >
                      <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                        {c.symbol}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm flex items-center gap-2">
                          <span className="truncate">{c.name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {c.code} · {c.symbol}
                        </div>
                      </div>
                      {selected && <Check className="h-4 w-4 text-primary shrink-0" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
