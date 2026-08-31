
import { draftMode } from 'next/headers';
import { client, draftClient, projectId, type HeroSlide, type Stat, type Service, type ServiceCategory, type Project, type TeamMember, type Testimonial, type Partner, type SiteSettings } from './sanity.client';
import {
  allHeroSlidesQuery,
  allStatsQuery,
  allServicesQuery,
  featuredServicesQuery,
  allServiceCategoriesQuery,
  allProjectsQuery,
  featuredProjectsQuery,
  allTeamMembersQuery,
  allTestimonialsQuery,
  allPartnersQuery,
  siteSettingsQuery,
  // Preview queries (sin filtro de drafts)
  allHeroSlidesPreviewQuery,
  allStatsPreviewQuery,
  allTestimonialsPreviewQuery,
  siteSettingsPreviewQuery,
  allServicesPreviewQuery,
  allProjectsPreviewQuery,
  allPartnersPreviewQuery,
  allTeamMembersPreviewQuery,
  featuredServicesPreviewQuery,
  featuredProjectsPreviewQuery,
} from './sanity.queries';


function getClient() {
  return draftMode().isEnabled ? draftClient : client;
}

function isPreview() {
  if (process.env.NODE_ENV === 'development') return true;
  try {
    return draftMode().isEnabled;
  } catch {
    return false;
  }
}

async function safeFetch<T>(query: string, forcePreview = false): Promise<T | null> {
  if (!projectId) return null;
  try {
    const c = forcePreview ? draftClient : getClient();
    const options = { next: { revalidate: forcePreview ? 0 : 30 } };
    return await c.fetch<T>(query, {}, options);
  } catch (err) {
    console.error("SAFEFETCH ERROR:", err);
    return null;
  }
}

export async function fetchHeroSlides(): Promise<HeroSlide[] | null> {
  const preview = isPreview();
  return safeFetch<HeroSlide[]>(preview ? allHeroSlidesPreviewQuery : allHeroSlidesQuery, preview);
}

export async function fetchStats(): Promise<Stat[] | null> {
  const preview = isPreview();
  return safeFetch<Stat[]>(preview ? allStatsPreviewQuery : allStatsQuery, preview);
}

export async function fetchServices(): Promise<Service[] | null> {
  const preview = isPreview();
  return safeFetch<Service[]>(preview ? allServicesPreviewQuery : allServicesQuery, preview);
}

export async function fetchFeaturedServices(): Promise<Service[] | null> {
  const preview = isPreview();
  return safeFetch<Service[]>(preview ? featuredServicesPreviewQuery : featuredServicesQuery, preview);
}

export async function fetchServiceCategories(): Promise<ServiceCategory[] | null> {
  return safeFetch<ServiceCategory[]>(allServiceCategoriesQuery);
}

export async function fetchProjects(): Promise<Project[] | null> {
  const preview = isPreview();
  return safeFetch<Project[]>(preview ? allProjectsPreviewQuery : allProjectsQuery, preview);
}

export async function fetchFeaturedProjects(): Promise<Project[] | null> {
  const preview = isPreview();
  return safeFetch<Project[]>(preview ? featuredProjectsPreviewQuery : featuredProjectsQuery, preview);
}

export async function fetchTeamMembers(): Promise<TeamMember[] | null> {
  const preview = isPreview();
  return safeFetch<TeamMember[]>(preview ? allTeamMembersPreviewQuery : allTeamMembersQuery, preview);
}

export async function fetchTestimonials(): Promise<Testimonial[] | null> {
  const preview = isPreview();
  return safeFetch<Testimonial[]>(preview ? allTestimonialsPreviewQuery : allTestimonialsQuery, preview);
}

export async function fetchPartners(): Promise<Partner[] | null> {
  const preview = isPreview();
  return safeFetch<Partner[]>(preview ? allPartnersPreviewQuery : allPartnersQuery, preview);
}

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  const preview = isPreview();
  return safeFetch<SiteSettings>(preview ? siteSettingsPreviewQuery : siteSettingsQuery, preview);
}

import type { Product } from './types';
import { allProductsQuery, allProductsPreviewQuery } from './sanity.queries';

/** Convert a Sanity image asset _ref to a CDN URL.
 *  ref format: "image-{sha1}-{width}x{height}-{format}"
 *  result: "https://cdn.sanity.io/images/{projectId}/{dataset}/{sha1}-{width}x{height}.{format}"
 */
function refToCdnUrl(ref: string): string {
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  const pid = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '981jghg0';
  // Remove "image-" prefix, replace last "-{ext}" with ".{ext}"
  const withoutPrefix = ref.replace(/^image-/, '');
  const lastDash = withoutPrefix.lastIndexOf('-');
  const ext = withoutPrefix.substring(lastDash + 1);
  const base = withoutPrefix.substring(0, lastDash);
  return `https://cdn.sanity.io/images/${pid}/${dataset}/${base}.${ext}`;
}

export async function fetchProducts(): Promise<Product[] | null> {
  const preview = isPreview();
  const res = await safeFetch<Product[]>(preview ? allProductsPreviewQuery : allProductsQuery, preview);
  if (!res) return null;
  // Convert imagenes from asset _refs to CDN URLs
  return res.map((product) => ({
    ...product,
    imagenes: (product.imagenes || [])
      .filter((ref: string) => typeof ref === 'string' && ref.startsWith('image-'))
      .map((ref: string) => refToCdnUrl(ref)),
  }));
}