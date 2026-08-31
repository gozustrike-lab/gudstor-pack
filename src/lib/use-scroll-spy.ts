'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * useScrollSpy — Deep linking + scroll spy con History API
 *
 * - Observa secciones via IntersectionObserver
 * - Actualiza el hash en la URL sin recargar (replaceState)
 * - Al montar, si hay hash, hace scroll suave a esa sección
 * - Funciona en PC, móvil y cualquier dispositivo
 *
 * Uso:
 *   useScrollSpy({
 *     ids: ['inicio', 'categorias', 'productos', 'contacto'],
 *     offset: '80px',   // offset para el observer (por header fijo)
 *   });
 */
interface ScrollSpyOptions {
  /** Lista de IDs de sección a observar */
  ids: string[];
  /** rootMargin top offset (por header fijo). Default: '80px' */
  offset?: string;
  /** Umbral de visibilidad. Default: 0.15 */
  threshold?: number;
  /** Habilitar. Default: true */
  enabled?: boolean;
}

export function useScrollSpy({
  ids,
  offset = '80px',
  threshold = 0.15,
  enabled = true,
}: ScrollSpyOptions) {
  const isScrollingFromHash = useRef(false);
  const currentHash = useRef('');

  // ── Scroll suave a sección por hash al montar ──────────────────
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const hash = window.location.hash.replace('#', '');
    if (!hash || !ids.includes(hash)) return;

    // Esperar a que el DOM esté listo
    const attemptScroll = (retries = 0) => {
      const el = document.getElementById(hash);
      if (el) {
        isScrollingFromHash.current = true;
        currentHash.current = hash;

        const headerOffset = parseInt(offset) || 80;
        const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;

        window.scrollTo({ top, behavior: 'smooth' });

        // Reset flag after animation
        setTimeout(() => {
          isScrollingFromHash.current = false;
        }, 800);
      } else if (retries < 20) {
        setTimeout(() => attemptScroll(retries + 1), 100);
      }
    };

    // Delay to allow page render
    setTimeout(() => attemptScroll(), 200);
  }, [ids, offset, enabled]);

  // ── IntersectionObserver para scroll spy ──────────────────────
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Filtrar IDs que realmente existen en el DOM
    const validIds = ids.filter((id) => document.getElementById(id));

    if (validIds.length === 0) return;

    let activeId = currentHash.current || validIds[0];

    const observer = new IntersectionObserver(
      (entries) => {
        // No actualizar si estamos haciendo scroll programático por hash
        if (isScrollingFromHash.current) return;

        // Encontrar la última sección visible (mayor ratio de intersección)
        let bestEntry: IntersectionObserverEntry | null = null;
        let bestRatio = 0;

        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestEntry = entry;
          }
        }

        if (bestEntry) {
          const newId = bestEntry.target.id;
          if (newId !== activeId) {
            activeId = newId;
            currentHash.current = newId;
            // Actualizar URL sin recargar ni añadir al historial
            const newUrl = `${window.location.pathname}${window.location.search}#${newId}`;
            window.history.replaceState(null, '', newUrl);
          }
        }
      },
      {
        rootMargin: `-${offset} 0px -40% 0px`,
        threshold,
      }
    );

    // Observar cada sección
    validIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids, offset, threshold, enabled]);

  // ── Listener para hash changes (navegación manual por hash) ──
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash || !ids.includes(hash)) return;

      const el = document.getElementById(hash);
      if (el) {
        isScrollingFromHash.current = true;
        const headerOffset = parseInt(offset) || 80;
        const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: 'smooth' });
        currentHash.current = hash;

        setTimeout(() => {
          isScrollingFromHash.current = false;
        }, 800);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [ids, offset, enabled]);

  // ── Utilidad: scrollTo (para links internos) ──────────────────
  const scrollTo = useCallback(
    (id: string) => {
      if (!enabled) return;
      const el = document.getElementById(id);
      if (!el) return;

      isScrollingFromHash.current = true;
      const headerOffset = parseInt(offset) || 80;
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${id}`);
      window.scrollTo({ top, behavior: 'smooth' });

      setTimeout(() => {
        isScrollingFromHash.current = false;
      }, 800);
    },
    [offset, enabled]
  );

  return { scrollTo };
}
