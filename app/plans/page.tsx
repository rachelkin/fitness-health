'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Plan {
  _id: string
  name: string
  category: string
  description: string
  duration: string
  level: string
  color: string
  icon: string
}

interface PlanDetail extends Plan {
  fullDescription: string
  days: { dayNumber: number; dayName: string; exercises: { name: string; sets?: string; reps?: string; duration?: string; notes?: string }[] }[]
}

export default function PlansPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [selected, setSelected] = useState<PlanDetail | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [dateError, setDateError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/plans').then(r => r.json()).then(setPlans)
  }, [])

  async function openPlan(id: string) {
    const res = await fetch(`/api/plans/${id}`)
    const data = await res.json()
    setSelected(data)
    setSaved(false)
  }

  async function choosePlan() {
    if (!selected || !startDate || !endDate) return
    setSaving(true)
    await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedPlanId: selected._id, startDate, endDate }),
    })
    await update({ selectedPlanId: selected._id, startDate, endDate })
    setSaving(false)
    setSaved(true)
    setTimeout(() => router.push('/dashboard'), 1200)
  }

  const levelColor: Record<string, string> = {
    'מתחיל': '#6a9e6a',
    'בינוני': '#c9a84c',
    'מתקדם': '#c0392b',
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-dark)', marginBottom: 8 }}>תוכניות אימון</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 36, fontSize: 16 }}>
        בחר את התוכנית המתאימה לך ולחץ עליה לפרטים נוספים
      </p>

      {plans.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏋️</div>
          <p style={{ fontSize: 18 }}>תוכניות האימון יתווספו בקרוב</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>המאמנת תעלה את התוכניות למערכת</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
        {plans.map(plan => (
          <div key={plan._id} onClick={() => openPlan(plan._id)}
            className="card"
            style={{
              cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s',
              borderTop: `4px solid ${plan.color || 'var(--accent)'}`,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(139,115,85,0.15)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(139,115,85,0.07)'
            }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>{plan.icon}</div>
            <h3 style={{ fontWeight: 700, fontSize: 18, color: 'var(--accent-dark)', marginBottom: 6 }}>{plan.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 12, lineHeight: 1.5 }}>{plan.description}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ background: 'var(--border)', borderRadius: 20, padding: '3px 10px', fontSize: 12, color: 'var(--text-muted)' }}>
                {plan.category}
              </span>
              <span style={{ background: 'var(--border)', borderRadius: 20, padding: '3px 10px', fontSize: 12, color: 'var(--text-muted)' }}>
                {plan.duration}
              </span>
              <span style={{ background: levelColor[plan.level] + '22', borderRadius: 20, padding: '3px 10px',
                fontSize: 12, color: levelColor[plan.level], fontWeight: 600 }}>
                {plan.level}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Full-page plan detail */}
      {selected && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'linear-gradient(135deg, #0a0608 0%, #1a0810 50%, #0d0408 100%)',
          overflowY: 'auto',
        }}>
          {/* Top bar */}
          <div style={{
            position: 'sticky', top: 0, zIndex: 10,
            background: 'rgba(10,6,8,0.9)', backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(192,48,90,0.2)',
            padding: '16px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <button onClick={() => setSelected(null)} style={{
              background: 'none', border: 'none', color: 'var(--accent3)',
              fontSize: 14, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
            }}>← חזרה לתוכניות</button>
            <span style={{ color: 'var(--text2)', fontSize: 13 }}>{selected.category}</span>
          </div>

          <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>{selected.icon}</div>
              <h1 style={{ fontSize: 30, fontWeight: 900, color: 'var(--text)', marginBottom: 10 }}>{selected.name}</h1>
              <p style={{ color: 'var(--text2)', lineHeight: 1.75, fontSize: 15, maxWidth: 520, margin: '0 auto 20px' }}>
                {selected.fullDescription || selected.description}
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(192,48,90,0.15)', border: '1px solid rgba(192,48,90,0.3)', borderRadius: 20, padding: '4px 14px', fontSize: 13, color: 'var(--accent3)' }}>{selected.duration}</span>
                <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '4px 14px', fontSize: 13, color: 'var(--text2)' }}>{selected.level}</span>
              </div>
            </div>

            {/* Categories */}
            {selected.days?.map(day => (
              <div key={day.dayNumber} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, padding: '20px', marginBottom: 14,
              }}>
                <h4 style={{ fontWeight: 700, color: 'var(--accent3)', marginBottom: 12, fontSize: 15 }}>
                  {day.dayName || `קטגוריה ${day.dayNumber}`}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {day.exercises.map((ex, i) => (
                    <div key={i} style={{
                      background: 'rgba(255,255,255,0.04)', borderRadius: 10,
                      padding: '10px 14px', fontSize: 14,
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>{ex.name}</span>
                      {ex.sets && <span style={{ color: 'var(--text2)', marginRight: 8 }}> · {ex.sets} סטים × {ex.reps}</span>}
                      {ex.duration && <span style={{ color: 'var(--text2)', marginRight: 8 }}> · {ex.duration}</span>}
                      {ex.notes && <span style={{ color: 'var(--text3)', marginRight: 8, fontStyle: 'italic' }}> ({ex.notes})</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Choose plan section */}
            {session && (
              <div style={{
                background: 'rgba(192,48,90,0.08)', border: '1px solid rgba(192,48,90,0.25)',
                borderRadius: 20, padding: '28px', marginTop: 24,
              }}>
                <h3 style={{ fontWeight: 800, color: 'var(--text)', marginBottom: 20, fontSize: 18 }}>בחרי תקופת אימון</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 600 }}>תאריך התחלה</label>
                    <input type="date" value={startDate} min={new Date().toISOString().split('T')[0]}
                      onChange={e => {
                        const val = e.target.value
                        setStartDate(val)
                        if (endDate && endDate <= val) { setEndDate(''); setDateError('תאריך הסיום אופס — בחרי תאריך סיום חדש') }
                        else setDateError('')
                      }}
                      onBlur={e => {
                        if (e.target.value < new Date().toISOString().split('T')[0]) {
                          setStartDate('')
                          setDateError('לא ניתן לבחור תאריך שעבר')
                        }
                      }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 600 }}>תאריך סיום</label>
                    <input type="date" value={endDate} min={startDate || new Date().toISOString().split('T')[0]}
                      disabled={!startDate}
                      onChange={e => {
                        setEndDate(e.target.value)
                        setDateError('')
                      }}
                      onBlur={e => {
                        if (e.target.value && e.target.value <= startDate) {
                          setEndDate('')
                          setDateError('תאריך הסיום חייב להיות אחרי תאריך ההתחלה')
                        }
                      }} />
                  </div>
                </div>
                {dateError && <p style={{ color: '#f87171', fontSize: 13, margin: '-4px 0 4px' }}>⚠️ {dateError}</p>}
                {saved ? (
                  <div style={{
                    background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)',
                    borderRadius: 12, padding: '14px', color: '#4ade80', textAlign: 'center', fontSize: 15,
                  }}>
                    ✅ התוכנית נבחרה! עוברת לדשבורד...
                  </div>
                ) : (
                  <button className="btn-primary" onClick={choosePlan} disabled={saving || !startDate || !endDate}
                    style={{ width: '100%', padding: '14px', fontSize: 16 }}>
                    {saving ? 'שומר...' : 'בחרי תוכנית זו'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
