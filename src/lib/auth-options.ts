import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { findUserByLogin } from '@/lib/users';
import { verifyPassword } from '@/lib/auth';
import type { UserRole } from '@/types/user';

declare module 'next-auth' {
  interface Session {
    user: { name?: string; email?: string; image?: string };
    role?: UserRole;
    userId?: string;
    agentId?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole;
    userId?: string;
    agentId?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        login: { label: 'Логин', type: 'text' },
        password: { label: 'Пароль', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) return null;
        const user = await findUserByLogin(credentials.login);
        if (!user || !verifyPassword(credentials.password, user.passwordHash)) return null;
        return {
          id: user.id,
          name: user.name,
          email: user.login,
          role: user.role,
          agentId: (user as any).agentId
        };
      }
    })
  ],
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.userId = (user as any).id;
        token.agentId = (user as any).agentId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session as any).role = token.role;
        (session as any).userId = token.userId;
        (session as any).agentId = token.agentId;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET
};
