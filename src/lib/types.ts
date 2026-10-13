export interface Pack {
  cantidad: number;      // 25, 50, 100, 250, etc.
  precio: number;         // precio del pack
  descuento: number;      // porcentaje de descuento vs precio unitario
  unidad?: string;        // opcional: 'UDS', 'KG', 'MTRS', 'ROLLOS', etc.
}

export interface ProductAttribute {
  nombre: string;
  modificaPrecio?: boolean;
  valores: string[];
}

export interface ProductVariation {
  titulo: string;
  atributos: { nombre: string; valor: string }[];
  precio: number;
  precioAnterior?: number;
  stock: number;
  sku?: string;
  imagen?: string;
  medidas?: string;
  peso?: string;
  disponible?: boolean;
  packs?: Pack[];
}

export interface ProductSpecification {
  nombre: string;
  valor: string;
}

export interface ShippingInfo {
  info?: string;
  zonas?: string;
  tiempos?: string;
  condiciones?: string;
  costo?: string;
}

export interface ProductImageItem {
  url: string;
  alt?: string;
}

export interface Product {
  id: string;
  slug?: string;
  slugsAnteriores?: string[];
  nombre: string;
  descripcion: string;
  descripcionCorta?: string;
  descripcionLarga?: string;
  precio: number;           // precio unitario base (1 unidad)
  precioAnterior?: number;   // precio tachado opcional
  precioUnidad: string;      // texto legible, ej: "S/ 12.50"
  stock: number;
  sku?: string;
  categoria: 'Cajas' | 'Films' | 'Cintas' | 'Protección' | 'Bolsas' | string;
  subcategoria?: string;
  material?: string;
  imagenes: string[];
  imagenesDetalle?: ProductImageItem[];
  colores?: string[];
  medidas?: string[];
  destacado?: boolean;
  etiquetas?: string[];
  packs: Pack[];             // variantes: 25, 50, 100 unidades
  seoPath?: string;
  unidadMedida?: string;     // 'UDS', 'KG', 'MTRS', 'ROLLOS', 'BOLSAS', 'PAQ'
  faqs?: { q: string; a: string }[];

  // Variaciones
  tieneVariaciones?: boolean;
  atributos?: ProductAttribute[];
  variaciones?: ProductVariation[];

  // Especificaciones dinámicas
  especificaciones?: ProductSpecification[];

  // Envíos por producto
  envio?: ShippingInfo;

  // SEO
  seoTitle?: string;
  metaDescription?: string;
  canonical?: string;
  noIndex?: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export interface Category {
  id?: string;
  nombre: string;
  slug: string;
  icon?: string;
  order?: number;
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: string;
  heroImageAlt?: string;
  heroCtaText?: string;
  heroCtaLink?: string;
  h1?: string;
  introDescription?: string;
  bottomSeoText?: string;
  seoTitle?: string;
  metaDescription?: string;
  canonical?: string;
  noIndex?: boolean;
  ogImage?: string;
  descripcion?: string;
  productos?: number;
}

export interface Subcategory {
  id?: string;
  nombre: string;
  slug: string;
  categoria?: string;
  categoriaSlug?: string;
  order?: number;
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: string;
  h1?: string;
  introDescription?: string;
  bottomSeoText?: string;
  seoTitle?: string;
  metaDescription?: string;
  canonical?: string;
  noIndex?: boolean;
}

