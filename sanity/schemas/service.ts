// @ts-nocheck
import { defineType, defineField } from 'sanity';
import { titleField, slugField, imageField, descriptionField, orderField, featuredField } from '../lib/schema-master';

export default defineType({
  name: 'service',
  title: 'Servicio',
  type: 'document',
  fields: [
    titleField(),
    slugField(),
    imageField(),
    descriptionField(),
    defineField({
      name: 'icon',
      title: 'Ícono (nombre Lucide)',
      type: 'string',
      description: 'Nombre del ícono de Lucide React, ej: Package, Truck, Shield',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Descripción Corta',
      type: 'string',
      description: 'Una línea para tarjetas',
    }),
    defineField({
      name: 'subservices',
      title: 'Sub-servicios',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    orderField(),
    featuredField(),
  ],
  orderings: [{ title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title', media: 'image' } },
});