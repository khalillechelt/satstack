import { getCachedBtcHistory, type Range, type CurrencyCode } from "@/lib/coingecko";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = (searchParams.get("range") ?? "1M") as Range;
  const currency = (searchParams.get("currency") ?? "usd") as CurrencyCode;

  try {
    const history = await getCachedBtcHistory(range, currency);
    return NextResponse.json({ history });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
