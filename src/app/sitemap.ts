import type { MetadataRoute } from 'next';
import products from '@/data/products.json';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gudstorpack.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const productPages = products.map((product) => ({
    url: `${BASE_URL}/productos/${product.slug || product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categories = [...new Set(products.map((p) => p.categoria))];
  const categoryPages = categories.map((cat) => ({
    url: `${BASE_URL}/productos?categoria=${encodeURIComponent(cat)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

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
    ...categoryPages,
    ...productPages,
    {
      url: `${BASE_URL}/carrito`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];
}
