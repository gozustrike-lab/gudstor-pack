import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'homeSection',
  title: 'Sección Home',
  type: 'document',
  fields: [
    defineField({
      name: 'sectionType',
      title: 'Tipo de Sección',
      type: 'string',
      options: {
        list: [
          { title: 'CTA Principal', value: 'cta' },
          { title: 'Indicadores de Confianza', value: 'trust' },
          { title: 'Info de Envíos', value: 'shipping' },
          { title: 'Categorías Home', value: 'categories' },
          { title: 'Productos Populares', value: 'featuredProducts' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'title', title: 'Título', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtítulo', type: 'text', rows: 2 }),
    defineField({ name: 'badge', title: 'Badge', type: 'string' }),
    defineField({ name: 'ctaText', title: 'Texto del Botón Principal', type: 'string' }),
    defineField({ name: 'ctaLink', title: 'Link del Botón Principal', type: 'string' }),
    defineField({ name: 'secondaryCtaText', title: 'Texto Botón Secundario', type: 'string' }),
    defineField({ name: 'secondaryCtaLink', title: 'Link Botón Secundario', type: 'string' }),
    defineField({
      name: 'items',
      title: 'Items (indicadores, envíos, etc.)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'icon', title: 'Icono (lucide)', type: 'string' }),
          defineField({ name: 'title', title: 'Título', type: 'string' }),
          defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 2 }),
          defineField({ name: 'order', title: 'Orden', type: 'number', initialValue: 0 }),
        ],
        preview: {
          select: { title: 'title', icon: 'icon' },
          prepare: ({ title, icon }) => ({ title: title || 'Sin título', subtitle: icon || '' }),
        },
      }],
    }),
    defineField({ name: 'order', title: 'Orden', type: 'number', initialValue: 0 }),
  ],
  preview: {
    select: { sectionType: 'sectionType', title: 'title' },
    prepare: ({ sectionType, title }) => ({
      title: title || `Sección: ${sectionType}`,
      subtitle: sectionType,
    }),
  },
});