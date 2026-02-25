import { getBtcPrice } from "@/lib/strike";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const price = await getBtcPrice();
    return NextResponse.json({ price });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch price" },
      { status: 500 }
    );
  }
}
