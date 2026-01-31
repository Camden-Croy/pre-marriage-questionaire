import { Skeleton } from "@/components/ui/skeleton";

// ============================================================================
// DASHBOARD LOADING STATE
// ----------------------------------------------------------------------------
// Loading UI shown during dashboard page transitions.
// Requirements: 11.5
// ============================================================================

/**
 * Dashboard loading component
 * 
 * Requirement 11.5: Use Suspense boundaries to stream content and show loading states
 */
export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm"
          >
            <div className="px-6 pb-2">
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
            </div>
            <div className="px-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
