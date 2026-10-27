import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import AnimatedBackground from '@/components/AnimatedBackground'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'

export const metadata: Metadata = {
  title: 'FitnessHealth — אימון אישי מקצועי',
  description: 'תוכנית אימון אישית מקצועית בזמן שלך ובקצב שלך',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png', sizes: '64x64' },
    ],
    apple: '/favicon.png',
    shortcut: '/favicon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <AnimatedBackground />
        <SessionProvider>
          <Navbar />
          <main style={{ position: 'relative', zIndex: 1, paddingTop: '72px' }}>
            {children}
          </main>
          <Footer />
          <ChatWidget />
        </SessionProvider>
      </body>
    </html>
  )
}
