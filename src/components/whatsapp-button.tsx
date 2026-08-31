'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Check, Loader2, User, Phone, MapPin, Navigation, Building2 } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import { COMPANY } from '@/config/company';

interface CustomerForm {
  nombre: string;
  telefono: string;
  direccion: string;
  referencia: string;
  distrito: string;
  departamento: string;
}

export default function WhatsAppButton() {
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const clearCart = useCartStore((s) => s.clearCart);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [form, setForm] = useState<CustomerForm>({
    nombre: '',
    telefono: '',
    direccion: '',
    referencia: '',
    distrito: '',
    departamento: '',
  });

  const updateField = (field: keyof CustomerForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = form.nombre.trim() && form.telefono.trim().length >= 9;

  const generateWhatsAppURL = () => {
    const phone = COMPANY.whatsapp;
    let message = '🛒 *Nuevo Pedido - GUDSTOR PACK*\n\n';
    message += '━━━━━━━━━━━━━━━━━━\n';
    message += '*Detalles del pedido:*\n\n';

    items.forEach((item, index) => {
      message += `${index + 1}. *${item.product.nombre}*\n`;
      if (item.medida) message += `   📐 Medida: ${item.medida}\n`;
      if (item.color) message += `   🎨 Color: ${item.color}\n`;
      message += `   📦 Cantidad: ${item.quantity}\n`;
      message += `   💰 Subtotal: ${formatPrice(item.product.precio * item.quantity)}\n\n`;
    });

    message += '━━━━━━━━━━━━━━━━━━\n';
    message += `*Total: ${formatPrice(totalPrice())}*\n\n`;
    message += '*Datos de envío:*\n';
    message += `👤 Nombre: ${form.nombre}\n`;
    message += `📱 Teléfono: ${form.telefono}\n`;
    if (form.direccion) message += `📍 Dirección: ${form.direccion}\n`;
    if (form.referencia) message += `📌 Referencia: ${form.referencia}\n`;
    if (form.distrito) message += `🏘️ Distrito: ${form.distrito}\n`;
    if (form.departamento) message += `🏛️ Departamento: ${form.departamento}\n`;
    message += '\n¡Gracias por su compra! 🎉';

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const handleSend = () => {
    if (!isFormValid) return;
    setIsSending(true);
    setTimeout(() => {
      const url = generateWhatsAppURL();
      window.open(url, '_blank');
      setIsSending(false);
      setIsFormOpen(false);
      clearCart();
    }, 800);
  };

  // Hide on product detail pages — they have their own WhatsApp in the sticky bar
  const isProductDetail = /^\/productos\/[^/]+$/.test(pathname);
  if (items.length === 0 || isProductDetail) return null;

  return (
    <>
      {/* Floating WhatsApp Button */}
      <AnimatePresence>
        {!isFormOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsFormOpen(true)}
            className="fixed bottom-[80px] sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2 px-5 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold rounded-2xl shadow-2xl shadow-[#25D366]/30 transition-colors"
            aria-label="Enviar pedido por WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Pedir por WhatsApp</span>
            <span className="sm:hidden text-sm">{formatPrice(totalPrice())}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Customer Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
              onClick={() => setIsFormOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-[95] bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md sm:rounded-3xl"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white rounded-t-3xl px-6 pt-6 pb-4 border-b border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Datos de Envío</h3>
                    <p className="text-sm text-muted-foreground">Completa tus datos para enviar el pedido</p>
                  </div>
                  <div className="w-10 h-10 bg-[#25D366]/10 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-primary/5 rounded-xl p-3 mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground/70">
                      {items.length} {items.length === 1 ? 'producto' : 'productos'}
                    </span>
                    <span className="text-lg font-bold text-primary">{formatPrice(totalPrice())}</span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => updateField('nombre', e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full px-4 py-2.5 bg-muted/50 rounded-xl border border-border/50 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={form.telefono}
                    onChange={(e) => updateField('telefono', e.target.value)}
                    placeholder="977 346 837"
                    className="w-full px-4 py-2.5 bg-muted/50 rounded-xl border border-border/50 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={form.direccion}
                    onChange={(e) => updateField('direccion', e.target.value)}
                    placeholder="Av. Principal 123"
                    className="w-full px-4 py-2.5 bg-muted/50 rounded-xl border border-border/50 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
                    <Navigation className="w-3.5 h-3.5 text-muted-foreground" />
                    Referencia
                  </label>
                  <input
                    type="text"
                    value={form.referencia}
                    onChange={(e) => updateField('referencia', e.target.value)}
                    placeholder="Cerca al parque central"
                    className="w-full px-4 py-2.5 bg-muted/50 rounded-xl border border-border/50 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
                      <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                      Distrito
                    </label>
                    <input
                      type="text"
                      value={form.distrito}
                      onChange={(e) => updateField('distrito', e.target.value)}
                      placeholder="Lima Centro"
                      className="w-full px-4 py-2.5 bg-muted/50 rounded-xl border border-border/50 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-1.5">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      Departamento
                    </label>
                    <input
                      type="text"
                      value={form.departamento}
                      onChange={(e) => updateField('departamento', e.target.value)}
                      placeholder="Lima"
                      className="w-full px-4 py-2.5 bg-muted/50 rounded-xl border border-border/50 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                {/* Send Button */}
                <motion.button
                  whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                  whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                  onClick={handleSend}
                  disabled={!isFormValid || isSending}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white transition-all shadow-lg ${
                    isFormValid
                      ? 'bg-[#25D366] hover:bg-[#20BD5A] shadow-[#25D366]/30'
                      : 'bg-muted-foreground/30 cursor-not-allowed shadow-none'
                  }`}
                >
                  {isSending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                  {isSending
                    ? 'Preparando pedido...'
                    : `Enviar Pedido por WhatsApp · ${formatPrice(totalPrice())}`}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
