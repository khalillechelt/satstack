"use client";

import { useState, useEffect } from "react";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export default function SatInput({ value, onChange }: Props) {
  const [raw, setRaw] = useState(value.toLocaleString("en-US"));

  // Sync display when value is changed externally
  useEffect(() => {
    setRaw(value.toLocaleString("en-US"));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const stripped = e.target.value.replace(/[^0-9]/g, "");
    const num = parseInt(stripped || "0", 10);
    setRaw(stripped ? num.toLocaleString("en-US") : "");
    if (!isNaN(num) && num >= 0) {
      onChange(num);
    }
  };

  const handleBlur = () => {
    setRaw(value.toLocaleString("en-US"));
  };

  const btcDisplay = (value / 100_000_000).toFixed(8);

  return (
    <div>
      <label
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "11px",
          color: "#888",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          display: "block",
          marginBottom: "12px",
        }}
      >
        Satoshis
      </label>
      <div
        style={{ borderBottom: "1px solid #1a1a1a", paddingBottom: "12px" }}
        className="flex items-baseline gap-3"
      >
        <input
          type="text"
          inputMode="numeric"
          value={raw}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{
            background: "transparent",
            fontFamily: "var(--font-geist-mono)",
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 300,
            color: "#fff",
            outline: "none",
            width: "100%",
            caretColor: "#fff",
            fontVariantNumeric: "tabular-nums",
          }}
          placeholder="0"
          autoComplete="off"
          spellCheck={false}
        />
        <span
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "13px",
            color: "#888",
            flexShrink: 0,
          }}
        >
          sats
        </span>
      </div>
      <p
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "11px",
          color: "#777",
          marginTop: "8px",
        }}
      >
        {btcDisplay} BTC
      </p>
    </div>
  );
}
