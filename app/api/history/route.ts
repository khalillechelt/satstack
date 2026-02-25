import { getCachedBtcHistory, type Range } from "@/lib/coingecko";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = (searchParams.get("range") ?? "1M") as Range;

  try {
    const history = await getCachedBtcHistory(range);
    return NextResponse.json({ history });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
