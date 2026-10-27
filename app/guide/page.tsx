'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function GuidePage() {
  const steps = [
    {
      num: '01', icon: '📝', title: 'הרשמה לאתר', color: '#7c5cbf',
      desc: 'לחצי על "הרשמה חינם" בפינה הימנית העליונה. הכניסי שם מלא, כתובת מייל וסיסמה. זהו — החשבון שלך מוכן תוך שניות.',
      tips: ['הסיסמה חייבת להיות לפחות 6 תווים', 'המייל ישמש לכניסה לאתר', 'אין צורך בכרטיס אשראי'],
    },
    {
      num: '02', icon: '💪', title: 'בחירת תוכנית אימון', color: '#e879a0',
      desc: 'עברי לדף "תוכניות אימון" בתפריט. תראי ריבועים צבעוניים עם כל סוגי התוכניות. לחצי על כל תוכנית לראות פרטים מלאים — תרגילים, ימים ורמת קושי.',
      tips: ['קראי את הפרטים לפני הבחירה', 'ניתן להחליף תוכנית בכל עת', 'בחרי לפי רמת הכושר שלך'],
    },
    {
      num: '03', icon: '📅', title: 'קביעת תקופת האימון', color: '#f0c060',
      desc: 'אחרי שבחרת תוכנית, קבעי תאריך התחלה וסיום. זה יכול להיות שבוע, חודש, שלושה חודשים — כל מה שמתאים לך. לחצי "בחרי תוכנית זו" ואת מוכנה.',
      tips: ['מומלץ להתחיל מחר בבוקר', 'תקופה של 4-8 שבועות אידיאלית', 'ניתן להאריך בכל עת'],
    },
    {
      num: '04', icon: '🗓️', title: 'הלוח האישי שלך', color: '#22d3ee',
      desc: 'בדף "לוח אישי" תראי לוח שנה צבעוני עם כל ימי האימון שלך. כל יום מוצג כריבוע עם צבע שמראה את הסטטוס שלו.',
      tips: ['ירוק = הושלם ✅', 'צהוב = חלקי ⚡', 'אדום = הוחמץ ❌', 'סגול = היום 📍'],
    },
    {
      num: '05', icon: '✅', title: 'סימון אימון יומי', color: '#4ade80',
      desc: 'לחצי על היום הנוכחי בלוח השנה. תיפתח רשימת כל התרגילים לאותו יום. לחצי על כל תרגיל שביצעת כדי לסמן אותו. הוסיפי הערות אם תרצי ולחצי "שמרי".',
      tips: ['סמני בזמן אמת לדיוק מקסימלי', 'הערות עוזרות לעקוב אחר התקדמות', 'ניתן לעדכן בכל שעה'],
    },
    {
      num: '06', icon: '📊', title: 'מעקב התקדמות', color: '#fb923c',
      desc: 'בדף הפרופיל תראי סטטיסטיקות מפורטות: כמה אימונים הושלמו, הרצף הנוכחי שלך ואחוז העמידה ביעדים. בלוח האישי תראי גם ממוצע כללי.',
      tips: ['רצף של 7 ימים = הישג מדהים 🔥', 'אחוז מעל 80% = מצוין', 'כל יום שמסמנים = ניצחון'],
    },
  ]

  const faq = [
    { q: 'האם האתר חינמי לחלוטין?', a: 'כן! ההרשמה, בחירת התוכנית והמעקב היומי — הכל חינמי לחלוטין.' },
    { q: 'האם אני יכולה לשנות תוכנית באמצע?', a: 'בהחלט. עברי לדף "תוכניות אימון", בחרי תוכנית חדשה וקבעי תאריכים חדשים. ההיסטוריה הישנה נשמרת.' },
    { q: 'מה קורה אם פספסתי יום?', a: 'אין בעיה! היום יסומן באדום בלוח השנה, אבל תמיד אפשר להמשיך. העיקר לא לוותר.' },
    { q: 'האם הנתונים שלי מאובטחים?', a: 'כן. הנתונים שלך מאוחסנים בענן מאובטח ומוצפנים. רק את יכולה לגשת לאזור האישי שלך.' },
    { q: 'האם אפשר להשתמש מהטלפון?', a: 'כן! האתר מותאם לכל המכשירים — מחשב, טאבלט וסמארטפון.' },
    { q: 'מה אם התחלתי ולא סיימתי?', a: 'זה בסדר גמור. החיים קורים. תמיד אפשר לחזור, לבחור תוכנית חדשה ולהתחיל מחדש.' },
  ]

  const sections = [
    { id: 'steps',    icon: '📖', label: 'שימוש באתר' },
    { id: 'colors',   icon: '🎨', label: 'מפתח צבעים' },
    { id: 'register', icon: '📝', label: 'הרשמה' },
    { id: 'faq',      icon: '❓', label: 'שאלות נפוצות' },
  ]

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>

      {/* ── HERO עם לוגו ── */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          position: 'relative', width: 'clamp(140px, 18vw, 220px)',
          aspectRatio: '891/822', margin: '0 auto 24px',
          borderRadius: 22,
          filter: 'drop-shadow(0 0 40px rgba(124,92,191,0.65)) drop-shadow(0 0 80px rgba(124,92,191,0.25))',
          animation: 'floatLogo 5s ease-in-out infinite',
        }}>
          <Image src="/images/LOGO.jpg" alt="FitnessHealth" fill
            style={{ borderRadius: 22, objectFit: 'cover' }} priority />
        </div>
        <div className="badge badge-purple" style={{ marginBottom: 16 }}>📖 מדריך שימוש</div>
        <h1 style={{ fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 900, marginBottom: 16 }}>
          <span className="gradient-text">איך משתמשים</span>
          <br />
          <span style={{ color: 'var(--text)' }}>ב-FitnessHealth?</span>
        </h1>
        <p style={{ fontSize: 17, color: 'var(--text2)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
          מדריך פשוט וברור שיעזור לך להתחיל תוך 5 דקות
        </p>
      </div>

      {/* ── ניווט עוגנים sticky ── */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 10,
        marginBottom: 52, flexWrap: 'wrap',
        position: 'sticky', top: 80, zIndex: 10,
        padding: '12px 16px',
        background: 'rgba(10,10,15,0.88)',
        backdropFilter: 'blur(18px)',
        borderRadius: 16,
        border: '1px solid var(--border)',
      }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => scrollTo(s.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: 'rgba(124,92,191,0.1)',
              border: '1px solid rgba(124,92,191,0.25)',
              borderRadius: 10, padding: '9px 18px',
              color: 'var(--accent3)', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(124,92,191,0.25)'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(124,92,191,0.3)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(124,92,191,0.1)'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
            }}>
            <span>{s.icon}</span>
            {s.label}
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>↓</span>
          </button>
        ))}
      </div>

      {/* ── שלבי שימוש ── */}
      <div id="steps" style={{ scrollMarginTop: 160, marginBottom: 64 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 24 }}>
          📖 שלבי השימוש באתר
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {steps.map(step => (
            <div key={step.num} className="glass"
              style={{ padding: '28px 32px', display: 'flex', gap: 24, alignItems: 'flex-start',
                borderRight: `4px solid ${step.color}` }}>
              <div style={{ flexShrink: 0,
                width: 52, height: 52, borderRadius: 13,
                background: step.color + '22', border: `2px solid ${step.color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                {step.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: step.color,
                    background: step.color + '22', padding: '2px 8px', borderRadius: 6 }}>
                    שלב {step.num}
                  </span>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{step.title}</h3>
                </div>
                <p style={{ color: 'var(--text2)', fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>
                  {step.desc}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {step.tips.map(tip => (
                    <span key={tip} style={{
                      background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
                      borderRadius: 8, padding: '3px 11px', fontSize: 12, color: 'var(--text2)',
                    }}>{tip}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── מפתח צבעים ── */}
      <div id="colors" style={{ scrollMarginTop: 160, marginBottom: 64 }}>
        <div className="glass" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, color: 'var(--text)' }}>
            🎨 מה אומרים הצבעים בלוח השנה?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {[
              { color: '#4ade80', bg: 'rgba(74,222,128,0.1)',   border: 'rgba(74,222,128,0.3)',   label: 'הושלם',  icon: '✅', desc: 'כל התרגילים בוצעו' },
              { color: '#f0c060', bg: 'rgba(240,192,96,0.1)',   border: 'rgba(240,192,96,0.3)',   label: 'חלקי',   icon: '⚡', desc: 'חלק מהתרגילים בוצעו' },
              { color: '#c4a8ff', bg: 'rgba(124,92,191,0.15)',  border: 'rgba(124,92,191,0.4)',   label: 'היום',   icon: '📍', desc: 'היום הנוכחי' },
              { color: '#f87171', bg: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.3)',  label: 'הוחמץ',  icon: '❌', desc: 'יום שעבר ללא סימון' },
              { color: '#6b6585', bg: 'rgba(107,101,133,0.1)',  border: 'rgba(107,101,133,0.3)',  label: 'עתידי',  icon: '🔮', desc: 'יום שעוד לא הגיע' },
            ].map(c => (
              <div key={c.label} style={{
                background: c.bg, border: `1px solid ${c.border}`,
                borderRadius: 12, padding: '16px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{c.icon}</div>
                <div style={{ fontWeight: 700, color: c.color, marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── הרשמה CTA ── */}
      <div id="register" style={{ scrollMarginTop: 160, marginBottom: 64 }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(124,92,191,0.18) 0%, rgba(232,121,160,0.12) 100%)',
          border: '1px solid rgba(124,92,191,0.35)',
          borderRadius: 20, padding: '48px 40px', textAlign: 'center',
          boxShadow: '0 0 60px rgba(124,92,191,0.1)',
        }}>
          {/* לוגו ריבועי ב-CTA */}
          <div style={{
            position: 'relative', width: 90,
            aspectRatio: '891/822',
            margin: '0 auto 20px', borderRadius: 14,
            filter: 'drop-shadow(0 0 24px rgba(240,192,96,0.6)) drop-shadow(0 0 48px rgba(240,192,96,0.25))',
            animation: 'floatLogo 4s ease-in-out infinite',
          }}>
            <Image src="/images/LOGO.jpg" alt="logo" fill style={{ borderRadius: 14, objectFit: 'cover' }} />
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>
            <span className="gradient-text">מוכנה להתחיל?</span>
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 16, marginBottom: 28, lineHeight: 1.7, maxWidth: 400, margin: '0 auto 28px' }}>
            הרשמה לוקחת פחות מדקה — שם, מייל, סיסמה וזהו.
            אין כרטיס אשראי, אין התחייבות.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn-gold" style={{ fontSize: 16, padding: '13px 40px' }}>
              ✨ הרשמה חינמית
            </Link>
            <Link href="/login" className="btn-outline" style={{ fontSize: 16, padding: '13px 32px' }}>
              כבר רשומה? כניסה
            </Link>
          </div>
        </div>
      </div>

      {/* ── שאלות נפוצות ── */}
      <div id="faq" style={{ scrollMarginTop: 160, marginBottom: 40 }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, textAlign: 'center', marginBottom: 28 }}>
          <span className="gradient-text-purple">❓ שאלות נפוצות</span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faq.map(item => (
            <div key={item.q} className="glass" style={{ padding: '20px 24px' }}>
              <h4 style={{ fontWeight: 700, color: 'var(--accent3)', marginBottom: 8, fontSize: 15 }}>
                {item.q}
              </h4>
              <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes floatLogo {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}
