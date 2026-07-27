import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { SESSION_COOKIE_KEY } from '@chup/core/shared';

export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE_KEY);

  if (!hasSession && request.nextUrl.pathname !== '/signin') {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
