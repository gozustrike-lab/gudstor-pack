export interface Pack {
  cantidad: number;      // 25, 50, 100
  precio: number;         // precio del pack
  descuento: number;      // porcentaje de descuento vs precio unitario
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
  packs: Pack[];             // variantes obligatorias: 25, 50, 100 unidades
  seoPath?: string;
}

export interface Category {
  nombre: string;
  icon: string;
  descripcion: string;
  productos: number;
}
