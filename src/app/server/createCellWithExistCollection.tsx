"use server";

import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

interface CreateCellWithExistCollectionParams {
  userId: string;
  collectionId: string;
  prompt?: string | null;
  result?: string | null;
  review?: string | null;
}

export async function createCellWithExistCollection({
  userId,
  collectionId,
  prompt = null,
  result = null,
  review = null,
}: CreateCellWithExistCollectionParams) {
  // Get the next position number
  const cellCount = await prisma.cell.count({
    where: {
      collectionId,
    },
  });

  const newCell = await prisma.cell.create({
    data: {
      userId,
      collectionId,
      position: cellCount,
      prompt,
      result,
      review,
    },
  });

  return newCell;
}
