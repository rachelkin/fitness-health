'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

export default function HomePage() {
  const logoRef = useRef<HTMLDivElement>(null)

  // Parallax float on logo
  useEffect(() => {
    let t = 0
    let raf: number
    const animate = () => {
      t += 0.012
      if (logoRef.current) {
        const y = Math.sin(t) * 10
        const rot = Math.sin(t * 0.7) * 1.5
        logoRef.current.style.transform = `translateY(${y}px) rotate(${rot}deg)`
      }
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(raf)
  }, [])

  const stats = [
    { value: '12+', label: 'תוכניות אימון' },
    { value: '100%', label: 'מותאם אישית' },
    { value: '24/7', label: 'זמין תמיד' },
    { value: '∞',   label: 'מוטיבציה' },
  ]

  const features = [
    { title: 'לוח שנה חכם',      desc: 'עקבי אחר כל יום אימון בלוח שנה ויזואלי. ראי בדיוק איפה את עומדת ולאן את הולכת.', color: '#7c5cbf' },
    { title: 'תוכניות מגוונות',   desc: 'קרדיו, כוח, יוגה, HIIT ועוד — תוכניות מקצועיות לכל רמה ומטרה.',                  color: '#e879a0' },
    { title: 'מעקב יומי',         desc: 'סמני כל תרגיל שביצעת, הוסיפי הערות ועקבי אחר ההתקדמות שלך בזמן אמת.',            color: '#4ade80' },
    { title: 'סטטיסטיקות',        desc: 'ראי את הרצף שלך, אחוז העמידה ביעדים ועוד נתונים שיניעו אותך קדימה.',             color: '#f0c060' },
    { title: 'אזור אישי מאובטח',  desc: 'כל הנתונים שלך שמורים בענן ומאובטחים. גשי מכל מכשיר בכל זמן.',                  color: '#22d3ee' },
    { title: 'מבוסס מחקר',        desc: 'תוכניות המבוססות על עקרונות הרמב"ם ומחקרי ספורט ותזונה עדכניים.',                 color: '#fb923c' },
  ]

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{
        minHeight: 'calc(100vh - 72px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '60px 24px',
        position: 'relative', overflow: 'hidden',
      }}>

        {/* ── LOGO — ריבועי, ענק, צף ── */}
        <div ref={logoRef} className="fade-in" style={{
          position: 'relative',
          width: 'clamp(220px, 28vw, 340px)',
          aspectRatio: '891 / 822',
          marginBottom: 40,
          borderRadius: 28,
          willChange: 'transform',
          filter: 'drop-shadow(0 0 40px rgba(124,92,191,0.7)) drop-shadow(0 0 80px rgba(124,92,191,0.35)) drop-shadow(0 0 140px rgba(124,92,191,0.15))',
        }}>
          <Image
            src="/images/LOGO.jpg"
            alt="FitnessHealth"
            fill
            style={{ borderRadius: 28, objectFit: 'cover' }}
            priority
          />

          {/* Animated border frame */}
          <div style={{
            position: 'absolute', inset: -3,
            borderRadius: 32,
            background: 'linear-gradient(135deg, rgba(196,168,255,0.7), rgba(240,192,96,0.5), rgba(232,121,160,0.6), rgba(34,211,238,0.4))',
            backgroundSize: '300% 300%',
            animation: 'borderRotate 4s linear infinite',
            zIndex: -1,
            padding: 3,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }} />

          {/* Corner accents */}
          {[
            { top: -6, right: -6 },
            { top: -6, left: -6 },
            { bottom: -6, right: -6 },
            { bottom: -6, left: -6 },
          ].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute', ...pos,
              width: 18, height: 18,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(196,168,255,0.9), rgba(240,192,96,0.7))',
              animation: `cornerPulse 2s ${i*0.5}s ease-in-out infinite`,
            }} />
          ))}
        </div>

        <div className="badge badge-purple fade-in-2" style={{ marginBottom: 20, fontSize: 13, padding: '6px 18px' }}>
          אימון אישי מקצועי ומתקדם
        </div>

        <h1 className="fade-in-2" style={{
          fontSize: 'clamp(36px, 6vw, 74px)',
          fontWeight: 900, lineHeight: 1.08,
          marginBottom: 22, maxWidth: 820,
        }}>
          <span className="gradient-text">מהיום</span>
          <br />
          <span style={{ color: 'var(--text)' }}>את המאמנת של עצמך</span>
        </h1>

        <p className="fade-in-3" style={{
          fontSize: 'clamp(16px, 2vw, 20px)',
          color: 'var(--text2)', maxWidth: 540,
          lineHeight: 1.75, marginBottom: 44,
        }}>
          תוכניות אימון מקצועיות, לוח שנה אישי ומעקב יומי — הכל במקום אחד.
          בזמן שלך, בקצב שלך, בנוחות שלך.
        </p>

        <div className="fade-in-4" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 64 }}>
          <Link href="/register" className="btn-gold" style={{ fontSize: 17, padding: '15px 44px' }}>
            התחילי עכשיו — חינם
          </Link>
          <Link href="/plans" className="btn-outline" style={{ fontSize: 17, padding: '15px 36px' }}>
            צפי בתוכניות
          </Link>
        </div>

        {/* Stats */}
        <div className="fade-in-4 glass" style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center', overflow: 'hidden',
        }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{
              padding: '20px 38px', textAlign: 'center',
              borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--accent3)', letterSpacing: -1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4, letterSpacing: 0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '100px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="badge badge-purple" style={{ marginBottom: 16 }}>הפיצ׳רים שלנו</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800, marginBottom: 16 }}>
            כל מה שצריך{' '}
            <span className="gradient-text-purple">במקום אחד</span>
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 17, maxWidth: 480, margin: '0 auto' }}>
            פלטפורמה מלאה לניהול האימונים שלך
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {features.map(f => (
            <div key={f.title} className="glass card-hover"
              style={{ padding: '32px', cursor: 'default' }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = f.color + '44'
                el.style.boxShadow = `0 24px 48px ${f.color}18, 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(255,255,255,0.06)'
                el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
              }}>
              <div style={{
                height: 3, borderRadius: 2,
                background: `linear-gradient(90deg, ${f.color}, transparent)`,
                marginBottom: 20,
              }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.75 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 24px 120px', textAlign: 'center' }}>
        <div style={{
          maxWidth: 700, margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(124,92,191,0.12) 0%, rgba(232,121,160,0.08) 100%)',
          border: '1px solid rgba(124,92,191,0.25)',
          borderRadius: 28, padding: '64px 48px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,92,191,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* לוגו ריבועי ב-CTA */}
          <div style={{
            position: 'relative', width: 110,
            aspectRatio: '891/822',
            margin: '0 auto 24px', borderRadius: 16,
            filter: 'drop-shadow(0 0 24px rgba(240,192,96,0.6)) drop-shadow(0 0 48px rgba(240,192,96,0.25))',
            animation: 'floatLogo 4s ease-in-out infinite',
          }}>
            <Image src="/images/LOGO.jpg" alt="logo" fill style={{ borderRadius: 16, objectFit: 'cover' }} />
          </div>

          <h2 style={{ fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 900, marginBottom: 16, position: 'relative' }}>
            מוכנה להתחיל?
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 17, marginBottom: 36, lineHeight: 1.7, position: 'relative' }}>
            הצטרפי עכשיו בחינם ובחרי את תוכנית האימון שמתאימה לך
          </p>
          <Link href="/register" className="btn-gold" style={{ fontSize: 18, padding: '16px 52px', position: 'relative' }}>
            הרשמה חינמית
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes borderRotate {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes cornerPulse {
          0%,100% { opacity: 0.6; transform: scale(1); }
          50%     { opacity: 1;   transform: scale(1.3); }
        }
        @keyframes floatLogo {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}

//איך להריץ את האתר הזה?
//בטרמינל:

//cd "C:\Users\רחל\Desktop\FitnessHealth\fitness-health"
//npm run dev

//ואז פתחי דפדפן על http://localhost:3000


