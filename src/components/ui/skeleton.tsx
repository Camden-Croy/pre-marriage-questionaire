import { cn } from "@/lib/utils"

// ============================================================================
// SKELETON COMPONENT
// ----------------------------------------------------------------------------
// Reusable skeleton loading placeholder component.
// Requirements: 11.5
// ============================================================================

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Skeleton loading placeholder component
 * 
 * Requirement 11.5: Use Suspense boundaries to stream content and show loading states
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800",
        className
      )}
      {...props}
    />
  )
}
