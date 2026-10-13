import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Producto',
  type: 'document',
  fields: [
    // ── 1. Información Principal ──
    defineField({
      name: 'nombre',
      title: 'Nombre del Producto',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL del producto: /productos/[slug])',
      type: 'slug',
      options: { source: 'nombre', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slugsAnteriores',
      title: 'Historial de Slugs Anteriores (Redirecciones 301)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Si cambias el slug, agrega aquí el slug anterior para que el sistema cree automáticamente la redirección 301 permanente.',
    }),

    // ── 2. Descripciones Separadas ──
    defineField({
      name: 'descripcionCorta',
      title: 'Descripción Corta',
      type: 'text',
      rows: 3,
      description: 'Resumen conciso para tarjetas, vista rápida y encabezado principal.',
    }),
    defineField({
      name: 'descripcionLarga',
      title: 'Descripción Larga',
      type: 'text',
      rows: 8,
      description: 'Descripción completa detallada que aparece en la pestaña "Descripción".',
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción General (Compatibilidad)',
      type: 'text',
      rows: 3,
      description: 'Se usa automáticamente si las descripciones corta o larga están vacías.',
    }),

    // ── 3. Precios y Stock Base ──
    defineField({
      name: 'precio',
      title: 'Precio Unitario Base (S/)',
      type: 'number',
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: 'precioAnterior',
      title: 'Precio Anterior / Tachado (S/)',
      type: 'number',
      description: 'Precio original para mostrar descuento de oferta (opcional).',
    }),
    defineField({
      name: 'stock',
      title: 'Stock General',
      type: 'number',
      initialValue: 500,
    }),
    defineField({
      name: 'sku',
      title: 'SKU / Código del Producto',
      type: 'string',
      description: 'Identificador único del producto base (ej: GP-BOX-403020).',
    }),

    // ── 4. Categoría y Subcategoría ──
    defineField({
      name: 'categoria',
      title: 'Categoría Principal',
      type: 'string',
      options: {
        list: ['Cajas', 'Films', 'Cintas', 'Protección', 'Bolsas'],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'categoriaRef',
      title: 'Categoría (Referencia CMS)',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Vincular con el documento de categoría administrable.',
    }),
    defineField({
      name: 'subcategoria',
      title: 'Subcategoría (Texto)',
      type: 'string',
      description: 'Ej: Archiveras, Corrugadas, Burbupack, Stretch Film, etc.',
    }),
    defineField({
      name: 'subcategoriaRef',
      title: 'Subcategoría (Referencia CMS)',
      type: 'reference',
      to: [{ type: 'subcategory' }],
      description: 'Vincular con el documento de subcategoría administrable.',
    }),

    // ── 5. Unidad de Medida ──
    defineField({
      name: 'unidadMedida',
      title: 'Unidad de Medida Principal',
      type: 'string',
      description: 'Unidad de medida del producto (ej: UDS, KG, MTRS, ROLLOS, BOLSAS, PAQ).',
      initialValue: 'UDS',
      options: {
        list: [
          { title: 'Unidades (UDS)', value: 'UDS' },
          { title: 'Kilogramos (KG)', value: 'KG' },
          { title: 'Metros (MTRS)', value: 'MTRS' },
          { title: 'Rollos (ROLLOS)', value: 'ROLLOS' },
          { title: 'Bolsas (BOLSAS)', value: 'BOLSAS' },
          { title: 'Paquetes (PAQ)', value: 'PAQ' },
        ],
      },
    }),

    // ── 6. Galería de Imágenes (con ALT editable y orden) ──
    defineField({
      name: 'imagenes',
      title: 'Galería de Imágenes del Producto',
      type: 'array',
      description: 'Sube todas las imágenes del producto. Puedes arrastrarlas para cambiar el orden. La primera será la imagen principal.',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Texto Alternativo (ALT)',
              type: 'string',
              description: 'Texto descriptivo para accesibilidad y posicionamiento en Google Imágenes.',
            }),
          ],
        },
      ],
    }),

    // ── 7. Variaciones de Producto ──
    defineField({
      name: 'tieneVariaciones',
      title: '¿Este producto tiene Variaciones? (Color, Medida, etc.)',
      type: 'boolean',
      initialValue: false,
      description: 'Activa esta casilla para habilitar atributos y combinaciones con precios y fotos independientes.',
    }),
    defineField({
      name: 'atributos',
      title: 'Atributos Configurables',
      type: 'array',
      hidden: ({ parent }) => !parent?.tieneVariaciones,
      description: 'Define los atributos del producto (ej: Tamaño, Color, Modelo, Micraje, Capacidad).',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'nombre',
              title: 'Nombre del Atributo',
              type: 'string',
              placeholder: 'Ej: Tamaño o Color',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'modificaPrecio',
              title: '¿Este atributo modifica el precio?',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'valores',
              title: 'Valores / Opciones',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Lista de opciones. Ej: ["30x20x15 cm", "40x30x20 cm"] o ["Kraft", "Blanco"]',
            }),
          ],
          preview: {
            select: { title: 'nombre', valores: 'valores', modifica: 'modificaPrecio' },
            prepare: ({ title, valores, modifica }) => ({
              title: `${title || 'Sin nombre'}${modifica ? ' (Modifica precio)' : ''}`,
              subtitle: Array.isArray(valores) ? valores.join(', ') : 'Sin valores',
            }),
          },
        },
      ],
    }),
    defineField({
      name: 'variaciones',
      title: 'Matriz de Variaciones / Combinaciones',
      type: 'array',
      hidden: ({ parent }) => !parent?.tieneVariaciones,
      description: 'Agrega cada combinación con su precio, stock, SKU, imagen y packs.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'titulo',
              title: 'Nombre / Título de la Variación',
              type: 'string',
              placeholder: 'Ej: 40×30×20 cm - Kraft',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'atributos',
              title: 'Valores de Atributos seleccionados',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({ name: 'nombre', title: 'Atributo', type: 'string', placeholder: 'Tamaño' }),
                    defineField({ name: 'valor', title: 'Valor', type: 'string', placeholder: '40×30×20 cm' }),
                  ],
                  preview: {
                    select: { nombre: 'nombre', valor: 'valor' },
                    prepare: ({ nombre, valor }) => ({ title: `${nombre}: ${valor}` }),
                  },
                },
              ],
            }),
            defineField({
              name: 'precio',
              title: 'Precio Unitario de la Variación (S/)',
              type: 'number',
              validation: (r) => r.required().min(0),
            }),
            defineField({
              name: 'precioAnterior',
              title: 'Precio Anterior (S/)',
              type: 'number',
            }),
            defineField({
              name: 'stock',
              title: 'Stock disponible',
              type: 'number',
              initialValue: 100,
            }),
            defineField({
              name: 'sku',
              title: 'SKU de la Variación',
              type: 'string',
              placeholder: 'CJ-403020-K',
            }),
            defineField({
              name: 'imagen',
              title: 'Imagen representativa de la Variación',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'medidas',
              title: 'Medidas específicas',
              type: 'string',
            }),
            defineField({
              name: 'peso',
              title: 'Peso',
              type: 'string',
            }),
            defineField({
              name: 'disponible',
              title: 'Disponible para venta',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'packs',
              title: 'Packs específicos de esta Variación (opcional)',
              type: 'array',
              description: 'Si se deja vacío, el sistema recalcula los packs base con el precio de esta variación.',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({ name: 'cantidad', title: 'Cantidad', type: 'number', validation: (r) => r.required().min(1) }),
                    defineField({ name: 'precio', title: 'Precio del Pack (S/)', type: 'number', validation: (r) => r.required().min(0) }),
                    defineField({ name: 'descuento', title: 'Descuento (%)', type: 'number', initialValue: 0 }),
                    defineField({ name: 'unidad', title: 'Unidad (opcional)', type: 'string' }),
                  ],
                  preview: {
                    select: { cantidad: 'cantidad', precio: 'precio', descuento: 'descuento', unidad: 'unidad' },
                    prepare: ({ cantidad, precio, descuento, unidad }) => ({
                      title: `Pack ${cantidad} ${unidad || 'uds'}`,
                      subtitle: `S/ ${precio?.toFixed(2)}${descuento > 0 ? ` (-${descuento}%)` : ''}`,
                    }),
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: 'titulo',
              precio: 'precio',
              sku: 'sku',
              stock: 'stock',
              media: 'imagen',
            },
            prepare: ({ title, precio, sku, stock, media }) => ({
              title: title || 'Variación',
              subtitle: `S/ ${precio?.toFixed(2)} | Stock: ${stock} | SKU: ${sku || 'S/N'}`,
              media,
            }),
          },
        },
      ],
    }),

    // ── 8. Packs Flexibles Generales ──
    defineField({
      name: 'packs',
      title: 'Packs de Descuento por Volumen (25, 50, 100, 250, etc.)',
      type: 'array',
      description: 'Agrega o elimina cualquier cantidad de packs. El precio unitario se calcula automáticamente.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'cantidad',
              title: 'Cantidad en el Pack',
              type: 'number',
              validation: (r) => r.required().min(1),
            }),
            defineField({
              name: 'unidad',
              title: 'Unidad (opcional)',
              type: 'string',
              description: 'Dejar en blanco para usar la unidad principal del producto.',
            }),
            defineField({
              name: 'precio',
              title: 'Precio Total del Pack (S/)',
              type: 'number',
              validation: (r) => r.required().min(0),
            }),
            defineField({
              name: 'descuento',
              title: 'Porcentaje de Descuento (%)',
              type: 'number',
              initialValue: 0,
            }),
          ],
          preview: {
            select: { cantidad: 'cantidad', precio: 'precio', descuento: 'descuento', unidad: 'unidad' },
            prepare: ({ cantidad, precio, descuento, unidad }) => ({
              title: `Pack ${cantidad} ${unidad || 'uds'}`,
              subtitle: `S/ ${precio?.toFixed(2)}${descuento > 0 ? ` (-${descuento}%)` : ''} — Unitario: S/ ${(precio && cantidad ? (precio / cantidad).toFixed(2) : '0.00')}/u`,
            }),
          },
        },
      ],
    }),

    // ── 9. Especificaciones Dinámicas (Clave / Valor) ──
    defineField({
      name: 'especificaciones',
      title: 'Especificaciones Técnicas (Dinámicas)',
      type: 'array',
      description: 'Agrega cualquier especificación que requiera este producto (Material, Medidas, Peso, Micraje, Ancho, Largo, Capacidad, etc.).',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'nombre',
              title: 'Característica / Especificación',
              type: 'string',
              placeholder: 'Ej: Micraje, Peso, Capacidad, Material',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'valor',
              title: 'Valor / Detalle',
              type: 'string',
              placeholder: 'Ej: 20 micras, 25 kg, 50 litros',
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: 'nombre', subtitle: 'valor' },
          },
        },
      ],
    }),

    // ── 10. Información de Envíos por Producto ──
    defineField({
      name: 'envio',
      title: 'Configuración de Envíos para este Producto',
      type: 'object',
      description: 'Personaliza los tiempos, costos y condiciones de envío para este producto.',
      fields: [
        defineField({
          name: 'info',
          title: 'Información General de Envío',
          type: 'string',
          placeholder: 'Despacho rápido a todo el país',
        }),
        defineField({
          name: 'zonas',
          title: 'Zonas de Cobertura',
          type: 'string',
          placeholder: 'Lima Metropolitana y todas las provincias del Perú',
        }),
        defineField({
          name: 'tiempos',
          title: 'Tiempos de Entrega',
          type: 'string',
          placeholder: '24h Lima Metropolitana / 48-72h Provincias',
        }),
        defineField({
          name: 'condiciones',
          title: 'Condiciones de Despacho',
          type: 'text',
          rows: 2,
          placeholder: 'Pedidos antes de las 2:00 PM se despachan el mismo día.',
        }),
        defineField({
          name: 'costo',
          title: 'Costo de Envío / Tarifa',
          type: 'string',
          placeholder: 'Envío gratis a partir de S/ 200 o tarifa fija según distrito.',
        }),
      ],
    }),

    // ── 11. Preguntas Frecuentes del Producto ──
    defineField({
      name: 'faqs',
      title: 'Preguntas Frecuentes del Producto',
      type: 'array',
      description: 'Preguntas y respuestas específicas para este producto.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'q', title: 'Pregunta', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'a', title: 'Respuesta', type: 'text', rows: 3, validation: (r) => r.required() }),
          ],
          preview: {
            select: { title: 'q', subtitle: 'a' },
          },
        },
      ],
    }),

    // ── 12. SEO por Producto ──
    defineField({
      name: 'seoTitle',
      title: 'SEO Title (Meta Title)',
      type: 'string',
      description: 'Título optimizado para Google (50-60 caracteres). Si está vacío, usa el nombre del producto.',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Descripción para resultados de búsqueda (150-160 caracteres).',
    }),
    defineField({
      name: 'canonical',
      title: 'URL Canónica Personalizada (opcional)',
      type: 'url',
      description: 'Por defecto se genera automáticamente como https://gudstor-pack.vercel.app/productos/[slug].',
    }),
    defineField({
      name: 'noIndex',
      title: 'No Indexar (noindex)',
      type: 'boolean',
      initialValue: false,
      description: 'Marcar para que Google no indexe esta página.',
    }),
    defineField({
      name: 'ogTitle',
      title: 'Open Graph Title (Redes Sociales)',
      type: 'string',
    }),
    defineField({
      name: 'ogDescription',
      title: 'Open Graph Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image (Imagen para WhatsApp / Facebook)',
      type: 'image',
    }),

    // ── 13. Metadatos adicionales para compatibilidad ──
    defineField({ name: 'material', title: 'Material', type: 'string' }),
    defineField({ name: 'colores', title: 'Colores disponibles', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'medidas', title: 'Medidas disponibles', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'destacado', title: 'Producto Destacado', type: 'boolean', initialValue: false }),
    defineField({ name: 'etiquetas', title: 'Etiquetas / Tags', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'seoPath', title: 'Ruta SEO antigua (legacy)', type: 'string' }),
    defineField({ name: 'order', title: 'Orden de aparición', type: 'number', initialValue: 0 }),
  ],
  preview: {
    select: {
      nombre: 'nombre',
      categoria: 'categoria',
      slug: 'slug',
      precio: 'precio',
      media: 'imagenes.0',
    },
    prepare: ({ nombre, categoria, slug, precio, media }) => ({
      title: nombre || 'Producto sin nombre',
      subtitle: `${categoria || 'Sin categoría'} · S/ ${precio?.toFixed(2) || '0.00'} · /productos/${slug?.current || ''}`,
      media,
    }),
  },
  orderings: [
    { title: 'Orden', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Nombre (A-Z)', name: 'nombreAsc', by: [{ field: 'nombre', direction: 'asc' }] },
    { title: 'Precio menor a mayor', name: 'precioAsc', by: [{ field: 'precio', direction: 'asc' }] },
  ],
});