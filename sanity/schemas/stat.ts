// @ts-nocheck
import { defineType, defineField } from 'sanity';
import { orderField } from '../lib/schema-master';

export default defineType({
  name: 'stat',
  title: 'Estadística',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Etiqueta',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Valor Numérico',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'prefix',
      title: 'Prefijo',
      type: 'string',
      description: 'Ej: S/, +, >',
    }),
    defineField({
      name: 'suffix',
      title: 'Sufijo',
      type: 'string',
      description: 'Ej: %, uds, clientes',
    }),
    defineField({
      name: 'icon',
      title: 'Ícono (nombre Lucide)',
      type: 'string',
    }),
    orderField(),
  ],
  preview: { select: { title: 'label', subtitle: 'value' } },
});