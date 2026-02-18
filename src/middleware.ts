import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/login?callbackUrl=/admin', req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: { signIn: '/login' },
    secret: process.env.NEXTAUTH_SECRET
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
};
