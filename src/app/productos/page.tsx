'use client';

import { useState, useMemo, useCallback, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  X,
  Package,
  ChevronDown,
  Grid3X3,
  List,
  Box,
  Layers,
  Ruler,
  CircleDot,
  ShoppingBag,
  LayoutGrid,
  Filter,
} from 'lucide-react';
import ProductCard from '@/components/product-card';
import ImmersiveBanner from '@/components/immersive-banner';
import { useScrollSpy } from '@/lib/use-scroll-spy';
import type { Product } from '@/lib/types';

// Fallback type reference
const visibleProducts: Product[] = [];

// ── SEO meta data por categoría ────────────────────────────────────
const CATEGORY_META: Record<string, { title: string; description: string }> = {
  Cajas: {
    title: 'Cajas de Embalaje | GUDSTOR PACK',
    description: 'Cajas de cartón corrugado, autoarmables, doble pared, grado alimenticio y más. Compra por mayor con descuentos en GUDSTOR PACK. Envío a todo Perú.',
  },
  Films: {
    title: 'Films y Plásticos de Embalaje | GUDSTOR PACK',
    description: 'Film estirable, termoencogible, antiestático, alimentario y microperforado. Soluciones de paletizado y protección industrial en GUDSTOR PACK.',
  },
  Cintas: {
    title: 'Cintas Adhesivas de Empaque | GUDSTOR PACK',
    description: 'Cintas adhesivas profesionales, de papel kraft, industrial reforzada, doble cara e impresa personalizada. Precios mayoristas en GUDSTOR PACK.',
  },
  'Protección': {
    title: 'Materiales de Protección para Embalaje | GUDSTOR PACK',
    description: 'Plástico burbuja, espuma poliestireno, papel de empaque, relleno ecológico y protectores de esquinas. Protege tus mercancías con GUDSTOR PACK.',
  },
  Bolsas: {
    title: 'Bolsas de Embalaje | GUDSTOR PACK',
    description: 'Bolsas de envío courier, kraft, zip lock, troqueladas, no tejidas, biodegradables y más. Soluciones de empaque mayoristas en GUDSTOR PACK.',
  },
};

const DEFAULT_META = {
  title: 'Catálogo de Productos de Embalaje | GUDSTOR PACK',
  description: 'Descubre nuestra amplia variedad de cajas, films, cintas, bolsas y materiales de protección para embalaje. Precios mayoristas con descuentos. Envío a todo Perú.',
};

// ── Iconos por categoría ──────────────────────────────────────────
const CATEGORY_ICONS: Record<string, typeof Box> = {
  Cajas: Box,
  Films: Layers,
  Cintas: Ruler,
  'Protección': CircleDot,
  Bolsas: ShoppingBag,
};

// ── Colores por categoría ──────────────────────────────────────────
const CATEGORY_COLORS: Record<string, { bg: string; active: string; icon: string }> = {
  Cajas:       { bg: 'bg-amber-500/8',   active: 'bg-amber-500/15 text-amber-700',   icon: 'text-amber-600' },
  Films:       { bg: 'bg-teal-500/8',    active: 'bg-teal-500/15 text-teal-700',     icon: 'text-teal-600' },
  Cintas:      { bg: 'bg-blue-500/8',    active: 'bg-blue-500/15 text-blue-700',    icon: 'text-blue-600' },
  'Protección':{ bg: 'bg-purple-500/8', active: 'bg-purple-500/15 text-purple-700', icon: 'text-purple-600' },
  Bolsas:      { bg: 'bg-green-500/8',   active: 'bg-green-500/15 text-green-700',  icon: 'text-green-600' },
};

// ── Subcategorías reales basadas en el catálogo ─────────────────────
const SUBCATEGORY_MAP: Record<string, string[]> = {
  Cajas: [
    'Archiveras',
    'Corrugadas',
    'Doble Corrugado',
    'E-commerce',
    'Pizza',
  ],
  Films: [
    'Transparente',
    'Negro',
  ],
  Cintas: [
    'Embalaje',
    'Fragil / Seguridad',
  ],
  Protección: [
    'Burbupack',
    'Cartón Corrugado',
    'Planchas',
    'Papel y Viruta',
  ],
  Bolsas: [],
};

// ── Mapeo de subcategorías a patrones de filtrado (tags + nombre + material) ──
const SUBCATEGORY_TAG_MAP: Record<string, string[]> = {
  // Cajas
  'Archiveras': ['archivo', 'oficina', 'organización', 'archivera'],
  'Corrugadas': ['professional', 'resistente'],
  'Doble Corrugado': ['doble pared', 'reforzado', 'industrial', 'doble corrugado'],
  'E-commerce': ['ecommerce', 'envío', 'correría', 'postal'],
  'Pizza': ['alimentario', 'delivery', 'caliente', 'pizza'],
  // Films
  'Transparente': ['transparente'],
  'Negro': ['opaco', 'negro'],
  // Cintas
  'Embalaje': ['cierre', 'empaque', 'transparente'],
  'Fragil / Seguridad': ['fragil', 'seguridad', 'advertencia'],
  // Protección
  'Burbupack': ['burbupack', 'burbuja'],
  'Cartón Corrugado': ['carton grueso', 'cartón grueso'],
  'Planchas': ['plancha', 'tecnopor', 'microcorrugado'],
  'Papel y Viruta': ['papel para embalar', 'viruta'],
};

function matchSubcategory(product: (typeof visibleProducts)[0], subcat: string): boolean {
  const patterns = SUBCATEGORY_TAG_MAP[subcat];
  if (!patterns) return false;
  const productTags = (product.etiquetas || []).map((t) => t.toLowerCase());
  const nameLower = product.nombre.toLowerCase();
  const materialLower = product.material.toLowerCase();

  return patterns.some((pattern) => {
    const p = pattern.toLowerCase();
    return productTags.includes(p) || nameLower.includes(p) || materialLower.includes(p);
  });
}

// ── Sidebar de Categorías con Subcategorías Expandibles ────────────
function CategorySidebar({
  selectedCategory,
  selectedSubcategory,
  onCategoryClick,
  onSubcategoryClick,
  onClearAll,
  isMobile = false,
  onClose,
  products,
}: {
  selectedCategory: string;
  selectedSubcategory: string;
  onCategoryClick: (cat: string) => void;
  onSubcategoryClick: (cat: string, sub: string) => void;
  onClearAll: () => void;
  isMobile?: boolean;
  onClose?: () => void;
  products: Product[];
}) {
  const categories = useMemo(() => {
    return ['Cajas', 'Films', 'Cintas', 'Protección', 'Bolsas'];
  }, []);

  // ── Exclusive accordion: only one category expanded at a time ──
  const [expandedCat, setExpandedCat] = useState<string | null>(
    selectedCategory || null
  );

  // Sync accordion with parent selectedCategory (e.g. breadcrumb clicks)
  useEffect(() => {
    if (selectedCategory) {
      setExpandedCat(selectedCategory);
    }
  }, [selectedCategory]);

  const handleCategoryClickLocal = (cat: string) => {
    onCategoryClick(cat);
    // Exclusive accordion: same cat → collapse, different cat → expand
    setExpandedCat((prev) => (prev === cat ? null : cat));
  };

  const handleClear = () => {
    onClearAll();
    setExpandedCat(null);
    if (isMobile && onClose) onClose();
  };

  const hasActiveFilter = selectedCategory || selectedSubcategory;

  return (
    <div className="flex flex-col h-full">
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-base font-bold text-foreground">Categorías</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Desktop Title */}
      {!isMobile && (
        <div className="flex items-center gap-2.5 mb-4 shrink-0">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Filter className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Categorías
          </h3>
        </div>
      )}

      {/* Scrollable content */}
      <div className={`flex-1 overflow-y-auto ${isMobile ? 'px-4 pb-6' : ''}`}>
        {/* Clear filters */}
        {hasActiveFilter && (
          <button
            onClick={handleClear}
            className="w-full text-left px-3 py-2 mb-3 text-xs font-semibold text-primary bg-primary/5 border border-primary/15 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <X className="w-3 h-3" />
              Limpiar filtros
            </span>
          </button>
        )}

        {/* All products button */}
        <button
          onClick={handleClear}
          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-2 ${
            !selectedCategory
              ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
              : 'text-foreground/70 hover:bg-muted/60 hover:text-foreground'
          }`}
        >
          <span className="flex items-center gap-2.5">
            <LayoutGrid className="w-4 h-4" />
            <span>Todos los productos</span>
            <span className={`ml-auto text-[11px] font-semibold ${!selectedCategory ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
              {products.length}
            </span>
          </span>
        </button>

        {/* Categories with expandable subcategories */}
        <div className="space-y-0.5">
          {categories.map((cat) => {
            const isExpanded = expandedCat === cat;
            const isActive = selectedCategory === cat;
            const hasSubActive = selectedCategory === cat && selectedSubcategory;
            const catCount = products.filter((p) => p.categoria === cat).length;
            const subcats = SUBCATEGORY_MAP[cat] || [];
            const Icon = CATEGORY_ICONS[cat] || Box;
            const colors = CATEGORY_COLORS[cat] || { bg: 'bg-muted/50', active: 'bg-primary/15 text-primary', icon: 'text-primary' };

            return (
              <div key={cat} className="rounded-xl overflow-hidden">
                {/* Category row */}
                <button
                  onClick={() => handleCategoryClickLocal(cat)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2.5 group ${
                    isActive
                      ? `${colors.active} font-semibold shadow-sm`
                      : 'text-foreground/80 hover:bg-muted/40 font-medium'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-white/30' : `${colors.bg}`
                  }`}>
                    <Icon className={`w-3.5 h-3.5 ${isActive ? '' : colors.icon}`} />
                  </div>
                  <span className="flex-1 truncate">{cat}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-white/20' : 'bg-muted/50 text-muted-foreground'
                    }`}>
                      {catCount}
                    </span>
                    {subcats.length > 0 && (
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className={`${isActive ? 'text-white/70' : 'text-muted-foreground/50'}`}
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </motion.span>
                    )}
                  </div>
                </button>

                {/* Subcategories — expandable */}
                <AnimatePresence initial={false}>
                  {isExpanded && subcats.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className={`ml-[18px] pl-3 ${hasSubActive ? 'border-l-2 border-primary/50' : 'border-l-2 border-border/40'} space-y-px py-1.5`}
                      >
                        {subcats.map((sub) => {
                          const isSubActive = selectedSubcategory === sub;
                          const subCount = products.filter(
                            (p) => p.categoria === cat && matchSubcategory(p, sub)
                          ).length;

                          if (subCount === 0) return null;

                          return (
                            <button
                              key={sub}
                              onClick={() => {
                                onSubcategoryClick(cat, sub);
                                if (isMobile && onClose) onClose();
                              }}
                              className={`w-full text-left px-3 py-[7px] rounded-lg text-[13px] transition-all flex items-center justify-between ${
                                isSubActive
                                  ? 'bg-primary/10 text-primary font-medium shadow-sm'
                                  : 'text-foreground/55 hover:bg-muted/40 hover:text-foreground/80'
                              }`}
                            >
                              <span className="flex items-center gap-1.5">
                                <span className={`w-1 h-1 rounded-full shrink-0 ${isSubActive ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                                <span>{sub}</span>
                              </span>
                              <span className={`text-[10px] font-semibold ${isSubActive ? 'text-primary/70' : 'text-muted-foreground/50'}`}>
                                {subCount}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main Content ───────────────────────────────────────────────────
function ProductosContent({ initialProducts }: { initialProducts: typeof visibleProducts }) {
  const searchParams = useSearchParams();

  // ── Read URL params on mount (deep linking from WhatsApp/shared links) ──
  const categoriaParam = searchParams.get('categoria') || '';
  const subcategoriaParam = searchParams.get('subcategoria') || '';

  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(categoriaParam);
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategoriaParam);
  const [sortBy, setSortBy] = useState('nombre');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'comfort' | 'compact' | 'list'>('comfort');
  const isFirstRender = useRef(true);

  useScrollSpy({
    ids: ['catalogo', 'productos-listado', 'sidebar-filtros'],
    offset: '100px',
  });

  // ── Sync state → URL via Next.js router (keeps internal state in sync) ──
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const params = new URLSearchParams();
    if (selectedCategory) params.set('categoria', selectedCategory);
    if (selectedSubcategory) params.set('subcategoria', selectedSubcategory);
    const qs = params.toString();
    router.replace(`/productos${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [selectedCategory, selectedSubcategory, router]);

  // ── Dynamic browser title + meta description ──
  useEffect(() => {
    const meta = CATEGORY_META[selectedCategory] || DEFAULT_META;
    const pageTitle = selectedSubcategory
      ? `${selectedSubcategory} | ${selectedCategory} | GUDSTOR PACK`
      : meta.title;
    document.title = pageTitle;
    // Update meta description
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) {
      descEl.setAttribute('content', meta.description);
    }
    // Update canonical URL
    const canonEl = document.querySelector('link[rel="canonical"]');
    if (canonEl) {
      const params = new URLSearchParams();
      if (selectedCategory) params.set('categoria', selectedCategory);
      if (selectedSubcategory) params.set('subcategoria', selectedSubcategory);
      const qs = params.toString();
      canonEl.setAttribute('href', `https://gudstor-pack.vercel.app/productos${qs ? `?${qs}` : ''}`);
    }
  }, [selectedCategory, selectedSubcategory]);

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (selectedCategory) {
      result = result.filter((p) => p.categoria === selectedCategory);
    }
    if (selectedSubcategory && selectedCategory) {
      result = result.filter((p) => matchSubcategory(p, selectedSubcategory));
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'destacados':
          return (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0) || a.nombre.localeCompare(b.nombre);
        case 'precio-asc':
          return a.precio - b.precio;
        case 'precio-desc':
          return b.precio - a.precio;
        case 'nombre':
        default:
          return a.nombre.localeCompare(b.nombre);
      }
    });

    return result;
  }, [selectedCategory, selectedSubcategory, sortBy]);

  // Ref to always read latest state inside stable callbacks (prevents stale closures)
  const filterRef = useRef({ selectedCategory: '', selectedSubcategory: '' });
  filterRef.current = { selectedCategory, selectedSubcategory };

  const handleCategoryClick = useCallback((cat: string) => {
    const { selectedCategory: prev } = filterRef.current;
    if (cat === prev) {
      setSelectedCategory('');
      setSelectedSubcategory('');
    } else {
      setSelectedCategory(cat);
      setSelectedSubcategory('');
    }
  }, []);

  const handleSubcategoryClick = useCallback((cat: string, sub: string) => {
    const { selectedCategory: prevCat, selectedSubcategory: prevSub } = filterRef.current;
    if (sub === prevSub && cat === prevCat) {
      setSelectedSubcategory('');
    } else {
      setSelectedCategory(cat);
      setSelectedSubcategory(sub);
    }
  }, []);

  const clearAll = useCallback(() => {
    setSelectedCategory('');
    setSelectedSubcategory('');
  }, []);

  const activeFiltersCount = (selectedCategory ? 1 : 0) + (selectedSubcategory ? 1 : 0);

  const breadcrumbs = useMemo(() => {
    const parts: { label: string; action?: () => void }[] = [];
    parts.push({ label: 'Inicio' });
    parts.push({ label: 'Productos' });
    if (selectedCategory) {
      parts.push({
        label: selectedCategory,
        action: () => {
          setSelectedSubcategory('');
        },
      });
    }
    if (selectedSubcategory) {
      parts.push({ label: selectedSubcategory });
    }
    return parts;
  }, [selectedCategory, selectedSubcategory]);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Immersive Hero Banner ─────────────────────────────── */}
      <ImmersiveBanner
        title={selectedSubcategory || (selectedCategory ? selectedCategory : 'Catálogo de Productos')}
        subtitle={`${filteredProducts.length} ${filteredProducts.length === 1 ? 'producto' : 'productos'} disponibles`}
        breadcrumb={breadcrumbs.map(b => ({ label: b.label, href: b.action ? '#' : undefined }))}
      />

      {/* ── Main Layout: Sidebar + Products ─────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6 sm:pb-8">
        {/* Toolbar: Filter + Sort + View Mode — sticky below banner */}
        <div id="catalogo" className="flex items-center gap-2 mb-4 sm:mb-6">
          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isFilterOpen
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                : 'bg-card border border-border hover:bg-muted/50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Categorías</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className="flex-1" />

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-card border border-border rounded-xl px-4 py-2.5 pr-8 text-sm font-medium outline-none focus:border-primary cursor-pointer"
            >
              <option value="destacados">Más vendidos</option>
              <option value="nombre">Nombre A-Z</option>
              <option value="precio-asc">Precio: Menor a Mayor</option>
              <option value="precio-desc">Precio: Mayor a Menor</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* View Mode */}
          <div className="flex items-center bg-card border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('comfort')}
              className={`p-2 sm:p-2.5 transition-colors ${viewMode === 'comfort' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label="1 columna"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`p-2 sm:p-2.5 transition-colors ${viewMode === 'compact' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label="2 columnas"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 sm:p-2.5 transition-colors ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label="Lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-6 lg:gap-8">
          {/* ── Desktop Sidebar (sticky, always visible, professional) ── */}
          <aside id="sidebar-filtros" className="hidden lg:block w-[280px] xl:w-[300px] shrink-0">
            <div
              className="sticky top-[96px] bg-card border border-border/60 rounded-2xl shadow-sm shadow-black/[0.03] overflow-hidden"
            >
              <div className="p-5 max-h-[calc(100vh-112px)] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                <CategorySidebar
                  selectedCategory={selectedCategory}
                  selectedSubcategory={selectedSubcategory}
                  onCategoryClick={handleCategoryClick}
                  onSubcategoryClick={handleSubcategoryClick}
                  onClearAll={clearAll}
                  products={initialProducts}
                />
              </div>
            </div>
          </aside>

          {/* ── Mobile Filter Drawer (full-height, professional) ──── */}
          <AnimatePresence>
            {isFilterOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                  onClick={() => setIsFilterOpen(false)}
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                  className="fixed top-0 left-0 bottom-0 z-50 w-[300px] max-w-[85vw] bg-white shadow-2xl lg:hidden flex flex-col"
                >
                  <CategorySidebar
                    selectedCategory={selectedCategory}
                    selectedSubcategory={selectedSubcategory}
                    onCategoryClick={handleCategoryClick}
                    onSubcategoryClick={handleSubcategoryClick}
                    onClearAll={clearAll}
                    isMobile
                    onClose={() => setIsFilterOpen(false)}
                    products={initialProducts}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* ── Product Grid ────────────────────────────────────── */}
          <div id="productos-listado" className="flex-1 min-w-0">
            {/* Active filter tags */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {selectedCategory}
                    <button onClick={() => { setSelectedCategory(''); setSelectedSubcategory(''); }}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedSubcategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-full">
                    {selectedSubcategory}
                    <button onClick={() => setSelectedSubcategory('')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === 'comfort'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6'
                    : viewMode === 'compact'
                      ? 'grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-5'
                      : 'space-y-4'
                }
              >
                <AnimatePresence mode="wait">
                  {filteredProducts.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-4">
                  <Package className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Sin resultados</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  No se encontraron productos con los filtros seleccionados. Prueba con otra categoría o
                  subcategoría.
                </p>
                <button
                  onClick={clearAll}
                  className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Ver todos los productos
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { fetchProducts } from '@/lib/fetchCMS';
import fallbackProducts from '@/data/products.json';
import type { Product } from '@/lib/types';

export default async function ProductosPage() {
  const sanityProducts = await fetchProducts();
  const finalProducts = (sanityProducts && sanityProducts.length > 0) ? sanityProducts : fallbackProducts;
  
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <ProductosContent initialProducts={finalProducts as any} />
    </Suspense>
  );
}
