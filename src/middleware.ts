import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import redirects from '@/data/redirects.json';
import products from '@/data/products.json';

// Build slug→id and id→slug lookup maps
const slugToId = new Map<string, string>();
const idToSlug = new Map<string, string>();

for (const p of products) {
  if (p.slug) {
    slugToId.set(p.slug, p.id);
  }
  if (p.id) {
    idToSlug.set(p.id, p.slug || p.id);
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Match /productos/[slug-or-id]
  if (pathname.startsWith('/productos/')) {
    const slug = pathname.replace('/productos/', '');

    // Skip if it's a query-param URL or the base page
    if (!slug || slug.includes('?')) return NextResponse.next();

    // 1. Check old short redirects (e.g., "cajas-kraft" → "cajas-kraft-premium")
    if (slug in redirects) {
      const targetId = redirects[slug as keyof typeof redirects];
      const newSlug = idToSlug.get(targetId) || targetId;
      const newUrl = request.nextUrl.clone();
      newUrl.pathname = `/productos/${newSlug}`;
      return NextResponse.redirect(newUrl, 301);
    }

    // 2. If slug matches a product directly, let it through
    const matchById = products.find((p) => p.id === slug);
    const matchBySlug = products.find((p) => p.slug === slug);
    if (matchById || matchBySlug) {
      return NextResponse.next();
    }

    // 3. If slug is an old product ID (without medida), redirect to new slug
    if (idToSlug.has(slug) && idToSlug.get(slug) !== slug) {
      const newUrl = request.nextUrl.clone();
      newUrl.pathname = `/productos/${idToSlug.get(slug)}`;
      return NextResponse.redirect(newUrl, 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/productos/:slug*'],
};