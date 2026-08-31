'use client';

/**
 * SkeletonCard – A polished skeleton loader that mirrors the ProductCard layout.
 *
 * Uses a custom shimmer animation (gradient sweep from left → right)
 * injected via an inline <style> tag so no global CSS changes are required.
 *
 * Usage:
 *   <SkeletonCard />           – single card skeleton
 *   Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
 */

export default function SkeletonCard() {
  return (
    <>
      {/* ── Shimmer keyframes ─────────────────────────────────────── */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            var(--muted) 25%,
            oklch(0.96 0.006 80) 37%,
            var(--muted) 63%
          );
          background-size: 200% 100%;
          animation: shimmer 1.8s ease-in-out infinite;
        }
        .dark .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            var(--muted) 25%,
            oklch(0.32 0.01 30) 37%,
            var(--muted) 63%
          );
          background-size: 200% 100%;
        }
      `}</style>

      {/* ── Card shell ──────────────────────────────────────────────── */}
      <div className="relative bg-card rounded-2xl border border-border/50 overflow-hidden">
        {/* ── Image area ──────────────────────────────────────────── */}
        <div className="relative aspect-[4/3] skeleton-shimmer rounded-none" />

        {/* ── Content body ────────────────────────────────────────── */}
        <div className="p-4 sm:p-5 space-y-3">

          {/* Tags – 3 small pills */}
          <div className="flex gap-1.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className="h-5 rounded-md skeleton-shimmer"
                style={{ width: i === 2 ? '3.5rem' : '4.5rem' }}
              />
            ))}
          </div>

          {/* Title line – w-3/4 */}
          <div className="h-5 w-3/4 rounded-md skeleton-shimmer" />

          {/* Pack selector pills – 3 */}
          <div className="flex gap-1.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className="h-7 rounded-lg skeleton-shimmer"
                style={{ width: '4.5rem' }}
              />
            ))}
          </div>

          {/* Description lines – 2 lines */}
          <div className="space-y-2">
            <div className="h-4 w-full rounded-md skeleton-shimmer" />
            <div className="h-4 w-2/3 rounded-md skeleton-shimmer" />
          </div>

          {/* Material & Measures badges */}
          <div className="flex gap-3">
            <span
              className="h-6 rounded-md skeleton-shimmer"
              style={{ width: '4.5rem' }}
            />
            <span
              className="h-6 rounded-md skeleton-shimmer"
              style={{ width: '5.5rem' }}
            />
          </div>

          {/* Price area + Add button placeholder */}
          <div className="flex items-end justify-between gap-3 pt-1">
            {/* Price text lines */}
            <div className="space-y-2 flex-1">
              <div className="h-3 w-24 rounded-md skeleton-shimmer" />
              <div className="h-6 w-28 rounded-md skeleton-shimmer" />
              <div className="h-3 w-20 rounded-md skeleton-shimmer" />
            </div>

            {/* Add to cart button placeholder */}
            <div
              className="h-10 w-28 rounded-xl skeleton-shimmer flex-shrink-0"
            />
          </div>
        </div>
      </div>
    </>
  );
}
