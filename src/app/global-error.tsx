'use client'

// ============================================================================
// GLOBAL ERROR PAGE
// ----------------------------------------------------------------------------
// Root-level error boundary for the entire application.
// Requirements: 8.5
// ============================================================================

import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Global error page component
 * 
 * Requirement 8.5: Display error message for unhandled errors
 * Note: This component must include its own html and body tags
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log error for debugging
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="en">
      <body className="antialiased bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10 text-red-600 dark:text-red-400"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            Something went wrong
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}
