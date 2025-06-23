import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, collectionId, prompt, result, review } = body;

  // Get current max position in the collection
  const lastCell = await prisma.cell.findFirst({
    where: { collectionId },
    orderBy: { position: 'desc' },
  });

  const nextPosition = lastCell ? lastCell.position + 1 : 0;

  const newCell = await prisma.cell.create({
    data: {
      userId,
      collectionId,
      prompt,
      result,
      review,
      position: nextPosition,
    },
  });

  return NextResponse.json(newCell, { status: 201 });
}

