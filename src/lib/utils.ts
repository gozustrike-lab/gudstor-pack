import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { COMPANY } from '@/config/company';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `S/ ${price.toFixed(2)}`;
}

import type { CartItem } from '@/lib/cart-store';

interface CustomerData {
  nombre: string;
  telefono: string;
  direccion?: string;
  referencia?: string;
  distrito?: string;
  departamento?: string;
}

export function generateWhatsAppURL(items: CartItem[], customerData: CustomerData): string {
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

  const total = items.reduce(
    (sum, item) => sum + item.product.precio * item.quantity,
    0
  );
  message += '━━━━━━━━━━━━━━━━━━\n';
  message += `*Total: ${formatPrice(total)}*\n\n`;
  message += '*Datos de envío:*\n';
  message += `👤 Nombre: ${customerData.nombre}\n`;
  message += `📱 Teléfono: ${customerData.telefono}\n`;
  if (customerData.direccion) message += `📍 Dirección: ${customerData.direccion}\n`;
  if (customerData.referencia) message += `📌 Referencia: ${customerData.referencia}\n`;
  if (customerData.distrito) message += `🏘️ Distrito: ${customerData.distrito}\n`;
  if (customerData.departamento) message += `🏛️ Departamento: ${customerData.departamento}\n`;
  message += '\n¡Gracias por su compra! 🎉';

  return `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(message)}`;
}
