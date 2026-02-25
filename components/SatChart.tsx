"use client";

import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  YAxis,
} from "recharts";

type ChartPoint = { date: number; value: number };

type TooltipEntry = {
  value: number;
  payload: ChartPoint;
};

function CustomTooltip({
  active,
  payload,
  formatValue,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  formatValue: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  const value = payload[0].value;

  return (
    <div
      style={{
        background: "#0a0a0a",
        border: "1px solid #1f1f1f",
        padding: "8px 12px",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "11px",
          color: "#555",
          margin: 0,
        }}
      >
        {new Date(point.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
      <p
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "14px",
          color: "#fff",
          margin: "4px 0 0",
        }}
      >
        {formatValue(value)}
      </p>
    </div>
  );
}

type Props = {
  data: ChartPoint[];
  loading: boolean;
  formatValue: (v: number) => string;
};

export default function SatChart({ data, loading, formatValue }: Props) {
  if (loading) {
    return (
      <div className="w-full h-full min-h-50 flex items-end justify-center pb-4">
        <span
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "11px",
            color: "#2a2a2a",
            letterSpacing: "0.1em",
          }}
          className="animate-pulse"
        >
          loading
        </span>
      </div>
    );
  }

  if (!data.length) return null;

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.15;

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={200}>
      <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="satGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.06} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis domain={[min - padding, max + padding]} hide />
        <Tooltip
          content={<CustomTooltip formatValue={formatValue} />}
          cursor={{ stroke: "#222", strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#ffffff"
          strokeWidth={1.5}
          fill="url(#satGradient)"
          dot={false}
          activeDot={{ r: 3, fill: "#fff", strokeWidth: 0 }}
          isAnimationActive
          animationDuration={500}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
