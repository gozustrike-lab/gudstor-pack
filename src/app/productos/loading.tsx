export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Skeleton header */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="animate-pulse space-y-3">
            <div className="h-8 w-48 bg-muted rounded-lg" />
            <div className="h-4 w-64 bg-muted rounded-lg" />
          </div>
        </div>
      </div>

      {/* Skeleton content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block w-64 shrink-0 animate-pulse space-y-4">
            <div className="h-40 bg-muted rounded-2xl" />
            <div className="h-32 bg-muted rounded-2xl" />
          </div>

          {/* Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-card border border-border/50 rounded-2xl overflow-hidden">
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex gap-1.5">
                    <div className="h-5 w-16 bg-muted rounded-md" />
                    <div className="h-5 w-14 bg-muted rounded-md" />
                  </div>
                  <div className="h-5 w-3/4 bg-muted rounded-lg" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-full bg-muted rounded" />
                    <div className="h-3 w-5/6 bg-muted rounded" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-24 bg-muted rounded-md" />
                    <div className="h-6 w-28 bg-muted rounded-md" />
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <div className="space-y-1">
                      <div className="h-3 w-12 bg-muted rounded" />
                      <div className="h-6 w-20 bg-muted rounded-lg" />
                    </div>
                    <div className="h-10 w-28 bg-muted rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
