"use server";

import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

export async function getCellPositions(collectionId: string) {
  const cells = await prisma.cell.findMany({
    where: { collectionId },
    orderBy: { position: "asc" },
    select: { id: true, position: true },
  });

  return cells; // returns array of { id, position }
}
