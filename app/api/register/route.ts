import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()
    if (!name || !email || !password)
      return NextResponse.json({ error: 'כל השדות נדרשים' }, { status: 400 })

    await connectDB()
    const exists = await User.findOne({ email })
    if (exists)
      return NextResponse.json({ error: 'המייל כבר רשום במערכת' }, { status: 400 })

    const hashed = await bcrypt.hash(password, 12)
    await User.create({ name, email, password: hashed })
    return NextResponse.json({ message: 'נרשמת בהצלחה!' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'שגיאת שרת' }, { status: 500 })
  }
}
