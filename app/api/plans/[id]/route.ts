import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { WorkoutPlan } from '@/models/WorkoutPlan'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await connectDB()
    const plan = await WorkoutPlan.findById(id)
    if (!plan) return NextResponse.json({ error: 'לא נמצא' }, { status: 404 })
    return NextResponse.json(plan)
  } catch (e) {
    console.error('Plan detail API error:', e)
    return NextResponse.json({ error: 'שגיאת שרת' }, { status: 500 })
  }
}
