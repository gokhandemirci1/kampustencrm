import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          canManageCustomers: user.canManageCustomers,
          canManageFinancial: user.canManageFinancial,
          canManageCollaborationCodes: user.canManageCollaborationCodes,
          canViewCollaborationStats: user.canViewCollaborationStats,
          canManageAccess: user.canManageAccess,
          canDeleteUsers: user.canDeleteUsers,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.canManageCustomers = user.canManageCustomers
        token.canManageFinancial = user.canManageFinancial
        token.canManageCollaborationCodes = user.canManageCollaborationCodes
        token.canViewCollaborationStats = user.canViewCollaborationStats
        token.canManageAccess = user.canManageAccess
        token.canDeleteUsers = user.canDeleteUsers
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.canManageCustomers = token.canManageCustomers as boolean
        session.user.canManageFinancial = token.canManageFinancial as boolean
        session.user.canManageCollaborationCodes = token.canManageCollaborationCodes as boolean
        session.user.canViewCollaborationStats = token.canViewCollaborationStats as boolean
        session.user.canManageAccess = token.canManageAccess as boolean
        session.user.canDeleteUsers = token.canDeleteUsers as boolean
      }
      return session
    }
  }
}
