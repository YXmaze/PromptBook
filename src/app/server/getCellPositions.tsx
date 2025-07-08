"use server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getCellPositions(collectionId: string) {
  const cells = await prisma.cell.findMany({
    where: { collectionId },
    orderBy: { position: "asc" },
    select: {
      id: true,
      position: true,
      prompt: true,
      result: true,
      review: true,
    },
  });
  return cells;
}
