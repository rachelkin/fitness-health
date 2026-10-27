'use client'
import { useState } from 'react'

export default function Footer() {
  const year = new Date().getFullYear()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setSending(true); setError('')
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSending(false)
    if (res.ok) {
      setSent(true)
      setTimeout(() => { setOpen(false); setSent(false); setForm({ name: '', email: '', message: '' }) }, 2500)
    } else {
      setError('שגיאה בשליחה, נסי שוב')
    }
  }

  return (
    <>
      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(192,48,90,0.2)',
        padding: '28px 24px',
        textAlign: 'center',
        background: 'rgba(10,6,8,0.7)',
        backdropFilter: 'blur(12px)',
      }}>
        <p style={{ fontSize: 16, color: 'var(--text2)', margin: 0, fontWeight: 600 }}>
          © {year} כל הזכויות שמורות ·{' '}
          <button
            onClick={() => setOpen(true)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--accent3)', fontWeight: 700, fontSize: 16,
              textDecoration: 'underline', padding: 0,
            }}
          >
            rachel67960@gmail.com
          </button>
        </p>
      </footer>

      {/* Contact modal */}
      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }} onClick={() => setOpen(false)}>
          <div style={{
            background: '#120810', border: '1px solid rgba(192,48,90,0.3)',
            borderRadius: 20, padding: '36px', width: '100%', maxWidth: 460,
          }} onClick={e => e.stopPropagation()}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)' }}>✉️ שלחי הודעה</h2>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            {sent ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <p style={{ color: 'var(--green)', fontSize: 18, fontWeight: 700 }}>ההודעה נשלחה בהצלחה!</p>
              </div>
            ) : (
              <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 600 }}>שם מלא</label>
                  <input placeholder="השם שלך" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 600 }}>כתובת מייל</label>
                  <input type="email" placeholder="המייל שלך" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: 13, color: 'var(--text2)', display: 'block', marginBottom: 6, fontWeight: 600 }}>הודעה</label>
                  <textarea placeholder="מה תרצי לשאול, להעיר, להאיר?..." rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required style={{ resize: 'vertical' }} />
                </div>
                {error && <p style={{ color: 'var(--red)', fontSize: 14 }}>⚠️ {error}</p>}
                <button type="submit" disabled={sending} style={{
                  padding: '13px', fontSize: 16, fontWeight: 700,
                  background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                  color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer',
                  boxShadow: '0 4px 20px var(--glow)',
                }}>
                  {sending ? '⏳ שולח...' : 'שלחי הודעה →'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
