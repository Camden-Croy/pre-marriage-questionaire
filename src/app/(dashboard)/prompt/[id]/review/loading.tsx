import { Skeleton } from "@/components/ui/skeleton";

// ============================================================================
// REVIEW PAGE LOADING STATE
// ----------------------------------------------------------------------------
// Loading UI shown during review page transitions.
// Requirements: 11.5
// ============================================================================

/**
 * Review page loading component
 * 
 * Requirement 11.5: Use Suspense boundaries to stream content and show loading states
 */
export default function ReviewLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-32" />

      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
