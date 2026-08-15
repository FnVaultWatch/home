export function SkinGridSkeleton({ count = 10 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse-slow overflow-hidden rounded-xl border border-border-line bg-surface">
          <div className="aspect-square bg-surface-2" />
          <div className="space-y-2 p-3.5">
            <div className="h-3.5 w-3/4 rounded bg-surface-2" />
            <div className="h-3 w-1/2 rounded bg-surface-2" />
            <div className="h-8 w-full rounded bg-surface-2 mt-2" />
          </div>
        </div>
      ))}
    </div>
  )
}
