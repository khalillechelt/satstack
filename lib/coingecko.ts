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

const DAYS_MAP: Record<Exclude<Range, "ALL">, string> = {
  "1W": "7",
  "1M": "30",
  "1Y": "365",
};

async function fetchBtcPrice(currency: CurrencyCode): Promise<number> {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currency},usd`
  );
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
  const data = await res.json();
  return data.bitcoin[currency] as number;
}

// CoinGecko free tier caps history at 365 days. For ALL time we use
// Blockchain.com which has the full dataset back to 2009, USD only.
// Non-USD currencies are scaled by the current USD→target ratio so the
// chart values stay in the selected currency.
async function fetchBtcHistoryAllTime(
  currency: CurrencyCode
): Promise<PricePoint[]> {
  const [historyRes, priceRes] = await Promise.all([
    fetch(
      "https://api.blockchain.info/charts/market-price?timespan=all&sampled=true&cors=true&format=json"
    ),
    fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currency},usd`
    ),
  ]);

  if (!historyRes.ok) throw new Error(`Blockchain.com error: ${historyRes.status}`);
  if (!priceRes.ok) throw new Error(`CoinGecko error: ${priceRes.status}`);

  const history = await historyRes.json();
  const prices = await priceRes.json();

  // Derive a USD→target scaling factor from the current price.
  // All historical USD prices are multiplied by this ratio.
  const btcUsd: number = prices.bitcoin.usd;
  const btcTarget: number = prices.bitcoin[currency];
  const fxRatio = currency === "usd" ? 1 : btcTarget / btcUsd;

  return (history.values as { x: number; y: number }[]).map(({ x, y }) => ({
    date: x * 1000, // Blockchain.com uses seconds; chart expects ms
    price: y * fxRatio,
  }));
}

async function fetchBtcHistory(
  range: Range,
  currency: CurrencyCode
): Promise<PricePoint[]> {
  if (range === "ALL") return fetchBtcHistoryAllTime(currency);

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

// Arguments are part of the cache key, so each currency+range combo gets
// its own entry.
export const getCachedBtcPrice = unstable_cache(fetchBtcPrice, ["btc-price"], {
  revalidate: 60,
});

export const getCachedBtcHistory = unstable_cache(
  fetchBtcHistory,
  ["btc-history"],
  { revalidate: 300 }
);
