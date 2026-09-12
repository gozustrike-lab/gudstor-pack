export interface Pack {
  cantidad: number;      // 25, 50, 100
  precio: number;         // precio del pack
  descuento: number;      // porcentaje de descuento vs precio unitario
  unidad?: string;        // opcional: 'UDS', 'KG', 'MTRS', 'ROLLOS', etc.
}

export interface Product {
  id: string;
  slug?: string;
  nombre: string;
  descripcion: string;
  precio: number;           // precio unitario (1 unidad)
  precioUnidad: string;      // texto legible, ej: "S/ 12.50"
  stock: number;
  categoria: 'Cajas' | 'Films' | 'Cintas' | 'Protección' | 'Bolsas';
  material: string;
  imagenes: string[];
  colores: string[];
  medidas: string[];
  destacado: boolean;
  etiquetas: string[];
  packs: Pack[];             // variantes: 25, 50, 100 unidades
  seoPath?: string;
  unidadMedida?: string;     // 'UDS', 'KG', 'MTRS', 'ROLLOS', 'BOLSAS', 'PAQ'
  faqs?: { q: string; a: string }[];
}

export interface Category {
  nombre: string;
  icon: string;
  descripcion: string;
  productos: number;
}
