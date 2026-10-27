'use client'
import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  const sections = [
    { id: 'story',    icon: '✨', label: 'הסיפור שלנו' },
    { id: 'values',   icon: '💎', label: 'הערכים שלנו' },
    { id: 'plans',    icon: '💪', label: 'סוגי תוכניות' },
    { id: 'rambam',   icon: '📜', label: 'בסיס מדעי' },
  ]

  const values = [
    { icon: '🧬', title: 'מדע ומחקר', desc: 'כל תוכנית מבוססת על מחקרי ספורט ותזונה עדכניים משנות ה-2020' },
    { icon: '📜', title: 'חוכמת הרמב"ם', desc: 'שילוב עקרונות בריאות עתיקים שעמדו במבחן הזמן' },
    { icon: '🎯', title: 'התאמה אישית', desc: 'כל אחת בונה את המסלול שלה לפי הצרכים והיכולות שלה' },
    { icon: '💡', title: 'פשטות ויעילות', desc: 'ממשק נקי ואינטואיטיבי שמאפשר להתמקד באימון עצמו' },
  ]

  const planTypes = [
    { icon: '🏃', name: 'אימון קרדיו', color: '#22d3ee',
      desc: 'שיפור סיבולת לב-ריאה, שריפת קלוריות ועלייה ברמת האנרגיה. מתאים לכל הרמות ומשלב ריצה, הליכה מהירה, קפיצה בחבל ועוד.' },
    { icon: '💪', name: 'כוח ועיצוב', color: '#e879a0',
      desc: 'תוכנית מבוססת משקולות ותרגילי התנגדות לבניית מסת שריר, עיצוב הגוף וחיזוק עצמות.' },
    { icon: '🧘', name: 'יוגה ומתיחות', color: '#4ade80',
      desc: 'שיפור גמישות, הפחתת מתח נפשי ושיפור יציבה. מושלם לשחרור שרירים ולמנוחה פעילה בין אימונים.' },
    { icon: '🔥', name: 'HIIT', color: '#f0c060',
      desc: 'אימון אינטרוולים בעצימות גבוהה — מקסימום תוצאות בזמן מינימלי. 20-30 דקות שמחליפות שעה של אימון רגיל.' },
    { icon: '🏠', name: 'אימון בית', color: '#7c5cbf',
      desc: 'ללא ציוד, בנוחות הבית שלך. תרגילים עם משקל גוף לחיזוק כללי, שמירה על כושר ועיצוב הגוף.' },
    { icon: '🥗', name: 'כושר ותזונה', color: '#fb923c',
      desc: 'שילוב תוכנית אימון עם הנחיות תזונה כלליות לתמיכה בתהליך, שיפור ביצועים ושמירה על אנרגיה.' },
  ]

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '60px 24px' }}>

      {/* ── HERO עם לוגו גדול ── */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{
          position: 'relative', width: 'clamp(160px, 22vw, 260px)',
          aspectRatio: '891/822', margin: '0 auto 32px',
          borderRadius: 24,
          filter: 'drop-shadow(0 0 50px rgba(124,92,191,0.7)) drop-shadow(0 0 100px rgba(124,92,191,0.3))',
          animation: 'floatLogo 5s ease-in-out infinite',
        }}>
          <Image src="/images/LOGO.jpg" alt="FitnessHealth" fill
            style={{ borderRadius: 24, objectFit: 'cover' }} priority />
        </div>
        <div className="badge badge-purple" style={{ marginBottom: 16 }}>✨ הסיפור שלנו</div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 20 }}>
          <span className="gradient-text">מהיום — את המאמנת</span>
          <br />
          <span style={{ color: 'var(--text)' }}>של עצמך</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text2)', maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>
          כי הגוף שלך הוא הנכס הכי יקר שיש לך — וכבר הגיע הזמן לטפל בו כמו שמגיע
        </p>
      </div>

      {/* ── ניווט עוגנים ── */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 10,
        marginBottom: 56, flexWrap: 'wrap',
        position: 'sticky', top: 80, zIndex: 10,
        padding: '12px 0',
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(16px)',
        borderRadius: 16,
        border: '1px solid var(--border)',
      }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => scrollTo(s.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: 'rgba(124,92,191,0.1)',
              border: '1px solid rgba(124,92,191,0.25)',
              borderRadius: 10, padding: '9px 20px',
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

      {/* ── הסיפור שלנו ── */}
      <div id="story" style={{ scrollMarginTop: 160, marginBottom: 64 }}>
        <div className="glass" style={{ padding: '40px 48px', lineHeight: 2, fontSize: 16 }}>

          {/* לוגו קטן בתוך הכרטיס */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
            <div style={{
              position: 'relative', width: 68,
              aspectRatio: '891/822', flexShrink: 0,
              borderRadius: 12,
              filter: 'drop-shadow(0 0 14px rgba(124,92,191,0.6))',
            }}>
              <Image src="/images/LOGO.jpg" alt="logo" fill style={{ borderRadius: 12, objectFit: 'cover' }} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent3)' }}>הסיפור שלנו</h2>
          </div>

          <p style={{ marginBottom: 20, color: 'var(--text)' }}>
            בעולם המודרני, כולנו יודעות שאורח חיים בריא הוא הבסיס לחיים טובים, מאושרים ומלאי אנרגיה.
            אנחנו יודעות שצריך לזוז, לאכול נכון, לישון מספיק. אבל המציאות היומיומית מציבה בפנינו
            אתגרים שלא נגמרים: לוחות זמנים עמוסים, עבודה שמתארכת, ילדים שצריכים תשומת לב,
            ומחויבויות שאינן מסתיימות. הזמן לטפל בעצמנו נדחק לסוף הרשימה — ולעיתים נעלם לחלוטין.
          </p>
          <p style={{ marginBottom: 20, color: 'var(--text)' }}>
            <strong style={{ color: 'var(--accent3)' }}>FitnessHealth</strong> נולד מתוך הבנה עמוקה של המציאות הזו.
            אנחנו מאמינות שכל אישה — בכל גיל, בכל רמת כושר, בכל לוח זמנים — יכולה להיות המאמנת של עצמה.
            לא צריך חדר כושר יקר. לא צריך מאמנת אישית שעולה הון. לא צריך לוח זמנים נוקשה שלא מתאים
            לחיים האמיתיים שלך. צריך רק רצון, כלים נכונים, ומערכת שתלווה אותך בדרך.
          </p>
          <p style={{ marginBottom: 20, color: 'var(--text)' }}>
            הפלטפורמה שלנו מאפשרת לך לבחור תוכנית אימון מקצועית ומותאמת לרמתך ולמטרותיך,
            לקבוע את תקופת האימון שמתאימה לך — שבוע, חודש, שלושה חודשים — ולעקוב אחר ההתקדמות
            שלך יום אחר יום בצורה ויזואלית, פשוטה ומעוררת מוטיבציה. כל יום שאת מסמנת ✅ הוא
            ניצחון קטן שמצטבר לשינוי גדול.
          </p>
          <p style={{ marginBottom: 0, color: 'var(--text)' }}>
            אנחנו מאמינות בגישה הוליסטית — גוף, נפש ורוח. לכן התוכניות שלנו לא מתמקדות רק
            בתרגילים, אלא גם בנשימה, במנוחה, בהתאוששות ובתזונה תומכת. כי כושר אמיתי הוא לא
            רק כמה את מרימה — אלא כמה את מרגישה טוב בחיי היומיום שלך.
          </p>
        </div>
      </div>

      {/* ── הערכים שלנו ── */}
      <div id="values" style={{ scrollMarginTop: 160, marginBottom: 64 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', marginBottom: 32 }}>
          <span className="gradient-text-purple">💎 הערכים שלנו</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {values.map(v => (
            <div key={v.title} className="glass" style={{ padding: '28px', textAlign: 'center' }}>
              <div style={{ fontSize: 38, marginBottom: 12 }}>{v.icon}</div>
              <h3 style={{ fontWeight: 700, color: 'var(--accent3)', marginBottom: 8, fontSize: 16 }}>{v.title}</h3>
              <p style={{ color: 'var(--text2)', fontSize: 13, lineHeight: 1.7 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── סוגי תוכניות ── */}
      <div id="plans" style={{ scrollMarginTop: 160, marginBottom: 64 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div className="badge badge-gold" style={{ marginBottom: 12 }}>💪 סוגי תוכניות</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)' }}>תוכניות האימון שלנו</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
          {planTypes.map(p => (
            <div key={p.name} className="glass"
              style={{ padding: '28px', transition: 'all 0.2s', cursor: 'default', borderTop: `3px solid ${p.color}` }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px ${p.color}22`
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
              }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{p.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 10, color: p.color }}>{p.name}</h3>
              <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.7 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── בסיס מדעי / רמב"ם ── */}
      <div id="rambam" style={{ scrollMarginTop: 160, marginBottom: 64 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', marginBottom: 32 }}>
          <span className="gradient-text">📜 הבסיס המדעי והרוחני</span>
        </h2>
        <div className="glass" style={{ padding: '40px 48px', lineHeight: 1.9, fontSize: 16 }}>

          {/* לוגו שלישי — בתוך הבסיס המדעי */}
          <div style={{ float: 'left', marginLeft: 0, marginRight: 28, marginBottom: 16 }}>
            <div style={{
              position: 'relative', width: 90,
              aspectRatio: '891/822',
              borderRadius: 14,
              filter: 'drop-shadow(0 0 20px rgba(240,192,96,0.6))',
              animation: 'floatLogo 4s ease-in-out infinite',
            }}>
              <Image src="/images/LOGO.jpg" alt="logo" fill style={{ borderRadius: 14, objectFit: 'cover' }} />
            </div>
          </div>

          <div style={{
            background: 'rgba(124,92,191,0.08)',
            border: '1px solid rgba(124,92,191,0.25)',
            borderRight: '4px solid var(--accent)',
            borderRadius: '0 12px 12px 0',
            padding: '20px 24px',
            marginBottom: 24,
          }}>
            <p style={{ fontStyle: 'italic', color: 'var(--text)', fontSize: 16, lineHeight: 1.8, marginBottom: 8 }}>
              "הואיל והיות הגוף בריא ושלם מדרכי השם הוא — שהרי אי אפשר שיבין או ידע דבר מידיעת הבורא
              והוא חולה — לפיכך צריך האדם להרחיק עצמו מדברים המאבדין את הגוף, ולהנהיג עצמו בדברים
              המברין והמחלימין."
            </p>
            <p style={{ color: 'var(--accent3)', fontSize: 13, fontWeight: 600 }}>
              — הרמב"ם, משנה תורה, הלכות דעות, פרק ד
            </p>
          </div>

          <p style={{ color: 'var(--text)', marginBottom: 16 }}>
            התוכניות שלנו משלבות את החוכמה הרפואית של הרמב"ם — שהדגיש פעילות גופנית מתונה ועקבית,
            שינה מספקת ותזונה מאוזנת — עם ממצאי מחקרי ספורט ותזונה עדכניים מהשנים האחרונות.
            שילוב ייחודי של עתיק ומודרני, של חוכמה ומדע.
          </p>

          <p style={{ fontSize: 13, color: 'var(--text3)', borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 8 }}>
            * המידע באתר מבוסס על עקרונות כלליים ומחקרי תזונה וספורט, ואינו מהווה תחליף לייעוץ רפואי
            או תזונתי אישי. לפני תחילת כל תוכנית אימון, מומלץ להתייעץ עם רופאה.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center' }}>
        <Link href="/plans" className="btn-primary" style={{ fontSize: 17, padding: '14px 44px' }}>
          לכל תוכניות האימון ←
        </Link>
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
