'use client'

// ============================================================================
// TOASTER COMPONENT
// ----------------------------------------------------------------------------
// Toast notification provider using Sonner.
// Requirements: 10.3
// ============================================================================

import { Toaster as SonnerToaster } from 'sonner'

/**
 * Toast notification provider component
 * 
 * Requirement 10.3: Show success/error toasts for mutations
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg',
          title: 'text-zinc-900 dark:text-zinc-100 font-medium',
          description: 'text-zinc-600 dark:text-zinc-400 text-sm',
          success: 'border-green-200 dark:border-green-800',
          error: 'border-red-200 dark:border-red-800',
          warning: 'border-amber-200 dark:border-amber-800',
        },
      }}
      richColors
      closeButton
    />
  )
}
