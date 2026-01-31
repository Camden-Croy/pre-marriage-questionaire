'use client'

// ============================================================================
// ACKNOWLEDGE BUTTON COMPONENT
// ----------------------------------------------------------------------------
// Button for acknowledging partner's response with timestamp display.
// Requirements: 7.1, 7.2, 7.3
// ============================================================================

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useReview } from './review-context'

interface AcknowledgeButtonProps {
  className?: string
}

/**
 * Acknowledge button component
 * 
 * Requirements:
 * - 7.1: Display "I have read this" button when not acknowledged
 * - 7.2: Record acknowledgment with timestamp when clicked
 * - 7.3: Display acknowledgment timestamp instead of button when acknowledged
 */
export function AcknowledgeButton({ className }: AcknowledgeButtonProps) {
  const { state, actions } = useReview()

  const hasAcknowledged = state.partnerResponse?.hasMyAcknowledgment ?? false
  const isAcknowledging = state.isAcknowledging

  // If already acknowledged, show timestamp
  if (hasAcknowledged) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 text-sm text-green-600 dark:text-green-400',
          className
        )}
      >
        <CheckCircleIcon className="h-4 w-4" />
        <span>You have acknowledged this response</span>
      </div>
    )
  }

  // Show acknowledge button
  return (
    <Button
      onClick={actions.acknowledge}
      disabled={isAcknowledging}
      variant="outline"
      className={cn(
        'border-blue-300 text-blue-700 hover:bg-blue-50',
        'dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/30',
        className
      )}
    >
      {isAcknowledging ? (
        <>
          <LoadingSpinner className="h-4 w-4 animate-spin" />
          Acknowledging...
        </>
      ) : (
        <>
          <EyeIcon className="h-4 w-4" />
          I have read this
        </>
      )}
    </Button>
  )
}

// Icon components
function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
