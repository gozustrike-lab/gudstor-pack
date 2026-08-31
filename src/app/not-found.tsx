import Link from 'next/link';
import { Package, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Package className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="text-6xl font-extrabold text-primary mb-2">404</h1>
        <h2 className="text-xl font-bold text-foreground mb-3">Página no encontrada</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Lo sentimos, la página que buscas no existe o ha sido movida. Te invitamos a explorar
          nuestro catálogo de materiales de embalaje.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <Home className="w-4 h-4" />
            Ir al Inicio
          </Link>
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border text-foreground font-semibold rounded-xl hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ver Productos
          </Link>
        </div>
      </div>
    </div>
  );
}
