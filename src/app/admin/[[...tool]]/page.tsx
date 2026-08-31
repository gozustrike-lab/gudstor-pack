'use client';

import { useEffect, useState } from 'react';

// Project ID hardcodeado — el Studio SIEMPRE conecta
const SANITY_PROJECT_ID = '981jghg0';

export default function AdminPage() {
  const [Studio, setStudio] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    import('next-sanity/studio').then(({ NextStudio }) => {
      import('../../../../sanity.config').then(({ default: config }) => {
        const StudioComponent = () => <NextStudio config={config} />;
        setStudio(() => StudioComponent);
      });
    });
  }, []);

  if (!Studio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return <Studio />;
}