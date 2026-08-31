import type { Metadata } from 'next';
import Link from 'next/link';
import ImmersiveBanner from '@/components/immersive-banner';

export const metadata: Metadata = {
  title: 'Política de Privacidad | GUDSTOR PACK',
  description: 'Política de privacidad y tratamiento de datos personales de GUDSTOR PACK.',
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-background">
      <ImmersiveBanner
        title="Política de Privacidad"
        subtitle="Tratamiento de datos personales"
        breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Política de Privacidad' }]}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 pb-24 md:pb-16 space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">1. Responsable del Tratamiento</h2>
          <p>GUDSTOR PACK, con RUC pendiente de registro, es el responsable del tratamiento de los datos personales que se recogen a través del sitio web https://gudstor-pack.vercel.app.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">2. Datos que Recopilamos</h2>
          <p>Recopilamos los siguientes datos personales proporcionados voluntariamente por el usuario: nombre completo, número de documento (DNI/RUC), teléfono, dirección de envío, distrito y departamento. Estos datos son necesarios para procesar y despachar los pedidos.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">3. Finalidad del Tratamiento</h2>
          <p>Los datos personales recopilados son utilizados exclusivamente para: procesar pedidos, coordinar entregas, enviar notificaciones sobre el estado del envío, y comunicarse con el cliente para resolver consultas relacionadas con su compra.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">4. Protección de Datos</h2>
          <p>GUDSTOR PACK adopta las medidas de seguridad necesarias para proteger los datos personales contra acceso no autorizado, pérdida o alteración. Los datos se almacenan de forma segura y solo son accesibles por personal autorizado.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">5. Derechos del Usuario</h2>
          <p>El usuario tiene derecho a: acceder a sus datos personales, solicitar la corrección de datos inexactos, solicitar la eliminación de sus datos, y revocar su consentimiento para el tratamiento de los mismos. Para ejercer estos derechos, puede contactarnos a través de WhatsApp o email.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">6. Contacto</h2>
          <p>Para consultas sobre esta Política de Privacidad, escríbanos a ventas@gudstorpack.com o por WhatsApp.</p>
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
