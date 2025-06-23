import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const collection = await prisma.collection.findUnique({
    where: { id },
    include: { cells: true }
  });

  if (!collection) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(collection);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();

  const updated = await prisma.collection.update({
    where: { id },
    data: body
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  await prisma.collection.delete({ where: { id } });

  return NextResponse.json({ message: 'Deleted' });
}
