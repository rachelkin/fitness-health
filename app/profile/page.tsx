'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [planName, setPlanName] = useState('')
  const [stats, setStats] = useState({ done: 0, total: 0, streak: 0 })

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (!session) return
    const user = session.user as any
    if (user.selectedPlanId) {
      fetch(`/api/plans/${user.selectedPlanId}`).then(r => r.json()).then(p => setPlanName(p.name || ''))
    }
    fetch('/api/progress').then(r => r.json()).then((data: any[]) => {
      if (!Array.isArray(data)) return
      const done = data.filter(d => d.exercises?.every((e: any) => e.completed)).length
      // Calculate streak
      let streak = 0
      const today = new Date()
      for (let i = 0; i < 365; i++) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        const key = d.toISOString().split('T')[0]
        const p = data.find(x => x.date === key)
        if (p && p.exercises?.length > 0 && p.exercises.every((e: any) => e.completed)) streak++
        else if (i > 0) break
      }
      setStats({ done, total: data.length, streak })
    })
  }, [session])

  if (status === 'loading') return <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>טוען...</div>
  if (!session) return null

  const user = session.user as any
  const startDate = user.startDate ? new Date(user.startDate).toLocaleDateString('he-IL') : '—'
  const endDate = user.endDate ? new Date(user.endDate).toLocaleDateString('he-IL') : '—'

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-dark)', marginBottom: 28 }}>הפרופיל שלי</h1>

      {/* Avatar + info */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--accent)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 30, color: '#fff', fontWeight: 700, flexShrink: 0,
        }}>
          {session.user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-dark)', marginBottom: 4 }}>
            {session.user?.name}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>{session.user?.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'אימונים הושלמו', value: stats.done, icon: '✅' },
          { label: 'ימים מעוקבים', value: stats.total, icon: '📅' },
          { label: 'רצף ימים', value: stats.streak, icon: '🔥' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center', padding: '16px 10px' }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--accent-dark)' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Current plan */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, color: 'var(--accent-dark)', marginBottom: 14, fontSize: 17 }}>תוכנית נוכחית</h3>
        {planName ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>תוכנית</span>
              <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{planName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>תאריך התחלה</span>
              <span style={{ fontWeight: 600 }}>{startDate}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>תאריך סיום</span>
              <span style={{ fontWeight: 600 }}>{endDate}</span>
            </div>
          </>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>לא נבחרה תוכנית עדיין</p>
        )}
        <Link href="/plans" className="btn-outline"
          style={{ display: 'inline-block', marginTop: 16, textDecoration: 'none', fontSize: 14, padding: '8px 20px' }}>
          {planName ? 'החלף תוכנית' : 'בחר תוכנית'}
        </Link>
      </div>
    </div>
  )
}
