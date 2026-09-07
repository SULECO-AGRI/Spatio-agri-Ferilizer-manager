import { memo } from "react";

export interface SkeletonProps {
  className?: string;
}

export const Skeleton = memo(function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`animate-pulse bg-slate-200/80 rounded-lg ${className}`} />;
});

export const CardSkeleton = memo(function CardSkeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-3 w-48" />
    </div>
  );
});

export const TableSkeleton = memo(function TableSkeleton({
  rows = 5,
  cols = 5,
  className = "",
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  return (
    <div
      className={`bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs p-4 ${className}`}
    >
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex items-center gap-4 py-2 border-b border-slate-100/70">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <Skeleton
                key={cIdx}
                className={`h-4 ${cIdx === 0 ? "w-28" : cIdx === 1 ? "w-36" : "w-20"} flex-1`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

export default Skeleton;
