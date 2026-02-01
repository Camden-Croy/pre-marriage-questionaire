import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const prompts = await db.prompt.findMany({
    orderBy: { order: 'asc' },
    select: {
      id: true,
      title: true,
      text: true,
      order: true,
    },
  })

  return NextResponse.json({ prompts })
}
