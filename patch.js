const fs = require('fs');
let file = 'src/app/productos/[id]/producto-detalle-client.tsx';
let c = fs.readFileSync(file, 'utf8');

// 1. Add Image import
c = c.replace(/import Link from 'next\/link';/, "import Image from 'next/image';\nimport Link from 'next/link';");

// 2. Desktop main image
c = c.replace(/<div className="absolute inset-0 flex items-center justify-center">\s*<div className="w-28 h-28 bg-gradient-to-br from-primary\/15 to-secondary\/15 rounded-3xl flex items-center justify-center">\s*<Package className="w-14 h-14 text-primary\/50" \/>\s*<\/div>\s*<\/div>/,
\<div className="absolute inset-0 flex items-center justify-center">
                {product.imagenes && product.imagenes.length > 0 ? (
                  <div className="w-full h-full relative">
                    <Image
                      src={product.imagenes[currentImageIndex]}
                      alt={product.nombre}
                      fill
                      priority
                      className="object-contain p-4 xl:p-8"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-3xl flex items-center justify-center">
                    <Package className="w-14 h-14 text-primary/50" />
                  </div>
                )}
              </div>\);

// 3. Desktop thumbnails
c = c.replace(/\{\(product\.imagenes \|\| \[\]\)\.map\(\(_, index\) => \([\s\S]*?<Package className=\{.*w-7 h-7.*\} \/>\s*<\/button>\s*\)\)\}/,
\{(product.imagenes || []).map((imgUrl, index) => (
                    <button
                      key={index}
                      onClick={() => { setCurrentImageIndex(index); setIsZoomed(false); }}
                      className={\\\elative aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-xl border-2 flex items-center justify-center overflow-hidden transition-all hover:opacity-80 \\\\}
                    >
                      <Image
                        src={imgUrl}
                        alt={\\\\ - vista \\\\}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </button>
                  ))}\);

// 4. Mobile main image
c = c.replace(/<div className=\{\lex items-center justify-center transition-all duration-300 \$\{\s*isZoomed \? 'w-24 h-24' : 'w-16 h-16'\s*\}\\}>\s*<div className="w-full h-full bg-gradient-to-br from-primary\/15 to-secondary\/15 rounded-3xl flex items-center justify-center">\s*<Package className="w-8 h-8 text-primary\/50" \/>\s*<\/div>\s*<\/div>/,
\{product.imagenes && product.imagenes.length > 0 ? (
                      <div className="w-full h-full relative">
                        <Image
                          src={product.imagenes[currentImageIndex]}
                          alt={product.nombre}
                          fill
                          priority
                          className="object-contain p-4"
                          sizes="100vw"
                        />
                      </div>
                    ) : (
                      <div className={\\\lex items-center justify-center transition-all duration-300 \\\\}>
                        <div className="w-full h-full bg-gradient-to-br from-primary/15 to-secondary/15 rounded-3xl flex items-center justify-center">
                          <Package className="w-8 h-8 text-primary/50" />
                        </div>
                      </div>
                    )}\);

// 5. Mobile thumbnails
c = c.replace(/\{\(product\.imagenes \|\| \[\]\)\.map\(\(_, index\) => \([\s\S]*?<Package className=\{.*w-5 h-5.*\} \/>\s*<\/button>\s*\)\)\}/,
\{(product.imagenes || []).map((imgUrl, index) => (
                    <button
                      key={index}
                      onClick={() => { setCurrentImageIndex(index); setIsZoomed(false); }}
                      className={\\\elative aspect-square rounded-xl border-2 flex items-center justify-center overflow-hidden transition-all \\\\}
                    >
                      <Image
                        src={imgUrl}
                        alt={\\\\ - vista \\\\}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </button>
                  ))}\);

fs.writeFileSync(file, c);
console.log('done!');
