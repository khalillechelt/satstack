"use client";

import { CURRENCIES, type CurrencyCode } from "@/lib/coingecko";

type Props = {
  value: CurrencyCode;
  onChange: (currency: CurrencyCode) => void;
};

export default function CurrencySelector({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as CurrencyCode)}
      style={{
        background: "transparent",
        color: "#555",
        border: "1px solid #1a1a1a",
        fontFamily: "var(--font-geist-mono)",
        fontSize: "11px",
        padding: "5px 8px",
        cursor: "pointer",
        outline: "none",
      }}
    >
      {CURRENCIES.map((c) => (
        <option key={c.code} value={c.code} style={{ background: "#0a0a0a" }}>
          {c.label}
        </option>
      ))}
    </select>
  );
}
