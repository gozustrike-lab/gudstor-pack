import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect, RedirectType } from "next/navigation";
import { fetchProducts, fetchSiteSettings } from "@/lib/fetchCMS";
import fallbackProducts from "@/data/products.json";
import ProductoDetalleClient from "./producto-detalle-client";
import { getCleanCategoryPath } from "@/lib/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gudstor-pack.vercel.app';

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
  const products = (sanityProducts && sanityProducts.length > 0) ? sanityProducts : (fallbackProducts as any[]);
  const product = products.find(
    (p) => p.id === id || p.slug === id || p.slugsAnteriores?.includes(id)
  );

  if (!product) {
    return {
      title: "Producto no encontrado | GUDSTOR PACK",
    };
  }

  // Canonical is strictly /productos/[slug]
  const canonicalSlug = product.slug || product.id;
  const canonicalUrl = product.canonical || `${SITE_URL}/productos/${canonicalSlug}`;

  // Read variant params for dynamic OG
  const packParam = typeof sp.pack === 'string' ? sp.pack : '';
  const priceStr = product.precioUnidad || `S/ ${product.precio.toFixed(2)}`;

  let title = product.seoTitle || `${product.nombre} | GUDSTOR PACK`;
  let description = product.metaDescription || product.descripcionCorta || `${product.descripcion}. Desde ${priceStr} por unidad. Compra mayorista con descuento en GUDSTOR PACK.`;

  if (packParam) {
    const pack = (product.packs || []).find((p: any) => String(p.cantidad) === packParam);
    if (pack) {
      const unitPrice = (pack.precio / pack.cantidad).toFixed(2);
      const unit = pack.unidad || product.unidadMedida || 'uds';
      title = `${product.nombre} - Pack ${pack.cantidad} ${unit} | GUDSTOR PACK`;
      description = `${product.nombre}: Pack ${pack.cantidad} ${unit} a S/ ${pack.precio.toFixed(2)} (S/ ${unitPrice}/u). ${pack.descuento > 0 ? `Ahorra ${pack.descuento}%.` : ''} Compra mayorista en GUDSTOR PACK.`;
    }
  }

  const ogImages = product.ogImage
    ? [{ url: product.ogImage, width: 1200, height: 630, alt: product.nombre }]
    : product.imagenes && product.imagenes.length > 0
    ? [{ url: product.imagenes[0], width: 1200, height: 630, alt: product.nombre }]
    : [{ url: "/og/gudstor-pack-og.jpg", width: 1200, height: 630, alt: "GUDSTOR PACK" }];

  return {
    title,
    description,
    robots: product.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: product.ogTitle || title,
      description: product.ogDescription || description,
      url: canonicalUrl,
      siteName: "GUDSTOR PACK",
      type: "website",
      locale: "es_PE",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: product.ogTitle || title,
      description: product.ogDescription || description,
      images: [ogImages[0].url],
    },
  };
}

export default async function ProductoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [sanityProducts, siteSettings] = await Promise.all([
    fetchProducts(),
    fetchSiteSettings(),
  ]);
  const finalProducts = (sanityProducts && sanityProducts.length > 0) ? sanityProducts : (fallbackProducts as any[]);
  const product = finalProducts.find(
    (p: any) => p.id === id || p.slug === id || p.slugsAnteriores?.includes(id)
  );

  // 301 Permanent Redirect if previous slug was accessed or accessed via ID when slug exists
  if (product && product.slug && id !== product.slug) {
    if (product.slugsAnteriores?.includes(id)) {
      redirect(`/productos/${product.slug}`, RedirectType.replace);
    }
  }

  // Structured Data (JSON-LD)
  const canonicalUrl = product?.canonical || `${SITE_URL}/productos/${product?.slug || id}`;
  const productSchema = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.nombre,
        description: product.descripcionCorta || product.descripcion,
        image: product.imagenes && product.imagenes.length > 0 ? product.imagenes : undefined,
        sku: product.sku || product.id,
        brand: {
          "@type": "Brand",
          name: "GUDSTOR PACK",
        },
        offers: {
          "@type": "Offer",
          url: canonicalUrl,
          priceCurrency: "PEN",
          price: product.precio,
          availability: (product.stock ?? 1) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
        },
      }
    : null;

  const breadcrumbsSchema = product
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Inicio",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Productos",
            item: `${SITE_URL}/productos`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.categoria,
            item: `${SITE_URL}${getCleanCategoryPath(product.categoria)}`,
          },
          ...(product.subcategoria
            ? [
                {
                  "@type": "ListItem",
                  position: 4,
                  name: product.subcategoria,
                  item: `${SITE_URL}${getCleanCategoryPath(product.categoria, product.subcategoria)}`,
                },
                {
                  "@type": "ListItem",
                  position: 5,
                  name: product.nombre,
                  item: canonicalUrl,
                },
              ]
            : [
                {
                  "@type": "ListItem",
                  position: 4,
                  name: product.nombre,
                  item: canonicalUrl,
                },
              ]),
        ],
      }
    : null;

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      {breadcrumbsSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
        />
      )}
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        }
      >
        <ProductoDetalleClient
          params={params}
          initialProducts={finalProducts as any}
          siteSettings={siteSettings}
        />
      </Suspense>
    </>
  );
}