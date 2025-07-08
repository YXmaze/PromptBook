import { NextResponse } from "next/server";
import { createCell } from "@/app/server/createCellWithNewCollection";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const cell = await createCell({ userId });
    return NextResponse.json(cell, { status: 201 });
  } catch (error) {
    console.error("Create cell with new collection error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
