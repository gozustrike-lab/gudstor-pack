// @ts-nocheck
import { defineType, defineField } from 'sanity';
import { titleField, imageField, descriptionField, orderField } from '../lib/schema-master';

export default defineType({
  name: 'heroSlide',
  title: 'Slide del Hero',
  type: 'document',
  fields: [
    titleField(),
    imageField(),
    descriptionField(),
    defineField({
      name: 'ctaText',
      title: 'Texto del Botón CTA',
      type: 'string',
      initialValue: 'Ver Catálogo',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Enlace del Botón CTA',
      type: 'string',
      initialValue: '/productos',
    }),
    orderField(),
  ],
  orderings: [{ title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', media: 'image' } },
});