import { NextResponse } from "next/server";
import { updateCellField } from "@/app/server/updateCellField";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cellId = params.id;
    const { field, value } = await req.json();

    if (!field || !cellId) {
      return NextResponse.json(
        { error: "Missing cellId or field" },
        { status: 400 }
      );
    }

    const updatedCell = await updateCellField({ cellId, field, value });
    return NextResponse.json(updatedCell, { status: 200 });
  } catch (error) {
    console.error("Update cell error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cellId = params.id;

    if (!cellId) {
      return NextResponse.json({ error: "Missing cellId" }, { status: 400 });
    }

    const cell = await prisma.cell.findUnique({
      where: { id: cellId },
    });

    if (!cell) {
      return NextResponse.json({ error: "Cell not found" }, { status: 404 });
    }

    return NextResponse.json(cell);
  } catch (error) {
    console.error("Fetch cell error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();

  const updated = await prisma.cell.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  await prisma.cell.delete({ where: { id } });

  return NextResponse.json({ message: "Deleted" });
}
