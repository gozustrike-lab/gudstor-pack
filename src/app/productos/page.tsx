import { Suspense } from 'react';
import type { Metadata } from 'next';
import { fetchProducts } from '@/lib/fetchCMS';
import fallbackProducts from '@/data/products.json';
import ProductosContent from './productos-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Catálogo de Productos | GUDSTOR PACK',
  description: 'Descubre nuestra amplia gama de cajas de cartón, materiales de embalaje y accesorios para proteger tus envíos.',
};

export default async function ProductosPage() {
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
