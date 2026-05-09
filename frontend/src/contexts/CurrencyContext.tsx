import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  symbolPosition: "before" | "after";
  decimals: number;
}

export const CURRENCIES: Currency[] = [
  { code: "USD", name: "United States Dollar", symbol: "$", symbolPosition: "before", decimals: 2 },
  { code: "EUR", name: "Euro", symbol: "€", symbolPosition: "before", decimals: 2 },
  { code: "GBP", name: "British Pound Sterling", symbol: "£", symbolPosition: "before", decimals: 2 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", symbolPosition: "before", decimals: 0 },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", symbolPosition: "before", decimals: 2 },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", symbolPosition: "after", decimals: 2 },
  { code: "KZT", name: "Kazakhstani Tenge", symbol: "₸", symbolPosition: "after", decimals: 2 },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴", symbolPosition: "after", decimals: 2 },
  { code: "BYN", name: "Belarusian Ruble", symbol: "Br", symbolPosition: "after", decimals: 2 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", symbolPosition: "before", decimals: 2 },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", symbolPosition: "before", decimals: 2 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", symbolPosition: "before", decimals: 2 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", symbolPosition: "before", decimals: 2 },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", symbolPosition: "before", decimals: 2 },
  { code: "KRW", name: "South Korean Won", symbol: "₩", symbolPosition: "before", decimals: 0 },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", symbolPosition: "before", decimals: 2 },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", symbolPosition: "before", decimals: 2 },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$", symbolPosition: "before", decimals: 2 },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", symbolPosition: "after", decimals: 2 },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", symbolPosition: "after", decimals: 2 },
  { code: "DKK", name: "Danish Krone", symbol: "kr", symbolPosition: "after", decimals: 2 },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", symbolPosition: "after", decimals: 2 },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", symbolPosition: "after", decimals: 2 },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", symbolPosition: "after", decimals: 0 },
  { code: "ZAR", name: "South African Rand", symbol: "R", symbolPosition: "before", decimals: 2 },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", symbolPosition: "before", decimals: 2 },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", symbolPosition: "before", decimals: 2 },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", symbolPosition: "before", decimals: 2 },
  { code: "THB", name: "Thai Baht", symbol: "฿", symbolPosition: "before", decimals: 2 },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", symbolPosition: "before", decimals: 0 },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", symbolPosition: "before", decimals: 2 },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", symbolPosition: "before", decimals: 2 },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", symbolPosition: "after", decimals: 0 },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£", symbolPosition: "before", decimals: 2 },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", symbolPosition: "before", decimals: 2 },
  { code: "ILS", name: "Israeli New Shekel", symbol: "₪", symbolPosition: "before", decimals: 2 },
  { code: "ARS", name: "Argentine Peso", symbol: "AR$", symbolPosition: "before", decimals: 2 },
  { code: "CLP", name: "Chilean Peso", symbol: "CL$", symbolPosition: "before", decimals: 0 },
  { code: "COP", name: "Colombian Peso", symbol: "CO$", symbolPosition: "before", decimals: 0 },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/", symbolPosition: "before", decimals: 2 },
  { code: "RON", name: "Romanian Leu", symbol: "lei", symbolPosition: "after", decimals: 2 },
  { code: "BGN", name: "Bulgarian Lev", symbol: "лв", symbolPosition: "after", decimals: 2 },
  { code: "HRK", name: "Croatian Kuna", symbol: "kn", symbolPosition: "after", decimals: 2 },
  { code: "ISK", name: "Icelandic Krona", symbol: "kr", symbolPosition: "after", decimals: 0 },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", symbolPosition: "before", decimals: 0 },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", symbolPosition: "before", decimals: 2 },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", symbolPosition: "before", decimals: 2 },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", symbolPosition: "before", decimals: 2 },
  { code: "TWD", name: "New Taiwan Dollar", symbol: "NT$", symbolPosition: "before", decimals: 0 },
  { code: "QAR", name: "Qatari Riyal", symbol: "QR", symbolPosition: "before", decimals: 2 },
];

const FALLBACK_RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 155, CNY: 7.25, RUB: 92, KZT: 470, UAH: 41,
  BYN: 3.27, INR: 83.5, BRL: 5.05, AUD: 1.52, CAD: 1.36, CHF: 0.88, KRW: 1370,
  AED: 3.67, TRY: 32.5, MXN: 17.2, SEK: 10.6, NOK: 10.8, DKK: 6.87, PLN: 3.97,
  CZK: 23.1, HUF: 360, ZAR: 18.5, SGD: 1.35, HKD: 7.82, NZD: 1.66, THB: 36.5,
  IDR: 16100, MYR: 4.72, PHP: 56.5, VND: 25400, EGP: 49, SAR: 3.75, ILS: 3.72,
  ARS: 880, CLP: 950, COP: 4000, PEN: 3.78, RON: 4.58, BGN: 1.8, HRK: 6.93,
  ISK: 137, PKR: 278, BDT: 110, NGN: 1500, KES: 130, TWD: 32.4, QAR: 3.64,
};

interface CurrencyContextValue {
  currency: Currency;
  setCurrencyCode: (code: string) => void;
  rates: Record<string, number>;
  convert: (usdAmount: number) => number;
  formatPrice: (usdAmount: number, opts?: { decimals?: number }) => string;
  isLoadingRates: boolean;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: CURRENCIES[0],
  setCurrencyCode: () => {},
  rates: FALLBACK_RATES,
  convert: (n) => n,
  formatPrice: (n) => `$${n.toFixed(2)}`,
  isLoadingRates: false,
});

const STORAGE_KEY_CODE = "currency.code";
const STORAGE_KEY_RATES = "currency.rates.v1";
const RATES_TTL_MS = 12 * 60 * 60 * 1000;

interface CachedRates {
  fetchedAt: number;
  rates: Record<string, number>;
}

function loadCachedRates(): CachedRates | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RATES);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedRates;
    if (!parsed?.rates || typeof parsed.fetchedAt !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState<string>(() => {
    const stored = localStorage.getItem(STORAGE_KEY_CODE);
    if (stored && CURRENCIES.some((c) => c.code === stored)) return stored;
    return "USD";
  });

  const [rates, setRates] = useState<Record<string, number>>(() => {
    const cached = loadCachedRates();
    if (cached && Date.now() - cached.fetchedAt < RATES_TTL_MS) {
      return { ...FALLBACK_RATES, ...cached.rates };
    }
    return FALLBACK_RATES;
  });
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CODE, code);
  }, [code]);

  useEffect(() => {
    const cached = loadCachedRates();
    if (cached && Date.now() - cached.fetchedAt < RATES_TTL_MS) return;

    let cancelled = false;
    setIsLoadingRates(true);
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.result === "success" && data?.rates && typeof data.rates === "object") {
          const fresh: Record<string, number> = { USD: 1 };
          for (const c of CURRENCIES) {
            const v = data.rates[c.code];
            if (typeof v === "number" && v > 0) fresh[c.code] = v;
          }
          setRates({ ...FALLBACK_RATES, ...fresh });
          try {
            localStorage.setItem(
              STORAGE_KEY_RATES,
              JSON.stringify({ fetchedAt: Date.now(), rates: fresh } as CachedRates)
            );
          } catch {
            // ignore storage failures (private mode etc.)
          }
        }
      })
      .catch(() => {
        // keep fallback rates
      })
      .finally(() => {
        if (!cancelled) setIsLoadingRates(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const currency = useMemo(
    () => CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0],
    [code]
  );

  const convert = useCallback(
    (usdAmount: number) => {
      if (!Number.isFinite(usdAmount)) return 0;
      const rate = rates[currency.code] ?? FALLBACK_RATES[currency.code] ?? 1;
      return usdAmount * rate;
    },
    [currency.code, rates]
  );

  const formatPrice = useCallback(
    (usdAmount: number, opts?: { decimals?: number }) => {
      const value = convert(usdAmount);
      const decimals = opts?.decimals ?? currency.decimals;
      let formatted: string;
      try {
        formatted = new Intl.NumberFormat(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(value);
      } catch {
        formatted = value.toFixed(decimals);
      }
      return currency.symbolPosition === "before"
        ? `${currency.symbol}${formatted}`
        : `${formatted} ${currency.symbol}`;
    },
    [convert, currency]
  );

  const setCurrencyCode = useCallback((newCode: string) => {
    if (CURRENCIES.some((c) => c.code === newCode)) setCode(newCode);
  }, []);

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrencyCode, rates, convert, formatPrice, isLoadingRates }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
