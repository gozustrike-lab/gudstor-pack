/**
 * seedCMS.ts — Poblar Sanity CMS con toda la data de GUDSTOR PACK.
 *
 * USO: npx tsx scripts/seedCMS.ts
 *
 * REQUISITOS:
 *   - Variables de entorno en .env.local:
 *     NEXT_PUBLIC_SANITY_PROJECT_ID
 *     SANITY_API_READ_TOKEN  (con permisos de escritura)
 */

import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId || !token) {
  console.error('Faltan variables de entorno. Necesitas:');
  console.error('   NEXT_PUBLIC_SANITY_PROJECT_ID');
  console.error('   SANITY_API_READ_TOKEN (con permisos de escritura)');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  companyName: 'GUDSTOR PACK',
  tagline: 'Soluciones en Embalaje',
  description: 'GUDSTOR PACK es tu proveedor lider de materiales de embalaje profesional en Peru. Cajas de carton, films, cintas adhesivas, materiales de proteccion y bolsas para ecommerce, logistica e industria.',
  whatsapp: '51977346837',
  email: 'ventas@gudstorpack.com',
  phone: '+51 977 346 837',
  address: 'Lima, Peru',
  seoTitle: 'GUDSTOR PACK | Soluciones en Embalaje',
  seoDescription: 'Materiales de embalaje profesional para ecommerce, logistica e industria. Cajas, films, cintas y mas. Envio rapido a todo Peru.',
  ctaSection: {
    _type: 'ctaSection',
    badge: 'Asesoria personalizada gratis',
    title: '¿Listo para optimizar tu embalaje?',
    subtitle: 'Contactanos por WhatsApp y recibe asesoria personalizada para tu negocio. Envio rapido a todo el Peru.',
    ctaText: 'Ver Catalogo',
    ctaLink: '/productos',
    secondaryCtaText: 'WhatsApp',
    secondaryCtaLink: 'https://wa.me/51977346837?text=Hola%2C%20quiero%20cotizar%20materiales%20de%20embalaje',
  },
  shippingItems: [
    { _type: 'shippingItems', icon: 'Clock', title: 'Despacho Rapido', description: 'Pedidos antes de las 2pm se despachan el mismo dia en Lima.', order: 0 },
    { _type: 'shippingItems', icon: 'MapPin', title: 'Cobertura Nacional', description: 'Envios a todas las regiones del Peru con seguimiento por WhatsApp.', order: 1 },
    { _type: 'shippingItems', icon: 'Shield', title: 'Empaque Seguro', description: 'Todos nuestros productos viajan con empaque protector especial.', order: 2 },
  ],
  trustItems: [
    { _type: 'trustItems', icon: 'Truck', title: 'Envio a Todo el Peru', description: 'Despacho en 24h para Lima Metropolitana y 48-72h a provincias. Seguimiento en tiempo real por WhatsApp.', order: 0 },
    { _type: 'trustItems', icon: 'Shield', title: 'Calidad Garantizada', description: 'Productos certificados con garantia de resistencia. Materiales de primera calidad para proteccion profesional.', order: 1 },
    { _type: 'trustItems', icon: 'MessageCircle', title: 'Asesoria por WhatsApp', description: 'Atencion personalizada inmediata por WhatsApp. Cotizacion y recomendacion de productos para tu negocio.', order: 2 },
    { _type: 'trustItems', icon: 'TrendingUp', title: 'Precios por Mayor', description: 'Descuentos escalonados desde 25 unidades hasta 1000+. Ahorra hasta 20% comprando en volumen.', order: 3 },
  ],
  footerCompanyLinks: [
    { _type: 'footerCompanyLinks', title: 'Sobre Nosotros', href: '/sobre-nosotros' },
    { _type: 'footerCompanyLinks', title: 'Terminos y Condiciones', href: '/terminos' },
    { _type: 'footerCompanyLinks', title: 'Politica de Privacidad', href: '/privacidad' },
    { _type: 'footerCompanyLinks', title: 'Envios', href: '/envios' },
  ],
  footerHours: 'Lun - Vie: 8:00 - 18:00',
  socialLinks: [
    { platform: 'Facebook', url: 'https://facebook.com/gudstorpack' },
    { platform: 'Instagram', url: 'https://instagram.com/gudstorpack' },
    { platform: 'TikTok', url: 'https://tiktok.com/@gudstorpack' },
  ],
};

const heroSlides = [
  { _type: 'heroSlide', title: 'Embalaje Profesional para tu Negocio', description: 'Mas de 50 productos de embalaje con descuentos por volumen. Envio a todo el Peru.', ctaText: 'Ver Catalogo', ctaLink: '/productos', order: 0, _id: 'heroSlide-0' },
  { _type: 'heroSlide', title: 'Cajas de Carton Corrugado', description: 'Autoarmables, kraft, doble pared y mas. Desde 25 unidades con descuentos de hasta 20%.', ctaText: 'Ver Cajas', ctaLink: '/productos?categoria=Cajas', order: 1, _id: 'heroSlide-1' },
  { _type: 'heroSlide', title: 'Films y Plasticos Industriales', description: 'Film estirable, termoencogible, antistatico y alimentario. Proteccion profesional.', ctaText: 'Ver Films', ctaLink: '/productos?categoria=Films', order: 2, _id: 'heroSlide-2' },
];

const stats = [
  { _type: 'stat', label: 'Productos Disponibles', value: 50, suffix: '+', icon: 'Package', order: 0, _id: 'stat-0' },
  { _type: 'stat', label: 'Clientes Satisfechos', value: 500, suffix: '+', icon: 'Users', order: 1, _id: 'stat-1' },
  { _type: 'stat', label: 'Envios a Todo el Peru', value: 100, suffix: '%', icon: 'Truck', order: 2, _id: 'stat-2' },
  { _type: 'stat', label: 'Anos de Experiencia', value: 5, suffix: '+', icon: 'Award', order: 3, _id: 'stat-3' },
];

const services = [
  { _type: 'service', title: 'Venta por Mayor', slug: { _type: 'slug', current: 'venta-por-mayor' }, shortDescription: 'Descuentos escalonados desde 25 unidades', description: 'Ofrecemos precios mayoristas con descuentos que aumentan segun el volumen de compra.', icon: 'ShoppingCart', subservices: ['Packs de 25 unidades', 'Packs de 50 unidades', 'Packs de 100 unidades'], featured: true, order: 0, _id: 'service-venta-por-mayor' },
  { _type: 'service', title: 'Envio a Todo el Peru', slug: { _type: 'slug', current: 'envio-todo-peru' }, shortDescription: 'Despacho en 24h para Lima, 48-72h a provincias', description: 'Despachamos pedidos antes de las 2pm el mismo dia para Lima Metropolitana.', icon: 'Truck', subservices: ['Lima Metropolitana (24h)', 'Provincias (48-72h)'], featured: true, order: 1, _id: 'service-envio-todo-peru' },
  { _type: 'service', title: 'Asesoria Personalizada', slug: { _type: 'slug', current: 'asesoria-personalizada' }, shortDescription: 'Cotizacion personalizada por WhatsApp', description: 'Nuestro equipo te ayuda a elegir los materiales de embalaje ideales.', icon: 'MessageCircle', subservices: ['Cotizacion por WhatsApp', 'Recomendacion de productos'], featured: true, order: 2, _id: 'service-asesoria-personalizada' },
  { _type: 'service', title: 'Cajas de Carton', slug: { _type: 'slug', current: 'cajas-de-carton' }, shortDescription: 'Autoarmables, kraft, doble pared y mas', description: 'Amplia variedad de cajas de carton corrugado para todo tipo de uso.', icon: 'Box', subservices: ['Autoarmables', 'Kraft Premium', 'Doble Pared'], featured: true, order: 3, _id: 'service-cajas-de-carton' },
];

const serviceCategories = [
  { _type: 'serviceCategory', title: 'Cajas', slug: { _type: 'slug', current: 'cajas' }, icon: 'Box', color: '#f59e0b', order: 0, _id: 'serviceCategory-cajas' },
  { _type: 'serviceCategory', title: 'Films', slug: { _type: 'slug', current: 'films' }, icon: 'Layers', color: '#14b8a6', order: 1, _id: 'serviceCategory-films' },
  { _type: 'serviceCategory', title: 'Cintas', slug: { _type: 'slug', current: 'cintas' }, icon: 'Ruler', color: '#3b82f6', order: 2, _id: 'serviceCategory-cintas' },
  { _type: 'serviceCategory', title: 'Proteccion', slug: { _type: 'slug', current: 'proteccion' }, icon: 'CircleDot', color: '#a855f7', order: 3, _id: 'serviceCategory-proteccion' },
  { _type: 'serviceCategory', title: 'Bolsas', slug: { _type: 'slug', current: 'bolsas' }, icon: 'ShoppingBag', color: '#22c55e', order: 4, _id: 'serviceCategory-bolsas' },
];

const projects = [
  { _type: 'project', title: 'Tienda Ecommerce de Moda', slug: { _type: 'slug', current: 'tienda-ecommerce-moda' }, client: 'Fashion Retail S.A.C.', category: 'Ecommerce', description: 'Proveemos cajas autoarmables y bolsas de envio courier para esta tienda de moda online.', result: 'Reduccion del 30% en costos de empaque.', featured: true, status: 'published', order: 0, _id: 'project-tienda-ecommerce-moda' },
  { _type: 'project', title: 'Distribuidora de Alimentos', slug: { _type: 'slug', current: 'distribuidora-alimentos' }, client: 'Alimentos del Norte E.I.R.L.', category: 'Alimentos', description: 'Suministramos cajas grado alimenticio y film termoencogible.', result: 'Cumplimiento de normativas sanitarias.', featured: true, status: 'published', order: 1, _id: 'project-distribuidora-alimentos' },
];

const testimonials = [
  { _type: 'testimonial', author: 'Maria Fernanda Rojas', company: 'Fashion Retail S.A.C.', role: 'Gerente de Operaciones', quote: 'GUDSTOR PACK nos ayudo a reducir costos de empaque significativamente. La calidad de las cajas autoarmables es excelente y el envio siempre puntual.', rating: 5, order: 0, _id: 'testimonial-0' },
  { _type: 'testimonial', author: 'Carlos Alberto Mendoza', company: 'Alimentos del Norte', role: 'Director Logistico', quote: 'El film grado alimenticio cumple perfectamente con las normativas. El equipo de GUDSTOR PACK nos asesoro para elegir los productos correctos.', rating: 5, order: 1, _id: 'testimonial-1' },
  { _type: 'testimonial', author: 'Ana Lucia Torres', company: 'Tienda Online "El Rincon Creativo"', role: 'Propietaria', quote: 'Los precios por mayor son inmejorables. Compro packs de 100 cajas y el ahorro es real. Muy recomendados para negocios de ecommerce.', rating: 5, order: 2, _id: 'testimonial-2' },
  { _type: 'testimonial', author: 'Roberto Sanchez Human', company: 'LogiPeru S.A.', role: 'Jefe de Almacen', quote: 'El film estirable industrial de alta tension optimizo nuestro paletizado. Redujimos tiempos de embalaje en un 40%.', rating: 5, order: 3, _id: 'testimonial-3' },
];

const teamMembers = [
  { _type: 'teamMember', title: 'Equipo de Ventas', role: 'Atencion al Cliente', phone: '+51 977 346 837', email: 'ventas@gudstorpack.com', order: 0, _id: 'teamMember-0' },
];

const partners = [
  { _type: 'partner', title: 'Cliente Corporativo 1', order: 0, _id: 'partner-0' },
  { _type: 'partner', title: 'Cliente Corporativo 2', order: 1, _id: 'partner-1' },
  { _type: 'partner', title: 'Cliente Corporativo 3', order: 2, _id: 'partner-2' },
  { _type: 'partner', title: 'Cliente Corporativo 4', order: 3, _id: 'partner-3' },
  { _type: 'partner', title: 'Cliente Corporativo 5', order: 4, _id: 'partner-4' },
  { _type: 'partner', title: 'Cliente Corporativo 6', order: 5, _id: 'partner-5' },
];

async function seed() {
  console.log('Iniciando seed de GUDSTOR PACK CMS...\n');
  const transaction = client.transaction();

  console.log('  Site Settings (con CTA, shipping, trust, footer)...');
  transaction.createOrReplace(siteSettings);

  console.log(`  ${heroSlides.length} Hero Slides...`);
  for (const s of heroSlides) transaction.create(s);

  console.log(`  ${stats.length} Estadisticas...`);
  for (const s of stats) transaction.create(s);

  console.log(`  ${services.length} Servicios...`);
  for (const s of services) transaction.create(s);

  console.log(`  ${serviceCategories.length} Categorias de Servicio...`);
  for (const c of serviceCategories) transaction.create(c);

  console.log(`  ${projects.length} Casos de Exito...`);
  for (const p of projects) transaction.create(p);

  console.log(`  ${testimonials.length} Testimonios...`);
  for (const t of testimonials) transaction.create(t);

  console.log(`  ${teamMembers.length} Miembros del Equipo...`);
  for (const m of teamMembers) transaction.create(m);

  console.log(`  ${partners.length} Socios...`);
  for (const p of partners) transaction.create(p);

  try {
    await transaction.commit();
    console.log('\nSeed completado exitosamente.');
    const total = 1 + heroSlides.length + stats.length + services.length + serviceCategories.length + projects.length + testimonials.length + teamMembers.length + partners.length;
    console.log(`Total documentos: ${total}`);
  } catch (err: any) {
    console.error('\nError durante el seed:', err.message);
    process.exit(1);
  }
}

seed();