import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json()
  if (!name || !email || !message)
    return NextResponse.json({ error: 'כל השדות נדרשים' }, { status: 400 })

  const res = await fetch('https://formspree.io/f/xppqlopy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ name, email, message }),
  })

  if (!res.ok) return NextResponse.json({ error: 'שגיאה בשליחה' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
