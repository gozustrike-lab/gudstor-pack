'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import {
  Package, Truck, Shield, HeadphonesIcon, ArrowRight, Star,
  ChevronRight, ChevronLeft, Box, Layers, Ruler, CircleDot,
  ShoppingBag, Sparkles, TrendingUp, Users, Quote, MessageCircle,
  Clock, MapPin, Zap, Award,
} from 'lucide-react';
import ProductCard from '@/components/product-card';
import products from '@/data/products.json';
import { useScrollSpy } from '@/lib/use-scroll-spy';
import { dataSanityAttr } from '@/hooks/use-data-sanity';
import type { HeroSlide, Stat, Testimonial, SiteSettings, Partner } from '@/lib/sanity.client';

// ─── Props ──────────────────────────────────────────────────────────────────

interface HomePageClientProps {
  sanitySlides: HeroSlide[] | null;
  sanityStats: Stat[] | null;
  sanityTestimonials: Testimonial[] | null;
  sanitySettings: SiteSettings | null;
  sanityPartners: Partner[] | null;
}

// ─── Local Fallback Data ────────────────────────────────────────────────────

const visibleProducts = products;

const categories = [
  { nombre: 'Cajas', icon: Box, descripcion: 'Cajas Kraft de alta resistencia para todo tipo de envíos', count: 12, color: 'from-amber-500/10 to-amber-600/5', iconColor: 'text-amber-600', image: '/images/categories/cajas.webp' },
  { nombre: 'Films', icon: Layers, descripcion: 'Film estirable industrial para paletizado profesional', count: 8, color: 'from-teal-500/10 to-teal-600/5', iconColor: 'text-teal-600', image: '/images/categories/films.webp' },
  { nombre: 'Cintas', icon: Ruler, descripcion: 'Cintas adhesivas de alto rendimiento para sellado seguro', count: 10, color: 'from-blue-500/10 to-blue-600/5', iconColor: 'text-blue-600', image: '/images/categories/cintas.webp' },
  { nombre: 'Protección', icon: CircleDot, descripcion: 'Plástico burbuja y espumas para protección de fragilidades', count: 8, color: 'from-purple-500/10 to-purple-600/5', iconColor: 'text-purple-600', image: '/images/categories/proteccion.webp' },
  { nombre: 'Bolsas', icon: ShoppingBag, descripcion: 'Bolsas de envío courier waterproof y seguras', count: 12, color: 'from-green-500/10 to-green-600/5', iconColor: 'text-green-600', image: '/images/categories/bolsas.webp' },
];

const localHeroSlides = [
  { badge: '#1 en Materiales de Embalaje en Perú', title: 'Soluciones de', titleHighlight: 'Embalaje Profesional', description: 'Protege tus productos con materiales de la más alta calidad. Cajas Kraft, film estirable, cintas adhesivas y más.', ctaText: 'Ver Catálogo', ctaLink: '/productos', secondaryText: 'Cajas Kraft', secondaryLink: '/productos?categoria=Cajas', floaters: [{ label: 'Cajas Kraft', icon: Box, position: 'top-4 right-8', delay: 0 }, { label: 'Film Estirable', icon: Layers, position: 'bottom-12 left-4', delay: 0.5 }, { label: 'Cintas', icon: Ruler, position: 'bottom-4 right-16', delay: 1 }] },
  { badge: 'Descuentos por Volumen', title: 'Cajas de Cartón', titleHighlight: 'Corrugado Premium', description: 'Más de 50 productos con descuentos de hasta 20% por volumen. Autoarmables, kraft, doble pared y más.', ctaText: 'Ver Cajas', ctaLink: '/productos?categoria=Cajas', secondaryText: 'Ver Films', secondaryLink: '/productos?categoria=Films', floaters: [{ label: 'Autoarmables', icon: Box, position: 'top-8 right-4', delay: 0 }, { label: 'Doble Pared', icon: Shield, position: 'bottom-8 left-8', delay: 0.6 }, { label: 'Kraft', icon: Package, position: 'bottom-4 right-8', delay: 1.2 }] },
  { badge: 'Envíos a Todo el Perú', title: 'Films y Plásticos', titleHighlight: 'Industriales', description: 'Film estirable, termoencogible, antiestático y alimentario. Protección profesional para tu mercancía.', ctaText: 'Ver Films', ctaLink: '/productos?categoria=Films', secondaryText: 'Contactar', secondaryLink: 'https://wa.me/51977346837?text=Hola%2C%20quiero%20cotizar', floaters: [{ label: 'Estirable', icon: Layers, position: 'top-4 right-12', delay: 0 }, { label: 'Alimentario', icon: Shield, position: 'bottom-16 left-4', delay: 0.7 }, { label: 'Termoencogible', icon: Zap, position: 'bottom-4 right-20', delay: 1.3 }] },
];

const localStats = [
  { value: '2,500+', label: 'Clientes Satisfechos', icon: Users },
  { value: '50+', label: 'Productos Disponibles', icon: Package },
  { value: '98%', label: 'Tasa de Entrega', icon: Truck },
  { value: '4.9', label: 'Calificación Promedio', icon: Star },
];

const localTestimonials = [
  { author: 'María Fernanda Rojas', company: 'Fashion Retail S.A.C.', role: 'Gerente de Operaciones', quote: 'GUDSTOR PACK nos ayudó a reducir costos de empaque significativamente. La calidad de las cajas autoarmables es excelente y el envío siempre puntual.', rating: 5 },
  { author: 'Carlos Alberto Mendoza', company: 'Alimentos del Norte', role: 'Director Logístico', quote: 'El film grado alimenticio cumple perfectamente con las normativas. El equipo de GUDSTOR PACK nos asesoró para elegir los productos correctos.', rating: 5 },
  { author: 'Ana Lucía Torres', company: 'Tienda Online "El Rincón Creativo"', role: 'Propietaria', quote: 'Los precios por mayor son inmejorables. Compro packs de 100 cajas y el ahorro es real. Muy recomendados para negocios de ecommerce.', rating: 5 },
  { author: 'Roberto Sánchez Huamán', company: 'LogiPeru S.A.', role: 'Jefe de Almacén', quote: 'El film estirable industrial de alta tensión optimizó nuestro paletizado. Redujimos tiempos de embalaje en un 40%.', rating: 5 },
];

const localShippingInfo = [
  { icon: Clock, title: 'Despacho Rápido', description: 'Pedidos antes de las 2pm se despachan el mismo día en Lima.' },
  { icon: MapPin, title: 'Cobertura Nacional', description: 'Envíos a todas las regiones del Perú con seguimiento por WhatsApp.' },
  { icon: Shield, title: 'Empaque Seguro', description: 'Todos nuestros productos viajan con empaque protector especial.' },
];

const localTrustIndicators = [
  { icon: Truck, title: 'Envío a Todo el Perú', description: 'Despacho en 24h para Lima Metropolitana y 48-72h a provincias. Seguimiento en tiempo real por WhatsApp.' },
  { icon: Shield, title: 'Calidad Garantizada', description: 'Productos certificados con garantía de resistencia. Materiales de primera calidad para protección profesional.' },
  { icon: MessageCircle, title: 'Asesoría por WhatsApp', description: 'Atención personalizada inmediata por WhatsApp. Cotización y recomendación de productos para tu negocio.' },
  { icon: TrendingUp, title: 'Precios por Mayor', description: 'Descuentos escalonados desde 25 unidades hasta 1000+. Ahorra hasta 20% comprando en volumen.' },
];

const localCTA = {
  badge: 'Asesoría personalizada gratis',
  title: '¿Listo para optimizar tu embalaje?',
  subtitle: 'Contáctanos por WhatsApp y recibe asesoría personalizada para tu negocio. Envío rápido a todo el Perú.',
  ctaText: 'Ver Catálogo',
  ctaLink: '/productos',
  secondaryCtaText: 'WhatsApp',
  secondaryCtaLink: 'https://wa.me/51977346837?text=Hola%2C%20quiero%20cotizar%20materiales%20de%20embalaje',
};

const localPartners = ['Cliente Corporativo 1', 'Cliente Corporativo 2', 'Cliente Corporativo 3', 'Cliente Corporativo 4', 'Cliente Corporativo 5', 'Cliente Corporativo 6'];

// ─── Icon Map ───────────────────────────────────────────────────────────────

const iconMap: Record<string, any> = { Users, Package, Truck, Star, Box, Layers, Ruler, CircleDot, ShoppingBag, Shield, TrendingUp, HeadphonesIcon, MessageCircle, Clock, MapPin, Zap, Award, Sparkles };
function getIcon(name?: string) { return (name && iconMap[name]) || Package; }

// ─── Hero Carousel ──────────────────────────────────────────────────────────

interface SlideData {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondaryText: string;
  secondaryLink: string;
  floaters: { label: string; icon: any; position: string; delay: number }[];
  _sanityId?: string | null;
}

function HeroCarousel({ slides }: { slides: SlideData[] }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 6000);
  }, [slides.length]);

  useEffect(() => { startTimer(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, [startTimer]);
  const goTo = (i: number) => { setCurrent(i); startTimer(); };
  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = () => goTo((current + 1) % slides.length);
  const slide = slides[current];

  return (
    <section id="inicio" className="relative min-h-[100svh] flex items-center overflow-hidden" {...(slide._sanityId ? dataSanityAttr(slide._sanityId, 'heroSlide', '_root') : {})}>
      {/* ── FULL-BLEED background image — ALL viewports ── */}
      <Image
        src="/images/hero-product.webp"
        alt=""
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />
      {/* Dark overlay for text contrast — stronger at bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
      {/* Subtle warm tint matching brand */}
      <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="space-y-5 sm:space-y-6">
              {/* Badge — glass pill */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-sm font-medium text-white/95">{slide.badge}</span>
              </motion.div>

              {/* Headline — large, white, crisp */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-7xl font-extrabold text-white leading-[1.08] tracking-tight">
                {slide.title}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-white/90">{slide.titleHighlight}</span>
              </h1>

              {/* Description — concise, readable */}
              <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-lg">
                {slide.description}
              </p>

              {/* CTAs — primary + ghost */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Link href={slide.ctaLink}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 bg-white text-foreground font-bold rounded-xl shadow-xl shadow-black/20 hover:shadow-black/30 transition-all text-sm sm:text-base"
                  >
                    {slide.ctaText}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link href={slide.secondaryLink}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/25 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-sm sm:text-base"
                  >
                    {slide.secondaryText}
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>

              {/* Social proof — minimal */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-3 pt-3"
              >
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-white/25 to-white/10 border-2 border-white/40 flex items-center justify-center">
                      <Users className="w-3.5 h-3.5 text-white/80" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-white/60 font-medium">+2,500 clientes</span>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Desktop — Hero product image, clean floating card */}
          <div className="relative hidden lg:flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-md xl:max-w-lg"
              >
                {/* Glow effect behind image */}
                <div className="absolute -inset-6 bg-primary/20 rounded-[2rem] blur-3xl" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/30 border border-white/20">
                  <Image
                    src="/images/hero-product.webp"
                    alt="GUDSTOR PACK - Embalaje Profesional"
                    width={1254}
                    height={1254}
                    priority
                    className="w-full h-auto object-cover"
                    sizes="(max-width: 1024px) 0vw, 50vw"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Carousel dots — centered at bottom */}
        <div className="flex items-center justify-center gap-4 mt-8 sm:mt-12">
          <button onClick={prev} className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/20 transition-colors">
            <ChevronLeft className="w-5 h-5 text-white/80" />
          </button>
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
          <button onClick={next} className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 hover:bg-white/20 transition-colors">
            <ChevronRight className="w-5 h-5 text-white/80" />
          </button>
        </div>
      </div>

      {/* Bottom fade into page background */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

// ─── Product Slider ──────────────────────────────────────────────────────────

function ProductSlider() {
  const fp = visibleProducts.filter((p) => p.destacado);
  const dup = [...fp, ...fp];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const pausedRef = useRef(false);

  // Keep ref in sync
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  // Auto-scroll animation
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || paused) return;
    let pos = el.scrollLeft;
    let raf: number;
    const step = () => {
      if (pausedRef.current) return;
      pos += 0.8;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  // Pause on interaction, resume after 4s
  const pauseImmediately = useCallback(() => {
    pausedRef.current = true;
    setPaused(true);
  }, []);

  useEffect(() => {
    if (!paused) return;
    const timer = setTimeout(() => { pausedRef.current = false; setPaused(false); }, 4000);
    return () => clearTimeout(timer);
  }, [paused]);

  // Update scroll button visibility
  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    return () => el.removeEventListener('scroll', updateScrollButtons);
  }, [updateScrollButtons]);

  // Drag to scroll (mouse)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current!.offsetLeft;
    scrollStart.current = scrollRef.current!.scrollLeft;
    pauseImmediately();
  }, [pauseImmediately]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current!.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current!.scrollLeft = scrollStart.current - walk;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Drag to scroll (touch)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isDragging.current = true;
    startX.current = e.touches[0].pageX - scrollRef.current!.offsetLeft;
    scrollStart.current = scrollRef.current!.scrollLeft;
    pauseImmediately();
  }, [pauseImmediately]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const x = e.touches[0].pageX - scrollRef.current!.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    const el = scrollRef.current!;
    el.scrollLeft = scrollStart.current - walk;
  }, []);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Arrow navigation
  const navigateSlider = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 320 + 24; // card width + gap
    el.scrollBy({ left: direction === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' });
    setPaused(true);
  }, []);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); handleMouseUp(); }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={pauseImmediately}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeaveCapture={handleMouseLeave}
    >
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={(e) => { e.stopPropagation(); navigateSlider('left'); }}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-border/50 hover:bg-white hover:shadow-xl transition-all md:opacity-0 md:group-hover:opacity-100"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5 text-foreground/70" />
        </button>
      )}

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={(e) => { e.stopPropagation(); navigateSlider('right'); }}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-border/50 hover:bg-white hover:shadow-xl transition-all md:opacity-0 md:group-hover:opacity-100"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-5 h-5 text-foreground/70" />
        </button>
      )}

      {paused && (
        <div className="absolute top-2 right-2 z-20 px-2.5 py-1 bg-white/80 backdrop-blur-sm text-foreground/60 text-[10px] font-medium rounded-lg shadow-sm pointer-events-none">
          Pausado
        </div>
      )}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto cursor-grab active:cursor-grabbing scrollbar-hide"
      >
        {dup.map((p, i) => (
          <div key={`${p.id}-${i}`} className="shrink-0 w-[280px] sm:w-[320px]">
            <ProductCard product={p} index={i % fp.length} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Client Component ─────────────────────────────────────────────────

export default function HomePageClient({ sanitySlides, sanityStats, sanityTestimonials, sanitySettings, sanityPartners }: HomePageClientProps) {
  const settingsId = sanitySettings?._id || null;

  // ── Merge: Sanity data if available, local fallback ──
  const heroSlides: SlideData[] = (sanitySlides && sanitySlides.length > 0)
    ? sanitySlides.map((s) => {
        const words = s.title.split(' ');
        return {
          badge: sanitySettings?.tagline || '#1 en Materiales de Embalaje en Perú',
          title: words.slice(0, Math.ceil(words.length / 2)).join(' '),
          titleHighlight: words.slice(Math.ceil(words.length / 2)).join(' ') || s.title,
          description: s.description || 'Soluciones profesionales en embalaje para tu negocio.',
          ctaText: s.ctaText || 'Ver Catálogo',
          ctaLink: s.ctaLink || '/productos',
          secondaryText: 'Ver Productos',
          secondaryLink: '/productos',
          floaters: localHeroSlides[0].floaters,
          _sanityId: s._id,
        };
      })
    : localHeroSlides;

  const stats = (sanityStats && sanityStats.length > 0)
    ? sanityStats.map((s) => ({ value: `${s.prefix || ''}${s.value.toLocaleString('es-PE')}${s.suffix || ''}`, label: s.label, icon: getIcon(s.icon), _sanityId: s._id }))
    : localStats.map((s) => ({ ...s, _sanityId: null }));

  const testimonials = (sanityTestimonials && sanityTestimonials.length > 0)
    ? sanityTestimonials.map((t) => ({ author: t.author, company: t.company || '', role: t.role || '', quote: t.quote, rating: t.rating || 5, _sanityId: t._id }))
    : localTestimonials.map((t) => ({ ...t, _sanityId: null }));

  const partners = (sanityPartners && sanityPartners.length > 0)
    ? sanityPartners.map((p) => ({ title: p.title, _sanityId: p._id }))
    : localPartners.map((name) => ({ title: name, _sanityId: null }));

  // ── Sections from siteSettings (with fallback) ──
  const shippingItems = sanitySettings?.shippingItems?.length
    ? sanitySettings.shippingItems
    : localShippingInfo;

  const trustItems = sanitySettings?.trustItems?.length
    ? sanitySettings.trustItems
    : localTrustIndicators;

  const ctaData = sanitySettings?.ctaSection?.title
    ? sanitySettings.ctaSection
    : localCTA;

  useScrollSpy({ ids: ['inicio', 'estadisticas', 'categorias', 'productos-populares', 'testimonios', 'envios', 'por-que-elegirnos', 'contacto'], offset: '70px' });

  // ── GSAP ScrollTrigger refs ──
  const statsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const partnersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Stats counter animation
    const statsEl = statsRef.current;
    if (statsEl) {
      const items = statsEl.querySelectorAll('.gsap-stat');
      gsap.fromTo(items,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: statsEl, start: 'top 90%', toggleActions: 'play none none none' },
        }
      );
    }
    // Categories stagger reveal
    const catsEl = categoriesRef.current;
    if (catsEl) {
      const items = catsEl.querySelectorAll('.gsap-cat');
      gsap.fromTo(items,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.7,
          stagger: { each: 0.1, from: 'start' },
          ease: 'power3.out',
          scrollTrigger: { trigger: catsEl, start: 'top 88%', toggleActions: 'play none none none' },
        }
      );
    }
    // Trust items
    const trustEl = trustRef.current;
    if (trustEl) {
      const items = trustEl.querySelectorAll('.gsap-trust');
      gsap.fromTo(items,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 0.9,
          stagger: { each: 0.15, from: 'random' },
          ease: 'power3.out',
          scrollTrigger: { trigger: trustEl, start: 'top 85%', toggleActions: 'play none none none' },
        }
      );
    }
    // Partners marquee fade
    const partnersEl = partnersRef.current;
    if (partnersEl) {
      const items = partnersEl.querySelectorAll('.gsap-partner');
      gsap.fromTo(items,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1, scale: 1,
          duration: 0.6,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: { trigger: partnersEl, start: 'top 92%', toggleActions: 'play none none none' },
        }
      );
    }
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  return (
    <div className="min-h-screen">
      <HeroCarousel slides={heroSlides} />

      {/* Quick Links — categories bar */}
      <section
        className="bg-card border-b border-border/50"
        {...(settingsId ? dataSanityAttr(settingsId, 'siteSettings', '_root') : {})}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap shrink-0">Categorías</span>
            <div className="w-px h-6 bg-border/60 shrink-0" />
            <div className="flex items-center gap-2 sm:gap-3">
              {categories.map((cat) => (
                <Link key={cat.nombre} href={`/productos?categoria=${encodeURIComponent(cat.nombre)}`} className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-background border border-border/50 rounded-xl hover:border-primary/30 hover:bg-primary/5 transition-all shrink-0 group">
                  <cat.icon className={`w-4 h-4 ${cat.iconColor} group-hover:scale-110 transition-transform`} />
                  <span className="text-sm font-medium text-foreground/80 group-hover:text-primary whitespace-nowrap transition-colors">{cat.nombre}</span>
                  <span className="text-[10px] font-semibold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-md">{cat.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats — GSAP animated */}
      <section id="estadisticas" className="border-y border-border/50 bg-card">
        <div ref={statsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat: any, i: number) => (
              <div key={stat.label || i} className="gsap-stat flex items-center gap-3 opacity-0" {...(stat._sanityId ? dataSanityAttr(stat._sanityId, 'stat', '_root') : {})}>
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0"><stat.icon className="w-5 h-5 text-primary" /></div>
                <div><p className="text-lg sm:text-xl font-extrabold text-foreground">{stat.value}</p><p className="text-xs text-muted-foreground">{stat.label}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section
        id="categorias"
        className="py-16 sm:py-20"
        {...(settingsId ? dataSanityAttr(settingsId, 'siteSettings', '_root') : {})}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">Categorías Destacadas</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Encuentra todo lo que necesitas para el embalaje de tus productos</p>
          </motion.div>
          <div ref={categoriesRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {categories.map((cat, i) => (
              <div key={cat.nombre} className="gsap-cat opacity-0">
                <Link href={`/productos?categoria=${encodeURIComponent(cat.nombre)}`}>
                  <div className="group relative bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted/30">
                      <Image src={cat.image} alt={cat.nombre} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" />
                    </div>
                    <div className="p-4 sm:p-5">
                      <h3 className="text-sm sm:text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{cat.nombre}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 hidden sm:block">{cat.descripcion}</p>
                      <p className="text-[10px] text-primary font-medium mt-2">{cat.count} productos</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Slider */}
      <section id="productos-populares" className="py-16 sm:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-10 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">Productos Populares</h2>
              <p className="text-muted-foreground">Los más solicitados por nuestros clientes — desliza para ver más</p>
            </div>
            <Link href="/productos" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:underline">Ver todos <ArrowRight className="w-4 h-4" /></Link>
          </motion.div>
          <ProductSlider />
          <div className="mt-8 text-center sm:hidden">
            <Link href="/productos"><button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20">Ver todos los productos <ArrowRight className="w-4 h-4" /></button></Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonios" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">Lo que dicen nuestros clientes</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Más de 2,500 negocios confían en GUDSTOR PACK para sus materiales de embalaje</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {testimonials.map((t: any, i: number) => (
              <motion.div key={t.author || i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card border border-border/50 rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col" {...(t._sanityId ? dataSanityAttr(t._sanityId, 'testimonial', '_root') : {})}>
                <Quote className="w-8 h-8 text-primary/20 mb-4 shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-1 mb-3">{[...Array(t.rating)].map((_, j) => (<Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />))}</div>
                <div className="border-t border-border/50 pt-4">
                  <p className="text-sm font-bold text-foreground">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}{t.company ? ` · ${t.company}` : ''}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Envíos — from siteSettings.shippingItems */}
      <section
        id="envios"
        className="py-16 sm:py-20 bg-muted/30"
        {...(settingsId ? dataSanityAttr(settingsId, 'siteSettings', 'shippingItems') : {})}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">Envíos a Todo el Perú</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Tu mercancía llega segura y a tiempo, sin importar dónde te encuentres</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {shippingItems.map((item: any, i: number) => {
              const Icon = getIcon(item.icon);
              return (
                <motion.div
                  key={item.title || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border/50 rounded-2xl p-6 text-center hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                  {...(settingsId ? dataSanityAttr(settingsId, 'siteSettings', `shippingItems[${i}]`) : {})}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4"><Icon className="w-7 h-7 text-primary" /></div>
                  <h3 className="text-base font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ¿Por qué elegirnos? — from siteSettings.trustItems */}
      <section
        id="por-que-elegirnos"
        className="py-16 sm:py-20"
        {...(settingsId ? dataSanityAttr(settingsId, 'siteSettings', 'trustItems') : {})}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">¿Por qué elegirnos?</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Nos comprometemos con la calidad y el servicio para hacer crecer tu negocio</p>
          </motion.div>
          <div ref={trustRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {trustItems.map((item: any, i: number) => {
              const Icon = getIcon(item.icon);
              return (
                <div
                  key={item.title || i}
                  className="gsap-trust bg-card border border-border/50 rounded-2xl p-6 text-center hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 opacity-0"
                  {...(settingsId ? dataSanityAttr(settingsId, 'siteSettings', `trustItems[${i}]`) : {})}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4"><Icon className="w-7 h-7 text-primary" /></div>
                  <h3 className="text-base font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-12 bg-card border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Empresas que confían en nosotros</p>
          </motion.div>
          <div ref={partnersRef} className="flex items-center justify-center gap-8 sm:gap-12 flex-wrap">
            {partners.map((p: any, i: number) => (
              <div key={i} className="gsap-partner flex items-center justify-center w-32 h-16 bg-muted/50 rounded-xl border border-border/30 px-4 opacity-0" {...(p._sanityId ? dataSanityAttr(p._sanityId, 'partner', '_root') : {})}>
                <span className="text-xs font-semibold text-muted-foreground/60 text-center">{p.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — from siteSettings.ctaSection */}
      <section
        id="contacto"
        className="py-16 sm:py-20 bg-gradient-to-r from-primary to-secondary"
        {...(settingsId ? dataSanityAttr(settingsId, 'siteSettings', 'ctaSection') : {})}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
            {ctaData.badge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                <Award className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white/90">{ctaData.badge}</span>
              </div>
            )}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4">{ctaData.title}</h2>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">{ctaData.subtitle}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {ctaData.ctaText && (
                <Link href={ctaData.ctaLink || '/productos'}>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl shadow-xl hover:shadow-2xl transition-shadow">
                    {ctaData.ctaText} <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              )}
              {ctaData.secondaryCtaText && (
                <Link href={ctaData.secondaryCtaLink || '#'} target="_blank" rel="noopener noreferrer">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-colors">
                    <MessageCircle className="w-5 h-5" /> {ctaData.secondaryCtaText}
                  </motion.button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}