import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectDB()
        const user = await User.findOne({ email: credentials?.email })
        if (!user) return null
        const valid = await bcrypt.compare(credentials?.password as string, user.password)
        if (!valid) return null
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          selectedPlanId: user.selectedPlanId?.toString() || null,
          startDate: user.startDate?.toISOString() || null,
          endDate: user.endDate?.toISOString() || null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.selectedPlanId = (user as any).selectedPlanId
        token.startDate = (user as any).startDate
        token.endDate = (user as any).endDate
      }
      if (trigger === 'update' && session) {
        token.selectedPlanId = session.selectedPlanId
        token.startDate = session.startDate
        token.endDate = session.endDate
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      ;(session.user as any).selectedPlanId = token.selectedPlanId
      ;(session.user as any).startDate = token.startDate
      ;(session.user as any).endDate = token.endDate
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
})
