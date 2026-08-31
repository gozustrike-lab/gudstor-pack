import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react';
import { dataSanityAttr } from '@/hooks/use-data-sanity';
import type { SiteSettings } from '@/lib/sanity.client';
import { COMPANY } from '@/config/company';

interface FooterProps {
  sanitySettings?: SiteSettings | null;
}

const CATEGORIES = [
  { label: 'Cajas', href: '/productos?categoria=Cajas' },
  { label: 'Films', href: '/productos?categoria=Films' },
  { label: 'Cintas', href: '/productos?categoria=Cintas' },
  { label: 'Protección', href: '/productos?categoria=Protección' },
  { label: 'Bolsas', href: '/productos?categoria=Bolsas' },
];

const ACCOUNT_LINKS = [
  { label: 'Carrito de Compras', href: '/carrito' },
  { label: 'Mis Favoritos', href: '/favoritos' },
];

const COMPANY_LINKS = [
  { label: 'Sobre Nosotros', href: '/sobre-nosotros' },
  { label: 'Contáctanos', href: '/contacto' },
  { label: 'Términos y Condiciones', href: '/terminos' },
  { label: 'Política de Privacidad', href: '/privacidad' },
  { label: 'Envíos y Entregas', href: '/envios' },
];

export default function Footer({ sanitySettings }: FooterProps) {
  const settingsId = sanitySettings?._id || null;
  const whatsapp = sanitySettings?.whatsapp || COMPANY.whatsapp;
  const whatsappDisplay = COMPANY.whatsappDisplay;
  const email = sanitySettings?.email || 'ventas@gudstorpack.com';
  const address = sanitySettings?.address || 'Lima, Perú';
  const companyName = sanitySettings?.companyName || 'GUDSTOR PACK';

  return (
    <footer
      className="bg-foreground text-background mt-auto mb-[68px] md:mb-0"
      {...(settingsId ? dataSanityAttr(settingsId, 'siteSettings', '_root') : {})}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Column 1: Brand + Contact */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-footer.webp"
                alt="GUDSTOR PACK"
                style={{ height: 36, width: 'auto' }}
                className="drop-shadow-sm brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-background/50 leading-relaxed mb-5 max-w-[280px]">
              Soluciones integrales en embalaje y packaging para empresas. Venta por mayor con descuentos progresivos.
            </p>

            <ul className="space-y-3">
              <li>
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-background/60 hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0 text-primary" />
                  {whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2.5 text-sm text-background/60 hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0 text-primary" />
                  {email}
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2.5 text-sm text-background/60">
                  <MapPin className="w-4 h-4 shrink-0 text-primary" />
                  {address}
                </span>
              </li>
              <li>
                <span className="flex items-center gap-2.5 text-sm text-background/60">
                  <Clock className="w-4 h-4 shrink-0 text-primary" />
                  Lun - Vie: 8:00 - 18:00
                </span>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://www.facebook.com/gudstorpack"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-background/70" />
              </a>
              <a
                href="https://www.instagram.com/gudstorpack"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-background/70" />
              </a>
              <a
                href="https://wa.me/${whatsapp}"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 text-background/70" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.82a8.27 8.27 0 004.76 1.5V6.94a4.85 4.85 0 01-1-.25z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Cuenta */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-background/90">
              Cuenta
            </h4>
            <ul className="space-y-2.5">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/50 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hola GUDSTOR PACK, deseo hacer un pedido personalizado.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-background/50 hover:text-primary transition-colors"
                >
                  Pedidos Personalizados
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Empresa */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-background/90">
              Empresa
            </h4>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/50 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Categorías */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-background/90">
              Categorías
            </h4>
            <ul className="space-y-2.5">
              {CATEGORIES.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-sm text-background/50 hover:text-primary transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/productos"
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Ver todos los productos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-background/40">
              © {new Date().getFullYear()} {companyName}. Todos los derechos reservados.
            </p>
            <p className="text-xs text-background/30">
              Lima, Perú
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
