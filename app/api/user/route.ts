import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id)
    return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })

  const { selectedPlanId, startDate, endDate } = await req.json()
  await connectDB()
  await User.findByIdAndUpdate(session.user.id, { selectedPlanId, startDate, endDate })
  return NextResponse.json({ message: 'עודכן בהצלחה' })
}
