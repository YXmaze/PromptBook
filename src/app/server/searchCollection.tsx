"use server";

import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

export async function searchCollections({
  userId,
  query,
}: {
  userId: string;
  query: string;
}) {
  const collections = await prisma.collection.findMany({
    where: {
      userId,
      name: {
        contains: query,
        mode: "insensitive", // case-insensitive search
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return collections;
}
