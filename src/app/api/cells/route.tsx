import { NextResponse } from "next/server";
import { getCellPositions } from "@/app/server/getCellPositions";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const collectionId = searchParams.get("collectionId");

    if (!collectionId) {
      return NextResponse.json(
        { error: "Missing collectionId" },
        { status: 400 }
      );
    }

    const positions = await getCellPositions(collectionId);
    return NextResponse.json(positions, { status: 200 });
  } catch (error) {
    console.error("Get cell positions error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
