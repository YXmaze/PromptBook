"use server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getCollections(userId: string) {
  if (!userId) return [];

  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  return collections;
}
