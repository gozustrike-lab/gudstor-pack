'use client';

import Image from 'next/image';

interface ImmersiveBannerProps {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
}

export default function ImmersiveBanner({ title, subtitle, breadcrumb }: ImmersiveBannerProps) {
  return (
    <section className="relative h-[220px] sm:h-[260px] lg:h-[280px] overflow-hidden">
      {/* Full-bleed background */}
      <Image
        src="/images/hero-product.webp"
        alt=""
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/70" />
      <div className="absolute inset-0 bg-primary/8 mix-blend-overlay" />

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8 sm:pb-10 pt-[72px] lg:pt-[80px]">
        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-3 overflow-x-auto">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5 shrink-0">
                {i > 0 && <span className="text-white/30">/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-white/80 transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-white/80 font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm sm:text-base text-white/60 mt-1.5 max-w-xl">{subtitle}</p>
        )}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}