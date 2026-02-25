export type PricePoint = { date: number; price: number };
export type Range = "1W" | "1M" | "1Y" | "ALL";

const DAYS_MAP: Record<Range, string> = {
  "1W": "7",
  "1M": "30",
  "1Y": "365",
  ALL: "max",
};

export async function getBtcHistory(range: Range): Promise<PricePoint[]> {
  const days = DAYS_MAP[range];
  const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`;

  const res = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`CoinGecko API error: ${res.status}`);
  }

  const data = await res.json();

  return (data.prices as [number, number][]).map(([timestamp, price]) => ({
    date: timestamp,
    price,
  }));
}
