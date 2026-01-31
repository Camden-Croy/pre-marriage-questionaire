'use client'

// ============================================================================
// RESPONSE PANEL COMPONENT
// ----------------------------------------------------------------------------
// Displays formatted HTML content with author label and timestamp.
// Requirements: 6.3, 6.4
// ============================================================================

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useReview } from './review-context'

interface ResponsePanelProps {
  type: 'mine' | 'partner'
  children?: React.ReactNode
  className?: string
}

/**
 * Response panel component for displaying a single response
 * 
 * Requirements:
 * - 6.3: Clearly label which response belongs to which partner
 * - 6.4: Display the full formatted content of both responses
 */
export function ResponsePanel({ type, children, className }: ResponsePanelProps) {
  const { state } = useReview()

  const response = type === 'mine' ? state.myResponse : state.partnerResponse
  const label = type === 'mine' ? 'My Response' : "Partner's Response"
  const accentColor = type === 'mine' ? 'rose' : 'blue'

  if (!response) {
    return (
      <Card className={cn('h-full', className)}>
        <CardHeader>
          <CardTitle className="text-base">{label}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm italic">
            No response submitted yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  const submittedDate = response.submittedAt
    ? new Date(response.submittedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <Card
      className={cn(
        'h-full',
        type === 'mine' && 'border-rose-200 dark:border-rose-900/50',
        type === 'partner' && 'border-blue-200 dark:border-blue-900/50',
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle
            className={cn(
              'text-base',
              type === 'mine' && 'text-rose-700 dark:text-rose-400',
              type === 'partner' && 'text-blue-700 dark:text-blue-400'
            )}
          >
            {label}
          </CardTitle>
          {submittedDate && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {submittedDate}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formatted HTML content */}
        <div
          className={cn(
            'prose prose-sm dark:prose-invert max-w-none',
            'prose-p:my-2 prose-ul:my-2 prose-li:my-0.5',
            `prose-strong:text-${accentColor}-700 dark:prose-strong:text-${accentColor}-400`
          )}
          dangerouslySetInnerHTML={{ __html: response.content || '' }}
        />

        {/* Children slot for acknowledge button */}
        {children}
      </CardContent>
    </Card>
  )
}
