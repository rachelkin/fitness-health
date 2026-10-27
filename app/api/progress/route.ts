import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { DailyProgress } from '@/models/DailyProgress'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })

  const date = req.nextUrl.searchParams.get('date')
  await connectDB()

  if (date) {
    const progress = await DailyProgress.findOne({ userId: session.user.id, date })
    return NextResponse.json(progress || null)
  }

  const all = await DailyProgress.find({ userId: session.user.id }, 'date exercises')
  return NextResponse.json(all)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })

  const { date, exercises, planId, notes } = await req.json()
  await connectDB()

  const progress = await DailyProgress.findOneAndUpdate(
    { userId: session.user.id, date },
    { exercises, planId, notes },
    { upsert: true, new: true }
  )
  return NextResponse.json(progress)
}
