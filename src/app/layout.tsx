import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { draftMode } from "next/headers";
import "./globals.css";
import SiteShell from "@/components/SiteShell";
import VisualEditing from "@/components/VisualEditing";
import SanityLiveMode from "@/components/SanityLiveMode";
import { fetchSiteSettings } from "@/lib/fetchCMS";
import type { SiteSettings } from "@/lib/sanity.client";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gudstor-pack.vercel.app"),
  title: {
    default: "GUDSTOR PACK | Soluciones en Embalaje",
    template: "%s | GUDSTOR PACK",
  },
  description:
    "Materiales de embalaje profesional para ecommerce, logística e industria. Cajas, films, cintas y más. Envío rápido a todo Perú.",
  keywords: [
    "materiales de embalaje",
    "cajas kraft",
    "film estirable",
    "cinta adhesiva",
    "plástico burbuja",
    "bolsas de envío",
    "embalaje Perú",
    "empaque ecommerce",
    "GUDSTOR PACK",
    "cajas de cartón",
    "embalaje profesional",
    "logística industrial",
  ],
  authors: [{ name: "GUDSTOR PACK" }],
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icono.png", sizes: "105x85", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "GUDSTOR PACK | Soluciones en Embalaje",
    description:
      "Materiales de embalaje profesional para ecommerce, logística e industria. Cajas, films, cintas, protección y bolsas.",
    url: "https://gudstor-pack.vercel.app",
    siteName: "GUDSTOR PACK",
    type: "website",
    locale: "es_PE",
    images: [
      {
        url: "/og/gudstor-pack-og.jpg",
        width: 1200,
        height: 630,
        alt: "GUDSTOR PACK - Soluciones en Embalaje",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GUDSTOR PACK | Soluciones en Embalaje",
    description:
      "Materiales de embalaje profesional para ecommerce, logística e industria.",
    images: ["/og/gudstor-pack-og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://gudstor-pack.vercel.app",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const draft = await draftMode();
  const isDraft = draft.isEnabled;

  // Fetch site settings para Footer y Visual Editing
  let siteSettings: SiteSettings | null = null;
  try {
    siteSettings = await fetchSiteSettings();
  } catch {
    // Silently fail — footer usa fallback
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <SiteShell siteSettings={siteSettings}>{children}</SiteShell>
        {(isDraft || process.env.NODE_ENV === 'development') && <SanityLiveMode />}
        {(isDraft || process.env.NODE_ENV === 'development') && <VisualEditing />}
      </body>
    </html>
  );
}