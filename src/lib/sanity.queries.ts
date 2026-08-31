import { groq } from 'next-sanity';

const IMAGE_PROJ = `{
  "id": asset->_ref,
  "url": asset->url,
  "alt": alt,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "blur": asset->metadata.lqip,
}`;

export const allHeroSlidesQuery = groq`
  *[_type == "heroSlide" && !(_id in path("drafts.**"))] | order(order asc) {
    _id, title, "slug": slug.current, description, ctaText, ctaLink, order,
    "image": image${IMAGE_PROJ}
  }
`;

export const allStatsQuery = groq`
  *[_type == "stat" && !(_id in path("drafts.**"))] | order(order asc) {
    _id, label, value, prefix, suffix, icon, order
  }
`;

export const allServicesQuery = groq`
  *[_type == "service" && !(_id in path("drafts.**"))] | order(order asc) {
    _id, title, "slug": slug.current, description, icon, shortDescription, subservices, order, featured,
    "image": image${IMAGE_PROJ}
  }
`;

export const featuredServicesQuery = groq`
  *[_type == "service" && featured == true && !(_id in path("drafts.**"))] | order(order asc) {
    _id, title, "slug": slug.current, description, icon, shortDescription, subservices, order, featured,
    "image": image${IMAGE_PROJ}
  }
`;

export const allServiceCategoriesQuery = groq`
  *[_type == "serviceCategory" && !(_id in path("drafts.**"))] | order(order asc) {
    _id, title, "slug": slug.current, icon, color, order
  }
`;

export const allProjectsQuery = groq`
  *[_type == "project" && status == "published" && !(_id in path("drafts.**"))] | order(order asc) {
    _id, title, "slug": slug.current, description, client, category, result, order, featured, status,
    "image": image${IMAGE_PROJ},
    "gallery": gallery[].${IMAGE_PROJ}
  }
`;

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true && status == "published" && !(_id in path("drafts.**"))] | order(order asc) {
    _id, title, "slug": slug.current, description, client, category, result, order,
    "image": image${IMAGE_PROJ},
    "gallery": gallery[].${IMAGE_PROJ}
  }
`;

export const allTeamMembersQuery = groq`
  *[_type == "teamMember" && !(_id in path("drafts.**"))] | order(order asc) {
    _id, title, role, phone, email, order,
    "image": image${IMAGE_PROJ}
  }
`;

export const allTestimonialsQuery = groq`
  *[_type == "testimonial" && !(_id in path("drafts.**"))] | order(order asc) {
    _id, author, company, role, quote, rating, order,
    "image": image${IMAGE_PROJ}
  }
`;

export const allPartnersQuery = groq`
  *[_type == "partner" && !(_id in path("drafts.**"))] | order(order asc) {
    _id, title, url, order,
    "image": image${IMAGE_PROJ}
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings" && !(_id in path("drafts.**"))][0] {
    _id, companyName, tagline, description, whatsapp, email, phone, address, mapEmbedUrl,
    "socialLinks": socialLinks[],
    "ogImage": ogImage${IMAGE_PROJ},
    "favicon": favicon${IMAGE_PROJ},
    "ctaSection": ctaSection {
      badge, title, subtitle, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink
    },
    "shippingItems": shippingItems[] { icon, title, description, order },
    "trustItems": trustItems[] { icon, title, description, order },
    "footerCompanyLinks": footerCompanyLinks[] { title, href },
    footerHours,
    seoTitle, seoDescription
  }
`;

// ── Preview queries (sin filtro de drafts) ──
// Usadas con perspective: "previewDrafts" — Sanity ya filtra por perspectiva

export const allHeroSlidesPreviewQuery = groq`
  *[_type == "heroSlide"] | order(order asc) {
    _id, title, "slug": slug.current, description, ctaText, ctaLink, order,
    "image": image${IMAGE_PROJ}
  }
`;

export const allStatsPreviewQuery = groq`
  *[_type == "stat"] | order(order asc) {
    _id, label, value, prefix, suffix, icon, order
  }
`;

export const allTestimonialsPreviewQuery = groq`
  *[_type == "testimonial"] | order(order asc) {
    _id, author, company, role, quote, rating, order,
    "image": image${IMAGE_PROJ}
  }
`;

export const siteSettingsPreviewQuery = groq`
  *[_type == "siteSettings"][0] {
    _id, companyName, tagline, description, whatsapp, email, phone, address, mapEmbedUrl,
    "socialLinks": socialLinks[],
    "ogImage": ogImage${IMAGE_PROJ},
    "favicon": favicon${IMAGE_PROJ},
    "ctaSection": ctaSection {
      badge, title, subtitle, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink
    },
    "shippingItems": shippingItems[] { icon, title, description, order },
    "trustItems": trustItems[] { icon, title, description, order },
    "footerCompanyLinks": footerCompanyLinks[] { title, href },
    footerHours,
    seoTitle, seoDescription
  }
`;

export const allServicesPreviewQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id, title, "slug": slug.current, description, icon, shortDescription, subservices, order, featured,
    "image": image${IMAGE_PROJ}
  }
`;

export const allProjectsPreviewQuery = groq`
  *[_type == "project"] | order(order asc) {
    _id, title, "slug": slug.current, description, client, category, result, order, featured, status,
    "image": image${IMAGE_PROJ},
    "gallery": gallery[].${IMAGE_PROJ}
  }
`;

export const allPartnersPreviewQuery = groq`
  *[_type == "partner"] | order(order asc) {
    _id, title, url, order,
    "image": image${IMAGE_PROJ}
  }
`;

export const allTeamMembersPreviewQuery = groq`
  *[_type == "teamMember"] | order(order asc) {
    _id, title, role, phone, email, order,
    "image": image${IMAGE_PROJ}
  }
`;

export const featuredServicesPreviewQuery = groq`
  *[_type == "service" && featured == true] | order(order asc) {
    _id, title, "slug": slug.current, description, icon, shortDescription, subservices, order, featured,
    "image": image${IMAGE_PROJ}
  }
`;

export const featuredProjectsPreviewQuery = groq`
  *[_type == "project" && featured == true] | order(order asc) {
    _id, title, "slug": slug.current, description, client, category, result, order,
    "image": image${IMAGE_PROJ},
    "gallery": gallery[].${IMAGE_PROJ}
  }
`;

export const allProductsQuery = groq`
  *[_type == "product" && !(_id in path("drafts.**"))] | order(order asc) {
    _id,
    "id": _id,
    nombre,
    "slug": slug.current,
    descripcion,
    precio,
    "precioUnidad": "S/ " + string(precio),
    stock,
    categoria,
    material,
    "imagenes": imagenes[].asset->url,
    colores,
    medidas,
    destacado,
    etiquetas,
    seoPath,
    packs[] {
      cantidad,
      precio,
      descuento
    },
    order
  }
`;

export const allProductsPreviewQuery = groq`
  *[_type == "product"] | order(order asc) {
    _id,
    "id": _id,
    nombre,
    "slug": slug.current,
    descripcion,
    precio,
    "precioUnidad": "S/ " + string(precio),
    stock,
    categoria,
    material,
    "imagenes": imagenes[].asset->url,
    colores,
    medidas,
    destacado,
    etiquetas,
    seoPath,
    packs[] {
      cantidad,
      precio,
      descuento
    },
    order
  }
`;