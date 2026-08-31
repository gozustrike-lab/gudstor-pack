const PROJECT_ID = '981jghg0';
const DATASET = 'production';
const TOKEN = 'skcFCvepSWMDJ0xgVUVk2WL9IKTTsjJ6o7r4Pa8pwFGt4R9xF9KdwiZCVJVdKr4g5MbMEp6z67vmFCC2nw7U4ht65e0XKEQHocPswsuCeOX4yi3kEQ6nTCJvRDMQu605uMVAFS9Oayh682yPYL6dPFEDLYCWcge79yR8eN987IXJXOFZGbJ4';
const API_URL = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}?returnDocuments=true`;

async function mutate(mutations) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  });
  const json = await res.json();
  if (json.error) {
    console.error('MUTATION ERROR:', JSON.stringify(json.error, null, 2));
    throw new Error('Mutation failed');
  }
  return json;
}

async function seed() {
  console.log('Seeding GUDSTOR PACK CMS...\n');

  // 1. Site Settings
  console.log('1/9 Site Settings...');
  await mutate([{
    createOrReplace: {
      _id: 'siteSettings', _type: 'siteSettings',
      companyName: 'GUDSTOR PACK', tagline: 'Soluciones en Embalaje',
      description: 'GUDSTOR PACK es tu proveedor lider de materiales de embalaje profesional en Peru.',
      whatsapp: '51977346837', email: 'ventas@gudstorpack.com',
      phone: '+51 977 346 837', address: 'Lima, Peru',
      socialLinks: [
        { platform: 'Facebook', url: 'https://facebook.com/gudstorpack' },
        { platform: 'Instagram', url: 'https://instagram.com/gudstorpack' },
        { platform: 'TikTok', url: 'https://tiktok.com/@gudstorpack' },
      ],
    },
  }]);

  // 2. Hero Slides
  console.log('2/9 Hero Slides...');
  await mutate([
    { createOrReplace: { _id: 'heroSlide-0', _type: 'heroSlide', title: 'Embalaje Profesional para tu Negocio', description: 'Mas de 50 productos de embalaje con descuentos por volumen. Envio a todo el Peru.', ctaText: 'Ver Catalogo', ctaLink: '/productos', order: 0 } },
    { createOrReplace: { _id: 'heroSlide-1', _type: 'heroSlide', title: 'Cajas de Carton Corrugado', description: 'Autoarmables, kraft, doble pared y mas. Desde 25 unidades con descuentos de hasta 20%.', ctaText: 'Ver Cajas', ctaLink: '/productos?categoria=Cajas', order: 1 } },
    { createOrReplace: { _id: 'heroSlide-2', _type: 'heroSlide', title: 'Films y Plasticos Industriales', description: 'Film estirable, termoencogible, antistatico y alimentario. Proteccion profesional.', ctaText: 'Ver Films', ctaLink: '/productos?categoria=Films', order: 2 } },
  ]);

  // 3. Stats
  console.log('3/9 Stats...');
  await mutate([
    { createOrReplace: { _id: 'stat-0', _type: 'stat', label: 'Clientes Satisfechos', value: 2500, prefix: '', suffix: '+', icon: 'Users', order: 0 } },
    { createOrReplace: { _id: 'stat-1', _type: 'stat', label: 'Productos Disponibles', value: 50, prefix: '', suffix: '+', icon: 'Package', order: 1 } },
    { createOrReplace: { _id: 'stat-2', _type: 'stat', label: 'Tasa de Entrega', value: 98, prefix: '', suffix: '%', icon: 'Truck', order: 2 } },
    { createOrReplace: { _id: 'stat-3', _type: 'stat', label: 'Calificacion Promedio', value: 4.9, prefix: '', suffix: '', icon: 'Star', order: 3 } },
  ]);

  // 4. Services
  console.log('4/9 Services...');
  await mutate([
    { createOrReplace: { _id: 'service-venta-por-mayor', _type: 'service', title: 'Venta por Mayor', slug: { _type: 'slug', current: 'venta-por-mayor' }, shortDescription: 'Descuentos escalonados desde 25 unidades', description: 'Ofrecemos precios mayoristas con descuentos que aumentan segun el volumen de compra.', icon: 'ShoppingCart', subservices: ['Packs de 25 unidades', 'Packs de 50 unidades', 'Packs de 100 unidades'], featured: true, order: 0 } },
    { createOrReplace: { _id: 'service-envio-todo-peru', _type: 'service', title: 'Envio a Todo el Peru', slug: { _type: 'slug', current: 'envio-todo-peru' }, shortDescription: 'Despacho en 24h para Lima, 48-72h a provincias', description: 'Despachamos pedidos antes de las 2pm el mismo dia para Lima Metropolitana.', icon: 'Truck', subservices: ['Lima Metropolitana (24h)', 'Provincias (48-72h)', 'Seguimiento en tiempo real'], featured: true, order: 1 } },
    { createOrReplace: { _id: 'service-asesoria-personalizada', _type: 'service', title: 'Asesoria Personalizada', slug: { _type: 'slug', current: 'asesoria-personalizada' }, shortDescription: 'Cotizacion personalizada por WhatsApp', description: 'Nuestro equipo te ayuda a elegir los materiales de embalaje ideales para tu negocio.', icon: 'MessageCircle', subservices: ['Cotizacion por WhatsApp', 'Recomendacion de productos', 'Pedidos personalizados'], featured: true, order: 2 } },
    { createOrReplace: { _id: 'service-cajas-de-carton', _type: 'service', title: 'Cajas de Carton', slug: { _type: 'slug', current: 'cajas-de-carton' }, shortDescription: 'Autoarmables, kraft, doble pared y mas', description: 'Amplia variedad de cajas de carton corrugado para todo tipo de uso.', icon: 'Box', subservices: ['Autoarmables', 'Kraft Premium', 'Doble Pared', 'Display / Ventana'], featured: true, order: 3 } },
    { createOrReplace: { _id: 'service-films-y-plasticos', _type: 'service', title: 'Films y Plasticos', slug: { _type: 'slug', current: 'films-y-plasticos' }, shortDescription: 'Estirable, termoencogible, antistatico', description: 'Films industriales para paletizado, proteccion de productos y conservacion de alimentos.', icon: 'Layers', subservices: ['Film Estirable', 'Termoencogible', 'Antistatico', 'Alimentario Certificado'], featured: false, order: 4 } },
    { createOrReplace: { _id: 'service-materiales-proteccion', _type: 'service', title: 'Materiales de Proteccion', slug: { _type: 'slug', current: 'materiales-proteccion' }, shortDescription: 'Burbuja, espuma, esponja y mas', description: 'Protege tus mercancias durante el transporte y almacenamiento.', icon: 'Shield', subservices: ['Plastico Burbuja', 'Espuma Poliestireno', 'Protectores de Esquinas'], featured: false, order: 5 } },
  ]);

  // 5. Service Categories
  console.log('5/9 Service Categories...');
  await mutate([
    { createOrReplace: { _id: 'serviceCategory-cajas', _type: 'serviceCategory', title: 'Cajas', slug: { _type: 'slug', current: 'cajas' }, icon: 'Box', color: '#f59e0b', order: 0 } },
    { createOrReplace: { _id: 'serviceCategory-films', _type: 'serviceCategory', title: 'Films', slug: { _type: 'slug', current: 'films' }, icon: 'Layers', color: '#14b8a6', order: 1 } },
    { createOrReplace: { _id: 'serviceCategory-cintas', _type: 'serviceCategory', title: 'Cintas', slug: { _type: 'slug', current: 'cintas' }, icon: 'Ruler', color: '#3b82f6', order: 2 } },
    { createOrReplace: { _id: 'serviceCategory-proteccion', _type: 'serviceCategory', title: 'Proteccion', slug: { _type: 'slug', current: 'proteccion' }, icon: 'CircleDot', color: '#a855f7', order: 3 } },
    { createOrReplace: { _id: 'serviceCategory-bolsas', _type: 'serviceCategory', title: 'Bolsas', slug: { _type: 'slug', current: 'bolsas' }, icon: 'ShoppingBag', color: '#22c55e', order: 4 } },
  ]);

  // 6. Projects
  console.log('6/9 Projects...');
  await mutate([
    { createOrReplace: { _id: 'project-ecommerce-moda', _type: 'project', title: 'Tienda Ecommerce de Moda', slug: { _type: 'slug', current: 'tienda-ecommerce-moda' }, client: 'Fashion Retail S.A.C.', category: 'Ecommerce', description: 'Proveemos cajas autoarmables y bolsas de envio courier para esta tienda de moda online con mas de 500 envios mensuales.', result: 'Reduccion del 30% en costos de empaque con packs de 100 unidades.', featured: true, status: 'published', order: 0 } },
    { createOrReplace: { _id: 'project-distribuidora-alimentos', _type: 'project', title: 'Distribuidora de Alimentos', slug: { _type: 'slug', current: 'distribuidora-alimentos' }, client: 'Alimentos del Norte E.I.R.L.', category: 'Alimentos', description: 'Suministramos cajas grado alimenticio y film termoencogible para el embalaje de productos frescos y congelados.', result: 'Cumplimiento de normativas sanitarias con certificacion grado alimenticio.', featured: true, status: 'published', order: 1 } },
    { createOrReplace: { _id: 'project-logistica-industrial', _type: 'project', title: 'Empresa de Logistica Industrial', slug: { _type: 'slug', current: 'empresa-logistica-industrial' }, client: 'LogiPeru S.A.', category: 'Logistica', description: 'Dotamos de film estirable industrial y cintas reforzadas para el paletizado y transporte de mercancias pesadas.', result: 'Optimizacion del 40% en tiempos de paletizado con film de alta tension.', featured: false, status: 'published', order: 2 } },
  ]);

  // 7. Testimonials
  console.log('7/9 Testimonials...');
  await mutate([
    { createOrReplace: { _id: 'testimonial-0', _type: 'testimonial', author: 'Maria Fernanda Rojas', company: 'Fashion Retail S.A.C.', role: 'Gerente de Operaciones', quote: 'GUDSTOR PACK nos ayudo a reducir costos de empaque significativamente. La calidad de las cajas autoarmables es excelente y el envio siempre puntual.', rating: 5, order: 0 } },
    { createOrReplace: { _id: 'testimonial-1', _type: 'testimonial', author: 'Carlos Alberto Mendoza', company: 'Alimentos del Norte', role: 'Director Logistico', quote: 'El film grado alimenticio cumple perfectamente con las normativas. El equipo de GUDSTOR PACK nos asesoro para elegir los productos correctos.', rating: 5, order: 1 } },
    { createOrReplace: { _id: 'testimonial-2', _type: 'testimonial', author: 'Ana Lucia Torres', company: 'Tienda Online El Rincon Creativo', role: 'Propietaria', quote: 'Los precios por mayor son inmejorables. Compro packs de 100 cajas y el ahorro es real. Muy recomendados para negocios de ecommerce.', rating: 5, order: 2 } },
    { createOrReplace: { _id: 'testimonial-3', _type: 'testimonial', author: 'Roberto Sanchez Huaman', company: 'LogiPeru S.A.', role: 'Jefe de Almacen', quote: 'El film estirable industrial de alta tension optimizo nuestro paletizado. Redujimos tiempos de embalaje en un 40% con el producto correcto.', rating: 5, order: 3 } },
  ]);

  // 8. Team Members
  console.log('8/9 Team Members...');
  await mutate([
    { createOrReplace: { _id: 'teamMember-0', _type: 'teamMember', title: 'Equipo de Ventas', role: 'Atencion al Cliente', phone: '+51 977 346 837', email: 'ventas@gudstorpack.com', order: 0 } },
    { createOrReplace: { _id: 'teamMember-1', _type: 'teamMember', title: 'Soporte Tecnico', role: 'Asesoria de Productos', phone: '+51 977 346 837', email: 'soporte@gudstorpack.com', order: 1 } },
  ]);

  // 9. Partners
  console.log('9/9 Partners...');
  await mutate([
    { createOrReplace: { _id: 'partner-0', _type: 'partner', title: 'Cliente Corporativo 1', order: 0 } },
    { createOrReplace: { _id: 'partner-1', _type: 'partner', title: 'Cliente Corporativo 2', order: 1 } },
    { createOrReplace: { _id: 'partner-2', _type: 'partner', title: 'Cliente Corporativo 3', order: 2 } },
    { createOrReplace: { _id: 'partner-3', _type: 'partner', title: 'Cliente Corporativo 4', order: 3 } },
  ]);

  console.log('\n✅ Seed completado! 32 documentos creados en Sanity CMS.');
}

seed().catch(function(e) { console.error(e); process.exit(1); });