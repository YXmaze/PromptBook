"use server";

import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

interface CreateCellParams {
  userId: string;
}

export async function createCell({ userId }: CreateCellParams) {
  // Step 1: Count existing "Untitled Collection" collections
  const untitledCount = await prisma.collection.count({
    where: {
      userId,
      name: {
        startsWith: "Untitled Collection",
      },
    },
  });

  // Step 2: Create a new collection with numbered name
  const newCollection = await prisma.collection.create({
    data: {
      userId,
      name: `Untitled Collection ${untitledCount + 1}`,
    },
  });

  // Step 3: Count current cells in the new collection (should be 0)
  const cellCount = await prisma.cell.count({
    where: {
      collectionId: newCollection.id,
    },
  });

  // Step 4: Create the new cell with null fields and position = 0
  const newCell = await prisma.cell.create({
    data: {
      userId,
      collectionId: newCollection.id,
      position: cellCount, // 0 here
      prompt: null,
      result: null,
      review: null,
    },
  });

  return newCell; // return new cell if you want to use it
}
