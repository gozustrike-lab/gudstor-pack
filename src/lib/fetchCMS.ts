
import { draftMode } from 'next/headers';
import { client, draftClient, type HeroSlide, type Stat, type Service, type ServiceCategory, type Project, type TeamMember, type Testimonial, type Partner, type SiteSettings } from './sanity.client';
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

const { projectId } = await import('./sanity.client');

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

export async function fetchProducts(): Promise<Product[] | null> {
  const preview = isPreview();
  const res = await safeFetch<Product[]>(preview ? allProductsPreviewQuery : allProductsQuery, preview);
  console.log("FETCHED PRODUCTS COUNT:", res ? res.length : 'NULL');
  return res;
}