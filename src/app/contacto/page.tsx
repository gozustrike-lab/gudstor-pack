import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { COMPANY } from '@/config/company';
import ImmersiveBanner from '@/components/immersive-banner';

export const metadata: Metadata = {
  title: 'Contáctanos | GUDSTOR PACK',
  description: 'Comunícate con GUDSTOR PACK por WhatsApp, email o teléfono para cotizaciones y pedidos.',
};

export default function ContactoPage() {
  const waMsg = encodeURIComponent('Hola GUDSTOR PACK, necesito información sobre sus productos.');
  return (
    <div className="min-h-screen bg-background">
      <ImmersiveBanner
        title="Contáctanos"
        subtitle="Estamos para ayudarte"
        breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Contáctanos' }]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 pb-24 md:pb-16">
        <div className="space-y-6">
          <p className="text-lg text-muted-foreground">
            ¿Necesitas una cotización personalizada o tienes alguna consulta? Escríbenos y te responderemos al instante.
          </p>

          <a
            href={`https://wa.me/${COMPANY.whatsapp}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-[#25D366] text-white rounded-2xl p-5 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-lg">WhatsApp</p>
              <p className="text-white/80 text-sm">Cotización instantánea</p>
            </div>
          </a>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-card border border-border/50 rounded-2xl p-5">
              <Phone className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Teléfono</p>
              <a href={`tel:+${COMPANY.whatsapp}`} className="text-base font-semibold text-foreground hover:text-primary">
                {COMPANY.whatsappDisplay}
              </a>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-5">
              <Mail className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Email</p>
              <a href="mailto:ventas@gudstorpack.com" className="text-base font-semibold text-foreground hover:text-primary">
                ventas@gudstorpack.com
              </a>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-5">
              <MapPin className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Ubicación</p>
              <p className="text-base font-semibold text-foreground">Lima, Perú</p>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-5">
              <Clock className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Horario</p>
              <p className="text-base font-semibold text-foreground">Lun - Vie: 8:00 - 18:00</p>
            </div>
          </div>

          <div className="mt-10">
            <Link href="/productos" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              <ArrowLeft className="w-4 h-4" />
              Ver productos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
