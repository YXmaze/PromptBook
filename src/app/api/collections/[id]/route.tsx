import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: { cells: true },
    });

    if (!collection)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(collection);
  } catch (error) {
    console.error("GET collection failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const id = params.id;

  const { name } = await req.json();

  if (!name) {
    return new Response("Missing name", { status: 400 });
  }

  const updated = await prisma.collection.update({
    where: { id },
    data: { name },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    await prisma.cell.deleteMany({ where: { collectionId: id } });
    await prisma.collection.delete({ where: { id } });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("DELETE collection failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
