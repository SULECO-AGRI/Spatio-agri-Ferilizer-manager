export function AdminTabSkeleton() {
  return (
    <div className="space-y-6 font-sans animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-slate-200/70 rounded-lg" />
        <div className="h-4 w-72 bg-slate-200/50 rounded-md" />
      </div>

      {/* Metrics Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 bg-white border border-slate-200/60 rounded-2xl p-5 space-y-3"
          >
            <div className="h-3 w-24 bg-slate-200/60 rounded" />
            <div className="h-7 w-20 bg-slate-200/80 rounded" />
            <div className="h-3 w-16 bg-slate-200/50 rounded" />
          </div>
        ))}
      </div>

      {/* Content Area Skeleton */}
      <div className="h-80 bg-white border border-slate-200/60 rounded-2xl p-6 space-y-4">
        <div className="h-4 w-36 bg-slate-200/60 rounded" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-slate-50 border border-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
