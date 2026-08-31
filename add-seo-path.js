const fs = require('fs');
const products = require('./src/data/products.json');

const getSeoPath = (product) => {
  const name = product.nombre.toLowerCase();
  const cat = product.categoria;
  const tags = product.etiquetas || [];

  if (name.includes('archivera') || tags.includes('archivo')) return 'cajas-de-carton/cajas-archiveras';
  if (name.includes('doble corrugado') || name.includes('doble pared')) return 'cajas-de-carton/cajas-doble-corrugadas';
  if (name.includes('pizza')) return 'cajas-de-carton/cajas-para-pizza';
  if (name.includes('ecommerce') || name.includes('envío') || name.includes('envio') || tags.includes('ecommerce') || name.includes('autoarmable') || tags.includes('autoarmable') || name.includes('postal')) return 'cajas-de-carton/cajas-para-envios';
  if (cat === 'Cajas') {
    if (name.includes('trupan')) return 'cajas-especiales/cajas-de-trupan';
    if (name.includes('regalo') || name.includes('ventana')) return 'cajas-especiales/cajas-de-regalo';
    if (name.includes('mudanza')) return 'pack-mudanza';
    if (name.includes('emprendedor')) return 'pack-emprendedor';
    if (name.includes('navideñ')) return 'campanas/cajas-navidenas';
    return 'cajas-de-carton/cajas-corrugadas';
  }
  
  if (cat === 'Films') {
    if (name.includes('stretch') || name.includes('estirable')) return 'materiales-de-embalaje/stretch-film';
    return 'materiales-de-embalaje/stretch-film';
  }
  
  if (cat === 'Cintas') {
    return 'materiales-de-embalaje/cintas-adhesivas';
  }
  
  if (cat === 'Protección') {
    if (name.includes('burbuja') || name.includes('burbupack')) return 'materiales-de-embalaje/plastico-burbuja';
    if (name.includes('cartón corrugado') || name.includes('carton corrugado')) return 'materiales-de-embalaje/carton-corrugado';
    if (name.includes('plancha') && name.includes('cartón')) return 'materiales-de-embalaje/plancha-de-carton';
    if (name.includes('tecnopor') && name.includes('plancha')) return 'materiales-de-embalaje/plancha-de-tecnopor';
    if (name.includes('viruta')) return 'relleno-y-complementos/viruta-de-papel';
    if (name.includes('seda') || name.includes('mantequilla')) return 'relleno-y-complementos/papel-seda-mantequilla';
    if (name.includes('relleno') && name.includes('tecnopor')) return 'relleno-y-complementos/relleno-de-tecnopor';
    if (name.includes('diseño') || name.includes('diseñ')) return 'relleno-y-complementos/papel-con-diseno';
    if (name.includes('soguilla')) return 'relleno-y-complementos/soguilla';
    if (name.includes('sticker')) return 'relleno-y-complementos/stickers';
    return 'materiales-de-embalaje/herramientas-y-accesorios'; // default fallback for protection
  }

  // fallback
  return 'productos';
};

products.forEach(p => {
  p.seoPath = getSeoPath(p);
});

fs.writeFileSync('./src/data/products.json', JSON.stringify(products, null, 2));
console.log('Added seoPath to products!');
