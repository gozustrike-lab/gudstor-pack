import type { Metadata } from 'next';
import Link from 'next/link';
import { Truck, Clock, MapPin, Package, Check } from 'lucide-react';
import ImmersiveBanner from '@/components/immersive-banner';

export const metadata: Metadata = {
  title: 'Envíos y Entregas | GUDSTOR PACK',
  description: 'Información sobre envíos, tiempos de entrega y zonas de cobertura de GUDSTOR PACK.',
};

export default function EnviosPage() {
  return (
    <div className="min-h-screen bg-background">
      <ImmersiveBanner
        title="Envíos y Entregas"
        subtitle="Tu pedido llega donde lo necesites"
        breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Envíos y Entregas' }]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 pb-24 md:pb-16 space-y-8">
        <p className="text-lg text-muted-foreground leading-relaxed">
          En GUDSTOR PACK nos aseguramos de que tus productos lleguen a tiempo y en perfectas condiciones. A continuación, te detallamos nuestra política de envíos.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: MapPin, title: 'Lima Metropolitana', desc: 'Entrega en 24-48 horas hábiles.' },
            { icon: Truck, title: 'Provincias', desc: 'Entrega en 2-5 días hábiles según destino.' },
            { icon: Clock, title: 'Horario de Despacho', desc: 'Lunes a Viernes de 8:00 a.m. a 5:00 p.m.' },
            { icon: Package, title: 'Empaque Seguro', desc: 'Todos los envíos van correctamente embalados.' },
          ].map((item) => (
            <div key={item.title} className="bg-card border border-border/50 rounded-2xl p-5">
              <item.icon className="w-6 h-6 text-primary mb-3" />
              <h3 className="text-base font-bold text-foreground mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <section className="space-y-4 text-muted-foreground">
          <h2 className="text-xl font-bold text-foreground">Proceso de Envío</h2>
          <div className="space-y-4">
            {[
              { step: '1', text: 'Confirmas tu pedido por WhatsApp y realizas el pago.' },
              { step: '2', text: 'Preparamos tu pedido con el máximo cuidado.' },
              { step: '3', text: 'Coordinamos la fecha y hora de entrega.' },
              { step: '4', text: 'Recibes tu pedido con seguimiento en tiempo real.' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{item.step}</span>
                </div>
                <p className="text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3 text-muted-foreground">
          <h2 className="text-xl font-bold text-foreground">Medios de Pago</h2>
          <ul className="space-y-2">
            {['Transferencia bancaria', 'Yape / Plin', 'Efectivo (contra entrega en Lima)'].map((method) => (
              <li key={method} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary shrink-0" />
                {method}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10">
          <Link href="/productos" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            Ver productos
          </Link>
        </div>
      </div>
    </div>
  );
}
