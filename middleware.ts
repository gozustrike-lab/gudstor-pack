import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://*.sanity.io https://*.sanity.studio http://localhost:3000 https://gudstor-pack-cms.vercel.app"
  );
  return response;
}

export const config = {
  matcher: '/:path*',
};
