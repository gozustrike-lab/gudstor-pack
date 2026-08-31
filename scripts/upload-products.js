const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');

require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '981jghg0';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN;

if (!token) {
  console.error("No token found. Please set SANITY_API_TOKEN in .env");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

async function uploadImage(imagePathLocal) {
  const fullPath = path.join(__dirname, '../public', imagePathLocal);
  if (!fs.existsSync(fullPath)) {
    console.warn("Image not found locally:", fullPath);
    return null;
  }
  
  console.log("Uploading image:", imagePathLocal);
  const stream = fs.createReadStream(fullPath);
  const asset = await client.assets.upload('image', stream, {
    filename: path.basename(fullPath)
  });
  
  return {
    _key: Math.random().toString(36).substring(7),
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: asset._id
    }
  };
}

async function run() {
  const products = require('../src/data/products.json');
  console.log(`Found ${products.length} products to upload.`);
  
  let order = 0;
  for (const product of products) {
    console.log(`Processing ${product.nombre}...`);
    
    // Upload images
    const imageRefs = [];
    if (product.imagenes) {
      for (const imgUrl of product.imagenes) {
        const ref = await uploadImage(imgUrl);
        if (ref) imageRefs.push(ref);
      }
    }
    
    // Construct sanity document
    const doc = {
      _type: 'product',
      _id: `product-migrated-${product.id}`,
      nombre: product.nombre,
      slug: { _type: 'slug', current: product.slug },
      descripcion: product.descripcion,
      precio: product.precio,
      stock: product.stock,
      categoria: product.categoria,
      material: product.material,
      imagenes: imageRefs.length > 0 ? imageRefs : undefined,
      colores: product.colores,
      medidas: product.medidas,
      destacado: product.destacado,
      etiquetas: product.etiquetas,
      seoPath: product.seoPath,
      packs: product.packs ? product.packs.map((p, i) => ({
        _key: `pack-${i}`,
        cantidad: p.cantidad,
        precio: p.precio,
        descuento: p.descuento || 0
      })) : [],
      order: order++
    };
    
    // Create or replace
    await client.createOrReplace(doc);
    console.log(`✅ Uploaded ${product.nombre}`);
  }
  
  console.log("Done uploading products!");
}

run().catch(console.error);
