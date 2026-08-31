'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import WhatsAppButton from "@/components/whatsapp-button";
import { Toaster } from "@/components/ui/toaster";
import type { SiteSettings } from '@/lib/sanity.client';

export default function SiteShell({
  children,
  siteSettings,
}: {
  children: React.ReactNode;
  siteSettings?: SiteSettings | null;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  // En rutas de admin: solo renderizar el contenido, sin chrome del sitio
  if (isAdmin) {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  // En rutas públicas: renderizar el sitio completo
  return (
    <>
      <Navbar />
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#0e384e" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192.png" />
      <main className="min-h-screen pt-[60px] pb-[calc(68px+env(safe-area-inset-bottom,0px))] md:pt-[64px] md:pb-0">
        {children}
      </main>
      <Footer sanitySettings={siteSettings} />
      <MobileBottomNav />
      <WhatsAppButton />
      <Toaster />
    </>
  );
}