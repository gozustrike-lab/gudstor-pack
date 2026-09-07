import { Suspense } from 'react';
import type { Metadata } from 'next';
import {
  fetchHeroSlides,
  fetchStats,
  fetchTestimonials,
  fetchSiteSettings,
  fetchPartners,
  fetchProducts,
} from '@/lib/fetchCMS';
import fallbackProducts from '@/data/products.json';
import HomePageClient from './home-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'GUDSTOR PACK | Soluciones Integrales en Embalaje',
  description: 'Materiales de embalaje profesional para ecommerce, logística e industria. Cajas Kraft, films, cintas y más. Descuentos por mayor y envíos a todo Perú.',
};

export default async function HomePage() {
  const [sanitySlides, sanityStats, sanityTestimonials, sanitySettings, sanityPartners, sanityProducts] =
    await Promise.all([
      fetchHeroSlides(),
      fetchStats(),
      fetchTestimonials(),
      fetchSiteSettings(),
      fetchPartners(),
      fetchProducts(),
    ]);

  const finalProducts = (sanityProducts && sanityProducts.length > 0) ? sanityProducts : fallbackProducts;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <HomePageClient
        sanitySlides={sanitySlides}
        sanityStats={sanityStats}
        sanityTestimonials={sanityTestimonials}
        sanitySettings={sanitySettings}
        sanityPartners={sanityPartners}
        initialProducts={finalProducts as any}
      />
    </Suspense>
  );
}

