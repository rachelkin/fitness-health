'use client'
import { useState, useRef, useEffect } from 'react'

interface Message { role: 'user' | 'assistant'; content: string }

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'שלום! 💪 אני העוזרת האישית שלך לכושר ותזונה. איך אוכל לעזור?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => Math.random().toString(36).slice(2))
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (e: any) {
      console.error('Chat error:', e)
      setMessages(prev => [...prev, { role: 'assistant', content: `שגיאה: ${e.message}` }])
    }
    setLoading(false)
  }

  return (
    <>
      {/* כפתור פתיחה */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 32, left: 32, zIndex: 9999,
          width: 'auto', height: 56, borderRadius: 28,
          background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)',
          border: '1px solid rgba(255,143,171,0.3)',
          cursor: 'pointer',
          boxShadow: '0 6px 32px var(--glow), 0 0 0 1px rgba(192,48,90,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '0 22px',
          fontSize: 15, fontWeight: 700, color: '#fff',
          letterSpacing: 0.3,
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px)'
          e.currentTarget.style.boxShadow = '0 10px 40px var(--glow)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 6px 32px var(--glow), 0 0 0 1px rgba(192,48,90,0.2)'
        }}
        title="עוזרת אישית"
      >
        <span style={{ fontSize: 20 }}>{open ? '✕' : '💪'}</span>
        {!open && <span>עוזרת אישית</span>}
      </button>

      {/* חלון הצ'אט */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 100, left: 28, zIndex: 9998,
          width: 340, maxHeight: 500,
          background: '#120810',
          border: '1px solid rgba(192,48,90,0.3)',
          borderRadius: 20,
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* כותרת */}
          <div style={{
            padding: '14px 18px',
            background: 'linear-gradient(135deg, rgba(192,48,90,0.2), rgba(232,80,122,0.1))',
            borderBottom: '1px solid rgba(192,48,90,0.2)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>💪</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>עוזרת כושר אישית</div>
              <div style={{ fontSize: 11, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
                מחוברת
              </div>
            </div>
          </div>

          {/* הודעות */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '14px 14px 8px',
            display: 'flex', flexDirection: 'column', gap: 10,
            maxHeight: 340,
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: m.role === 'user' ? 'flex-start' : 'flex-end',
              }}>
                <div style={{
                  maxWidth: '82%',
                  padding: '9px 13px',
                  borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: m.role === 'user'
                    ? 'rgba(192,48,90,0.2)'
                    : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${m.role === 'user' ? 'rgba(192,48,90,0.35)' : 'rgba(255,255,255,0.08)'}`,
                  fontSize: 13, color: 'var(--text)', lineHeight: 1.55,
                  direction: 'rtl',
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  padding: '9px 14px', borderRadius: '16px 16px 16px 4px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: 18, letterSpacing: 3,
                }}>
                  <span style={{ animation: 'pulse 1s infinite' }}>•••</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* שדה קלט */}
          <div style={{
            padding: '10px 12px',
            borderTop: '1px solid rgba(192,48,90,0.15)',
            display: 'flex', gap: 8,
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="שאלי אותי על כושר ותזונה..."
              style={{
                flex: 1, padding: '9px 13px', fontSize: 13,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(192,48,90,0.2)',
                borderRadius: 12, color: 'var(--text)',
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                padding: '9px 14px', borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                color: '#fff', cursor: 'pointer', fontSize: 16,
                opacity: loading || !input.trim() ? 0.5 : 1,
                transition: 'opacity 0.2s',
              }}
            >→</button>
          </div>
        </div>
      )}
    </>
  )
}
