'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  Trash2,
  Package,
  X,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { useFavoritesStore } from '@/lib/favorites-store';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';

interface FavoritesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FavoritesPanel({ isOpen, onClose }: FavoritesPanelProps) {
  const items = useFavoritesStore((s) => s.items);
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);
  const clearFavorites = useFavoritesStore((s) => s.clearFavorites);
  const addItemsFromFavorites = useCartStore((s) => s.addItemsFromFavorites);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddAllToCart = () => {
    addItemsFromFavorites(items);
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
      clearFavorites();
      onClose();
    }, 1500);
  };

  const totalPrice = items.reduce((sum, item) => {
    const pack = item.product.packs.find((p) => p.cantidad === item.selectedPack);
    return sum + (pack ? pack.precio : item.product.precio * item.selectedPack);
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Mis Favoritos
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {items.length} {items.length === 1 ? 'producto' : 'productos'} guardados
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Cerrar panel"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">
                    No tienes favoritos
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Explora nuestro catálogo y guarda los productos que más te interesan.
                  </p>
                  <Link href="/productos" onClick={onClose}>
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-xl shadow-lg shadow-primary/20">
                      Ver Productos
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  <AnimatePresence>
                    {items.map((item) => {
                      const pack = item.product.packs.find(
                        (p) => p.cantidad === item.selectedPack
                      );
                      return (
                        <motion.div
                          key={item.product.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 100, height: 0 }}
                          className="bg-card border border-border/50 rounded-xl p-3 sm:p-4"
                        >
                          <div className="flex gap-3">
                            {/* Product icon */}
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center shrink-0">
                              <Package className="w-6 h-6 text-primary/40" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <Link
                                    href={`/productos/${item.product.slug || item.product.id}`}
                                    onClick={onClose}
                                    className="text-sm font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                                  >
                                    {item.product.nombre}
                                  </Link>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                                      {item.product.categoria}
                                    </span>
                                    <span className="text-[10px] text-primary font-medium bg-primary/8 px-1.5 py-0.5 rounded">
                                      {item.selectedPack} uds
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeFavorite(item.product.id)}
                                  className="p-1 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                                  aria-label="Quitar de favoritos"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Price */}
                              <div className="mt-2">
                                <p className="text-xs text-muted-foreground">
                                  Pack {item.selectedPack} uds:
                                </p>
                                <p className="text-base font-extrabold text-primary">
                                  {pack
                                    ? formatPrice(pack.precio)
                                    : formatPrice(item.product.precio * item.selectedPack)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer with Add All to Cart */}
            {items.length > 0 && (
              <div className="p-4 border-t border-border/50 space-y-3 bg-white">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total estimado</span>
                  <span className="text-lg font-extrabold text-primary">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                {/* Add all to cart button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddAllToCart}
                  disabled={addedToCart}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold shadow-lg transition-all ${
                    addedToCart
                      ? 'bg-green-500 text-white shadow-green-500/30'
                      : 'bg-primary text-primary-foreground shadow-primary/20 hover:shadow-primary/30'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {addedToCart ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        ¡Agregados al carrito!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add-all"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Agregar {items.length} {items.length === 1 ? 'pack' : 'packs'} al Carrito
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <p className="text-[10px] text-center text-muted-foreground">
                  Se agregarán los packs seleccionados directamente a tu carrito de compras
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
