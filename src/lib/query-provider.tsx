'use client'

// ============================================================================
// TANSTACK QUERY PROVIDER
// ----------------------------------------------------------------------------
// Client-side provider for TanStack Query with optimized default options.
// Requirements: 10.5
// ============================================================================

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

/**
 * QueryProvider wraps the application with TanStack Query's QueryClientProvider.
 * Creates a new QueryClient instance per component mount to avoid sharing state
 * between requests in SSR scenarios.
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time of 60 seconds - data is considered fresh for this duration
            staleTime: 60 * 1000,
            // Retry failed queries once
            retry: 1,
            // Refetch on window focus for fresh data
            refetchOnWindowFocus: true,
          },
          mutations: {
            // Retry mutations once on failure
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
