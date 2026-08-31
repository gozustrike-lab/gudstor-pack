'use client';

import { useState, use, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import {
  Package,
  ShoppingCart,
  ArrowLeft,
  Truck,
  Shield,
  Check,
  Heart,
  MessageCircle,
  ChevronRight,
  Phone,
  Box,
  Layers,
  Ruler,
  CircleDot,
  ShoppingBag,
  LayoutGrid,
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useFavoritesStore } from '@/lib/favorites-store';
import { formatPrice } from '@/lib/utils';
import { COMPANY } from '@/config/company';
import LightboxGallery from '@/components/lightbox-gallery';
import SavingsMessage from '@/components/savings-message';

type TabKey = 'descripcion' | 'especificaciones' | 'envios' | 'faq';

// ─── Related Products Carousel — Swiper.js ──────────────────────────────
function RelatedProductsCarousel({ products: rpList }: { products: any[] }) {
  if (rpList.length === 0) return null;

  return (
    <section className="mt-8 sm:mt-12 pt-6 border-t border-border/50">
      <div className="mb-0">
        <h2 className="text-xl font-semibold text-foreground mb-6">Productos Relacionados</h2>
      </div>
      <Swiper
        modules={[Navigation, FreeMode]}
        spaceBetween={16}
        slidesPerView={2}
        freeMode={true}
        grabCursor={true}
        simulateTouch={true}
        navigation={true}
        breakpoints={{
          640: { slidesPerView: 3, spaceBetween: 16 },
          768: { slidesPerView: 4, spaceBetween: 20 },
          1024: { slidesPerView: 5, spaceBetween: 24 },
        }}
        className="pb-10 [&_.swiper-button-next]:right-1 [&_.swiper-button-prev]:left-1 [&_.swiper-button-next]:w-8 [&_.swiper-button-prev]:w-8 [&_.swiper-button-next]:h-8 [&_.swiper-button-prev]:h-8 [&_.swiper-button-next]:rounded-full [&_.swiper-button-prev]:rounded-full [&_.swiper-button-next]:border [&_.swiper-button-prev]:border [&_.swiper-button-next]:border-border/50 [&_.swiper-button-prev]:border-border/50 [&_.swiper-button-next]:bg-white/90 [&_.swiper-button-prev]:bg-white/90 [&_.swiper-button-next]:backdrop-blur-sm [&_.swiper-button-prev]:backdrop-blur-sm [&_.swiper-button-next]:shadow-sm [&_.swiper-button-prev]:shadow-sm [&_.swiper-button-next]:top-1/2 [&_.swiper-button-prev]:top-1/2 [&_.swiper-button-next]:-translate-y-1/2 [&_.swiper-button-prev]:-translate-y-1/2 [&_.swiper-button-next]:z-10 [&_.swiper-button-prev]:z-10 [&_.swiper-button-next]:after:text-foreground/70 [&_.swiper-button-prev]:after:text-foreground/70 [&_.swiper-button-next]:after:text-sm [&_.swiper-button-prev]:after:text-sm [&_.swiper-button-next]:hover:bg-muted/50 [&_.swiper-button-prev]:hover:bg-muted/50 sm:[&_.swiper-button-next]:right-0 sm:[&_.swiper-button-prev]:left-0 sm:[&_.swiper-button-next]:w-9 sm:[&_.swiper-button-prev]:w-9 sm:[&_.swiper-button-next]:h-9 sm:[&_.swiper-button-prev]:h-9"
      >
        {rpList.map((rp) => (
          <SwiperSlide key={rp.id}>
            <Link href={rp.seoPath && rp.seoPath !== 'productos' ? `/${rp.seoPath}/${rp.slug}` : `/productos/${rp.slug}`} className="block">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group bg-card border border-border/50 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div data-rp-card className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-primary/30" />
                </div>
                <div className="p-2.5 sm:p-3">
                  <h3 className="text-[11px] sm:text-xs font-bold text-foreground group-hover:text-primary truncate">{rp.nombre}</h3>
                  <p className="text-sm sm:text-lg font-extrabold text-primary mt-0.5 sm:mt-1">
                    {formatPrice((rp.packs || [])[0].precio / (rp.packs || [])[0].cantidad)}/u
                  </p>
                </div>
              </motion.div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default function ProductoDetalleClient({
  params,
  initialProducts,
}: {
  params: Promise<{ id: string }>;
  initialProducts: any[];
}) {
  const visibleProducts = initialProducts;
  const { id } = use(params);
  const searchParams = useSearchParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedMedida, setSelectedMedida] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedPackIndex, setSelectedPackIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [heartActive, setHeartActive] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('descripcion');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});
  const isFirstRender = useRef(true);

  const addItem = useCartStore((s) => s.addItem);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(id));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  const rawProduct = visibleProducts.find((p) => p.id === id || p.slug === id);
  const product = rawProduct ? { ...rawProduct, imagenes: (rawProduct.imagenes || []).filter((img) => typeof img === 'string' && img.startsWith('https://')) } : undefined;

  // ── Deep linking: read pack + medida from URL on mount ──
  useEffect(() => {
    if (!product) return;
    const packParam = searchParams.get('pack');
    const medidaParam = searchParams.get('medida');
    if (packParam) {
      const idx = product.packs.findIndex((p) => String(p.cantidad) === packParam);
      if (idx >= 0) setSelectedPackIndex(idx);
    }
    if (medidaParam) {
      const decoded = decodeURIComponent(medidaParam);
      if (product.medidas.includes(decoded)) {
        setSelectedMedida(decoded);
      }
    }
  }, [product, searchParams]);

  // ── Sync pack + medida → URL query params ──
  useEffect(() => {
    if (!product || isFirstRender.current) {
      if (isFirstRender.current) isFirstRender.current = false;
      return;
    }
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams();
    const pack = product.packs[selectedPackIndex];
    if (pack) urlParams.set('pack', String(pack.cantidad));
    const medida = selectedMedida || (product.medidas || [])[0];
    urlParams.set('medida', encodeURIComponent(medida));
    const qs = urlParams.toString();
    const productSeoPath = product.seoPath && product.seoPath !== 'productos' ? `/${product.seoPath}` : `/productos`;
    window.history.replaceState(null, '', `${productSeoPath}/${id}?${qs}`);
  }, [product, id, selectedPackIndex, selectedMedida]);

  const selectedPack = product?.packs[selectedPackIndex] ?? null;

  const handleAddToCart = useCallback(() => {
    if (!product || !selectedPack) return;
    addItem(
      product,
      selectedPack.cantidad,
      selectedMedida || (product.medidas || [])[0],
      selectedColor || (product.colores || [])[0],
      selectedPack.cantidad
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }, [product, selectedPack, selectedMedida, selectedColor, addItem]);

  const handleToggleFavorite = useCallback(() => {
    if (!product || !selectedPack) return;
    toggleFavorite(product, selectedPack.cantidad);
    setHeartActive(true);
    setTimeout(() => setHeartActive(false), 600);
  }, [product, selectedPack, toggleFavorite]);

  const handleWhatsApp = useCallback(() => {
    if (!product || !selectedPack) return;
    const medida = selectedMedida || (product.medidas || [])[0];
    const color = selectedColor || (product.colores || [])[0];
    const productSeoPath = product.seoPath && product.seoPath !== 'productos' ? `${product.seoPath}` : `productos`;
    const productUrl = `https://gudstor-pack.vercel.app/${productSeoPath}/${product.slug || product.id}`;
    const msg = [
      'Hola GUDSTOR PACK',
      '',
      'Deseo cotizar el siguiente producto:',
      '',
      `📦 ${product.nombre}`,
      `📐 Medida: ${medida}`,
      `🎨 Color: ${color}`,
      `📦 Pack: ${selectedPack.cantidad} unidades`,
      `💰 Precio: ${formatPrice(selectedPack.precio)}`,
      `🔢 Cantidad: ${quantity} pack${quantity > 1 ? 's' : ''}`,
      `💵 Total: ${formatPrice(selectedPack.precio * quantity)}`,
      '',
      `🔗 Ver producto: ${productUrl}`,
      '',
      'Gracias.',
    ].join('\n');
    window.open(`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  }, [product, selectedPack, selectedMedida, selectedColor, quantity]);

  const handleWhatsAppCotizacion = useCallback(() => {
    if (!product || !selectedPack) return;
    const medida = selectedMedida || (product.medidas || [])[0];
    const color = selectedColor || (product.colores || [])[0];
    const productSeoPath = product.seoPath && product.seoPath !== 'productos' ? `${product.seoPath}` : `productos`;
    const productUrl = `https://gudstor-pack.vercel.app/${productSeoPath}/${product.slug || product.id}`;
    const msg = [
      'Hola GUDSTOR PACK',
      '',
      `Requiero cotizar este producto por mayor / volumen o con requerimientos personalizados:`,
      '',
      `📦 ${product.nombre}`,
      `📐 Medida: ${medida}`,
      `🎨 Color: ${color}`,
      '',
      `🔗 Ver producto: ${productUrl}`,
      '',
      'Gracias.',
    ].join('\n');
    window.open(`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  }, [product, selectedPack, selectedMedida, selectedColor]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
          <Package className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-lg font-bold text-foreground mb-2">Producto no encontrado</h1>
        <p className="text-muted-foreground mb-4 text-center text-sm">
          El producto que buscas no existe o fue removido.
        </p>
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const relatedProducts = visibleProducts
    .filter((p) => p.categoria === product.categoria && p.id !== product.id)
    .slice(0, 8);

  // Category-specific FAQs
  const categoryFAQs: Record<string, { q: string; a: string }[]> = {
    Cajas: [
      { q: '¿Cuál es el tiempo de entrega?', a: 'El tiempo de entrega es de 24-48 horas en Lima Metropolitana y 48-72 horas hábiles a provincias. Pedidos realizados antes de las 2pm se despachan el mismo día.' },
      { q: '¿Tienen descuento por mayor?', a: 'Sí, ofrecemos descuentos progresivos. Desde 25 unidades ya tienes precios especiales, y a partir de 100 unidades el descuento es aún mayor. Contáctanos por WhatsApp para cotizaciones personalizadas.' },
      { q: '¿Puedo personalizar el tamaño de la caja?', a: 'Sí, fabricamos cajas a medida. Solo envíanos las dimensiones que necesitas y te cotizamos en menos de 1 hora. Mínimo de pedido para medidas personalizadas: 100 unidades.' },
      { q: '¿Las cajas soportan peso pesado?', a: 'Nuestras cajas de doble corrugado soportan hasta 30kg dependiendo del tamaño. Las cajas de triple corrugado pueden soportar hasta 50kg. Te asesoramos según tu necesidad.' },
      { q: '¿Qué tipo de material usan?', a: 'Utilizamos cartón corrugado de alta resistencia, certificado con estándares internacionales. Disponemos en kraft (marrón natural) y blanco, según tu preferencia.' },
    ],
    Films: [
      { q: '¿Cuál es el grosor del film?', a: 'Disponemos de film estirable en diferentes grosores: 17 micras (uso liviano), 20 micras (uso estándar) y 23 micras (uso industrial). El grosor ideal depende de tu aplicación.' },
      { q: '¿Es resistente a la perforación?', a: 'Sí, nuestro film estirable tiene alta resistencia a la perforación y estiramiento. Es ideal para paletizar y proteger mercancías durante el transporte.' },
      { q: '¿Venden por rollo o por pallet?', a: 'Ambas opciones están disponibles. Puedes comprar rollos individuales desde 1 unidad, o pallets completos con precios especiales para volumen.' },
      { q: '¿Tienen film para alimentos?', a: 'Sí, contamos con film apto para contacto alimentario certificado. Es perfecto para envolver alimentos y mantener su frescura.' },
    ],
    Cintas: [
      { q: '¿Qué tan resistente es la cinta?', a: 'Nuestras cintas de embalaje tienen alta adhesividad y resistencia al desgarre. La cinta de 48mm soporta hasta 15kg de peso en cierre vertical.' },
      { q: '¿Puedo personalizar la cinta con mi logo?', a: 'Sí, ofrecemos cintas personalizadas con tu logo, colores corporativos o mensajes promocionales. Mínimo de pedido: 100 rollos. Te enviamos diseño sin costo.' },
      { q: '¿Cuántos metros tiene cada rollo?', a: 'Dependiendo del ancho: los rollos de 48mm tienen 100m, los de 72mm tienen 100m, y los de 100mm tienen 50m. Todos con núcleo de cartón resistente.' },
      { q: '¿Tienen cinta para frío?', a: 'Sí, contamos con cinta especial para ambientes fríos (hasta -20°C). Ideal para cámaras de frío e industria alimentaria.' },
    ],
    Protección: [
      { q: '¿Para qué productos es recomendado el papel burbuja?', a: 'El papel burbuja es ideal para proteger artículos frágiles como electrónicos, vidrios, cerámicas y productos decorativos durante el envío y almacenamiento.' },
      { q: '¿Qué densidades de espuma tienen?', a: 'Disponemos de espuma de polietileno en densidades de 15kg/m³ (blanda), 20kg/m³ (media) y 25kg/m³ (firme). Cada densidad se adapta a diferentes niveles de protección.' },
      { q: '¿Venden por metro o por rollo?', a: 'Ambas opciones. Puedes comprar cortes a medida por metro lineal, o rollos completos de 50m y 100m para uso industrial.' },
      { q: '¿Es reciclable el material de protección?', a: 'Sí, todos nuestros materiales de protección son 100% reciclables. Promovemos el embalaje sostenible y ofrecemos alternativas ecológicas.' },
    ],
    Bolsas: [
      { q: '¿Qué capacidad soportan las bolsas?', a: 'Nuestras bolsas soportan desde 5kg hasta 25kg dependiendo del tipo y grosor. Las bolsas de polietileno reforzado son las más resistentes.' },
      { q: '¿Tienen bolsas biodegradables?', a: 'Sí, contamos con línea ecológica de bolsas biodegradables que se degradan en 12-18 meses. Ideales para empresas con compromiso ambiental.' },
      { q: '¿Puedo pedir bolsas impresas?', a: 'Sí, ofrecemos impresión hasta 6 colores con tu diseño. Mínimo de pedido para bolsas impresas: 500 unidades. Te asesoramos en el diseño sin costo.' },
      { q: '¿Qué tipos de bolsas tienen?', a: 'Disponemos de bolsas de polietileno (planas y con fuelle), bolsas de papel kraft, bolsas ziplock y bolsas para uso alimentario. Todos los tamaños disponibles.' },
    ],
  };

  const productFAQs = categoryFAQs[product.categoria] || categoryFAQs['Cajas'];

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'descripcion', label: 'Descripción' },
    { key: 'especificaciones', label: 'Especificaciones' },
    { key: 'envios', label: 'Envíos' },
    { key: 'faq', label: '¿Preguntas frecuentes?' },
  ];

  // Shipping tiers
  const shippingTiers = [
    { min: 25, max: 49, label: '25 - 49 uds', info: 'Envío estándar' },
    { min: 50, max: 99, label: '50 - 99 uds', info: 'Envío económico' },
    { min: 100, max: 499, label: '100 - 499 uds', info: 'Envío mayorista' },
    { min: 500, max: 999, label: '500 - 999 uds', info: 'Envío distribuidor' },
    { min: 1000, max: null, label: '1,000+ uds', info: 'Envío industrial' },
  ];

  // Category navigation items
  const categoryItems = [
    { name: 'Cajas', href: '/productos?categoria=Cajas', icon: Box },
    { name: 'Films', href: '/productos?categoria=Films', icon: Layers },
    { name: 'Cintas', href: '/productos?categoria=Cintas', icon: Ruler },
    { name: 'Protección', href: '/productos?categoria=Protección', icon: CircleDot },
    { name: 'Bolsas', href: '/productos?categoria=Bolsas', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen pb-[140px] md:pb-20">
      {/* ============================================================ */}
      {/* MOBILE: Sticky top bar with back + title + favorite          */}
      {/* ============================================================ */}
      <div className="md:hidden sticky top-[56px] z-30 bg-white/90 backdrop-blur-md border-b border-border/30">
        <div className="flex items-center justify-between px-3 h-11">
          <Link href="/productos" className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 active:text-primary">
            <ArrowLeft className="w-4 h-4" />
            <span className="max-w-[180px] truncate">{product.nombre}</span>
          </Link>
          <button
            onClick={handleToggleFavorite}
            className="p-2 active:bg-red-50 rounded-xl transition-colors"
          >
            <motion.div animate={heartActive ? { scale: [1, 1.4, 0.8, 1] } : { scale: 1 }} transition={{ duration: 0.4 }}>
              <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-foreground/30'}`} />
            </motion.div>
          </button>
        </div>
      </div>

      {/* DESKTOP Breadcrumb */}
      <div className="hidden md:block bg-muted/30 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto">
            <Link href="/" className="hover:text-primary transition-colors shrink-0">Inicio</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <Link href="/productos" className="hover:text-primary transition-colors shrink-0">Productos</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <Link href={`/productos?categoria=${encodeURIComponent(product.categoria)}`} className="hover:text-primary transition-colors shrink-0">
              {product.categoria}
            </Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-foreground font-medium truncate">{product.nombre}</span>
          </nav>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MAIN CONTENT — Mobile-First Single Column Layout             */}
      {/* ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

        {/* ── MOBILE: Horizontal category strip ── */}
        <nav className="md:hidden mb-4 -mx-4 px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoryItems.map((cat) => {
              const isActive = cat.name === product.categoria;
              const CatIcon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/60 bg-muted/50 border border-border/50'
                  }`}
                >
                  <CatIcon className="w-3 h-3" />
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* ── Desktop: 3-column layout ── */}
        <div className="hidden lg:grid lg:grid-cols-[220px_1fr_1fr] gap-6">

          {/* LEFT SIDEBAR — Vertical Category Navigation */}
          <aside>
            <div className="sticky top-[96px] bg-card border border-border/60 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                  <LayoutGrid className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">Categorías</span>
              </div>
              <div className="space-y-1">
                {[
                  { name: 'Todos', href: '/productos', icon: LayoutGrid, activeClass: 'bg-primary text-primary-foreground', hoverClass: 'hover:bg-muted/60' },
                  { name: 'Cajas', href: '/productos?categoria=Cajas', icon: Box, activeClass: 'bg-amber-500/10 text-amber-700 border-l-2 border-amber-500', hoverClass: 'hover:bg-amber-500/5' },
                  { name: 'Films', href: '/productos?categoria=Films', icon: Layers, activeClass: 'bg-teal-500/10 text-teal-700 border-l-2 border-teal-500', hoverClass: 'hover:bg-teal-500/5' },
                  { name: 'Cintas', href: '/productos?categoria=Cintas', icon: Ruler, activeClass: 'bg-blue-500/10 text-blue-700 border-l-2 border-blue-500', hoverClass: 'hover:bg-blue-500/5' },
                  { name: 'Protección', href: '/productos?categoria=Protección', icon: CircleDot, activeClass: 'bg-purple-500/10 text-purple-700 border-l-2 border-purple-500', hoverClass: 'hover:bg-purple-500/5' },
                  { name: 'Bolsas', href: '/productos?categoria=Bolsas', icon: ShoppingBag, activeClass: 'bg-green-500/10 text-green-700 border-l-2 border-green-500', hoverClass: 'hover:bg-green-500/5' },
                ].map((cat) => {
                  const isActive = cat.name === 'Todos' ? false : cat.name === product.categoria;
                  const CatIcon = cat.icon;
                  return (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive ? cat.activeClass : `text-foreground/70 ${cat.hoverClass}`
                      }`}
                    >
                      <CatIcon className={`w-4 h-4 shrink-0 ${isActive ? '' : 'text-muted-foreground/60'}`} />
                      <span>{cat.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* IMAGE SECTION — Desktop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:sticky lg:top-[96px] lg:self-start"
          >
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="relative w-full min-h-[400px] xl:min-h-[480px] bg-gradient-to-br from-primary/5 via-muted to-secondary/5 rounded-2xl border border-border/50 overflow-hidden cursor-zoom-in group"
            >
              {/* Image counter */}
              {(() => {
                console.log("RENDER PRODUCT IMAGENES:", product.imagenes, typeof product.imagenes);
                return null;
              })()}
              <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-black/30 backdrop-blur-sm text-white text-[11px] font-medium rounded-lg">
                {currentImageIndex + 1}/{product.imagenes?.length ?? 0}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                {product.imagenes && product.imagenes.length > 0 ? (
                  <div className="w-full h-full relative">
                    <Image
                      src={product.imagenes[currentImageIndex]}
                      alt={product.nombre}
                      fill
                      priority
                      className="object-contain p-4 xl:p-8"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-3xl flex items-center justify-center">
                    <Package className="w-14 h-14 text-primary/50" />
                  </div>
                )}
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-black/20 backdrop-blur-sm text-white text-xs rounded-lg">
                <ZoomIn className="w-3.5 h-3.5" />
                Toca para ampliar
              </div>
            </button>
            {/* Thumbnail strip — BELOW main image, horizontal row */}
            {(product.imagenes?.length || 0) > 1 && (
              <div className="hidden lg:grid grid-cols-4 gap-2 mt-2">
                {(product.imagenes || []).map((imgUrl, index) => (
                    <button
                      key={index}
                      onClick={() => { setCurrentImageIndex(index); setIsZoomed(false); }}
                      className={`relative aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-xl border-2 flex items-center justify-center overflow-hidden transition-all hover:opacity-80 ${
                        currentImageIndex === index
                          ? 'border-primary shadow-sm'
                          : 'border-border/50'
                      }`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`${product.nombre} - vista ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </button>
                  ))}
              </div>
            )}
          </motion.div>

          {/* PRODUCT INFO — Desktop */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-5"
          >
            {/* Desktop Title + Tags */}
            <div>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(product.etiquetas || []).map((etiqueta) => (
                      <span key={etiqueta} className="px-3 py-1 text-xs font-medium text-primary bg-primary/8 rounded-lg">{etiqueta}</span>
                    ))}
                  </div>
                  <h1 className="text-2xl xl:text-3xl font-extrabold text-foreground leading-tight">{product.nombre}</h1>
                  <p className="text-sm text-muted-foreground mt-1">{product.material} · {product.categoria}</p>
                </div>
                <motion.button whileTap={{ scale: 0.7 }} onClick={handleToggleFavorite}
                  className="ml-3 p-3 rounded-xl border border-border/50 hover:border-red-200 hover:bg-red-50 transition-all shrink-0">
                  <motion.div animate={heartActive ? { scale: [1, 1.4, 0.8, 1.15, 1], rotate: [0, -10, 10, -5, 0] } : { scale: 1 }}>
                    <Heart className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-foreground/30'}`} />
                  </motion.div>
                </motion.button>
              </div>
            </div>

            {/* Description — Collapsible */}
            <div className="bg-muted/30 rounded-xl p-4">
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${descExpanded ? 'max-h-[2000px]' : 'max-h-[72px]'}`}>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.descripcion}
                </p>
              </div>
              {product.descripcion.length > 120 && (
                <button
                  onClick={() => setDescExpanded(!descExpanded)}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700 active:text-green-800 transition-colors"
                >
                  {descExpanded ? 'Ver menos' : 'Ver más'}
                  {descExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            <SavingsMessage
              selectedPack={selectedPack}
              basePrice={product.precio}
              allPacks={product.packs}
            />

            {/* Pack Selector */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Elige tu Pack</h3>
              <div className="grid grid-cols-3 gap-3">
                {(product.packs || []).map((pack, i) => {
                  const originalPrice = product.precio * pack.cantidad;
                  const isSelected = selectedPackIndex === i;
                  return (
                    <motion.button
                      key={pack.cantidad}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedPackIndex(i)}
                      className={`relative p-3 rounded-xl border-2 transition-all text-center ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <p className="text-xs text-muted-foreground line-through">
                        {formatPrice(originalPrice)}
                      </p>
                      <p className="text-base font-extrabold text-primary">
                        {formatPrice(pack.precio)}
                      </p>
                      <div className="flex items-center justify-center gap-1.5 mt-0.5">
                        <p className="text-[10px] text-foreground/70 uppercase font-medium">
                          {pack.cantidad} UDS
                        </p>
                        {pack.descuento > 0 && (
                          <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold bg-green-100 text-green-700 rounded-md">
                            -{pack.descuento}%
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Color & Size */}
            <div className="flex gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-2">Color</h3>
                <div className="flex flex-wrap gap-1.5">
                  {(product.colores || []).map((color) => (
                    <button key={color} onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-all min-h-[36px] ${
                        selectedColor === color || (!selectedColor && (product.colores || [])[0] === color)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-foreground/70'
                      }`}
                    >{color}</button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-2">Medida</h3>
                <div className="flex flex-wrap gap-1.5">
                  {(product.medidas || []).map((medida) => (
                    <button key={medida} onClick={() => setSelectedMedida(medida)}
                      className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-all min-h-[36px] ${
                        selectedMedida === medida || (!selectedMedida && (product.medidas || [])[0] === medida)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-foreground/70'
                      }`}
                    >{medida}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── WhatsApp CTA Banner ── */}
            <div className="bg-gradient-to-r from-[#25D366]/8 to-[#25D366]/3 border border-[#25D366]/20 rounded-2xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#25D366]/15 rounded-xl flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">¿Requieres una cotización personalizada o por volumen?</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Escríbenos y te respondemos al instante.</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleWhatsAppCotizacion}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold rounded-xl shadow-lg shadow-[#25D366]/25 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Cotización Personalizada por WhatsApp
              </motion.button>
            </div>

            {/* TABS */}
            <div>
              <div className="flex border-b border-border/50 overflow-x-auto">
                {tabs.map((tab) => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] ${
                      activeTab === tab.key ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                    {tab.label}
                    {activeTab === tab.key && (
                      <motion.div layoutId="tab-underline-d" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }} className="py-4">
                  {activeTab === 'descripcion' && (
                    <div>
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${descExpanded ? 'max-h-[2000px]' : 'max-h-[60px]'}`}>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Producto ideal para uso en ecommerce, tiendas por departamento y logística empresarial.
                          Diseñado para proteger tus mercancías durante el transporte y almacenamiento.
                          Fabricado con materiales de alta calidad que cumplen con los estándares internacionales de embalaje.
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                          {product.descripcion}
                        </p>
                      </div>
                      <button
                        onClick={() => setDescExpanded(!descExpanded)}
                        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700 active:text-green-800 transition-colors"
                      >
                        {descExpanded ? 'Ver menos' : 'Ver más'}
                        {descExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                  {activeTab === 'especificaciones' && (
                    <div className="space-y-2">
                      {[
                        ['Material', product.material],
                        ['Categoría', product.categoria],
                        ['Medidas disponibles', product.medidas.join(', ')],
                        ['Colores disponibles', product.colores.join(', ')],
                        ['Packs disponibles', (product.packs || []).map(p => `${p.cantidad} uds (-${p.descuento}%)`).join(', ')],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between py-2.5 border-b border-border/30 text-sm">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-medium text-foreground text-right ml-4">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'envios' && (
                    <div className="space-y-5">
                      <div>
                        <h4 className="text-sm font-bold text-foreground mb-3">Envíos a Todo el Perú</h4>
                        <div className="bg-primary/5 rounded-xl border border-primary/10 overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-primary/10">
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Cantidad</th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Tipo de Envío</th>
                              </tr>
                            </thead>
                            <tbody>
                              {shippingTiers.map((tier) => (
                                <tr key={tier.label} className="border-b border-primary/5 last:border-0">
                                  <td className="px-4 py-2 font-medium text-foreground">{tier.label}</td>
                                  <td className="px-4 py-2 text-muted-foreground">{tier.info}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {[
                          { icon: Truck, title: 'Despacho en 24h', desc: 'Pedidos realizados antes de las 2pm se despachan el mismo día para Lima Metropolitana. Envíos a provincias en 48-72 horas hábiles.' },
                          { icon: Shield, title: 'Envío Seguro', desc: 'Todos nuestros paquetes incluyen protección adicional contra golpes y manipulación durante el transporte.' },
                          { icon: Phone, title: 'Seguimiento de tu pedido', desc: 'Recibe notificaciones por WhatsApp con el estado de tu envío y coordenadas de delivery en tiempo real.' },
                        ].map(({ icon: Icon, title, desc }) => (
                          <div key={title} className="flex gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-foreground">{title}</h4>
                              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === 'faq' && (
                    <div className="space-y-0">
                      {productFAQs.map((faq, i) => (
                        <div key={i} className="border-b border-gray-200 last:border-0">
                          <button
                            onClick={() => setFaqOpen(prev => ({ ...prev, [i]: !prev[i] }))}
                            className="w-full flex items-center justify-between py-3 px-1 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors text-left"
                          >
                            <span>{faq.q}</span>
                            <span className="text-green-600 shrink-0 ml-2">
                              {faqOpen[i] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </span>
                          </button>
                          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${faqOpen[i] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <p className="pb-3 px-1 text-sm text-gray-600 leading-relaxed pl-4">
                              {faq.a}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Desktop benefits */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Truck, label: 'Envío Rápido' },
                { icon: Shield, label: 'Garantía de Calidad' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1.5 p-3 bg-muted/30 rounded-xl text-center">
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ============================================================ */}
        {/* MOBILE: Single-column layout (visible below md)              */}
        {/* ============================================================ */}
        <div className="lg:hidden space-y-4">

          {/* ── Mobile Product Info ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-3"
          >
            {/* Tags + Title */}
            <div>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {product.etiquetas.slice(0, 3).map((etiqueta) => (
                  <span key={etiqueta} className="px-2 py-0.5 text-[10px] font-medium text-primary bg-primary/8 rounded-md">{etiqueta}</span>
                ))}
                <span className="px-2 py-0.5 text-[10px] font-medium text-muted-foreground bg-muted/50 rounded-md">{product.categoria}</span>
              </div>
              <h1 className="text-lg font-bold text-foreground leading-tight">{product.nombre}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{product.material}</p>
            </div>

            {/* ── Mobile Image Gallery (ABOVE product info) ── */}
            <div className="space-y-2">
              {/* Main Image — compact */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative w-full aspect-[4/3] max-h-[260px] bg-gradient-to-br from-primary/5 via-muted to-secondary/5 rounded-2xl border border-border/50 overflow-hidden"
              >
                {/* Nav Arrows */}
                {(product.imagenes?.length || 0) > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex((prev) => (prev - 1 + (product.imagenes?.length || 0)) % (product.imagenes?.length || 0));
                        setIsZoomed(false);
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm active:bg-white/90 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-foreground/70" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex((prev) => (prev + 1) % (product.imagenes?.length || 0));
                        setIsZoomed(false);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/70 backdrop-blur-sm rounded-full shadow-sm active:bg-white/90 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-foreground/70" />
                    </button>
                  </>
                )}

                {/* Image counter badge */}
                <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-black/30 backdrop-blur-sm text-white text-[10px] font-medium rounded-md">
                  {currentImageIndex + 1}/{(product.imagenes?.length || 0)}
                </div>

                {/* Placeholder content */}
                <div
                  className="absolute inset-0 flex items-center justify-center cursor-zoom-in"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  {product.imagenes && product.imagenes.length > 0 ? (
                      <div className="w-full h-full relative">
                        <Image
                          src={product.imagenes[currentImageIndex]}
                          alt={product.nombre}
                          fill
                          priority
                          className="object-contain p-4"
                          sizes="100vw"
                        />
                      </div>
                    ) : (
                      <div className={`flex items-center justify-center transition-all duration-300 ${
                        isZoomed ? 'w-24 h-24' : 'w-16 h-16'
                      }`}>
                        <div className="w-full h-full bg-gradient-to-br from-primary/15 to-secondary/15 rounded-3xl flex items-center justify-center">
                          <Package className="w-8 h-8 text-primary/50" />
                        </div>
                      </div>
                    )}
                </div>

                {/* Tap to expand */}
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-black/30 backdrop-blur-sm text-white text-[11px] rounded-lg active:bg-black/40 transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  Ampliar
                </button>
              </motion.div>

              {/* Image grid — show all images as a visible grid */}
              {(product.imagenes?.length || 0) > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {(product.imagenes || []).map((imgUrl, index) => (
                    <button
                      key={index}
                      onClick={() => { setCurrentImageIndex(index); setIsZoomed(false); }}
                      className={`relative aspect-square rounded-xl border-2 flex items-center justify-center overflow-hidden transition-all ${
                        currentImageIndex === index
                          ? 'border-primary shadow-sm'
                          : 'border-border/50 bg-muted/30'
                      }`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`${product.nombre} - vista ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <SavingsMessage
              selectedPack={selectedPack}
              basePrice={product.precio}
              allPacks={product.packs}
            />

            {/* Pack Selector — compact for mobile */}
            <div>
              <h3 className="text-xs font-semibold text-foreground mb-2">Elige tu Pack</h3>
              <div className="grid grid-cols-3 gap-1.5">
                {(product.packs || []).map((pack, i) => {
                  const isSelected = selectedPackIndex === i;
                  return (
                    <motion.button
                      key={pack.cantidad}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedPackIndex(i)}
                      className={`p-2 rounded-xl border-2 transition-all text-center ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border'
                      }`}
                    >
                      <p className="text-[10px] text-muted-foreground line-through">
                        {formatPrice(product.precio * pack.cantidad)}
                      </p>
                      <p className="text-sm font-extrabold text-primary">{formatPrice(pack.precio)}</p>
                      <div className="flex items-center justify-center gap-1 mt-0.5">
                        <span className="text-[9px] text-foreground/70 uppercase font-medium">{pack.cantidad} UDS</span>
                        {pack.descuento > 0 && (
                          <span className="text-[9px] font-bold text-primary">-{pack.descuento}%</span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Color & Medida — stacked on mobile */}
            <div className="space-y-3">
              <div>
                <h3 className="text-xs font-semibold text-foreground mb-1.5">Color</h3>
                <div className="flex flex-wrap gap-1.5">
                  {(product.colores || []).map((color) => (
                    <button key={color} onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-all ${
                        selectedColor === color || (!selectedColor && (product.colores || [])[0] === color)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-foreground/70'
                      }`
                    }>{color}</button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-foreground mb-1.5">Medida</h3>
                <div className="flex flex-wrap gap-1.5">
                  {(product.medidas || []).map((medida) => (
                    <button key={medida} onClick={() => setSelectedMedida(medida)}
                      className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-all ${
                        selectedMedida === medida || (!selectedMedida && (product.medidas || [])[0] === medida)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-foreground/70'
                      }`
                    }>{medida}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Mobile WhatsApp CTA Banner ── */}
            <div className="bg-gradient-to-r from-[#25D366]/8 to-[#25D366]/3 border border-[#25D366]/20 rounded-xl p-3 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 bg-[#25D366]/15 rounded-lg flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">¿Requieres una cotización personalizada o por volumen?</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Escríbenos y te respondemos al instante.</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleWhatsAppCotizacion}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-semibold rounded-xl shadow-lg shadow-[#25D366]/25 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Cotización Personalizada por WhatsApp
              </motion.button>
            </div>

            {/* Mobile Tabs */}
            <div>
              <div className="flex border-b border-border/50 overflow-x-auto">
                {tabs.map((tab) => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`relative px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors min-h-[40px] ${
                      activeTab === tab.key ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                    {tab.label}
                    {activeTab === tab.key && (
                      <motion.div layoutId="tab-underline-m" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }} className="py-3">
                  {activeTab === 'descripcion' && (
                    <div>
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${descExpanded ? 'max-h-[2000px]' : 'max-h-[48px]'}`}>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Producto ideal para uso en ecommerce, tiendas por departamento y logística empresarial.
                          Diseñado para proteger tus mercancías durante el transporte y almacenamiento.
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">
                          {product.descripcion}
                        </p>
                      </div>
                      <button
                        onClick={() => setDescExpanded(!descExpanded)}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700 active:text-green-800 transition-colors"
                      >
                        {descExpanded ? 'Ver menos' : 'Ver más'}
                        {descExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                  {activeTab === 'especificaciones' && (
                    <div className="space-y-1.5">
                      {[
                        ['Material', product.material],
                        ['Categoría', product.categoria],
                        ['Medidas', product.medidas.join(', ')],
                        ['Colores', product.colores.join(', ')],
                        ['Packs', (product.packs || []).map(p => `${p.cantidad} uds (-${p.descuento}%)`).join(', ')],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between py-2 border-b border-border/30 text-xs">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-medium text-foreground text-right ml-3 max-w-[60%]">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'envios' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-foreground mb-2">Envíos a Todo el Perú</h4>
                        <div className="bg-primary/5 rounded-xl border border-primary/10 overflow-hidden">
                          <div className="divide-y divide-primary/5">
                            {shippingTiers.map((tier) => (
                              <div key={tier.label} className="flex justify-between px-3 py-2 text-xs">
                                <span className="font-medium text-foreground">{tier.label}</span>
                                <span className="text-muted-foreground">{tier.info}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        {[
                          { icon: Truck, title: 'Despacho en 24h', desc: 'Pedidos antes de las 2pm se despachan el mismo día (Lima). Provincias en 48-72h.' },
                          { icon: Shield, title: 'Envío Seguro', desc: 'Protección adicional contra golpes y manipulación durante el transporte.' },
                          { icon: Phone, title: 'Seguimiento', desc: 'Notificaciones por WhatsApp con el estado de tu envío en tiempo real.' },
                        ].map(({ icon: Icon, title, desc }) => (
                          <div key={title} className="flex gap-2.5">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-foreground">{title}</h4>
                              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === 'faq' && (
                    <div className="space-y-0">
                      {productFAQs.map((faq, i) => (
                        <div key={i} className="border-b border-gray-200 last:border-0">
                          <button
                            onClick={() => setFaqOpen(prev => ({ ...prev, [i]: !prev[i] }))}
                            className="w-full flex items-center justify-between py-2.5 px-1 text-xs font-semibold text-gray-900 hover:bg-gray-50 transition-colors text-left"
                          >
                            <span>{faq.q}</span>
                            <span className="text-green-600 shrink-0 ml-2">
                              {faqOpen[i] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </span>
                          </button>
                          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${faqOpen[i] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <p className="pb-2.5 px-1 text-xs text-gray-600 leading-relaxed pl-4">
                              {faq.a}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ============================================================ */}
        {/* Related Products — Horizontal scroll carousel                */}
        {/* ============================================================ */}
        {relatedProducts.length > 0 && (
          <RelatedProductsCarousel products={relatedProducts} />
        )}

      </div>

      {/* ============================================================ */}
      {/* UNIFIED BOTTOM BAR: Total Pack + WhatsApp + Agregar */}
      {/* ============================================================ */}
      <div className="fixed bottom-[calc(68px+env(safe-area-inset-bottom,0px))] md:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-border/40 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-3 py-2">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          {/* Total Pack — visible on ALL devices */}
          <div className="flex flex-col items-end shrink-0 mr-1">
            <span className="text-[9px] sm:text-[10px] text-muted-foreground uppercase font-medium leading-none">Total pack</span>
            <span className="text-base sm:text-lg font-extrabold text-primary leading-tight">
              {formatPrice(selectedPack?.precio || 0)}
            </span>
          </div>

          {/* Botón Agregar al Carrito */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAddToCart}
            disabled={addedToCart}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-sm font-semibold rounded-xl transition-all min-h-[44px] ${
              addedToCart
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
            }`}
          >
            {addedToCart ? (
              <><Check className="w-4 h-4" /> ¡Listo!</>
            ) : (
              <><ShoppingCart className="w-4 h-4" /> <span>Agregar al Carrito</span></>
            )}
          </motion.button>

          {/* WhatsApp — mobile: icon circle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleWhatsApp}
            className="sm:hidden flex-shrink-0 w-11 h-11 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/25"
            aria-label="Cotizar por WhatsApp"
          >
            <MessageCircle className="w-5 h-5 text-white" />
          </motion.button>

          {/* WhatsApp — desktop: full button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleWhatsApp}
            className="hidden sm:flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl bg-[#25D366] text-white shadow-lg shadow-[#25D366]/20 min-h-[44px] shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Cotizar por WhatsApp</span>
          </motion.button>
        </div>
      </div>

      <LightboxGallery product={product} isOpen={isLightboxOpen} onClose={() => setIsLightboxOpen(false)} />
    </div>
  );
}