export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Breadcrumb skeleton */}
      <div className="bg-muted/30 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="animate-pulse flex gap-2">
            <div className="h-3 w-12 bg-muted rounded" />
            <div className="h-3 w-3 bg-muted rounded" />
            <div className="h-3 w-16 bg-muted rounded" />
            <div className="h-3 w-3 bg-muted rounded" />
            <div className="h-3 w-20 bg-muted rounded" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image skeleton */}
          <div className="animate-pulse space-y-4">
            <div className="w-full aspect-[4/3] bg-muted rounded-2xl" />
            <div className="flex gap-3">
              <div className="w-20 h-20 bg-muted rounded-xl" />
              <div className="w-20 h-20 bg-muted rounded-xl" />
              <div className="w-20 h-20 bg-muted rounded-xl" />
            </div>
          </div>

          {/* Info skeleton */}
          <div className="animate-pulse space-y-5">
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-muted rounded-lg" />
              <div className="h-6 w-16 bg-muted rounded-lg" />
            </div>
            <div className="h-8 w-3/4 bg-muted rounded-lg" />
            <div className="h-4 w-40 bg-muted rounded" />
            <div className="h-10 w-32 bg-muted rounded-lg" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-5/6 bg-muted rounded" />
              <div className="h-3 w-4/6 bg-muted rounded" />
            </div>
            <div className="h-px bg-border" />
            <div className="space-y-2">
              <div className="h-4 w-16 bg-muted rounded" />
              <div className="flex gap-2">
                <div className="h-9 w-28 bg-muted rounded-xl" />
                <div className="h-9 w-32 bg-muted rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-16 bg-muted rounded" />
              <div className="flex gap-2">
                <div className="h-9 w-32 bg-muted rounded-xl" />
                <div className="h-9 w-36 bg-muted rounded-xl" />
              </div>
            </div>
            <div className="h-14 w-full bg-primary/20 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
