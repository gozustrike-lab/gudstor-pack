import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/products.json');
const products = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

function slugifyMedida(medida: string): string {
  return medida
    .toLowerCase()
    .replace(/ø/g, 'diametro')
    .replace(/[^a-z0-9\sx-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const updated = products.map((p: any) => {
  const firstMedida = p.medidas[0] || '';
  const slugPart = slugifyMedida(firstMedida);
  return { ...p, slug: `${p.id}-${slugPart}` };
});

// Print all slugs for verification
updated.forEach((p: any) => {
  console.log(`${p.id} → ${p.slug}`);
});

fs.writeFileSync(filePath, JSON.stringify(updated, null, 2) + '\n', 'utf-8');
console.log(`\nUpdated ${updated.length} products with slugs.`);