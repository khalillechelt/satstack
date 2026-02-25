import { unstable_cache } from "next/cache";

export type PricePoint = { date: number; price: number };
export type Range = "1W" | "1M" | "1Y" | "ALL";

export const CURRENCIES = [
  { code: "usd", label: "USD", locale: "en-US" },
  { code: "eur", label: "EUR", locale: "de-DE" },
  { code: "gbp", label: "GBP", locale: "en-GB" },
  { code: "jpy", label: "JPY", locale: "ja-JP" },
  { code: "chf", label: "CHF", locale: "de-CH" },
  { code: "aud", label: "AUD", locale: "en-AU" },
  { code: "cad", label: "CAD", locale: "en-CA" },
  { code: "brl", label: "BRL", locale: "pt-BR" },
  { code: "sgd", label: "SGD", locale: "en-SG" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

export function formatCurrency(amount: number, currency: CurrencyCode): string {
  const entry = CURRENCIES.find((c) => c.code === currency)!;
  return new Intl.NumberFormat(entry.locale, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

const DAYS_MAP: Record<Range, string> = {
  "1W": "7",
  "1M": "30",
  "1Y": "365",
  ALL: "max",
};

async function fetchBtcPrice(currency: CurrencyCode): Promise<number> {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currency}`
  );
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
  const data = await res.json();
  return data.bitcoin[currency] as number;
}

async function fetchBtcHistory(
  range: Range,
  currency: CurrencyCode
): Promise<PricePoint[]> {
  const days = DAYS_MAP[range];
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=${currency}&days=${days}`
  );
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
  const data = await res.json();
  return (data.prices as [number, number][]).map(([timestamp, price]) => ({
    date: timestamp,
    price,
  }));
}

// Arguments are part of the cache key, so each currency gets its own entry.
export const getCachedBtcPrice = unstable_cache(fetchBtcPrice, ["btc-price"], {
  revalidate: 60,
});

export const getCachedBtcHistory = unstable_cache(
  fetchBtcHistory,
  ["btc-history"],
  { revalidate: 300 }
);
