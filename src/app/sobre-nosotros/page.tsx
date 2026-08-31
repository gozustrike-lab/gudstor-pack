import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, Shield, Users } from 'lucide-react';
import ImmersiveBanner from '@/components/immersive-banner';

export const metadata: Metadata = {
  title: 'Sobre Nosotros | GUDSTOR PACK',
  description: 'Conoce GUDSTOR PACK, tu aliado en soluciones de embalaje y packaging mayorista en Perú.',
};

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen bg-background">
      <ImmersiveBanner
        title="Sobre Nosotros"
        subtitle="Tu aliado en embalaje mayorista"
        breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Sobre Nosotros' }]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 pb-24 md:pb-16">
        <div className="prose prose-gray max-w-none">
          <p className="text-lg text-muted-foreground leading-relaxed">
            En <strong className="text-foreground">GUDSTOR PACK</strong> nos dedicamos a brindar soluciones integrales en embalaje y packaging para empresas de todos los tamaños en Perú. Nuestra misión es que cada negocio cuente con los materiales de empaque necesarios para proteger y presentar sus productos de forma profesional.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mt-10">
            {[
              { icon: Package, title: 'Calidad Garantizada', desc: 'Productos seleccionados para proteger tus mercaderías durante el transporte y almacenamiento.' },
              { icon: Truck, title: 'Despacho Rápido', desc: 'Entregas eficientes en Lima y provincias para que tu negocio nunca se detenga.' },
              { icon: Shield, title: 'Precios Competitivos', desc: 'Descuentos progresivos por volumen: mientras más compras, más ahorras.' },
              { icon: Users, title: 'Atención Personalizada', desc: 'Asesoría dedicada por WhatsApp para cotizaciones y pedidos personalizados.' },
            ].map((item) => (
              <div key={item.title} className="bg-card border border-border/50 rounded-2xl p-6">
                <item.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-base font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link href="/productos" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              <ArrowLeft className="w-4 h-4" />
              Ver nuestros productos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
