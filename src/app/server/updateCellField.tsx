"use server";

import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

export async function updateCellField({
  cellId,
  field,
  value,
}: {
  cellId: string;
  field: "prompt" | "result" | "review";
  value: string;
}) {
  return prisma.cell.update({
    where: { id: cellId },
    data: {
      [field]: value,
    },
  });
}
