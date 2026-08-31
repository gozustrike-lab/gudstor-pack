import type { Metadata } from 'next';
import Link from 'next/link';
import ImmersiveBanner from '@/components/immersive-banner';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | GUDSTOR PACK',
  description: 'Términos y condiciones de uso del sitio web GUDSTOR PACK.',
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-background">
      <ImmersiveBanner
        title="Términos y Condiciones"
        subtitle="Condiciones de uso"
        breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Términos y Condiciones' }]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 pb-24 md:pb-16 space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">1. Generalidades</h2>
          <p>Al acceder y utilizar el sitio web de GUDSTOR PACK (en adelante, "el Sitio"), el usuario acepta plenamente los presentes Términos y Condiciones. GUDSTOR PACK se reserva el derecho de modificar estos términos en cualquier momento sin previo aviso.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">2. Productos y Precios</h2>
          <p>Los precios publicados en el Sitio están expresados en soles peruanos (S/) e incluyen IGV. Los precios pueden variar sin previo aviso. Las ofertas y descuentos están sujetas a disponibilidad y pueden ser modificadas o retiradas en cualquier momento.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">3. Proceso de Compra</h2>
          <p>El proceso de compra se realiza a través de WhatsApp para garantizar una atención personalizada. Una vez confirmado el pedido y realizado el pago correspondiente, se procederá con el despacho del producto.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">4. Despacho y Entrega</h2>
          <p>Los plazos de entrega son referenciales y pueden variar según la ubicación y disponibilidad del producto. GUDSTOR PACK no se responsabiliza por retrasos causados por factores externos como huelgas, desastres naturales o problemas logísticos del transportista.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">5. Propiedad Intelectual</h2>
          <p>Todo el contenido del Sitio, incluyendo textos, imágenes, logotipos, diseño y código, es propiedad de GUDSTOR PACK y está protegido por las leyes de propiedad intelectual. Queda prohibida su reproducción total o parcial sin autorización expresa.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">6. Contacto</h2>
          <p>Para cualquier consulta sobre estos Términos y Condiciones, puede comunicarse con nosotros a través de nuestro WhatsApp o al email ventas@gudstorpack.com.</p>
        </section>

        <div className="mt-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
