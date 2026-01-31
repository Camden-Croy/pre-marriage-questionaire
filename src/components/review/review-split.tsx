'use client'

// ============================================================================
// REVIEW SPLIT LAYOUT
// ----------------------------------------------------------------------------
// Side-by-side responsive layout for comparing responses.
// Requirements: 6.2
// ============================================================================

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ReviewSplitProps {
  children: React.ReactNode
  className?: string
}

/**
 * Split layout component for side-by-side response comparison
 * 
 * Requirements:
 * - 6.2: Present both responses in split-screen or toggle layout
 * 
 * On desktop: Side-by-side layout
 * On mobile: Toggle view with tabs
 */
export function ReviewSplit({ children, className }: ReviewSplitProps) {
  const [activeTab, setActiveTab] = useState<'mine' | 'partner'>('mine')

  // Get children as array for mobile toggle
  const childArray = Array.isArray(children) ? children : [children]

  return (
    <div className={cn('space-y-4', className)}>
      {/* Mobile toggle tabs */}
      <div className="flex gap-2 md:hidden">
        <button
          onClick={() => setActiveTab('mine')}
          className={cn(
            'flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors',
            activeTab === 'mine'
              ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
          )}
        >
          My Response
        </button>
        <button
          onClick={() => setActiveTab('partner')}
          className={cn(
            'flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors',
            activeTab === 'partner'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
          )}
        >
          Partner&apos;s Response
        </button>
      </div>

      {/* Desktop: Side-by-side layout */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-6">
        {childArray}
      </div>

      {/* Mobile: Toggle view */}
      <div className="md:hidden">
        {childArray.map((child, index) => (
          <div
            key={index}
            className={cn(
              index === 0 && activeTab !== 'mine' && 'hidden',
              index === 1 && activeTab !== 'partner' && 'hidden'
            )}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
