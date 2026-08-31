'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  Package,
  User,
  Phone,
  MapPin,
  Navigation,
  Building2,
  MessageCircle,
  Check,
  Loader2,
  ShoppingBag,
} from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import { COMPANY } from '@/config/company';
import { useScrollSpy } from '@/lib/use-scroll-spy';
import ImmersiveBanner from '@/components/immersive-banner';

interface CustomerForm {
  nombre: string;
  documento: string;
  telefono: string;
  direccion: string;
  referencia: string;
  distrito: string;
  departamento: string;
}

export default function CarritoPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCartStore();
  const [form, setForm] = useState<CustomerForm>({
    nombre: '',
    documento: '',
    telefono: '',
    direccion: '',
    referencia: '',
    distrito: '',
    departamento: '',
  });
  const [isSending, setIsSending] = useState(false);

  useScrollSpy({
    ids: ['carrito-header', 'carrito-items', 'resumen-pedido', 'datos-envio'],
    offset: '70px',
  });

  const updateField = (field: keyof CustomerForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = form.nombre.trim() && form.telefono.trim().length >= 9 && items.length > 0;

  const getItemUnitPrice = (item: typeof items[0]) => {
    if (item.packSize) {
      const pack = item.product.packs.find((p) => p.cantidad === item.packSize);
      if (pack) return pack.precio / pack.cantidad;
    }
    return item.product.precio;
  };

  const getItemSubtotal = (item: typeof items[0]) => {
    return getItemUnitPrice(item) * item.quantity;
  };

  const handleSendWhatsApp = () => {
    if (!isFormValid) return;
    setIsSending(true);

    setTimeout(() => {
      const phone = COMPANY.whatsapp;
      let message = '🛒 *Nuevo Pedido - GUDSTOR PACK*\n\n';
      message += '━━━━━━━━━━━━━━━━━━\n';
      message += '*Detalles del pedido:*\n\n';

      items.forEach((item, index) => {
        message += `${index + 1}. *${item.product.nombre}*\n`;
        if (item.packSize) {
          message += `   📦 Pack: ${item.packSize} unidades\n`;
          const pack = item.product.packs.find((p) => p.cantidad === item.packSize);
          if (pack) message += `   💲 Precio pack: ${formatPrice(pack.precio)}\n`;
        }
        if (item.medida) message += `   📐 Medida: ${item.medida}\n`;
        if (item.color) message += `   🎨 Color: ${item.color}\n`;
        message += `   🔢 Cantidad: ${item.quantity} pack${item.quantity > 1 ? 's' : ''}\n`;
        message += `   💰 Subtotal: ${formatPrice(getItemSubtotal(item))}\n\n`;
      });

      message += '━━━━━━━━━━━━━━━━━━\n';
      message += `*Total: ${formatPrice(totalPrice())}*\n\n`;
      message += '*Datos de envío:*\n';
      message += `👤 Nombre: ${form.nombre}\n`;
      if (form.documento) message += `📄 RUC/DNI: ${form.documento}\n`;
      message += `📱 Celular: ${form.telefono}\n`;
      if (form.direccion) message += `📍 Dirección: ${form.direccion}\n`;
      if (form.referencia) message += `📌 Referencia: ${form.referencia}\n`;
      if (form.distrito) message += `🏘️ Distrito: ${form.distrito}\n`;
      if (form.departamento) message += `🏛️ Departamento: ${form.departamento}\n`;
      message += '\n¡Gracias por su compra! 🎉';

      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
      setIsSending(false);
      clearCart();
      setForm({
        nombre: '',
        documento: '',
        telefono: '',
        direccion: '',
        referencia: '',
        distrito: '',
        departamento: '',
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Immersive Banner */}
      <ImmersiveBanner
        title="Carrito de Compras"
        subtitle={`${totalItems()} ${totalItems() === 1 ? 'pack' : 'packs'} en tu carrito`}
        breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Carrito' }]}
      />

      {/* Custom order alert */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
          <div className="bg-amber-50 border border-amber-200/60 rounded-xl px-4 py-3 flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">¿Necesitas medidas o cantidades especiales?</p>
              <p className="text-xs text-amber-700 mt-0.5">
                También ofrecemos pedidos personalizados. <a href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent('Hola GUDSTOR PACK, necesito una cotización personalizada.')}`} target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-amber-900">Contáctanos por WhatsApp</a> y te cotizamos al instante.
              </p>
            </div>
          </div>
        </div>

      {items.length === 0 ? (
        /* Empty Cart */
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
              Tu carrito está vacío
            </h2>
            <p className="text-muted-foreground max-w-sm mb-8">
              Explora nuestro catálogo y encuentra los materiales de embalaje perfectos para tu
              negocio.
            </p>
            <Link href="/productos">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20"
              >
                <ArrowLeft className="w-4 h-4" />
                Ver Productos
              </motion.button>
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 sm:pb-10 max-w-full">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 w-full">
            {/* Cart Items */}
            <div id="carrito-items" className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.packSize || 'unit'}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100, height: 0 }}
                    className="bg-card border border-border/50 rounded-2xl p-4 sm:p-6 overflow-hidden"
                  >
                    <div className="flex gap-3 sm:gap-4">
                      {/* Product Image */}
                      <Link href={`/productos/${item.product.slug || item.product.id}`} className="shrink-0">
                        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center">
                          <Package className="w-6 h-6 sm:w-8 sm:h-8 text-primary/30" />
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 min-w-0">
                          <div>
                            <Link href={`/productos/${item.product.slug || item.product.id}`}>
                              <h3 className="text-sm sm:text-base font-bold text-foreground hover:text-primary transition-colors truncate">
                                {item.product.nombre}
                              </h3>
                            </Link>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {item.packSize && (
                                <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                  Pack {item.packSize} uds
                                </span>
                              )}
                              {item.medida && (
                                <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                                  {item.medida}
                                </span>
                              )}
                              {item.color && (
                                <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                                  {item.color}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors shrink-0"
                            aria-label="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-end justify-between mt-3 sm:mt-4">
                          {/* Quantity */}
                          <div>
                            <div className="inline-flex items-center border border-border rounded-lg overflow-hidden">
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity - 1)
                                }
                                className="w-8 h-8 flex items-center justify-center hover:bg-muted/50 transition-colors"
                                aria-label="Reducir cantidad"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-12 h-8 flex items-center justify-center text-sm font-medium border-x border-border">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity + 1)
                                }
                                className="w-8 h-8 flex items-center justify-center hover:bg-muted/50 transition-colors"
                                aria-label="Aumentar cantidad"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {formatPrice(getItemUnitPrice(item))} c/u
                            </p>
                          </div>

                          {/* Subtotal */}
                          <div className="text-right shrink-0 ml-2 min-w-0">
                            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                              {item.quantity}u x {formatPrice(getItemUnitPrice(item))}
                            </p>
                            <p className="text-base sm:text-lg font-extrabold text-primary">
                              {formatPrice(getItemSubtotal(item))}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Continue Shopping */}
              <div className="pt-2">
                <Link
                  href="/productos"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Seguir comprando
                </Link>
              </div>
            </div>

            {/* Order Summary & Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Order Summary */}
                <div id="resumen-pedido" className="bg-card border border-border/50 rounded-2xl p-5 sm:p-6">
                  <h2 className="text-base font-bold text-foreground mb-4">
                    Resumen del Pedido
                  </h2>

                  <div className="space-y-3 mb-4">
                    {items.map((item) => (
                      <div
                        key={`${item.product.id}-${item.packSize || 'unit'}`}
                        className="flex items-center justify-between text-sm gap-2 min-w-0"
                      >
                        <span className="text-muted-foreground truncate min-w-0">
                          {item.product.nombre}
                          {item.packSize ? ` (${item.packSize}u)` : ''} x{item.quantity}
                        </span>
                        <span className="font-medium text-foreground shrink-0">
                          {formatPrice(getItemSubtotal(item))}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border/50 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-foreground">Total</span>
                      <span className="text-2xl font-extrabold text-primary">
                        {formatPrice(totalPrice())}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping Form */}
                <div id="datos-envio" className="bg-card border border-border/50 rounded-2xl p-5 sm:p-6">
                  <h2 className="text-base font-bold text-foreground mb-4">
                    Datos de Envío
                  </h2>

                  <div className="space-y-3">
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-1">
                        <User className="w-3 h-3 text-muted-foreground" />
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        value={form.nombre}
                        onChange={(e) => updateField('nombre', e.target.value)}
                        placeholder="Tu nombre completo"
                        className="w-full px-3.5 py-2.5 bg-muted/50 rounded-xl border border-border/50 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-1">
                        <Building2 className="w-3 h-3 text-muted-foreground" />
                        RUC / DNI (opcional)
                      </label>
                      <input
                        type="text"
                        value={form.documento}
                        onChange={(e) => updateField('documento', e.target.value)}
                        placeholder="12345678901"
                        className="w-full px-3.5 py-2.5 bg-muted/50 rounded-xl border border-border/50 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-1">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        value={form.telefono}
                        onChange={(e) => updateField('telefono', e.target.value)}
                        placeholder="999 999 999"
                        className="w-full px-3.5 py-2.5 bg-muted/50 rounded-xl border border-border/50 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        Dirección
                      </label>
                      <input
                        type="text"
                        value={form.direccion}
                        onChange={(e) => updateField('direccion', e.target.value)}
                        placeholder="Av. Principal 123"
                        className="w-full px-3.5 py-2.5 bg-muted/50 rounded-xl border border-border/50 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-1">
                        <Navigation className="w-3 h-3 text-muted-foreground" />
                        Referencia
                      </label>
                      <input
                        type="text"
                        value={form.referencia}
                        onChange={(e) => updateField('referencia', e.target.value)}
                        placeholder="Cerca al parque central"
                        className="w-full px-3.5 py-2.5 bg-muted/50 rounded-xl border border-border/50 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-1">
                          <Building2 className="w-3 h-3 text-muted-foreground" />
                          Distrito
                        </label>
                        <input
                          type="text"
                          value={form.distrito}
                          onChange={(e) => updateField('distrito', e.target.value)}
                          placeholder="Lima Centro"
                          className="w-full px-3.5 py-2.5 bg-muted/50 rounded-xl border border-border/50 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          Departamento
                        </label>
                        <input
                          type="text"
                          value={form.departamento}
                          onChange={(e) => updateField('departamento', e.target.value)}
                          placeholder="Lima"
                          className="w-full px-3.5 py-2.5 bg-muted/50 rounded-xl border border-border/50 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Send Button */}
                <motion.button
                  whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                  whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                  onClick={handleSendWhatsApp}
                  disabled={!isFormValid || isSending}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-white transition-all shadow-lg ${
                    isFormValid
                      ? 'bg-[#25D366] hover:bg-[#20BD5A] shadow-[#25D366]/30'
                      : 'bg-muted-foreground/30 cursor-not-allowed shadow-none'
                  }`}
                >
                  {isSending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <MessageCircle className="w-5 h-5" />
                  )}
                  {isSending
                    ? 'Procesando pedido...'
                    : `Completar Pedido · ${formatPrice(totalPrice())}`}
                </motion.button>

                <p className="text-[10px] text-center text-muted-foreground">
                  Al presionar &quot;Completar Pedido&quot;, serás redirigido a WhatsApp para confirmar
                  tu compra con nuestro equipo de ventas.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
