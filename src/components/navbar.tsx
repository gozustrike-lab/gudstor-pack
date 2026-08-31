'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Menu, X, Package, ChevronDown, Heart, Home, Box, Layers, Ruler, CircleDot, ShoppingBag, MessageCircle, BookOpen } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useFavoritesStore } from '@/lib/favorites-store';
import FavoritesPanel from '@/components/favorites-panel';
import products from '@/data/products.json';
import { COMPANY } from '@/config/company';

const visibleProducts = products;

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const totalItems = useCartStore((s) => s.items.reduce((t, i) => t + i.quantity, 0));
  const totalFavorites = useFavoritesStore((s) => s.items.length);

  const searchResults = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    return visibleProducts
      .filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.categoria.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.etiquetas.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .slice(0, 5);
  }, [searchQuery]);

  // Listen for mobile search trigger from bottom nav
  useEffect(() => {
    const handleOpenSearch = () => {
      setIsSearchOpen(true);
      setSearchQuery('');
    };
    window.addEventListener('open-mobile-search', handleOpenSearch);
    return () => window.removeEventListener('open-mobile-search', handleOpenSearch);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when favorites panel is open
  useEffect(() => {
    if (isFavoritesOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFavoritesOpen]);

  const categories = useMemo(() => ['Cajas', 'Films', 'Cintas', 'Protección', 'Bolsas'], []);

  const CATEGORY_DRAWER_ICONS: Record<string, typeof Box> = {
    Cajas: Box, Films: Layers, Cintas: Ruler, 'Protección': CircleDot, Bolsas: ShoppingBag,
  };

  return (
    <>
      {/* ============================================================ */}
      {/* MOBILE HEADER — Transparent on hero, solid on scroll */}
      {/* ============================================================ */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40">
        <div
          className={`transition-all duration-500 ${
            scrolled
              ? 'bg-white/[0.92] backdrop-blur-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border-b border-black/[0.06]'
              : 'bg-white/70 backdrop-blur-[16px] border-b border-black/[0.06]'
          }`}
          style={{ height: 60 }}
        >
          <div className="flex items-center h-full px-4">
            {/* Logo — PNG limpio, sin contenedor restrictivo */}
            <div style={{ flex: '1 1 0%', minWidth: 0 }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-mobile.png"
                  alt="GUDSTOR PACK"
                  className="mobile-logo-img"
                  style={{ height: 18, width: 'auto', maxWidth: 'none', display: 'block' }}
                />
              </Link>
            </div>

            {/* Menú hamburger — único botón en mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl transition-all text-foreground/70 hover:text-amber-600 active:bg-amber-50"
              aria-label="Menú"
            >
              {isMobileMenuOpen ? <X className="w-[22px] h-[22px]" /> : <Menu className="w-[22px] h-[22px]" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 top-[60px] z-50 bg-black/20 backdrop-blur-sm"
                onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute top-[60px] left-0 right-0 z-50 bg-white shadow-lg shadow-black/5"
              >
                <div className="p-3">
                  <div className="flex items-center gap-2 bg-muted/60 rounded-xl px-4 py-3">
                    <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                    <input
                      type="text"
                      placeholder="Buscar productos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                      autoFocus
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="text-muted-foreground">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                {searchResults.length > 0 && (
                  <div className="border-t border-border/40 max-h-[60vh] overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/productos/${product.slug || product.id}`}
                        onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                        className="flex items-center gap-3 px-4 py-3 active:bg-primary/5 transition-colors"
                      >
                        <div className="w-11 h-11 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{product.nombre}</p>
                          <p className="text-xs text-muted-foreground">{product.categoria} · {product.precioUnidad}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    Sin resultados para &quot;{searchQuery}&quot;
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Mobile Menu Drawer — Amazon/Shopify style */}
        <AnimatePresence>
          {isMobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="fixed inset-0 top-[60px] z-50 bg-black/40 backdrop-blur-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                  className="fixed top-[60px] right-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col"
                >
                  {/* Header: MENÚ + ✕ */}
                  <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/50 shrink-0">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      Menú
                    </h2>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-lg transition-colors"
                      aria-label="Cerrar menú"
                    >
                      <X className="w-[18px] h-[18px] text-muted-foreground" />
                    </button>
                  </div>

                  {/* Scrollable content */}
                  <div className="flex-1 overflow-y-auto py-2">
                    {/* ── Navegación principal ── */}
                    <Link
                      href="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-foreground/85 hover:text-primary hover:bg-primary/5 transition-all active:bg-primary/10"
                    >
                      <Home className="w-[18px] h-[18px] text-muted-foreground" />
                      Inicio
                    </Link>

                    <Link
                      href="/productos"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-foreground/85 hover:text-primary hover:bg-primary/5 transition-all active:bg-primary/10"
                    >
                      <BookOpen className="w-[18px] h-[18px] text-muted-foreground" />
                      Catálogo
                    </Link>

                    <Link
                      href="/productos"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-foreground/85 hover:text-primary hover:bg-primary/5 transition-all active:bg-primary/10"
                    >
                      <Package className="w-[18px] h-[18px] text-muted-foreground" />
                      Todos los Productos
                    </Link>

                    {/* ── Separador ── */}
                    <div className="mx-4 my-2 border-t border-border/40" />

                    {/* ── Categorías con iconos ── */}
                    <p className="px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      Categorías
                    </p>
                    {categories.map((cat) => {
                      const Icon = CATEGORY_DRAWER_ICONS[cat] || Package;
                      return (
                        <Link
                          key={cat}
                          href={`/productos?categoria=${encodeURIComponent(cat)}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-2.5 text-sm text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                        >
                          <Icon className="w-4 h-4 text-muted-foreground/60" />
                          {cat}
                        </Link>
                      );
                    })}

                    {/* ── Separador ── */}
                    <div className="mx-4 my-2 border-t border-border/40" />

                    {/* ── Favoritos ── */}
                    <Link
                      href="/favoritos"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-foreground/85 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Heart className="w-[18px] h-[18px] text-muted-foreground" />
                      Favoritos
                      {totalFavorites > 0 && (
                        <span className="ml-auto min-w-[20px] h-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
                          {totalFavorites}
                        </span>
                      )}
                    </Link>

                    {/* ── Carrito ── */}
                    <Link
                      href="/carrito"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-foreground/85 hover:text-primary hover:bg-primary/5 transition-all"
                    >
                      <ShoppingCart className="w-[18px] h-[18px] text-muted-foreground" />
                      Carrito
                      {totalItems > 0 && (
                        <span className="ml-auto min-w-[20px] h-5 flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold rounded-full">
                          {totalItems}
                        </span>
                      )}
                    </Link>

                    {/* ── Contacto WhatsApp ── */}
                    <a
                      href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent('Hola GUDSTOR PACK, necesito información sobre sus productos.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-foreground/85 hover:text-green-600 hover:bg-green-50 transition-all"
                    >
                      <MessageCircle className="w-[18px] h-[18px] text-muted-foreground" />
                      Contacto
                      <span className="ml-auto text-[11px] text-muted-foreground">{COMPANY.whatsappDisplay}</span>
                    </a>
                  </div>
                </motion.div>
              </>
          )}
        </AnimatePresence>
      </header>

      {/* ============================================================ */}
      {/* DESKTOP HEADER — Transparent on hero, solid on scroll    */}
      {/* ============================================================ */}
      <header
        className={`hidden md:block fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-white/[0.92] backdrop-blur-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] border-b border-black/[0.06]'
            : 'bg-white/70 backdrop-blur-[16px] border-b border-black/[0.06]'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[64px]">
            {/* Logo — FULL con slogan */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/logo-full.svg"
                alt="GUDSTOR PACK - Soluciones en Embalaje"
                width={678}
                height={83}
                priority
                className="h-[32px] w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all text-foreground/80 hover:text-amber-600 hover:bg-amber-50/50"
              >
                Inicio
              </Link>
              <Link
                href="/productos"
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all text-foreground/80 hover:text-amber-600 hover:bg-amber-50/50"
              >
                Catálogo
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all text-foreground/80 hover:text-amber-600 hover:bg-amber-50/50">
                  Productos
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white rounded-xl shadow-xl shadow-black/10 border border-border/50 py-2 min-w-[200px]">
                    <Link
                      href="/productos"
                      className="block px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                    >
                      Todos los Productos
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat}
                        href={`/productos?categoria=${encodeURIComponent(cat)}`}
                        className="block px-4 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link
                href="/carrito"
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all text-foreground/80 hover:text-amber-600 hover:bg-amber-50/50"
              >
                Carrito
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div ref={searchRef} className="relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="relative p-2.5 rounded-xl transition-all text-foreground/60 hover:text-amber-600 hover:bg-amber-50/50"
                  aria-label="Buscar productos"
                >
                  <Search className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-[420px]"
                    >
                      <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 border border-border/50 overflow-hidden">
                        <div className="p-3">
                          <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-2.5">
                            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                            <input
                              type="text"
                              placeholder="Buscar cajas, films, cintas..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                              autoFocus
                            />
                            {searchQuery && (
                              <button onClick={() => setSearchQuery('')} className="text-muted-foreground hover:text-foreground">
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        {searchResults.length > 0 && (
                          <div className="border-t border-border/50 max-h-72 overflow-y-auto">
                            {searchResults.map((product) => (
                              <Link
                                key={product.id}
                                href={`/productos/${product.slug || product.id}`}
                                onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors"
                              >
                                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                                  <Package className="w-5 h-5 text-primary" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">{product.nombre}</p>
                                  <p className="text-xs text-muted-foreground">{product.categoria} · {product.precioUnidad}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                        {searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                            No se encontraron resultados para &quot;{searchQuery}&quot;
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Favorites */}
              <button
                onClick={() => setIsFavoritesOpen(true)}
                className="relative p-2.5 rounded-xl transition-all text-foreground/60 hover:text-red-500 hover:bg-red-50"
                aria-label="Ver favoritos"
              >
                <Heart className="w-5 h-5" />
                <AnimatePresence>
                  {totalFavorites > 0 && (
                    <motion.span
                      key={totalFavorites}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30"
                    >
                      {totalFavorites}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Cart */}
              <Link href="/carrito" className="relative p-2.5 rounded-xl transition-all text-foreground/60 hover:text-amber-600 hover:bg-amber-50/50">
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key={totalItems}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-primary/30"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Favorites Panel */}
      <FavoritesPanel
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
      />
    </>
  );
}
