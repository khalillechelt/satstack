import { getCachedBtcPrice } from "@/lib/coingecko";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const price = await getCachedBtcPrice();
    return NextResponse.json({ price });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch price" },
      { status: 500 }
    );
  }
}
