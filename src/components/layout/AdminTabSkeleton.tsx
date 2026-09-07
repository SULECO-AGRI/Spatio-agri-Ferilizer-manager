import { memo } from "react";
import { Skeleton, CardSkeleton, TableSkeleton } from "@/components/common/SkeletonLoader";

export const AdminTabSkeleton = memo(function AdminTabSkeleton() {
  return (
    <div className="space-y-6 md:space-y-8 animate-pulse font-sans">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Metrics Row Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Main Table Skeleton */}
      <TableSkeleton rows={6} cols={5} />
    </div>
  );
});

export default AdminTabSkeleton;
