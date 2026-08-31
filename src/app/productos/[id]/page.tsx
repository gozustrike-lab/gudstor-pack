import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchProducts } from "@/lib/fetchCMS";
import fallbackProducts from "@/data/products.json";
import ProductoDetalleClient from "./producto-detalle-client";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { id } = await params;
  const sp = await searchParams;
  
  const sanityProducts = await fetchProducts();
  const products = (sanityProducts && sanityProducts.length > 0) ? sanityProducts : fallbackProducts;
  const product = products.find((p) => p.id === id || p.slug === id);

  if (!product) {
    return {
      title: "Producto no encontrado | GUDSTOR PACK",
    };
  }

  // Use slug for canonical URL
  const urlId = product.slug || product.id;

  // Read variant params for dynamic OG (WhatsApp sharing)
  const packParam = typeof sp.pack === 'string' ? sp.pack : '';
  const medidaParam = typeof sp.medida === 'string' ? decodeURIComponent(sp.medida) : '';

  const priceStr = product.precioUnidad || `S/ ${product.precio.toFixed(2)}`;

  // Build variant-aware title and description for OG
  let title = `${product.nombre} | GUDSTOR PACK`;
  let description = `${product.descripcion}. Desde ${priceStr} por unidad. Compra mayorista con descuento en GUDSTOR PACK.`;

  if (packParam) {
    const pack = (product.packs || []).find((p) => String(p.cantidad) === packParam);
    if (pack) {
      const unitPrice = (pack.precio / pack.cantidad).toFixed(2);
      title = `${product.nombre} - Pack ${pack.cantidad} uds | GUDSTOR PACK`;
      description = `${product.nombre}: Pack ${pack.cantidad} uds a S/ ${pack.precio.toFixed(2)} (S/ ${unitPrice}/u). ${pack.descuento > 0 ? `Ahorra ${pack.descuento}%.` : ''} Compra mayorista en GUDSTOR PACK.`;
    }
  }

  const baseUrl = `https://gudstor-pack.vercel.app/${product.seoPath && product.seoPath !== 'productos' ? `${product.seoPath}/` : 'productos/'}${urlId}`;
  // Preserve variant params in OG URL for consistent sharing
  const variantParams: string[] = [];
  if (packParam) variantParams.push(`pack=${packParam}`);
  if (medidaParam) variantParams.push(`medida=${sp.medida}`);
  const ogUrl = variantParams.length > 0 ? `${baseUrl}?${variantParams.join('&')}` : baseUrl;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: ogUrl,
      siteName: "GUDSTOR PACK",
      type: "website",
      locale: "es_PE",
      images: product.imagenes && product.imagenes.length > 0
        ? [
            {
              url: product.imagenes[0],
              width: 1200,
              height: 630,
              alt: product.nombre,
            },
          ]
        : [
            {
              url: "/og/gudstor-pack-og.jpg",
              width: 1200,
              height: 630,
              alt: "GUDSTOR PACK - Soluciones en Embalaje",
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.imagenes && product.imagenes.length > 0
        ? [product.imagenes[0]]
        : ["/og/gudstor-pack-og.jpg"],
    },
    alternates: {
      canonical: baseUrl,
    },
  };
}

export default async function ProductoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
      <ProductoDetalleClient params={params} initialProducts={finalProducts as any} />
    </Suspense>
  );
}