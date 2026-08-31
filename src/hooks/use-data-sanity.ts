'use client';

import { useMemo } from 'react';
import { createDataAttribute } from '@sanity/visual-editing';

interface DataSanityOptions {
  id: string;
  type: string;
  path: string;
}

/**
 * Hook que genera el string del atributo data-sanity
 * para overlays editables en la Presentation Tool.
 *
 * Uso:
 *   <div {...dataSanity({ id: 'abc', type: 'heroSlide', path: '_root' })}>
 */
export function useDataSanity(options: DataSanityOptions) {
  return useMemo(() => {
    const attr = createDataAttribute(options);
    return { 'data-sanity': String(attr) };
  }, [options.id, options.type, options.path]);
}

/**
 * Helper directo para generar data-sanity sin hook.
 * Útil en componentes que ya están en contexto client.
 */
export function dataSanityAttr(id: string, type: string, path: string) {
  return { 'data-sanity': String(createDataAttribute({ id, type, path })) };
}