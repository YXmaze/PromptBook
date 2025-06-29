import { NextResponse } from "next/server";
import { searchCollections } from "@/app/server/searchCollection";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const query = searchParams.get("query") || "";

    if (!userId)
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    const results = await searchCollections({ userId, query });
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Search collection error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
