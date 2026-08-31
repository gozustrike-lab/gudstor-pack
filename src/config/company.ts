export const COMPANY = {
  name: "GUDSTOR PACK",
  whatsapp: "51977346837",
  whatsappDisplay: "+51 977 346 837",
} as const;

/** Default CTA message for general inquiries */
export const WHATSAPP_DEFAULT_MESSAGE =
  "Hola GUDSTOR PACK\n\nEstoy interesado en sus productos de embalaje y me gustaria recibir una cotizacion.\n\nGracias.";

/** Build a product-specific WhatsApp message */
export function buildProductMessage(params: {
  nombre: string;
  packCantidad: number;
  packPrecio: string;
  slug?: string;
}): string {
  const productUrl = params.slug
    ? `https://gudstor-pack.vercel.app/productos/${params.slug}`
    : '';
  const lines = [
    "Hola GUDSTOR PACK",
    "",
    "Deseo cotizar el siguiente producto:",
    "",
    `[${params.nombre}]`,
    "",
    `Pack seleccionado:`,
    `${params.packCantidad} unidades`,
    "",
    `Precio:`,
    params.packPrecio,
  ];
  if (productUrl) {
    lines.push("", `🔗 Ver producto: ${productUrl}`);
  }
  lines.push("", "Gracias.");
  return lines.join("\n");
}