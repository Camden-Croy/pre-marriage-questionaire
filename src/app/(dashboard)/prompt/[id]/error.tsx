'use client'

// ============================================================================
// PROMPT PAGE ERROR
// ----------------------------------------------------------------------------
// Error boundary for prompt compose/review routes.
// Requirements: 8.5
// ============================================================================

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Prompt page error component
 * 
 * Requirement 8.5: Display error message and provide recovery options
 */
export default function PromptError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error for debugging
    console.error('Prompt page error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
        <AlertCircleIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
        Failed to load prompt
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 max-w-md">
        We couldn&apos;t load this prompt. Please try again or return to the dashboard.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/">Back to Dashboard</Link>
        </Button>
        <Button onClick={reset}>
          Try Again
        </Button>
      </div>
    </div>
  )
}

function AlertCircleIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  )
}
