import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { diffWords } from 'diff' 

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const { cellId1, cellId2 } = await req.json()

  if (!cellId1 || !cellId2) {
    return NextResponse.json({ error: 'Missing cell IDs' }, { status: 400 })
  }

  const [cell1, cell2] = await Promise.all([
    prisma.cell.findUnique({ where: { id: cellId1 } }),
    prisma.cell.findUnique({ where: { id: cellId2 } })
  ])

  if (!cell1 || !cell2) {
    return NextResponse.json({ error: 'One or both cells not found' }, { status: 404 })
  }

  const diff = diffWords(cell1.result || '', cell2.result || '')

  return NextResponse.json({ diff })
}
