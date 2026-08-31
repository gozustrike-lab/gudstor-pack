'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Heart,
  Package,
  Trash2,
  ShoppingCart,
  Eye,
  ShoppingBag,
} from 'lucide-react';
import { useFavoritesStore } from '@/lib/favorites-store';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import ImmersiveBanner from '@/components/immersive-banner';
import products from '@/data/products.json';
import { useScrollSpy } from '@/lib/use-scroll-spy';

const visibleProducts = products;

export default function FavoritosPage() {
  const { items, removeFavorite, clearFavorites, isFavorite } = useFavoritesStore();
  const addItemsFromFavorites = useCartStore((s) => s.addItemsFromFavorites);
  const [mounted, setMounted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useScrollSpy({
    ids: ['favoritos-header', 'favoritos-lista'],
    offset: '70px',
  });

  useEffect(() => setMounted(true), []);

  const favoriteProducts = mounted
    ? visibleProducts.filter((p) => isFavorite(p.id))
    : [];

  const handleAddAllToCart = () => {
    addItemsFromFavorites(items);
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
      clearFavorites();
    }, 2000);
  };

  const handleAddSingleToCart = (productId: string) => {
    const fav = items.find((f) => f.product.id === productId);
    if (fav) {
      addItemsFromFavorites([fav]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Immersive Banner */}
      <ImmersiveBanner
        title="Mis Favoritos"
        subtitle={mounted
          ? `${favoriteProducts.length} ${favoriteProducts.length === 1 ? 'producto guardado' : 'productos guardados'}`
          : 'Cargando...'}
        breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Favoritos' }]}
      />

      {!mounted ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border/50 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-20 bg-muted rounded" />
                  <div className="h-5 w-3/4 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-2/3 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : favoriteProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-muted rounded-3xl flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Aún no tienes favoritos
            </h2>
            <p className="text-muted-foreground max-w-sm mb-8">
              Explora nuestro catálogo y guarda los productos que más te gusten haciendo clic en el corazón.
            </p>
            <Link href="/productos">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20"
              >
                <ArrowLeft className="w-4 h-4" />
                Explorar Productos
              </motion.button>
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10" id="favoritos-lista">
          {/* Actions bar */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Seguir comprando
            </Link>
            <div className="flex items-center gap-3">
              {items.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddAllToCart}
                  disabled={addedToCart}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all shadow-lg ${
                    addedToCart
                      ? 'bg-green-500 text-white shadow-green-500/30'
                      : 'bg-primary text-primary-foreground shadow-primary/20'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {addedToCart ? '¡Agregados!' : `Agregar ${items.length} al carrito`}
                </motion.button>
              )}
              <button
                onClick={clearFavorites}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Borrar todo
              </button>
            </div>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <AnimatePresence mode="popLayout">
              {favoriteProducts.map((product, i) => {
                const favItem = items.find((f) => f.product.id === product.id);
                const pack = favItem
                  ? product.packs.find((p) => p.cantidad === favItem.selectedPack)
                  : product.packs[0];

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <div className="group relative bg-card rounded-2xl border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                      {/* Image */}
                      <div className="relative aspect-[4/3] bg-gradient-to-br from-muted via-muted to-muted/50 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center">
                            <Package className="w-10 h-10 text-primary/60" />
                          </div>
                        </div>

                        {/* Category */}
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase bg-white/90 backdrop-blur-sm text-foreground rounded-lg">
                            {product.categoria}
                          </span>
                        </div>

                        {/* Active heart */}
                        <button
                          onClick={() => removeFavorite(product.id)}
                          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full shadow-lg bg-red-50 hover:bg-red-100 transition-colors"
                          aria-label="Quitar de favoritos"
                        >
                          <Heart
                            className="w-[18px] h-[18px] text-red-500"
                            fill="#ef4444"
                            stroke="#dc2626"
                            strokeWidth={0}
                          />
                        </button>

                        {/* Pack badge */}
                        {pack && (
                          <div className="absolute bottom-3 left-3">
                            <span className="inline-flex items-center px-2 py-1 text-[10px] font-semibold bg-primary/90 text-primary-foreground rounded-lg">
                              Pack {pack.cantidad} uds · -{pack.descuento}%
                            </span>
                          </div>
                        )}

                        {/* Quick actions on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                          <Link href={`/productos/${product.slug || product.id}`}>
                            <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                              <Eye className="w-5 h-5 text-foreground" />
                            </div>
                          </Link>
                          <button
                            onClick={() => handleAddSingleToCart(product.id)}
                            className="w-10 h-10 bg-primary/90 rounded-full flex items-center justify-center shadow-lg hover:bg-primary transition-colors"
                          >
                            <ShoppingCart className="w-5 h-5 text-white" />
                          </button>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4 sm:p-5">
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
                        <Link href={`/productos/${product.slug || product.id}`}>
                          <h3 className="text-base font-bold text-foreground leading-tight mb-1.5 line-clamp-1 hover:text-primary transition-colors">
                            {product.nombre}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                          {product.descripcion}
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">
                              Pack {pack?.cantidad} uds
                            </p>
                            <p className="text-xl font-extrabold text-primary">
                              {pack ? formatPrice(pack.precio) : formatPrice(product.precio * 25)}
                            </p>
                            {pack && (
                              <p className="text-[10px] text-muted-foreground">
                                {formatPrice(pack.precio / pack.cantidad)}/u
                              </p>
                            )}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAddSingleToCart(product.id)}
                            className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                            aria-label={`Agregar ${product.nombre} al carrito`}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span className="hidden sm:inline">Agregar</span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
