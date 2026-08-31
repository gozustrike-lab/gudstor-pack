import { defineLive } from 'next-sanity/live';
import { draftClient } from '@/lib/sanity.client';
import { schemaTypes } from '../../sanity/schema';

// defineLive se ejecuta a nivel módulo (server-side)
// Retorna SanityLive que es internamente un client component
const { SanityLive } = defineLive({
  client: draftClient,
  schema: schemaTypes as any,
});

export { SanityLive };