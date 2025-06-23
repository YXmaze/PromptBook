import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });

  const collections = await prisma.collection.findMany({
    where: { userId },
    include: { cells: true },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(collections);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, name } = body;
  if (!userId || !name) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const newCollection = await prisma.collection.create({
    data: { userId, name }
  });

  return NextResponse.json(newCollection, { status: 201 });
}
