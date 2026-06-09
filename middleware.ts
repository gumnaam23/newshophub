// middleware.ts
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// 👇 Yeh line add karo - runtime explicitly nodejs set karo
export const runtime = 'nodejs';

export default auth((req) => {

    const siteEnabled = false; // launch ke waqt true kar dena

  if (!siteEnabled) {
    return new NextResponse('Website is under development. Coming soon!', {
      status: 503,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  
  const token = req.auth;
  const isAuth = !!token;
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
  const isAdminPage = req.nextUrl.pathname.startsWith('/admin');
  const isSellerPage = req.nextUrl.pathname.startsWith('/seller');

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }

  if (!isAuth) {
    const from = req.nextUrl.pathname;
    if (from) {
      return NextResponse.redirect(
        new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Role-based access control
  if (isAdminPage && token?.user?.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (isSellerPage && token?.user?.role !== 'seller' && token?.user?.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/account/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    '/admin/:path*',
    '/seller/:path*',
    '/auth/:path*',
  ],
};