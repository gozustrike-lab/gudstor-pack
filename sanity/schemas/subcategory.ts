import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'subcategory',
  title: 'Subcategoría de Producto',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre de la Subcategoría',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'nombre', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'categoria',
      title: 'Categoría Padre',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Orden de Visualización',
      type: 'number',
      initialValue: 0,
    }),

    // ── Hero de Subcategoría ──
    defineField({
      name: 'heroTitle',
      title: 'Título del Hero',
      type: 'string',
      description: 'Título visual principal de la cabecera',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Descripción del Hero',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen del Hero / Banner',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroImageAlt',
      title: 'Texto ALT de la Imagen',
      type: 'string',
    }),
    defineField({
      name: 'heroCtaText',
      title: 'Texto del Botón CTA (opcional)',
      type: 'string',
    }),
    defineField({
      name: 'heroCtaLink',
      title: 'Enlace del Botón CTA (opcional)',
      type: 'string',
    }),

    // ── SEO de Subcategoría ──
    defineField({
      name: 'h1',
      title: 'Encabezado H1 (SEO)',
      type: 'string',
    }),
    defineField({
      name: 'introDescription',
      title: 'Descripción Introductoria (bajo H1)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'bottomSeoText',
      title: 'Texto SEO Inferior (debajo de productos)',
      type: 'text',
      rows: 6,
      description: 'Contenido SEO extenso que aparece al final de la página',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title (Meta Title)',
      type: 'string',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'canonical',
      title: 'URL Canónica Personalizada (opcional)',
      type: 'url',
    }),
    defineField({
      name: 'noIndex',
      title: 'No Indexar (noindex)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagen para Redes Sociales (Open Graph)',
      type: 'image',
    }),
  ],
  preview: {
    select: {
      title: 'nombre',
      parentCategory: 'categoria.nombre',
      media: 'heroImage',
    },
    prepare: ({ title, parentCategory, media }) => ({
      title: title || 'Sin nombre',
      subtitle: parentCategory ? `Categoría: ${parentCategory}` : '',
      media,
    }),
  },
  orderings: [
    {
      title: 'Orden ascendente',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
});
