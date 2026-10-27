import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { WorkoutPlan } from '@/models/WorkoutPlan'

export async function GET() {
  try {
    await connectDB()
    const plans = await WorkoutPlan.find({}, 'name category description duration level color icon')
    return NextResponse.json(plans)
  } catch (e) {
    console.error('Plans API error:', e)
    return NextResponse.json([], { status: 200 })
  }
}
