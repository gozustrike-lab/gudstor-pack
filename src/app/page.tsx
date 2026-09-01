import { Suspense } from 'react';
import type { Metadata } from 'next';
import { fetchProducts } from '@/lib/fetchCMS';
import fallbackProducts from '@/data/products.json';
import ProductosContent from './productos/productos-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'GUDSTOR PACK | Soluciones en Embalaje',
  description: 'Materiales de embalaje profesional para ecommerce, logística e industria. Cajas, films, cintas y más. Envío rápido a todo Perú.',
};

export default async function HomePage() {
  const sanityProducts = await fetchProducts();
  const finalProducts = (sanityProducts && sanityProducts.length > 0) ? sanityProducts : fallbackProducts;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <ProductosContent initialProducts={finalProducts as any} />
    </Suspense>
  );
}

