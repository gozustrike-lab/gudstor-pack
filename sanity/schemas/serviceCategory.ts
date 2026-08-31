// @ts-nocheck
import { defineType, defineField } from 'sanity';
import { titleField, slugField, orderField } from '../lib/schema-master';

export default defineType({
  name: 'serviceCategory',
  title: 'Categoría de Servicio',
  type: 'document',
  fields: [
    titleField(),
    slugField(),
    defineField({
      name: 'icon',
      title: 'Ícono (nombre Lucide)',
      type: 'string',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Color hexadecimal, ej: #0e384e',
    }),
    orderField(),
  ],
  preview: { select: { title: 'title' } },
});