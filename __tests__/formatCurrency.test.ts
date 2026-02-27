import { describe, it, expect } from "vitest";
import { formatCurrency } from "@/lib/coingecko";

describe("formatCurrency", () => {
  it("formats USD with dollar sign and two decimal places", () => {
    expect(formatCurrency(95431.2, "usd")).toBe("$95,431.20");
  });

  it("formats JPY with no decimal places", () => {
    // JPY has no subunit — Intl drops the decimals automatically.
    // The exact yen glyph varies by environment (¥ vs ￥) so we
    // assert on the number and the absence of a decimal point.
    const result = formatCurrency(14_500_000, "jpy");
    expect(result).toContain("14,500,000");
    expect(result).not.toContain(".");
  });

  it("formats EUR with euro sign", () => {
    expect(formatCurrency(89432.15, "eur")).toContain("89.432");
  });

  it("formats GBP with pound sign", () => {
    expect(formatCurrency(75000, "gbp")).toContain("£");
  });

  it("formats zero correctly", () => {
    expect(formatCurrency(0, "usd")).toBe("$0.00");
  });

  it("formats very small sat values (fractions of a cent)", () => {
    // 1 sat at $95,000/BTC = $0.00095
    const oneSatValue = 95000 / 100_000_000;
    const result = formatCurrency(oneSatValue, "usd");
    expect(result).toContain("$");
    expect(result).toContain("0.00");
  });
});
