"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import SatChart from "./SatChart";
import RangeSelector from "./RangeSelector";
import SatInput from "./SatInput";
import { type Range } from "@/lib/coingecko";

type PricePoint = { date: number; price: number };

const RANGE_LABELS: Record<Range, string> = {
  "1W": "past week",
  "1M": "past month",
  "1Y": "past year",
  ALL: "all time",
};

export default function SatStackApp() {
  // Always start with the default so server and client render identically.
  // Restore from localStorage after hydration to avoid the SSR mismatch.
  const [sats, setSats] = useState(1_000_000);
  const [range, setRange] = useState<Range>("1M");

  useEffect(() => {
    const saved = localStorage.getItem("satstack-sats");
    const parsed = saved ? parseInt(saved, 10) : NaN;
    if (!isNaN(parsed) && parsed >= 0) setSats(parsed);
  }, []);

  useEffect(() => {
    localStorage.setItem("satstack-sats", String(sats));
  }, [sats]);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Compute chart data by scaling price history by satoshi amount.
  // This is pure math — no fetch needed when sats changes.
  const chartData = useMemo(
    () =>
      priceHistory.map((p) => ({
        date: p.date,
        value: (p.price * sats) / 100_000_000,
      })),
    [priceHistory, sats]
  );

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/history?range=${range}`);
      const data = await res.json();
      setPriceHistory(data.history ?? []);
    } catch {
      setPriceHistory([]);
    } finally {
      setLoading(false);
    }
  }, [range]);

  const fetchCurrentPrice = useCallback(async () => {
    try {
      const res = await fetch("/api/price");
      const data = await res.json();
      if (data.price) setCurrentPrice(data.price);
    } catch {
      // Silently fall back — chart still works from CoinGecko history
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    fetchCurrentPrice();
    const id = setInterval(fetchCurrentPrice, 60_000);
    return () => clearInterval(id);
  }, [fetchCurrentPrice]);

  // Derived values
  const currentValue =
    currentPrice !== null ? (currentPrice * sats) / 100_000_000 : null;

  const firstValue = priceHistory[0]?.price;
  const lastValue = priceHistory[priceHistory.length - 1]?.price;
  const pctChange =
    firstValue && lastValue
      ? ((lastValue - firstValue) / firstValue) * 100
      : null;

  const isUp = pctChange !== null && pctChange >= 0;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <header
        style={{ borderBottom: "1px solid #111" }}
        className="px-6 py-5 flex items-center justify-between"
      >
        <span
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "12px",
            letterSpacing: "0.2em",
            color: "#fff",
          }}
        >
          SATSTACK
        </span>
        {currentPrice !== null && (
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "11px",
              color: "#333",
            }}
          >
            BTC{" "}
            <span style={{ color: "#fff" }}>
              $
              {currentPrice.toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}
            </span>
          </span>
        )}
      </header>

      {/* Value Display */}
      <div className="px-6 pt-10 pb-6">
        {currentValue !== null ? (
          <>
            <div
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: "clamp(36px, 6vw, 56px)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              $
              {currentValue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            {pctChange !== null && (
              <div
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "12px",
                  color: isUp ? "#fff" : "#666",
                  marginTop: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>{isUp ? "↑" : "↓"}</span>
                <span>{Math.abs(pctChange).toFixed(2)}%</span>
                <span style={{ color: "#333" }}>{RANGE_LABELS[range]}</span>
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "clamp(36px, 6vw, 56px)",
              fontWeight: 300,
              color: "#1a1a1a",
            }}
          >
            $—
          </div>
        )}
      </div>

      {/* Chart */}
      <div style={{ flex: 1, minHeight: 220, paddingInline: 0 }}>
        <SatChart data={chartData} loading={loading} />
      </div>

      {/* Range Selector */}
      <div className="px-6 py-4">
        <RangeSelector value={range} onChange={setRange} />
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "#111", marginInline: "24px" }} />

      {/* Satoshi Input */}
      <div className="px-6 py-8">
        <SatInput value={sats} onChange={setSats} />
      </div>

      {/* Footer */}
      <footer
        style={{ borderTop: "1px solid #0d0d0d", padding: "16px 24px" }}
        className="flex items-center justify-between"
      >
        <span
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "10px",
            color: "#222",
          }}
        >
          data via CoinGecko
        </span>
        <span
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "10px",
            color: "#1a1a1a",
          }}
        >
          1 BTC = 100,000,000 sats
        </span>
      </footer>
    </main>
  );
}
