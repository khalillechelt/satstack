import { getCachedBtcPrice, type CurrencyCode } from "@/lib/coingecko";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const currency = (searchParams.get("currency") ?? "usd") as CurrencyCode;

  try {
    const price = await getCachedBtcPrice(currency);
    return NextResponse.json({ price });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch price" },
      { status: 500 }
    );
  }
}
