"use client";

import { type Range } from "@/lib/coingecko";

const RANGES: Range[] = ["1W", "1M", "1Y", "ALL"];

type Props = {
  value: Range;
  onChange: (range: Range) => void;
};

export default function RangeSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-1">
      {RANGES.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          style={{ fontFamily: "var(--font-geist-mono)" }}
          className={`text-xs px-3 py-1.5 transition-all cursor-pointer ${
            value === r
              ? "bg-white text-black"
              : "text-neutral-400 hover:text-white border border-neutral-900 hover:border-neutral-700"
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
