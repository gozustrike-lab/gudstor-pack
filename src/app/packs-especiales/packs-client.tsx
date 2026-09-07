'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Package,
  TrendingDown,
  Truck,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  Filter,
} from 'lucide-react';
import ProductCard from '@/components/product-card';
import ImmersiveBanner from '@/components/immersive-banner';
import { COMPANY } from '@/config/company';
import type { Product } from '@/lib/types';

interface PacksEspecialesClientProps {
  products: Product[];
}

export default function PacksEspecialesClient({ products }: PacksEspecialesClientProps) {
  const [selectedTag, setSelectedTag] = useState<string>('todos');

  const tags = [
    { id: 'todos', label: 'Todos los Packs' },
    { id: 'cajas', label: 'Packs de Cajas' },
    { id: 'films', label: 'Packs de Film & Stretch' },
    { id: 'cintas', label: 'Packs de Cintas' },
    { id: 'proteccion', label: 'Protección y Relleno' },
  ];

  const filteredProducts = useMemo(() => {
    if (selectedTag === 'todos') return products;
    if (selectedTag === 'cajas') return products.filter((p) => p.categoria.toLowerCase().includes('caja'));
    if (selectedTag === 'films') return products.filter((p) => p.categoria.toLowerCase().includes('film'));
    if (selectedTag === 'cintas') return products.filter((p) => p.categoria.toLowerCase().includes('cinta'));
    if (selectedTag === 'proteccion') return products.filter((p) => p.categoria.toLowerCase().includes('protec') || p.categoria.toLowerCase().includes('relleno') || p.categoria.toLowerCase().includes('bolsa'));
    return products;
  }, [products, selectedTag]);

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* ── Immersive Hero Banner ── */}
      <ImmersiveBanner
        title="Packs Especiales & Promociones por Mayor"
        subtitle="Ahorra hasta 20% con nuestros packs de 25, 50 y 100 unidades diseñados para empresas y ecommerce"
        breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Packs Especiales' }]}
      />

      {/* ── Benefit Highlights ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-card border border-border/60 shadow-lg shadow-black/5 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Descuentos Progresivos</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">A mayor cantidad de unidades, menor precio por pieza</p>
            </div>
          </div>

          <div className="bg-card border border-border/60 shadow-lg shadow-black/5 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Despacho en 24h</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">Envíos rápidos a toda Lima y provincias de todo el Perú</p>
            </div>
          </div>

          <div className="bg-card border border-border/60 shadow-lg shadow-black/5 rounded-2xl p-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Garantía de Calidad</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">Cartón corrugado y adhesivos de máxima resistencia</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Catalog Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Category Filter Pills */}
        <div className="flex items-center justify-between gap-4 pb-6 border-b border-border/50 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {tags.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTag(t.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                  selectedTag === t.id
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                    : 'bg-card border border-border/70 text-foreground/70 hover:text-foreground hover:bg-muted/60'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-muted-foreground font-medium">
            {filteredProducts.length} productos en promoción
          </span>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pt-6">
          {filteredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Custom Wholesale Banner */}
        <div className="mt-14 bg-gradient-to-br from-primary/10 via-card to-background border border-primary/20 rounded-3xl p-6 sm:p-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-primary/5">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/15 text-primary rounded-full text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cotizaciones Especiales</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-foreground">
              ¿Necesitas un combo a medida o compras por pallet?
            </h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Armamos packs combinados de cajas, cinta y film con precios distribuidores directos. Escríbenos por WhatsApp y te cotizamos en menos de 15 minutos.
            </p>
          </div>

          <a
            href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent('Hola GUDSTOR PACK, deseo armar un pack especial personalizado para mi empresa.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-xl shadow-lg shadow-[#25D366]/25 transition-all shrink-0 text-sm"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Cotizar Pack por WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
