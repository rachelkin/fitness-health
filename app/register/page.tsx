'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error); return }
    router.push('/')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            position: 'relative', width: 80, height: 80, margin: '0 auto 16px',
            borderRadius: '50%',
            boxShadow: '0 0 30px rgba(124,92,191,0.5)',
            border: '2px solid rgba(196,168,255,0.4)',
          }}>
            <Image src="/images/LOGO.jpg" alt="logo" fill style={{ borderRadius: '50%', objectFit: 'cover' }} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 6 }}>
            <span className="gradient-text">הצטרף אלינו</span>
          </h1>
          <p style={{ color: 'var(--text3)', fontSize: 14 }}>צור חשבון חינמי ותתחיל את המסע שלך</p>
        </div>

        <div className="glass" style={{ padding: '36px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 600 }}>
                שם מלא
              </label>
              <input placeholder="ישראל ישראלי" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 600 }}>
                כתובת מייל
              </label>
              <input type="email" placeholder="example@email.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 600 }}>
                סיסמה
              </label>
              <input type="password" placeholder="לפחות 6 תווים" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
            </div>

            {error && (
              <div style={{
                background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
                borderRadius: 10, padding: '12px 16px', color: 'var(--red)', fontSize: 14,
              }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading}
              style={{ padding: '13px', fontSize: 16, marginTop: 4 }}>
              {loading ? '⏳ נרשם...' : '✨ הרשמה חינמית'}
            </button>
          </form>

          <div className="divider" style={{ margin: '20px 0' }} />

          <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 14 }}>
            כבר יש לך חשבון?{' '}
            <Link href="/login" style={{ color: 'var(--accent3)', fontWeight: 700, textDecoration: 'none' }}>
              כניסה →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
