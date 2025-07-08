"use server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createUserIfNotExists(user: {
  id: string;
  email: string;
  name: string | null;
}) {
  const existing = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!existing) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  }

  return { success: true };
}
