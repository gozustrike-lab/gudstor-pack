// @ts-nocheck
import { defineType, defineField } from 'sanity';
import { titleField, slugField, imageField, descriptionField, orderField, featuredField, statusField } from '../lib/schema-master';

export default defineType({
  name: 'project',
  title: 'Caso de Éxito',
  type: 'document',
  fields: [
    titleField(),
    slugField(),
    imageField(),
    descriptionField(),
    defineField({
      name: 'client',
      title: 'Cliente',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: ['Ecommerce', 'Logística', 'Industrial', 'Alimentos', 'Retail'],
      },
    }),
    defineField({
      name: 'gallery',
      title: 'Galería',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'result',
      title: 'Resultado / Impacto',
      type: 'string',
    }),
    orderField(),
    featuredField(),
    statusField(),
  ],
  orderings: [{ title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', media: 'image', subtitle: 'client' } },
});