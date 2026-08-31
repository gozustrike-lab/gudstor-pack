// @ts-nocheck
import { defineType, defineField } from 'sanity';
import { titleField, imageField, orderField } from '../lib/schema-master';

export default defineType({
  name: 'partner',
  title: 'Socio / Cliente',
  type: 'document',
  fields: [
    titleField(),
    imageField(),
    defineField({
      name: 'url',
      title: 'URL del Sitio Web',
      type: 'url',
    }),
    orderField(),
  ],
  preview: { select: { title: 'title', media: 'image' } },
});