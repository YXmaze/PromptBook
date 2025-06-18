"use server";

import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

interface CreateCellParams {
  userId: string;
  collectionId: string;
  position: number;
  prompt?: string | null;
  result?: string | null;
  review?: string | null;
}

export async function createCell({
  userId,
  collectionId,
  position,
  prompt = null,
  result = null,
  review = null,
}: CreateCellParams) {
  const cell = await prisma.cell.create({
    data: {
      userId,
      collectionId,
      position,
      prompt,
      result,
      review,
    },
  });
  return cell;
}
