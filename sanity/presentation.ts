// @ts-nocheck
import { defineDocuments, defineLocations } from 'sanity/presentation';

export const { client: presentationClient } = defineDocuments({
  documentTypes: [
    { type: 'heroSlide', title: 'Hero Slide' },
    { type: 'stat', title: 'Estadística' },
    { type: 'testimonial', title: 'Testimonio' },
    { type: 'partner', title: 'Socio / Cliente' },
    { type: 'service', title: 'Servicio' },
    { type: 'serviceCategory', title: 'Categoría de Servicio' },
    { type: 'project', title: 'Caso de Éxito' },
    { type: 'teamMember', title: 'Miembro del Equipo' },
    { type: 'siteSettings', title: 'Configuración del Sitio', resolve: { id: 'siteSettings' } },
    { type: 'homeSection', title: 'Sección Home' },
    { type: 'product', title: 'Producto' },
  ],
});

// Mapeo de tipos de documento → rutas del frontend
export const locations = defineLocations({
  select: {
    title: 'heroSlide.title',
    slug: 'heroSlide.slug.current',
  },
  resolve: { type: 'heroSlide', href: '/' },
}, {
  select: {
    title: 'stat.label',
  },
  resolve: { type: 'stat', href: '/' },
}, {
  select: {
    title: 'testimonial.author',
  },
  resolve: { type: 'testimonial', href: '/' },
}, {
  select: {
    title: 'partner.title',
  },
  resolve: { type: 'partner', href: '/' },
}, {
  select: {
    title: 'service.title',
    slug: 'service.slug.current',
  },
  resolve: { type: 'service', href: '/' },
}, {
  select: {
    title: 'project.title',
    slug: 'project.slug.current',
  },
  resolve: { type: 'project', href: '/' },
}, {
  select: {
    title: 'teamMember.title',
  },
  resolve: { type: 'teamMember', href: '/' },
}, {
  select: {
    title: 'homeSection.title',
    sectionType: 'homeSection.sectionType',
  },
  resolve: { type: 'homeSection', href: '/' },
}, {
  select: {
    title: 'product.nombre',
    slug: 'product.slug.current',
  },
  resolve: { type: 'product', href: ({ slug }: any) => `/productos/${slug}` } },
}, {
  select: {
    title: 'siteSettings.companyName',
  },
  resolve: { type: 'siteSettings', id: 'siteSettings', href: '/' },
});