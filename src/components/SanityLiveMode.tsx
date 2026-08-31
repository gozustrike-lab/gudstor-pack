// Server component wrapper — re-exporta SanityLive
// SanityLive (de defineLive) es internamente un client component
import { SanityLive } from '@/sanity/live';

export default function SanityLiveMode() {
  return <SanityLive />;
}