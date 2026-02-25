import { unstable_cache } from "next/cache";

export type PricePoint = { date: number; price: number };
export type Range = "1W" | "1M" | "1Y" | "ALL";

const DAYS_MAP: Record<Range, string> = {
  "1W": "7",
  "1M": "30",
  "1Y": "365",
  ALL: "max",
};

async function fetchBtcPrice(): Promise<number> {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
  );
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
  const data = await res.json();
  return data.bitcoin.usd as number;
}

async function fetchBtcHistory(range: Range): Promise<PricePoint[]> {
  const days = DAYS_MAP[range];
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`
  );
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
  const data = await res.json();
  return (data.prices as [number, number][]).map(([timestamp, price]) => ({
    date: timestamp,
    price,
  }));
}

// Cached server-side — all visitors share one result, refreshed on a schedule.
// Price: 60s TTL (fast enough for a live ticker feel).
// History: 5min TTL (chart data doesn't need to be real-time).
export const getCachedBtcPrice = unstable_cache(fetchBtcPrice, ["btc-price"], {
  revalidate: 60,
});

export const getCachedBtcHistory = unstable_cache(
  fetchBtcHistory,
  ["btc-history"],
  { revalidate: 300 }
);
