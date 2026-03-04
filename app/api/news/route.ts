import { NextRequest, NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/rss";

export const revalidate = 1800; // Revalidate every 30 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = parseInt(searchParams.get("limit") || "30", 10);

  try {
    const news = await fetchAllNews(limit);
    return NextResponse.json(news, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
