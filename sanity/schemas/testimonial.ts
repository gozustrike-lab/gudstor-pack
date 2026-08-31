// @ts-nocheck
import { defineType, defineField } from 'sanity';
import { titleField, imageField, orderField } from '../lib/schema-master';

export default defineType({
  name: 'testimonial',
  title: 'Testimonio',
  type: 'document',
  fields: [
    defineField({
      name: 'author',
      title: 'Nombre del Cliente',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    imageField(),
    defineField({
      name: 'company',
      title: 'Empresa',
      type: 'string',
    }),
    defineField({
      name: 'role',
      title: 'Cargo',
      type: 'string',
    }),
    defineField({
      name: 'quote',
      title: 'Testimonio',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Calificación (1-5)',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5).integer(),
      initialValue: 5,
    }),
    orderField(),
  ],
  preview: { select: { title: 'author', subtitle: 'company' } },
});