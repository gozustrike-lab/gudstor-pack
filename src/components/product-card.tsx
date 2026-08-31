'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Package, Star, Eye, Heart } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useFavoritesStore } from '@/lib/favorites-store';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedPackIndex, setSelectedPackIndex] = useState(0);
  const [heartActive, setHeartActive] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const isFav = useFavoritesStore((s) => s.isFavorite(product.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  const selectedPack = product.packs[selectedPackIndex];

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addItem(
        product,
        selectedPack.cantidad,
        product.medidas[0],
        product.colores[0],
        selectedPack.cantidad
      );
    },
    [product, selectedPack, addItem]
  );

  const handleToggleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(product, selectedPack.cantidad);
      setHeartActive(true);
      setTimeout(() => setHeartActive(false), 600);
    },
    [product, selectedPack, toggleFavorite]
  );

  // Compute the per-unit price from pack (price / quantity)
  const pricePerUnit = selectedPack.precio / selectedPack.cantidad;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={product.seoPath && product.seoPath !== 'productos' ? `/${product.seoPath}/${product.slug}` : `/productos/${product.slug}`}>
        <article
          className="group relative h-full flex flex-col bg-card rounded-2xl md:rounded-3xl border border-border/50 hover:border-primary/20 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Area */}
          <div className="relative aspect-square bg-gradient-to-br from-muted via-muted to-muted/50 overflow-hidden">
            {product.imagenes && product.imagenes.length > 0 ? (
              <motion.div
                animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                <Image
                  src={product.imagenes[0]}
                  alt={product.nombre}
                  fill
                  className="object-contain p-3"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              </motion.div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={isHovered ? { scale: 1.05, rotate: 2 } : { scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center"
                >
                  <Package className="w-10 h-10 text-primary/60" />
                </motion.div>
              </div>
            )}

            {/* Hover overlay with flip hint */}
            <motion.div
              initial={false}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end justify-center pb-4"
            >
              <div className="flex items-center gap-1.5 text-white/90 text-xs font-medium bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Eye className="w-3.5 h-3.5" />
                Ver detalle
              </div>
            </motion.div>

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase bg-white/90 backdrop-blur-sm text-foreground rounded-lg">
                {product.categoria}
              </span>
            </div>

            {/* Heart / Favorite Button */}
            <motion.button
              whileTap={{ scale: 0.7 }}
              onClick={handleToggleFavorite}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow"
              aria-label={
                isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'
              }
            >
              <motion.div
                animate={
                  heartActive
                    ? {
                        scale: [1, 1.4, 0.8, 1.15, 1],
                        rotate: [0, -10, 10, -5, 0],
                      }
                    : { scale: 1 }
                }
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <Heart
                  className={`w-5 h-5 transition-colors duration-300 ${
                    isFav
                      ? 'text-red-500 fill-red-500'
                      : 'text-foreground/30 hover:text-red-400'
                  }`}
                />
              </motion.div>
            </motion.button>

            {/* Stock Badge */}
            {product.stock <= 10 && (
              <div className="absolute top-3 right-12">
                <span className="inline-flex items-center px-2 py-1 text-[10px] font-semibold bg-destructive/90 text-destructive-foreground rounded-lg">
                  Últimas {product.stock}
                </span>
              </div>
            )}

            {/* Featured Star - show only when not favorited */}
            {product.destacado && !isFav && (
              <div className="absolute bottom-3 right-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold bg-secondary/90 text-secondary-foreground rounded-lg">
                  <Star className="w-3 h-3 fill-current" />
                  Popular
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 md:p-5">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.etiquetas.slice(0, 3).map((etiqueta) => (
                <span
                  key={etiqueta}
                  className="px-2 py-0.5 text-[10px] font-medium text-primary bg-primary/8 rounded-md"
                >
                  {etiqueta}
                </span>
              ))}
            </div>

            {/* Name */}
            <h3 className="text-base font-bold text-foreground leading-tight mb-2 line-clamp-1 group-hover:text-primary transition-colors">
              {product.nombre}
            </h3>

            {/* Pack Selector (Pills) */}
            <div className="flex gap-1.5 mb-3">
              {product.packs.map((pack, i) => (
                <motion.button
                  key={pack.cantidad}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedPackIndex(i);
                  }}
                  className={`relative flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all duration-200 ${
                    selectedPackIndex === i
                      ? 'border-primary bg-primary/10 text-primary shadow-sm shadow-primary/20'
                      : 'border-border hover:border-primary/30 text-foreground/60 hover:text-foreground'
                  }`}
                >
                  {pack.cantidad} uds
                  {pack.descuento > 0 && (
                    <span className="text-[9px] font-bold text-green-600">
                      -{pack.descuento}%
                    </span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
              {product.descripcion}
            </p>

            {/* Material & Measures */}
            <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
              <span className="bg-muted/50 px-2 py-1 rounded-md">{product.material}</span>
              <span className="bg-muted/50 px-2 py-1 rounded-md">{product.medidas[0]}</span>
            </div>

            {/* Price & Cart */}
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">
                  Desde · {selectedPack.cantidad} uds
                </p>
                <div className="flex items-center gap-1.5">
                  <p className="text-[10px] text-muted-foreground line-through">
                    {formatPrice(product.precio * selectedPack.cantidad)}
                  </p>
                  <p className="text-xl font-extrabold text-primary">
                    {formatPrice(selectedPack.precio)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-[10px] text-muted-foreground">
                    {formatPrice(pricePerUnit)}/u
                  </p>
                  {selectedPack.descuento > 0 && (
                    <span className="text-[9px] font-bold text-green-600">
                      -{selectedPack.descuento}%
                    </span>
                  )}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 hover:shadow-primary/30"
                aria-label={`Agregar ${product.nombre} al carrito`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Agregar</span>
              </motion.button>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
