import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpilar paquetes problemáticos con Turbopack (sin "sanity" para evitar conflicto)
  transpilePackages: [
    "swr",
    "@sanity/icons",
    "@sanity/image-url",
    "groq",
  ],

  // Marcar sanity como externo en Server Components (top-level en Next.js 16)
  serverExternalPackages: ["sanity"],

  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.sanity.io https://*.sanity.studio http://localhost:3000 https://gudstor-pack.vercel.app https://gudstor-pack-cms.vercel.app"
          }
        ]
      }
    ];
  },

  // Redirects from old gudstorpack.com URLs to new Vercel pages
  async redirects() {
    return [
      // ── Pages ──
      { source: '/inicio', destination: '/', permanent: true },
      { source: '/productos-populares', destination: '/productos', permanent: true },
      { source: '/testimonios', destination: '/productos', permanent: true },
      { source: '/por-que-elegirnos', destination: '/sobre-nosotros', permanent: true },

      // ── Categorías principales ──
      { source: '/cajas-de-carton', destination: '/productos?categoria=Cajas', permanent: true },
      { source: '/cajas-especiales', destination: '/productos?categoria=Cajas', permanent: true },
      { source: '/materiales-de-embalaje', destination: '/productos', permanent: true },
      { source: '/relleno-y-complementos', destination: '/productos?categoria=Protección', permanent: true },

      // ── Subcategorías: Cajas de Cartón ──
      { source: '/cajas-de-carton/cajas-archiveras', destination: '/productos?categoria=Cajas', permanent: true },
      { source: '/cajas-de-carton/cajas-corrugadas', destination: '/productos?categoria=Cajas', permanent: true },
      { source: '/cajas-de-carton/cajas-doble-corrugadas', destination: '/productos?categoria=Cajas', permanent: true },
      { source: '/cajas-de-carton/cajas-para-envios', destination: '/productos?categoria=Cajas', permanent: true },
      { source: '/cajas-de-carton/cajas-para-pizza', destination: '/productos?categoria=Cajas', permanent: true },

      // ── Subcategorías: Cajas Especiales ──
      { source: '/cajas-especiales/cajas-de-trupan', destination: '/productos?categoria=Cajas', permanent: true },
      { source: '/cajas-especiales/cajas-de-regalo', destination: '/productos?categoria=Cajas', permanent: true },

      // ── Subcategorías: Materiales de Embalaje ──
      { source: '/materiales-de-embalaje/stretch-film', destination: '/productos?categoria=Films', permanent: true },
      { source: '/materiales-de-embalaje/cintas-adhesivas', destination: '/productos?categoria=Cintas', permanent: true },
      { source: '/materiales-de-embalaje/plastico-burbuja', destination: '/productos?categoria=Protección', permanent: true },
      { source: '/materiales-de-embalaje/carton-corrugado', destination: '/productos?categoria=Protección', permanent: true },
      { source: '/materiales-de-embalaje/plancha-de-carton', destination: '/productos?categoria=Protección', permanent: true },
      { source: '/materiales-de-embalaje/plancha-de-tecnopor', destination: '/productos?categoria=Protección', permanent: true },
      { source: '/materiales-de-embalaje/herramientas-y-accesorios', destination: '/productos', permanent: true },

      // ── Subcategorías: Relleno y Complementos ──
      { source: '/relleno-y-complementos/viruta-de-papel', destination: '/productos?categoria=Protección', permanent: true },
      { source: '/relleno-y-complementos/papel-seda-mantequilla', destination: '/productos?categoria=Protección', permanent: true },
      { source: '/relleno-y-complementos/relleno-de-tecnopor', destination: '/productos?categoria=Protección', permanent: true },
      { source: '/relleno-y-complementos/papel-con-diseño', destination: '/productos?categoria=Protección', permanent: true },
      { source: '/relleno-y-complementos/soguilla', destination: '/productos?categoria=Protección', permanent: true },
      { source: '/relleno-y-complementos/stickers', destination: '/productos?categoria=Protección', permanent: true },

      // ── Packs especiales ──
      { source: '/pack-mudanza', destination: '/productos?categoria=Cajas', permanent: true },
      { source: '/pack-emprendedor', destination: '/productos?categoria=Cajas', permanent: true },

      // ── Campañas ──
      { source: '/campanas', destination: '/productos', permanent: true },
      { source: '/campanas/cajas-navidenas', destination: '/productos?categoria=Cajas', permanent: true },
      { source: '/campanas/fechas-especiales', destination: '/productos', permanent: true },
      { source: '/campanas/ofertas', destination: '/productos', permanent: true },
    ];
  },

  async rewrites() {
    return [
      // Mapea las URLs limpias de SEO hacia la ruta dinámica interna de productos
      {
        source: '/cajas-de-carton/:subcategoria/:slug',
        destination: '/productos/:slug',
      },
      {
        source: '/cajas-especiales/:subcategoria/:slug',
        destination: '/productos/:slug',
      },
      {
        source: '/materiales-de-embalaje/:subcategoria/:slug',
        destination: '/productos/:slug',
      },
      {
        source: '/relleno-y-complementos/:subcategoria/:slug',
        destination: '/productos/:slug',
      },
      {
        source: '/campanas/:subcategoria/:slug',
        destination: '/productos/:slug',
      },
      // Para rutas de primer nivel que tienen productos directamente (ej. pack-mudanza)
      {
        source: '/pack-mudanza/:slug',
        destination: '/productos/:slug',
      },
      {
        source: '/pack-emprendedor/:slug',
        destination: '/productos/:slug',
      },
    ];
  },
};

export default nextConfig;