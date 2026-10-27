'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/plans', label: 'תוכניות אימון', icon: '💪' },
  { href: '/dashboard', label: 'לוח אישי', icon: '📅', authOnly: true },
  { href: '/about', label: 'אודותינו', icon: '✨' },
  { href: '/guide', label: 'שימוש באתר', icon: '📖' },
  { href: '/profile', label: 'פרופיל', icon: '👤', authOnly: true },
]

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const visibleLinks = navLinks.filter(l => !l.authOnly || session)

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, right: 0, left: 0, zIndex: 1000,
        height: 72,
        background: scrolled
          ? 'rgba(10,10,15,0.92)'
          : 'rgba(10,10,15,0.6)',
        backdropFilter: 'blur(24px)',
        borderBottom: scrolled ? '1px solid rgba(42,42,61,0.8)' : '1px solid rgba(42,42,61,0.3)',
        transition: 'all 0.3s ease',
        display: 'flex', alignItems: 'center',
        padding: '0 32px',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            position: 'relative', width: 46, height: 42,
            borderRadius: 10,
            filter: 'drop-shadow(0 0 10px rgba(124,92,191,0.7))',
          }}>
            <Image src="/images/LOGO.jpg" alt="FitnessHealth" fill
              style={{ borderRadius: 10, objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: 0.3,
              background: 'linear-gradient(135deg, #c4a8ff, #f0c060)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              FitnessHealth
            </div>
            <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 1, marginTop: -2 }}>
              האימון האישי שלך
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
          {visibleLinks.map(link => {
            const active = pathname === link.href
            return (
              <Link key={link.href} href={link.href} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px',
                borderRadius: 10,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: active ? 700 : 500,
                color: active ? 'var(--accent3)' : 'var(--text2)',
                background: active ? 'rgba(124,92,191,0.15)' : 'transparent',
                border: active ? '1px solid rgba(124,92,191,0.3)' : '1px solid transparent',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = 'var(--text)'
                    ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = 'var(--text2)'
                    ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                  }
                }}>
                <span style={{ fontSize: 15 }}>{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Auth buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {session ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(124,92,191,0.1)', border: '1px solid rgba(124,92,191,0.25)',
                borderRadius: 10, padding: '6px 12px' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent), var(--pink))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: '#fff',
                }}>
                  {session.user?.name?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: 13, color: 'var(--text2)', maxWidth: 100,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {session.user?.name}
                </span>
              </div>
              <button onClick={() => signOut({ callbackUrl: '/login' })}
                style={{
                  background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
                  color: 'var(--red)', borderRadius: 10, padding: '7px 14px',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.1)')}>
                התנתק
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost" style={{ fontSize: 14 }}>כניסה</Link>
              <Link href="/register" className="btn-primary" style={{ fontSize: 14, padding: '8px 20px' }}>
                הרשמי חינם ✨
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)}
          style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text)',
            fontSize: 22, cursor: 'pointer' }}
          className="mobile-menu-btn">
          {mobileOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 72, right: 0, left: 0, zIndex: 999,
          background: 'rgba(10,10,15,0.97)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          padding: '16px 24px 24px',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {visibleLinks.map(link => (
            <Link key={link.href} href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', borderRadius: 10, textDecoration: 'none',
                color: pathname === link.href ? 'var(--accent3)' : 'var(--text2)',
                background: pathname === link.href ? 'rgba(124,92,191,0.15)' : 'transparent',
                fontSize: 15, fontWeight: 500,
              }}>
              <span>{link.icon}</span>{link.label}
            </Link>
          ))}
          <div className="divider" style={{ margin: '8px 0' }} />
          {session ? (
            <button onClick={() => signOut({ callbackUrl: '/login' })}
              style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)',
                color: 'var(--red)', borderRadius: 10, padding: '12px', fontSize: 15,
                fontWeight: 600, cursor: 'pointer' }}>
              התנתקי
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/login" className="btn-outline" style={{ flex: 1, textAlign: 'center' }}
                onClick={() => setMobileOpen(false)}>כניסה</Link>
              <Link href="/register" className="btn-primary" style={{ flex: 1, textAlign: 'center' }}
                onClick={() => setMobileOpen(false)}>הרשמי</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: block !important; }
          nav > div:nth-child(2) { display: none !important; }
          nav > div:nth-child(3) { display: none !important; }
        }
      `}</style>
    </>
  )
}
