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

export function getCleanCategoryPath(category?: string, subcategory?: string): string {
  if (!category || category === 'Todos') return '/productos';

  const normCat = category.trim();
  if (normCat === 'Cajas') {
    if (subcategory === 'Archiveras') return '/cajas-de-carton/cajas-archiveras';
    if (subcategory === 'Corrugadas') return '/cajas-de-carton/cajas-corrugadas';
    if (subcategory === 'Doble Corrugado') return '/cajas-de-carton/cajas-doble-corrugadas';
    if (subcategory === 'E-commerce') return '/cajas-de-carton/cajas-para-envios';
    if (subcategory === 'Pizza') return '/cajas-de-carton/cajas-para-pizza';
    return '/cajas-de-carton';
  }
  if (normCat === 'Films') {
    return '/materiales-de-embalaje/stretch-film';
  }
  if (normCat === 'Cintas') {
    return '/materiales-de-embalaje/cintas-adhesivas';
  }
  if (normCat === 'Protección') {
    if (subcategory === 'Burbupack') return '/materiales-de-embalaje/plastico-burbuja';
    if (subcategory === 'Cartón Corrugado') return '/materiales-de-embalaje/carton-corrugado';
    if (subcategory === 'Planchas') return '/materiales-de-embalaje/plancha-de-tecnopor';
    if (subcategory === 'Papel y Viruta') return '/relleno-y-complementos/viruta-de-papel';
    return '/relleno-y-complementos';
  }
  if (normCat === 'Bolsas') {
    return '/bolsas';
  }
  return '/productos';
}

export function getProductHref(product: { seoPath?: string; slug?: string; id?: string }): string {
  const slug = product.slug || product.id || '';
  if (product.seoPath && product.seoPath !== 'productos') {
    return `/${product.seoPath}/${slug}`;
  }
  return `/productos/${slug}`;
}

export function getCategoryAndSubcategoryFromPath(
  pathname: string = '',
  searchParams?: { get: (key: string) => string | null } | null
): { category: string; subcategory: string } {
  // 1. If explicit query params exist, use them
  const qCat = searchParams?.get('categoria');
  const qSub = searchParams?.get('subcategoria');
  if (qCat) {
    return { category: qCat, subcategory: qSub || '' };
  }

  // 2. Parse clean pathname
  const cleanPath = (pathname || '').replace(/\/+$/, '').toLowerCase();

  // Cajas
  if (cleanPath === '/cajas-de-carton/cajas-archiveras') {
    return { category: 'Cajas', subcategory: 'Archiveras' };
  }
  if (cleanPath === '/cajas-de-carton/cajas-corrugadas') {
    return { category: 'Cajas', subcategory: 'Corrugadas' };
  }
  if (cleanPath === '/cajas-de-carton/cajas-doble-corrugadas') {
    return { category: 'Cajas', subcategory: 'Doble Corrugado' };
  }
  if (cleanPath === '/cajas-de-carton/cajas-para-envios') {
    return { category: 'Cajas', subcategory: 'E-commerce' };
  }
  if (cleanPath === '/cajas-de-carton/cajas-para-pizza') {
    return { category: 'Cajas', subcategory: 'Pizza' };
  }
  if (cleanPath === '/cajas-de-carton' || cleanPath === '/cajas-especiales') {
    return { category: 'Cajas', subcategory: '' };
  }

  // Films
  if (
    cleanPath === '/materiales-de-embalaje/stretch-film' ||
    cleanPath === '/films'
  ) {
    return { category: 'Films', subcategory: '' };
  }

  // Cintas
  if (
    cleanPath === '/materiales-de-embalaje/cintas-adhesivas' ||
    cleanPath === '/cintas'
  ) {
    return { category: 'Cintas', subcategory: '' };
  }

  // Protección
  if (cleanPath === '/materiales-de-embalaje/plastico-burbuja') {
    return { category: 'Protección', subcategory: 'Burbupack' };
  }
  if (cleanPath === '/materiales-de-embalaje/carton-corrugado') {
    return { category: 'Protección', subcategory: 'Cartón Corrugado' };
  }
  if (
    cleanPath === '/materiales-de-embalaje/plancha-de-carton' ||
    cleanPath === '/materiales-de-embalaje/plancha-de-tecnopor' ||
    cleanPath === '/relleno-y-complementos/relleno-de-tecnopor'
  ) {
    return { category: 'Protección', subcategory: 'Planchas' };
  }
  if (
    cleanPath === '/relleno-y-complementos/viruta-de-papel' ||
    cleanPath === '/relleno-y-complementos/papel-seda-mantequilla' ||
    cleanPath === '/relleno-y-complementos/papel-con-diseño'
  ) {
    return { category: 'Protección', subcategory: 'Papel y Viruta' };
  }
  if (
    cleanPath === '/relleno-y-complementos' ||
    cleanPath === '/proteccion' ||
    cleanPath === '/materiales-de-embalaje/herramientas-y-accesorios' ||
    cleanPath === '/relleno-y-complementos/soguilla' ||
    cleanPath === '/relleno-y-complementos/stickers'
  ) {
    return { category: 'Protección', subcategory: '' };
  }

  // Bolsas
  if (cleanPath === '/bolsas') {
    return { category: 'Bolsas', subcategory: '' };
  }

  return { category: '', subcategory: '' };
}

