type TickerRate = {
  sourceCurrency: string;
  targetCurrency: string;
  amount: string;
};

export async function getBtcPrice(): Promise<number> {
  const apiKey = process.env.STRIKE_API_KEY;

  const res = await fetch("https://api.strike.me/v1/rates/ticker", {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Strike API error: ${res.status}`);
  }

  const rates: TickerRate[] = await res.json();

  // Try direct BTC/USD pair first
  const btcUsd = rates.find(
    (r) => r.sourceCurrency === "BTC" && r.targetCurrency === "USD"
  );
  if (btcUsd) return parseFloat(btcUsd.amount);

  // Fallback: derive from BTC/USDT ÷ USD/USDT
  const btcUsdt = rates.find(
    (r) => r.sourceCurrency === "BTC" && r.targetCurrency === "USDT"
  );
  const usdUsdt = rates.find(
    (r) => r.sourceCurrency === "USD" && r.targetCurrency === "USDT"
  );

  if (btcUsdt && usdUsdt) {
    return parseFloat(btcUsdt.amount) / parseFloat(usdUsdt.amount);
  }

  throw new Error("Could not determine BTC/USD price from Strike rates");
}
