import { NextResponse } from "next/server";
import { createCollectionWithAutoName } from "@/app/server/createCollectionWithAutoName";
import { getCollections } from "@/app/server/getCollection";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    if (!userId)
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    const collection = await createCollectionWithAutoName(userId);
    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    console.error("Create collection error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId)
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    const collections = await getCollections(userId);
    return NextResponse.json(collections, { status: 200 });
  } catch (error) {
    console.error("Get collections error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
