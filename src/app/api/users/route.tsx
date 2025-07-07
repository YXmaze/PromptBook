import { NextResponse } from "next/server";
import { createUserIfNotExists } from "@/app/server/createUser";

export async function POST(req: Request) {
  try {
    const { id, email, name } = await req.json();
    if (!id || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await createUserIfNotExists({ id, email, name });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
