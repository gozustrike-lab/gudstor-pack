// @ts-nocheck
import { defineType, defineField } from 'sanity';

const ctaSectionField = () =>
  defineField({
    name: 'ctaSection',
    title: 'Sección CTA (Call to Action)',
    type: 'object',
    fields: [
      defineField({ name: 'badge', title: 'Badge', type: 'string', description: 'Texto pequeño sobre el título (ej: "Asesoría personalizada gratis")' }),
      defineField({ name: 'title', title: 'Título', type: 'string' }),
      defineField({ name: 'subtitle', title: 'Subtítulo', type: 'text', rows: 3 }),
      defineField({ name: 'ctaText', title: 'Texto Botón Principal', type: 'string' }),
      defineField({ name: 'ctaLink', title: 'Link Botón Principal', type: 'string' }),
      defineField({ name: 'secondaryCtaText', title: 'Texto Botón Secundario', type: 'string' }),
      defineField({ name: 'secondaryCtaLink', title: 'Link Botón Secundario', type: 'string' }),
    ],
    preview: { select: { title: 'title', badge: 'badge' }, prepare: ({ title, badge }) => ({ title: title || 'CTA Section', subtitle: badge }) },
  });

const sectionItemField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [{
      type: 'object',
      fields: [
        defineField({ name: 'icon', title: 'Icono (nombre Lucide)', type: 'string', description: 'Ej: Truck, Shield, MessageCircle, Clock, MapPin, TrendingUp, Award' }),
        defineField({ name: 'title', title: 'Título', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'description', title: 'Descripción', type: 'text', rows: 2 }),
        defineField({ name: 'order', title: 'Orden', type: 'number', initialValue: 0 }),
      ],
      preview: {
        select: { title: 'title', icon: 'icon' },
        prepare: ({ title, icon }) => ({ title: title || 'Sin título', subtitle: icon || '' }),
      },
    }],
  });

export default defineType({
  name: 'siteSettings',
  title: 'Configuración del Sitio',
  type: 'document',
  fields: [
    // ── Company Info ──
    defineField({ name: 'companyName', title: 'Nombre de la Empresa', type: 'string', initialValue: 'GUDSTOR PACK' }),
    defineField({ name: 'tagline', title: 'Eslogan', type: 'string', initialValue: 'Soluciones en Embalaje' }),
    defineField({ name: 'description', title: 'Descripción del Sitio', type: 'text', rows: 3 }),
    defineField({ name: 'whatsapp', title: 'WhatsApp (formato internacional sin +)', type: 'string', initialValue: '51977346837' }),
    defineField({ name: 'email', title: 'Email de Contacto', type: 'string' }),
    defineField({ name: 'phone', title: 'Teléfono', type: 'string' }),
    defineField({ name: 'address', title: 'Dirección', type: 'string' }),
    defineField({ name: 'mapEmbedUrl', title: 'URL del Mapa (Google Maps Embed)', type: 'url' }),

    // ── SEO & Open Graph ──
    defineField({ name: 'seoTitle', title: 'Título SEO (por defecto)', type: 'string', description: 'Se usa como título por defecto del sitio. Si está vacío, usa el nombre de la empresa.' }),
    defineField({ name: 'seoDescription', title: 'Descripción SEO (por defecto)', type: 'text', rows: 2, description: 'Meta descripción por defecto del sitio.' }),
    defineField({ name: 'ogImage', title: 'OG Image', type: 'image', options: { hotspot: true }, description: 'Imagen por defecto para compartir en redes sociales.' }),
    defineField({ name: 'favicon', title: 'Favicon', type: 'image' }),

    // ── CTA Section (Home) ──
    ctaSectionField(),

    // ── Shipping Info ──
    sectionItemField('shippingItems', 'Info de Envíos (Home)'),

    // ── Trust Indicators ──
    sectionItemField('trustItems', 'Indicadores de Confianza (Home)'),

    // ── Footer ──
    defineField({
      name: 'footerCompanyLinks',
      title: 'Links de Empresa (Footer)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title', title: 'Texto del Link', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'href', title: 'URL', type: 'string' }),
        ],
        preview: { select: { title: 'title', href: 'href' }, prepare: ({ title, href }) => ({ title, subtitle: href }) },
      }],
    }),
    defineField({ name: 'footerHours', title: 'Horario de Atención (Footer)', type: 'string', initialValue: 'Lun - Vie: 8:00 - 18:00' }),

    // ── Social Links ──
    defineField({
      name: 'socialLinks',
      title: 'Redes Sociales',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'platform', type: 'string', title: 'Plataforma', options: { list: ['Facebook', 'Instagram', 'TikTok', 'LinkedIn', 'YouTube'] } },
            { name: 'url', type: 'url', title: 'URL' },
          ],
        },
      ],
    }),
  ],
  preview: { select: { title: 'companyName' } },
});