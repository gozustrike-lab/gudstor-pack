'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Heart,
  Trash2,
  ShoppingCart,
  Package,
  ShoppingBag,
  Check,
  Loader2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useFavoritesStore } from '@/lib/favorites-store';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import products from '@/data/products.json';
import type { Product } from '@/lib/types';

/* ──────────────── Animation Variants ──────────────── */
const drawerVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring', damping: 28, stiffness: 300, mass: 0.8 },
  },
  exit: {
    x: '100%',
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2, delay: 0.05 } },
};

const itemVariants = {
  hidden: { x: 60, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: { delay: 0.06 + i * 0.04, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
  exit: {
    x: 120,
    opacity: 0,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
  },
};

/* ──────────────── Flying Cart Dot ──────────────── */
function FlyingDot({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
          animate={{ scale: 0.2, x: 200, y: -300, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="fixed top-20 right-8 z-[100] w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/40 pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
}

/* ──────────────── Main Component ──────────────── */
interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FavoritesDrawer({ isOpen, onClose }: FavoritesDrawerProps) {
  const { favoriteIds, toggleFavorite, clearAll } = useFavoritesStore();
  const addItem = useCartStore((s) => s.addItem);
  const [mounted, setMounted] = useState(false);
  const [isAddingAll, setIsAddingAll] = useState(false);
  const [addedAll, setAddedAll] = useState(false);
  const [showFlyingDot, setShowFlyingDot] = useState(false);

  useEffect(() => setMounted(true), []);

  /* Lock body scroll */
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = original; };
    }
  }, [isOpen]);

  const favoriteProducts: Product[] = mounted
    ? products.filter((p) => favoriteIds.includes(p.id))
    : [];

  const totalPrice = favoriteProducts.reduce((sum, p) => sum + p.precio, 0);
  const count = favoriteProducts.length;

  const handleRemove = useCallback(
    (productId: string) => toggleFavorite(productId),
    [toggleFavorite]
  );

  const handleAddAllToCart = useCallback(async () => {
    if (count === 0 || isAddingAll) return;
    setIsAddingAll(true);
    setShowFlyingDot(true);

    /* Staggered add for visual effect */
    for (let i = 0; i < favoriteProducts.length; i++) {
      await new Promise((r) => setTimeout(r, 150));
      addItem(favoriteProducts[i]);
    }

    setTimeout(() => {
      setShowFlyingDot(false);
      setIsAddingAll(false);
      setAddedAll(true);
      setTimeout(() => setAddedAll(false), 2500);
    }, 300);
  }, [count, isAddingAll, favoriteProducts, addItem]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* ── Overlay ── */}
            <motion.div
              key="fav-overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={onClose}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            />

            {/* ── Drawer Panel ── */}
            <motion.div
              key="fav-drawer"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 z-[70] h-full w-[90vw] max-w-[420px] bg-white shadow-2xl shadow-black/20 flex flex-col"
              style={{ willChange: 'transform' }}
            >
              {/* ── Header ── */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                    <Heart className="w-[18px] h-[18px] text-red-500" fill="#ef4444" stroke="#dc2626" strokeWidth={0} />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-foreground">Mis Favoritos</h2>
                    <p className="text-[11px] text-muted-foreground">
                      {mounted ? `${count} ${count === 1 ? 'producto' : 'productos'} guardados` : 'Cargando...'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-foreground/60 hover:text-foreground hover:bg-muted rounded-xl transition-all"
                  aria-label="Cerrar panel de favoritos"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ── Content (scrollable) ── */}
              <div className="flex-1 overflow-y-auto">
                {!mounted ? (
                  /* Skeleton */
                  <div className="p-4 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-3 p-3 animate-pulse">
                        <div className="w-16 h-16 bg-muted rounded-xl shrink-0" />
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-3.5 w-3/4 bg-muted rounded" />
                          <div className="h-3 w-1/2 bg-muted rounded" />
                          <div className="h-4 w-1/3 bg-muted rounded mt-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : count === 0 ? (
                  /* Empty state */
                  <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                    <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-5">
                      <ShoppingBag className="w-9 h-9 text-muted-foreground" />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-1.5">
                      Aún no tienes favoritos
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-[240px] mb-5 leading-relaxed">
                      Explora nuestro catálogo y guarda los productos que más te gusten tocando el corazón.
                    </p>
                    <Link
                      href="/productos"
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors"
                    >
                      Explorar Productos
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  /* Product list */
                  <div className="p-3 space-y-2">
                    <AnimatePresence mode="popLayout">
                      {favoriteProducts.map((product, i) => (
                        <motion.div
                          key={product.id}
                          custom={i}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layout
                          className="group flex gap-3 p-3 bg-card border border-border/50 rounded-xl hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 transition-all"
                        >
                          {/* Thumbnail */}
                          <Link
                            href={`/productos/${product.slug || product.id}`}
                            onClick={onClose}
                            className="shrink-0"
                          >
                            <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] bg-gradient-to-br from-primary/8 to-secondary/8 rounded-xl flex items-center justify-center overflow-hidden group-hover:from-primary/15 group-hover:to-secondary/15 transition-colors">
                              {product.imagenes && product.imagenes.length > 0 && product.imagenes[0]?.startsWith('http') ? (
                                <Image
                                  src={product.imagenes[0]}
                                  alt={product.nombre}
                                  fill
                                  className="object-contain p-1.5"
                                  sizes="72px"
                                />
                              ) : (
                                <Package className="w-7 h-7 text-primary/40" />
                              )}
                            </div>
                          </Link>

                          {/* Info */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                            <div>
                              <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {product.categoria}
                              </span>
                              <Link href={`/productos/${product.slug || product.id}`} onClick={onClose}>
                                <h4 className="text-sm font-bold text-foreground leading-tight line-clamp-1 hover:text-primary transition-colors">
                                  {product.nombre}
                                </h4>
                              </Link>
                              <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                {product.medidas[0]}
                              </p>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-sm font-extrabold text-primary">
                                {formatPrice(product.precio)}
                              </span>
                              <div className="flex items-center gap-1">
                                {/* Quick add to cart */}
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => addItem(product)}
                                  className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                  aria-label={`Agregar ${product.nombre} al carrito`}
                                >
                                  <ShoppingCart className="w-3.5 h-3.5" />
                                </motion.button>
                                {/* Delete */}
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleRemove(product.id)}
                                  className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  aria-label={`Eliminar ${product.nombre} de favoritos`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Clear all */}
                    {count > 1 && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        onClick={clearAll}
                        className="w-full py-2.5 mt-2 text-xs text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        Borrar todos los favoritos
                      </motion.button>
                    )}
                  </div>
                )}
              </div>

              {/* ── Fixed Footer ── */}
              {mounted && count > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="shrink-0 border-t border-border/50 px-5 py-4 bg-gradient-to-t from-white via-white to-white/95"
                >
                  {/* Price summary */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[11px] text-muted-foreground">
                        Total acumulado ({count} {count === 1 ? 'producto' : 'productos'})
                      </p>
                      <p className="text-xl font-extrabold text-foreground">
                        {formatPrice(totalPrice)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Precio desde</span>
                    </div>
                  </div>

                  {/* Add all button */}
                  <motion.button
                    whileHover={isAddingAll ? {} : { scale: 1.02, y: -1 }}
                    whileTap={isAddingAll ? {} : { scale: 0.98 }}
                    onClick={handleAddAllToCart}
                    disabled={isAddingAll}
                    className={`w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-semibold text-white transition-all shadow-lg ${
                      addedAll
                        ? 'bg-secondary shadow-secondary/30'
                        : isAddingAll
                        ? 'bg-primary/70 cursor-wait shadow-primary/10'
                        : 'bg-primary hover:bg-primary/90 shadow-primary/25 hover:shadow-primary/35'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {addedAll ? (
                        <motion.span
                          key="done"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="flex items-center gap-2"
                        >
                          <Check className="w-5 h-5" />
                          ¡Agregados al carrito!
                        </motion.span>
                      ) : isAddingAll ? (
                        <motion.span
                          key="loading"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="flex items-center gap-2"
                        >
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Agregando...
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="flex items-center gap-2"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          Agregar todo al carrito
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  <p className="text-[10px] text-center text-muted-foreground mt-2">
                    Se agregarán {count} productos a tu carrito de compras
                  </p>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Flying dot animation */}
      <FlyingDot active={showFlyingDot} />
    </>
  );
}
