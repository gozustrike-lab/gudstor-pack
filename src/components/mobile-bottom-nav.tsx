'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Grid3X3,
  Search,
  Heart,
  ShoppingCart,
} from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useFavoritesStore } from '@/lib/favorites-store';
import { COMPANY, WHATSAPP_DEFAULT_MESSAGE } from '@/config/company';

/* ------------------------------------------------------------------ */
/*  Nav item definitions                                               */
/* ------------------------------------------------------------------ */

interface NavItem {
  label: string;
  href: string | null; // null = action-only button
  icon: typeof Home;
  key: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', href: '/', icon: Home, key: 'home' },
  { label: 'Categorías', href: '/productos', icon: Grid3X3, key: 'categories' },
  { label: 'Favoritos', href: '/favoritos', icon: Heart, key: 'favorites' },
  { label: 'Buscar', href: null, icon: Search, key: 'search' },
  { label: 'Carrito', href: '/carrito', icon: ShoppingCart, key: 'cart' },
];

/* ------------------------------------------------------------------ */
/*  Active-key resolver                                                */
/* ------------------------------------------------------------------ */

function resolveActiveKey(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/favoritos')) return 'favorites';
  if (pathname.startsWith('/productos')) return 'categories';
  if (pathname === '/carrito') return 'cart';
  return 'home'; // fallback
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MobileBottomNav() {
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.items.reduce((t, i) => t + i.quantity, 0));
  const totalFavorites = useFavoritesStore((s) => s.items.length);

  const activeKey = useMemo(() => resolveActiveKey(pathname), [pathname]);

  // ── Nav always visible ──

  const handleClick = (item: NavItem) => {
    if (item.key === 'search') {
      window.dispatchEvent(new Event('open-mobile-search'));
    }
    if (item.key === 'quote') {
      window.open(`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`, '_blank', 'noopener');
    }
  };

  return (
    <nav
      aria-label="Navegación móvil"
      className={`fixed bottom-0 inset-x-0 z-45 md:hidden`}
    >
      {/* Glassmorphism bar */}
      <div
        className="relative mx-auto w-full max-w-lg bg-white/90 backdrop-blur-xl border-t border-border/40"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          height: 'calc(68px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {/* Active dot indicator – positioned absolutely so it can slide */}
        <div className="absolute inset-x-0 top-0 pointer-events-none flex justify-around px-2">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.key}
              className="relative flex-1 flex justify-center"
            >
              <AnimatePresence mode="popLayout">
                {activeKey === item.key && (
                  <motion.span
                    layoutId="bottom-nav-dot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-sm shadow-primary/40"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Items */}
        <div className="flex items-center justify-around h-[68px] px-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeKey === item.key;
            const Icon = item.icon;

            const inner = (
              <button
                type="button"
                onClick={() => handleClick(item)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  relative flex flex-col items-center justify-center gap-0.5
                  min-h-[44px] min-w-[44px] px-2.5 py-2 rounded-xl
                  transition-colors duration-200
                  ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
                `}
              >
                {/* Icon */}
                <span className="relative flex items-center justify-center">
                  <Icon
                    className="w-[22px] h-[22px]"
                    strokeWidth={isActive ? 2.4 : 1.8}
                    fill={item.key === 'favorites' && totalFavorites > 0 && isActive ? 'currentColor' : 'none'}
                  />

                  {/* Favorites badge */}
                  {item.key === 'favorites' && totalFavorites > 0 && (
                    <motion.span
                      key={totalFavorites}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1
                        bg-red-500 text-white text-[10px] font-bold
                        rounded-full flex items-center justify-center
                        shadow-md shadow-red-500/30"
                    >
                      {totalFavorites > 99 ? '99+' : totalFavorites}
                    </motion.span>
                  )}

                  {/* Cart badge */}
                  {item.key === 'cart' && totalItems > 0 && (
                    <motion.span
                      key={totalItems}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1
                        bg-primary text-primary-foreground text-[10px] font-bold
                        rounded-full flex items-center justify-center
                        shadow-md shadow-primary/30"
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </motion.span>
                  )}
                </span>

                {/* Label */}
                <span
                  className={`text-[10px] leading-none font-medium transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );

            // Wrap link items in Next.js <Link>, render action buttons as-is
            if (item.href !== null) {
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className="flex items-center justify-center"
                  aria-label={item.label}
                >
                  {inner}
                </Link>
              );
            }

            return <div key={item.key}>{inner}</div>;
          })}
        </div>
      </div>
    </nav>
  );
}
