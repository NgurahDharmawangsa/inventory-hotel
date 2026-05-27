export function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-28 bg-muted rounded animate-pulse" />
            <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-8 w-20 bg-muted rounded animate-pulse" />
            <div className="h-3 w-36 bg-muted rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AlertSectionSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <div className="flex items-center gap-3">
        <div className="h-4 w-4 rounded bg-muted animate-pulse" />
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
      </div>
      <div className="h-3 w-64 bg-muted rounded animate-pulse" />
    </div>
  );
}

export function InfrastructureHealthSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-3 w-3 rounded-full bg-muted animate-pulse" />
        <div className="flex-1 space-y-1">
          <div className="h-4 w-36 bg-muted rounded animate-pulse" />
          <div className="h-3 w-48 bg-muted rounded animate-pulse" />
        </div>
      </div>
      <div className="space-y-4 pt-2 border-t border-border">
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted rounded animate-pulse" />
          <div className="h-2 w-full bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted rounded animate-pulse" />
          <div className="h-2 w-full bg-muted rounded animate-pulse" />
        </div>
      </div>
      <div className="space-y-3 pt-2 border-t border-border">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-3 w-full bg-muted rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export function RecentActivitySkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card divide-y divide-border">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-4">
          <div className="h-8 w-8 rounded-lg bg-muted animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            <div className="h-3 w-24 bg-muted rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}