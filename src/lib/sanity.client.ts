import { createClient } from 'next-sanity';
import { createImageUrlBuilder } from '@sanity/image-url';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '981jghg0';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = '2024-01-01';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

export const draftClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: 'previewDrafts',
  stega: {
    enabled: true,
    studioUrl: 'http://localhost:3000/admin',
    logger: process.env.NODE_ENV === 'development' ? console : undefined,
  },
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}

export function plainText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map((block: any) => plainText(block)).join('\n');
  if (value && typeof value === 'object' && 'children' in value) {
    return (value.children as any[]).map((child: any) => child.text || '').join('');
  }
  return '';
}

// ── TypeScript interfaces ──
export interface SanityImage {
  _type: 'image';
  asset?: { _ref: string; _type: 'reference' };
  alt?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface HeroSlide {
  _id: string;
  title: string;
  slug: { current: string };
  image?: SanityImage;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
}

export interface Service {
  _id: string;
  title: string;
  slug: { current: string };
  image?: SanityImage;
  description?: string;
  icon?: string;
  shortDescription?: string;
  subservices?: string[];
  order: number;
  featured: boolean;
}

export interface ServiceCategory {
  _id: string;
  title: string;
  slug: { current: string };
  icon?: string;
  color?: string;
  order: number;
}

export interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  image?: SanityImage;
  description?: string;
  client?: string;
  category?: string;
  gallery?: SanityImage[];
  result?: string;
  order: number;
  featured: boolean;
  status: string;
}

export interface TeamMember {
  _id: string;
  title: string;
  image?: SanityImage;
  role?: string;
  phone?: string;
  email?: string;
  order: number;
}

export interface Testimonial {
  _id: string;
  author: string;
  image?: SanityImage;
  company?: string;
  role?: string;
  quote: string;
  rating: number;
  order: number;
}

export interface Stat {
  _id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon?: string;
  order: number;
}

export interface Partner {
  _id: string;
  title: string;
  image?: SanityImage;
  url?: string;
  order: number;
}

export interface CTASection {
  badge?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export interface SectionItem {
  icon?: string;
  title: string;
  description?: string;
  order?: number;
}

export interface FooterLink {
  title: string;
  href?: string;
}

export interface SiteSettings {
  _id: string;
  companyName: string;
  tagline: string;
  description?: string;
  whatsapp: string;
  email?: string;
  phone?: string;
  address?: string;
  mapEmbedUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: SanityImage;
  favicon?: SanityImage;
  ctaSection?: CTASection;
  shippingItems?: SectionItem[];
  trustItems?: SectionItem[];
  footerCompanyLinks?: FooterLink[];
  footerHours?: string;
  socialLinks?: { platform: string; url: string }[];
}

export interface HomeSection {
  _id: string;
  sectionType: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  items?: SectionItem[];
  order?: number;
}

export type { SanityImage };