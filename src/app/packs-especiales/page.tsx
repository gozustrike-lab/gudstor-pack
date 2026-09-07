import { Suspense } from 'react';
import type { Metadata } from 'next';
import { fetchProducts } from '@/lib/fetchCMS';
import fallbackProducts from '@/data/products.json';
import PacksEspecialesClient from './packs-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Packs Especiales & Combos por Mayor | GUDSTOR PACK',
  description: 'Ahorra con nuestros packs especiales y combos por volumen en cajas, films y protección para embalaje. Envíos a todo el Perú.',
};

export default async function PacksEspecialesPage() {
  const sanityProducts = await fetchProducts();
  const allProducts = (sanityProducts && sanityProducts.length > 0) ? sanityProducts : fallbackProducts;

  // Filtrar productos con packs de volumen o descuentos especiales
  const specialProducts = allProducts.filter(
    (p) => p.packs && p.packs.some((pk) => pk.descuento > 0 || pk.cantidad >= 25)
  );

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <PacksEspecialesClient products={specialProducts.length > 0 ? specialProducts : allProducts} />
    </Suspense>
  );
}
