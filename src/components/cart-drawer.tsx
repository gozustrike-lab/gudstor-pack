'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Package,
  ArrowRight,
  Truck,
  MessageCircle,
  ShoppingBag,
} from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import { COMPANY } from '@/config/company';

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

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice, totalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Lock body scroll when open */
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  if (!mounted) return null;

  const total = totalPrice();
  const count = totalItems();

  const getItemPrice = (item: typeof items[0]) => {
    const packs = Array.isArray(item.product?.packs) ? item.product.packs : [];
    if (item.packSize) {
      const pack = packs.find((p) => p.cantidad === item.packSize);
      if (pack && typeof pack.precio === 'number') {
        return pack.precio;
      }
    }
    const base = typeof item.product?.precio === 'number' ? item.product.precio : 0;
    return base * (item.packSize || 1);
  };

  const handleQuickWhatsApp = () => {
    if (items.length === 0) return;
    let message = '🛒 *Nuevo Pedido - GUDSTOR PACK*\n\n';
    message += '━━━━━━━━━━━━━━━━━━\n';
    message += '*Detalles del pedido:*\n\n';

    items.forEach((item, index) => {
      const packPrice = getItemPrice(item);
      const subtotal = packPrice * item.quantity;
      message += `${index + 1}. *${item.product?.nombre || 'Producto'}*\n`;
      if (item.packSize) {
        message += `   📦 Pack: ${item.packSize} unidades\n`;
      }
      if (item.medida) message += `   📐 Medida: ${item.medida}\n`;
      if (item.color) message += `   🎨 Color: ${item.color}\n`;
      message += `   🔢 Cantidad: ${item.quantity} pack${item.quantity > 1 ? 's' : ''}\n`;
      message += `   💰 Subtotal: ${formatPrice(subtotal)}\n\n`;
    });

    message += '━━━━━━━━━━━━━━━━━━\n';
    message += `*Total: ${formatPrice(total)}*\n\n`;
    message += 'Por favor confirmar stock y costo de envío. ¡Gracias!';

    window.open(`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer panel */}
          <motion.aside
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 w-full max-w-md bg-background shadow-2xl flex flex-col h-full border-l border-border/50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">Tu Carrito</h2>
                  <p className="text-xs text-muted-foreground">
                    {count} {count === 1 ? 'pack seleccionado' : 'packs seleccionados'}
                  </p>
                </div>
              </div>

              <button
                onClick={closeCart}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                aria-label="Cerrar carrito"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-20 h-20 rounded-3xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-4">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-1">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-[240px] mb-6 leading-relaxed">
                    Explora nuestro catálogo mayorista y añade productos para comenzar tu cotización.
                  </p>
                  <button
                    onClick={closeCart}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors"
                  >
                    Explorar Productos
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => {
                    const packPrice = getItemPrice(item);
                    const subtotal = packPrice * item.quantity;
                    const cdnImage = item.product?.imagenes?.find(
                      (img) => typeof img === 'string' && img.startsWith('http')
                    );
                    const detailHref = item.product?.seoPath && item.product.seoPath !== 'productos'
                      ? `/${item.product.seoPath}/${item.product.slug || item.product.id}`
                      : `/productos/${item.product?.slug || item.product?.id || ''}`;

                    return (
                      <motion.div
                        key={`${item.product?.id}-${item.packSize}-${item.medida}-${item.color}`}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-3 bg-card border border-border/60 rounded-2xl flex gap-3 group hover:border-primary/30 transition-all shadow-sm"
                      >
                        {/* Thumbnail */}
                        <Link
                          href={detailHref}
                          onClick={closeCart}
                          className="relative w-20 h-20 rounded-xl bg-muted/40 shrink-0 overflow-hidden flex items-center justify-center"
                        >
                          {cdnImage ? (
                            <Image
                              src={cdnImage}
                              alt={item.product?.nombre || 'Producto'}
                              fill
                              className="object-contain p-2"
                              sizes="80px"
                            />
                          ) : (
                            <Package className="w-8 h-8 text-primary/40" />
                          )}
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                href={detailHref}
                                onClick={closeCart}
                                className="text-sm font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                              >
                                {item.product?.nombre}
                              </Link>
                              <button
                                onClick={() => removeItem(item.product.id, item.packSize)}
                                className="text-muted-foreground/60 hover:text-destructive transition-colors p-1"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              {item.packSize && (
                                <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-md">
                                  Pack {item.packSize} {item.product?.unidadMedida || 'uds'}
                                </span>
                              )}
                              {item.medida && (
                                <span className="inline-block px-1.5 py-0.5 text-[10px] bg-muted text-muted-foreground rounded-md">
                                  {item.medida}
                                </span>
                              )}
                              {item.color && (
                                <span className="inline-block px-1.5 py-0.5 text-[10px] bg-muted text-muted-foreground rounded-md">
                                  {item.color}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-border/30">
                            {/* Quantity controls */}
                            <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.packSize)}
                                className="w-6 h-6 flex items-center justify-center rounded-md bg-background hover:bg-card text-foreground shadow-xs transition-colors"
                                aria-label="Disminuir"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold px-1.5 text-foreground min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.packSize)}
                                className="w-6 h-6 flex items-center justify-center rounded-md bg-background hover:bg-card text-foreground shadow-xs transition-colors"
                                aria-label="Aumentar"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Subtotal */}
                            <div className="text-right">
                              <span className="text-xs text-muted-foreground block text-[10px]">
                                {formatPrice(packPrice)} c/u
                              </span>
                              <span className="text-sm font-extrabold text-primary">
                                {formatPrice(subtotal)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-5 border-t border-border/50 bg-card/60 space-y-3 shrink-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-primary" />
                    Despacho en 24h para Lima
                  </span>
                  <span className="text-green-600 font-semibold">Precios mayoristas</span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-sm font-semibold text-foreground">Total Estimado:</span>
                  <span className="text-2xl font-black text-primary">
                    {formatPrice(total)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {/* Continuar Compra / Seguir Comprando */}
                  <button
                    onClick={closeCart}
                    className="w-full py-3 px-3 text-xs font-bold border border-border/80 hover:bg-muted/60 text-foreground rounded-xl transition-colors text-center"
                  >
                    Seguir Comprando
                  </button>

                  {/* Ir al Checkout / Carrito */}
                  <Link
                    href="/carrito"
                    onClick={closeCart}
                    className="w-full py-3 px-3 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-1.5"
                  >
                    <span>Continuar Compra</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Direct WhatsApp fast order */}
                <button
                  onClick={handleQuickWhatsApp}
                  className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold rounded-xl shadow-md shadow-[#25D366]/20 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pedir Pedido por WhatsApp</span>
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
