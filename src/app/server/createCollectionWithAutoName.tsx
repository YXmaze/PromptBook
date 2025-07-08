"use server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createCollectionWithAutoName(userId: string) {
  // Count collections with name starting with "Untitled Collection"
  const count = await prisma.collection.count({
    where: {
      userId,
      name: {
        startsWith: "Untitled Collection",
      },
    },
  });

  // Compose new collection name with number (count + 1)
  const newName = `Untitled Collection ${count + 1}`;

  // Create the collection
  const newCollection = await prisma.collection.create({
    data: {
      userId,
      name: newName,
    },
  });

  return newCollection;
}
