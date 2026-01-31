import { Skeleton } from "@/components/ui/skeleton";

// ============================================================================
// PROMPT PAGE LOADING STATE
// ----------------------------------------------------------------------------
// Loading UI shown during prompt page transitions.
// Requirements: 11.5
// ============================================================================

/**
 * Prompt page loading component
 * 
 * Requirement 11.5: Use Suspense boundaries to stream content and show loading states
 */
export default function PromptLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-32" />

      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-48 w-full" />
        <div className="flex justify-end gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  );
}
