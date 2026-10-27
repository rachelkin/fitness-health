'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface DayProgress { date: string; exercises: { name: string; completed: boolean }[] }

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [allProgress, setAllProgress] = useState<DayProgress[]>([])
  const [planName, setPlanName] = useState('')
  const [todayExercises, setTodayExercises] = useState<{ name: string; completed: boolean }[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (!session) return
    const user = session.user as any
    const planId = user.selectedPlanId
    if (!planId) return

    const today = new Date().toISOString().split('T')[0]

    fetch(`/api/plans/${planId}`).then(r => r.json()).then(plan => {
      setPlanName(plan.name || '')
      const base = (plan.days || []).flatMap((day: any) =>
        (day.exercises || []).map((ex: any) => ({ name: ex.name, completed: false }))
      )

      fetch(`/api/progress?date=${today}`).then(r => r.json()).then(p => {
        setTodayExercises(p?.exercises?.length ? p.exercises : base)
      })
    })

    fetch('/api/progress').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setAllProgress(data)
    })
  }, [session])

  if (status === 'loading') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--text2)' }}>טוען...</div>
    </div>
  )
  if (!session) return null

  const user = session.user as any
  const startDate = user.startDate ? new Date(user.startDate) : null
  const endDate = user.endDate ? new Date(user.endDate) : null

  if (!startDate || !endDate || !user.selectedPlanId) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{
          maxWidth: 480, width: '100%', textAlign: 'center',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(192,48,90,0.2)',
          borderRadius: 24, padding: '56px 40px',
        }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🏋️</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text)', marginBottom: 12 }}>
            ברוכה הבאה, {session.user?.name}!
          </h2>
          <p style={{ color: 'var(--text2)', marginBottom: 32, lineHeight: 1.7 }}>
            עדיין לא בחרת תוכנית. בחרי תוכנית כדי להתחיל לעקוב אחר האימונים שלך.
          </p>
          <Link href="/plans" className="btn-primary" style={{ fontSize: 16, padding: '14px 36px' }}>
            בחרי תוכנית אימון
          </Link>
        </div>
      </div>
    )
  }

  // Build calendar days
  const days: Date[] = []
  const cur = new Date(startDate); cur.setHours(0,0,0,0)
  const end = new Date(endDate); end.setHours(0,0,0,0)
  while (cur <= end) { days.push(new Date(cur)); cur.setDate(cur.getDate() + 1) }

  const progressMap: Record<string, DayProgress> = {}
  allProgress.forEach(p => { progressMap[p.date] = p })

  const today = new Date(); today.setHours(0,0,0,0)
  const todayKey = today.toISOString().split('T')[0]

  function getDayStatus(date: Date) {
    const key = date.toISOString().split('T')[0]
    const p = progressMap[key]
    if (!p || !p.exercises?.length) return date < today ? 'missed' : date.getTime() === today.getTime() ? 'today' : 'future'
    const done = p.exercises.filter(e => e.completed).length
    if (done === p.exercises.length) return 'done'
    if (done > 0) return 'partial'
    return date < today ? 'missed' : 'today'
  }

  const pastDays = days.filter(d => d <= today)
  const doneDays = pastDays.filter(d => getDayStatus(d) === 'done').length
  const overallPct = pastDays.length > 0 ? Math.round((doneDays / pastDays.length) * 100) : 0
  const totalDays = days.length

  const todayDone = todayExercises.filter(e => e.completed).length
  const todayTotal = todayExercises.length
  const todayPct = todayTotal > 0 ? Math.round((todayDone / todayTotal) * 100) : 0

  const statusColors: Record<string, { bg: string; border: string; color: string }> = {
    done:    { bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.5)',  color: '#4ade80' },
    partial: { bg: 'rgba(255,170,96,0.12)',  border: 'rgba(255,170,96,0.5)',  color: '#ffaa60' },
    today:   { bg: 'rgba(192,48,90,0.15)',   border: 'rgba(192,48,90,0.6)',   color: 'var(--accent3)' },
    missed:  { bg: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.4)', color: '#f87171' },
    future:  { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)', color: 'var(--text3)' },
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '36px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>
          שלום, {session.user?.name} 👋
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: 15 }}>
          תוכנית: <span style={{ color: 'var(--accent3)', fontWeight: 700 }}>{planName}</span>
          {' · '}
          {startDate.toLocaleDateString('he-IL')} — {endDate.toLocaleDateString('he-IL')}
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 32 }}>
        <div style={{ background: 'rgba(192,48,90,0.1)', border: '1px solid rgba(192,48,90,0.25)', borderRadius: 16, padding: '20px 22px' }}>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6, fontWeight: 600 }}>הצלחה היום</div>
          <div style={{ fontSize: 34, fontWeight: 900, color: 'var(--accent3)', marginBottom: 8 }}>{todayPct}%</div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 4, height: 5 }}>
            <div style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent3))', borderRadius: 4, height: '100%', width: `${todayPct}%`, transition: 'width 0.4s' }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5 }}>{todayDone}/{todayTotal} פעילויות</div>
        </div>

        <div style={{ background: 'rgba(255,124,58,0.08)', border: '1px solid rgba(255,124,58,0.2)', borderRadius: 16, padding: '20px 22px' }}>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6, fontWeight: 600 }}>התקדמות כללית</div>
          <div style={{ fontSize: 34, fontWeight: 900, color: 'var(--gold2)', marginBottom: 8 }}>{overallPct}%</div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 4, height: 5 }}>
            <div style={{ background: 'linear-gradient(90deg, var(--gold), var(--gold2))', borderRadius: 4, height: '100%', width: `${overallPct}%`, transition: 'width 0.4s' }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5 }}>{doneDays}/{pastDays.length} ימים הושלמו</div>
        </div>

        <div style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.18)', borderRadius: 16, padding: '20px 22px' }}>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6, fontWeight: 600 }}>ימים בתכנית</div>
          <div style={{ fontSize: 34, fontWeight: 900, color: 'var(--green)', marginBottom: 8 }}>{totalDays}</div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 4, height: 5 }}>
            <div style={{ background: 'linear-gradient(90deg, #4ade80, #22c55e)', borderRadius: 4, height: '100%', width: `${Math.round((pastDays.length/totalDays)*100)}%`, transition: 'width 0.4s' }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5 }}>{pastDays.length} ימים עברו</div>
        </div>
      </div>

      {/* Today's workout quick access */}
      <Link href={`/dashboard/${todayKey}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 32 }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(192,48,90,0.15) 0%, rgba(255,124,58,0.08) 100%)',
          border: '1px solid rgba(192,48,90,0.35)',
          borderRadius: 20, padding: '24px 28px',
          transition: 'all 0.2s',
          cursor: 'pointer',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(192,48,90,0.6)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(192,48,90,0.35)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 4, fontWeight: 600 }}>📍 האימון שלך היום</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>
                {today.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--accent3)' }}>{todayPct}%</div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {todayExercises.slice(0, 5).map((ex, i) => (
              <span key={i} style={{
                padding: '5px 12px', borderRadius: 20, fontSize: 13,
                background: ex.completed ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${ex.completed ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.1)'}`,
                color: ex.completed ? '#4ade80' : 'var(--text2)',
                textDecoration: ex.completed ? 'line-through' : 'none',
              }}>
                {ex.completed ? '✓ ' : ''}{ex.name}
              </span>
            ))}
            {todayExercises.length > 5 && (
              <span style={{ padding: '5px 12px', borderRadius: 20, fontSize: 13, color: 'var(--text3)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                +{todayExercises.length - 5} עוד
              </span>
            )}
          </div>
          <div style={{ marginTop: 14, color: 'var(--accent3)', fontSize: 14, fontWeight: 600 }}>
            לחצי לסימון האימון ←
          </div>
        </div>
      </Link>

      {/* Calendar */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>לוח האימונים</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))', gap: 8 }}>
          {days.map(day => {
            const key = day.toISOString().split('T')[0]
            const st = getDayStatus(day)
            const s = statusColors[st]
            const isToday = day.getTime() === today.getTime()
            return (
              <Link key={key} href={`/dashboard/${key}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: s.bg, border: `1.5px solid ${s.border}`,
                  borderRadius: 12, padding: '10px 6px', textAlign: 'center',
                  cursor: 'pointer', transition: 'transform 0.12s',
                  boxShadow: isToday ? `0 0 0 2px ${s.border}` : 'none',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.07)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
                >
                  <div style={{ fontSize: 10, color: s.color, fontWeight: 600 }}>
                    {day.toLocaleDateString('he-IL', { weekday: 'short' })}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.color, margin: '2px 0' }}>{day.getDate()}</div>
                  <div style={{ fontSize: 11 }}>
                    {st === 'done' ? '✅' : st === 'partial' ? '⚡' : st === 'missed' ? '❌' : st === 'today' ? '📍' : ''}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Link href="/plans" style={{ color: 'var(--text3)', fontSize: 13, textDecoration: 'none' }}>
          החלף תוכנית ←
        </Link>
      </div>
    </div>
  )
}
