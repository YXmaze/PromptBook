import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: {id: string}}){
  const {id } = params;

  const cell = await prisma.cell.findUnique({
    where: { id },
  });

  if (!cell) {
    return NextResponse.json({ error: 'Cell not found' }, { status: 404 });
  }

  return NextResponse.json(cell);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();

  const updated = await prisma.cell.update({
    where: { id },
    data: body
  });

  return NextResponse.json(updated);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const partialData = await req.json();

  const updated = await prisma.cell.update({
    where: { id },
    data: partialData,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  await prisma.cell.delete({ where: { id } });

  return NextResponse.json({ message: 'Deleted' });
}
