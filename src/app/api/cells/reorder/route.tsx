// app/api/cells/reorder/route.ts
import { PrismaClient, Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cellId, newIndex } = body as { cellId: string; newIndex: number };

    if (!cellId || typeof newIndex !== 'number' || newIndex < 0) {
      return NextResponse.json(
        { error: 'Missing or invalid cellId or newIndex' },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const targetCell = await tx.cell.findUnique({
        where: { id: cellId },
        select: { id: true, collectionId: true, position: true },
      });

      if (!targetCell) throw new Error('Cell not found');

      const { collectionId } = targetCell;

      const allCells = await tx.cell.findMany({
        where: { collectionId },
        orderBy: { position: 'asc' },
        select: { id: true, position: true },
      });

      if (newIndex >= allCells.length) throw new Error('newIndex out of range');

      const filteredCells = allCells.filter((c: { id: string; position: number }) => c.id !== cellId);

      const reorderedCells = [
        ...filteredCells.slice(0, newIndex),
        targetCell,
        ...filteredCells.slice(newIndex),
      ];

      const updatePromises = reorderedCells.map(
        (cell: { id: string; position: number }, index: number) => {
          if (cell.position === index) return null;
          return tx.cell.update({
            where: { id: cell.id },
            data: { position: index },
          });
        }
      ).filter(Boolean);

      await Promise.all(updatePromises as Promise<unknown>[]);

      return { success: true };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Reorder cells error:', error);

    if (error instanceof Error) {
      if (error.message === 'Cell not found') {
        return NextResponse.json({ error: 'Cell not found' }, { status: 404 });
      }
      if (error.message === 'newIndex out of range') {
        return NextResponse.json({ error: 'newIndex out of range' }, { status: 400 });
      }
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}