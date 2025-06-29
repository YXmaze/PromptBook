import { NextResponse } from "next/server";
import { createCellWithExistCollection } from "@/app/server/createCellWithExistCollection";

export async function POST(req: Request) {
  try {
    const { userId, collectionId, prompt, result, review } = await req.json();

    if (!userId || !collectionId) {
      return NextResponse.json(
        { error: "Missing userId or collectionId" },
        { status: 400 }
      );
    }

    const cell = await createCellWithExistCollection({
      userId,
      collectionId,
      prompt,
      result,
      review,
    });

    return NextResponse.json(cell, { status: 201 });
  } catch (error) {
    console.error("Create cell error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
