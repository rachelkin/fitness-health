'use client'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Exercise { name: string; sets?: string; reps?: string; duration?: string; notes?: string }
interface ExerciseProgress { name: string; completed: boolean }

export default function DayPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const date = params.date as string

  const [exercises, setExercises] = useState<ExerciseProgress[]>([])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [planName, setPlanName] = useState('')
  const [overallPct, setOverallPct] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (!session) return
    const user = session.user as any
    const planId = user.selectedPlanId
    if (!planId) return

    fetch(`/api/plans/${planId}`).then(r => r.json()).then(plan => {
      setPlanName(plan.name || '')
      // Flatten all exercises from all days/categories into one list
      const allExercises: ExerciseProgress[] = (plan.days || []).flatMap((day: any) =>
        (day.exercises || []).map((ex: Exercise) => ({ name: ex.name, completed: false }))
      )

      fetch(`/api/progress?date=${date}`).then(r => r.json()).then(progress => {
        if (progress?.exercises?.length) {
          setExercises(progress.exercises)
          setNotes(progress.notes || '')
        } else {
          setExercises(allExercises)
        }
      })
    })

    // Overall plan progress
    fetch('/api/progress').then(r => r.json()).then(all => {
      if (!Array.isArray(all)) return
      const startDate = user.startDate ? new Date(user.startDate) : null
      const endDate = user.endDate ? new Date(user.endDate) : null
      if (!startDate || !endDate) return
      const today = new Date(); today.setHours(0,0,0,0)
      const days: string[] = []
      const cur = new Date(startDate); cur.setHours(0,0,0,0)
      while (cur <= today && cur <= endDate) {
        days.push(cur.toISOString().split('T')[0])
        cur.setDate(cur.getDate() + 1)
      }
      const progressMap: Record<string, any> = {}
      all.forEach((p: any) => { progressMap[p.date] = p })
      const doneDays = days.filter(d => {
        const p = progressMap[d]
        if (!p || !p.exercises?.length) return false
        return p.exercises.every((e: any) => e.completed)
      }).length
      setOverallPct(days.length > 0 ? Math.round((doneDays / days.length) * 100) : 0)
      setLoading(false)
    })
  }, [session, date])

  async function saveProgress() {
    setSaving(true)
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, exercises, notes, planId: (session?.user as any)?.selectedPlanId }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function toggle(i: number) {
    setExercises(prev => prev.map((ex, idx) => idx === i ? { ...ex, completed: !ex.completed } : ex))
    setSaved(false)
  }

  if (status === 'loading' || loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--text2)', fontSize: 18 }}>טוען...</div>
    </div>
  )

  const dateObj = new Date(date)
  const dateStr = dateObj.toLocaleDateString('he-IL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const done = exercises.filter(e => e.completed).length
  const total = exercises.length
  const dayPct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0608 0%, #1a0810 50%, #0d0408 100%)',
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(10,6,8,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(192,48,90,0.2)',
        padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/dashboard" style={{
          color: 'var(--accent3)', fontSize: 14, textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600,
        }}>
          ← חזרה לדשבורד
        </Link>
        <span style={{ color: 'var(--text2)', fontSize: 13 }}>{planName}</span>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px' }}>

        {/* Date header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text)', marginBottom: 6 }}>{dateStr}</h1>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>סמני את מה שהספקת היום</p>
        </div>

        {/* Progress cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
          {/* Daily */}
          <div style={{
            background: 'rgba(192,48,90,0.1)',
            border: '1px solid rgba(192,48,90,0.3)',
            borderRadius: 16, padding: '20px',
          }}>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8, fontWeight: 600 }}>הצלחה היום</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--accent3)', marginBottom: 10 }}>{dayPct}%</div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 6, height: 6 }}>
              <div style={{
                background: dayPct === 100
                  ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                  : 'linear-gradient(90deg, var(--accent), var(--accent3))',
                borderRadius: 6, height: '100%',
                width: `${dayPct}%`, transition: 'width 0.4s ease',
              }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6 }}>{done} / {total} פעילויות</div>
          </div>

          {/* Overall */}
          <div style={{
            background: 'rgba(255,124,58,0.08)',
            border: '1px solid rgba(255,124,58,0.25)',
            borderRadius: 16, padding: '20px',
          }}>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8, fontWeight: 600 }}>התקדמות כללית</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--gold2)', marginBottom: 10 }}>{overallPct}%</div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 6, height: 6 }}>
              <div style={{
                background: 'linear-gradient(90deg, var(--gold), var(--gold2))',
                borderRadius: 6, height: '100%',
                width: `${overallPct}%`, transition: 'width 0.4s ease',
              }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6 }}>מהתכנית הושלמה</div>
          </div>
        </div>

        {/* Exercises */}
        {exercises.length === 0 ? (
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: '48px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>😴</div>
            <p style={{ color: 'var(--text2)' }}>אין פעילות מתוכננת ליום זה</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {exercises.map((ex, i) => (
              <div key={i} onClick={() => toggle(i)} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: ex.completed ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${ex.completed ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 14, padding: '16px 18px', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = ex.completed ? 'rgba(74,222,128,0.6)' : 'rgba(192,48,90,0.4)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = ex.completed ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.08)'}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: ex.completed ? 'rgba(74,222,128,0.8)' : 'transparent',
                  border: `2px solid ${ex.completed ? '#4ade80' : 'rgba(255,255,255,0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 14, transition: 'all 0.2s',
                }}>
                  {ex.completed ? '✓' : ''}
                </div>
                <div style={{ flex: 1 }}>
                  {(() => {
                    const match = ex.name.match(/^(.+?)\s*(\(.+\))\s*$/);
                    const main = match ? match[1] : ex.name;
                    const paren = match ? match[2] : null;
                    return (
                      <>
                        <div style={{
                          fontSize: 17, fontWeight: 800,
                          color: ex.completed ? '#4ade80' : 'var(--text)',
                          textDecoration: ex.completed ? 'line-through' : 'none',
                          opacity: ex.completed ? 0.75 : 1,
                          transition: 'all 0.2s',
                          letterSpacing: 0.2,
                        }}>
                          {main}
                        </div>
                        {paren && (
                          <div style={{
                            fontSize: 14, fontWeight: 700,
                            color: ex.completed ? 'rgba(74,222,128,0.7)' : 'var(--accent3)',
                            marginTop: 2,
                            opacity: ex.completed ? 0.7 : 1,
                          }}>
                            {paren}
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notes */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, padding: '20px', marginBottom: 20,
        }}>
          <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 10, fontWeight: 600 }}>
            📝 הערות לאימון
          </label>
          <textarea value={notes} onChange={e => { setNotes(e.target.value); setSaved(false) }}
            placeholder="איך הרגשת? מה היה קשה? מה הצלחת?"
            rows={3} style={{ resize: 'vertical', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }} />
        </div>

        {/* Save button */}
        <button onClick={saveProgress} disabled={saving} style={{
          width: '100%', padding: '15px', fontSize: 17, fontWeight: 700,
          background: saved
            ? 'linear-gradient(135deg, #22c55e, #4ade80)'
            : 'linear-gradient(135deg, var(--accent), var(--accent2))',
          color: '#fff', border: 'none', borderRadius: 14, cursor: 'pointer',
          transition: 'all 0.3s',
          boxShadow: saved ? '0 4px 24px rgba(74,222,128,0.3)' : '0 4px 24px var(--glow)',
        }}>
          {saving ? '⏳ שומר...' : saved ? '✅ נשמר בהצלחה!' : 'שמור התקדמות'}
        </button>
      </div>
    </div>
  )
}
