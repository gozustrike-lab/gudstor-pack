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
  experimental: {
    turbopackUseSystemTlsCerts: true,
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
  // Redirects from old gudstorpack.com URLs to new Vercel pages
  async redirects() {
    return [
      // ── Pages ──
      { source: '/inicio', destination: '/', permanent: true },
      { source: '/productos-populares', destination: '/productos', permanent: true },
      { source: '/testimonios', destination: '/productos', permanent: true },
      { source: '/por-que-elegirnos', destination: '/sobre-nosotros', permanent: true },

      // ── Packs especiales y Campañas ──
      { source: '/pack-mudanza', destination: '/cajas-de-carton', permanent: true },
      { source: '/pack-emprendedor', destination: '/cajas-de-carton', permanent: true },
      { source: '/campanas', destination: '/productos', permanent: true },
      { source: '/campanas/cajas-navidenas', destination: '/cajas-de-carton', permanent: true },
      { source: '/campanas/fechas-especiales', destination: '/productos', permanent: true },
      { source: '/campanas/ofertas', destination: '/productos', permanent: true },
    ];
  },

  async rewrites() {
    return [
      // 1. Mapea las URLs limpias de SEO hacia la ruta dinámica interna de productos
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
      {
        source: '/pack-mudanza/:slug',
        destination: '/productos/:slug',
      },
      {
        source: '/pack-emprendedor/:slug',
        destination: '/productos/:slug',
      },

      // 2. Subcategorías: URLs limpias de categorías y subcategorías (sin símbolos ni query strings)
      { source: '/cajas-de-carton/cajas-archiveras', destination: '/productos?categoria=Cajas&subcategoria=Archiveras' },
      { source: '/cajas-de-carton/cajas-corrugadas', destination: '/productos?categoria=Cajas&subcategoria=Corrugadas' },
      { source: '/cajas-de-carton/cajas-doble-corrugadas', destination: '/productos?categoria=Cajas&subcategoria=Doble%20Corrugado' },
      { source: '/cajas-de-carton/cajas-para-envios', destination: '/productos?categoria=Cajas&subcategoria=E-commerce' },
      { source: '/cajas-de-carton/cajas-para-pizza', destination: '/productos?categoria=Cajas&subcategoria=Pizza' },

      { source: '/cajas-especiales/cajas-de-trupan', destination: '/productos?categoria=Cajas' },
      { source: '/cajas-especiales/cajas-de-regalo', destination: '/productos?categoria=Cajas' },

      { source: '/materiales-de-embalaje/stretch-film', destination: '/productos?categoria=Films' },
      { source: '/materiales-de-embalaje/cintas-adhesivas', destination: '/productos?categoria=Cintas' },
      { source: '/materiales-de-embalaje/plastico-burbuja', destination: '/productos?categoria=Protección&subcategoria=Burbupack' },
      { source: '/materiales-de-embalaje/carton-corrugado', destination: '/productos?categoria=Protección&subcategoria=Cartón%20Corrugado' },
      { source: '/materiales-de-embalaje/plancha-de-carton', destination: '/productos?categoria=Protección&subcategoria=Planchas' },
      { source: '/materiales-de-embalaje/plancha-de-tecnopor', destination: '/productos?categoria=Protección&subcategoria=Planchas' },
      { source: '/materiales-de-embalaje/herramientas-y-accesorios', destination: '/productos?categoria=Protección' },

      { source: '/relleno-y-complementos/viruta-de-papel', destination: '/productos?categoria=Protección&subcategoria=Papel%20y%20Viruta' },
      { source: '/relleno-y-complementos/papel-seda-mantequilla', destination: '/productos?categoria=Protección&subcategoria=Papel%20y%20Viruta' },
      { source: '/relleno-y-complementos/relleno-de-tecnopor', destination: '/productos?categoria=Protección&subcategoria=Planchas' },
      { source: '/relleno-y-complementos/papel-con-diseño', destination: '/productos?categoria=Protección&subcategoria=Papel%20y%20Viruta' },
      { source: '/relleno-y-complementos/soguilla', destination: '/productos?categoria=Protección' },
      { source: '/relleno-y-complementos/stickers', destination: '/productos?categoria=Protección' },

      // 3. Categorías principales: URLs limpias de nivel superior
      { source: '/cajas-de-carton', destination: '/productos?categoria=Cajas' },
      { source: '/cajas-especiales', destination: '/productos?categoria=Cajas' },
      { source: '/materiales-de-embalaje', destination: '/productos' },
      { source: '/relleno-y-complementos', destination: '/productos?categoria=Protección' },
      { source: '/films', destination: '/productos?categoria=Films' },
      { source: '/cintas', destination: '/productos?categoria=Cintas' },
      { source: '/proteccion', destination: '/productos?categoria=Protección' },
      { source: '/bolsas', destination: '/productos?categoria=Bolsas' },
    ];
  },
};

export default nextConfig;