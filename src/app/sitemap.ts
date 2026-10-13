import type { MetadataRoute } from 'next';
import { fetchProducts, fetchCategories, fetchSubcategories } from '@/lib/fetchCMS';
import fallbackProducts from '@/data/products.json';
import { getCleanCategoryPath, getProductHref } from '@/lib/utils';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gudstor-pack.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cmsProducts, cmsCategories, cmsSubcategories] = await Promise.all([
    fetchProducts().catch(() => []),
    fetchCategories().catch(() => []),
    fetchSubcategories().catch(() => []),
  ]);

  const allProducts = (cmsProducts && cmsProducts.length > 0) ? cmsProducts : fallbackProducts;

  // Filter out noIndex products and map to clean canonical URLs
  const seenUrls = new Set<string>();
  const productPages: MetadataRoute.Sitemap = [];

  for (const product of allProducts as any[]) {
    if (product.noIndex) continue;
    const path = getProductHref(product);
    const fullUrl = `${BASE_URL}${path}`;
    if (!seenUrls.has(fullUrl)) {
      seenUrls.add(fullUrl);
      productPages.push({
        url: fullUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // Categories
  const categoryPages: MetadataRoute.Sitemap = [];
  if (cmsCategories && cmsCategories.length > 0) {
    for (const cat of cmsCategories) {
      if (cat.noIndex) continue;
      const path = getCleanCategoryPath(cat.nombre);
      const fullUrl = `${BASE_URL}${path}`;
      if (!seenUrls.has(fullUrl)) {
        seenUrls.add(fullUrl);
        categoryPages.push({
          url: fullUrl,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }
  } else {
    const uniqueCats = [...new Set(allProducts.map((p: any) => p.categoria))];
    for (const cat of uniqueCats) {
      const path = getCleanCategoryPath(cat);
      const fullUrl = `${BASE_URL}${path}`;
      if (!seenUrls.has(fullUrl)) {
        seenUrls.add(fullUrl);
        categoryPages.push({
          url: fullUrl,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }
  }

  // Subcategories
  if (cmsSubcategories && cmsSubcategories.length > 0) {
    for (const sub of cmsSubcategories) {
      if (sub.noIndex || !sub.categoriaPadre) continue;
      const path = getCleanCategoryPath(sub.categoriaPadre, sub.nombre);
      const fullUrl = `${BASE_URL}${path}`;
      if (!seenUrls.has(fullUrl)) {
        seenUrls.add(fullUrl);
        categoryPages.push({
          url: fullUrl,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.65,
        });
      }
    }
  }

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/productos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/packs-especiales`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    ...categoryPages,
    ...productPages,
  ];
}
