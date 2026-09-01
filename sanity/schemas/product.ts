import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Producto',
  type: 'document',
  fields: [
    defineField({ name: 'nombre', title: 'Nombre', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'nombre', maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: 'descripcion', title: 'Descripción', type: 'text', rows: 3 }),
    defineField({ name: 'precio', title: 'Precio Unitario (S/)', type: 'number', validation: (r) => r.required().min(0) }),
    defineField({ name: 'stock', title: 'Stock', type: 'number', initialValue: 500 }),
    defineField({
      name: 'categoria',
      title: 'Categoría',
      type: 'string',
      options: { list: ['Cajas', 'Films', 'Cintas', 'Protección', 'Bolsas'], layout: 'radio' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'material', title: 'Material', type: 'string' }),
    defineField({ name: 'imagenes', title: 'Imágenes', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'colores', title: 'Colores', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'medidas', title: 'Medidas', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'seoPath', title: 'Ruta SEO (URL)', type: 'string', description: 'Por ejemplo: cajas-de-carton/cajas-archiveras' }),
    defineField({ name: 'destacado', title: 'Destacado', type: 'boolean', initialValue: false }),
    defineField({ name: 'etiquetas', title: 'Etiquetas', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'packs',
      title: 'Packs',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'cantidad', title: 'Cantidad (uds)', type: 'number', validation: (r) => r.required().min(1) }),
          defineField({ name: 'precio', title: 'Precio del Pack (S/)', type: 'number', validation: (r) => r.required().min(0) }),
          defineField({ name: 'descuento', title: 'Descuento (%)', type: 'number', initialValue: 0 }),
        ],
        preview: {
          select: { cantidad: 'cantidad', precio: 'precio', descuento: 'descuento' },
          prepare: ({ cantidad, precio, descuento }) => ({
            title: `Pack ${cantidad} uds`,
            subtitle: `S/ ${precio?.toFixed(2)}${descuento > 0 ? ` (-${descuento}%)` : ''}`,
          }),
        },
      }],
    }),
    defineField({ name: 'order', title: 'Orden', type: 'number', initialValue: 0 }),
  ],
  preview: {
    select: {
      nombre: 'nombre',
      categoria: 'categoria',
      slug: 'slug',
      media: 'imagenes.0',
    },
    prepare: ({ nombre, categoria, slug, media }) => ({
      title: nombre,
      subtitle: `${categoria} — /productos/${slug?.current || ''}`,
      media,
    }),
  },
  orderings: [{ title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
});