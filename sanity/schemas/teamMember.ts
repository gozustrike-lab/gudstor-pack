// @ts-nocheck
import { defineType, defineField } from 'sanity';
import { titleField, imageField, orderField } from '../lib/schema-master';

export default defineType({
  name: 'teamMember',
  title: 'Miembro del Equipo',
  type: 'document',
  fields: [
    titleField(),
    imageField(),
    defineField({
      name: 'role',
      title: 'Cargo',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Teléfono',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    orderField(),
  ],
  preview: { select: { title: 'title', subtitle: 'role', media: 'image' } },
});