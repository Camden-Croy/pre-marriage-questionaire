'use client'

// ============================================================================
// REVIEW PAGE CLIENT COMPONENT
// ----------------------------------------------------------------------------
// Client component integrating Review compound component for response comparison.
// Requirements: 5.3, 6.1, 6.5
// ============================================================================

import { Review } from '@/components/review'
import { StatusBadge } from '@/app/(dashboard)/_components/status-badge'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import type { PromptStatus } from '@/types'
import type { ResponseData, PartnerResponseData } from '@/components/review'

interface ReviewPageProps {
  promptId: string
  promptText: string
  promptOrder: number
  status: PromptStatus
  myResponse: ResponseData | null
  partnerResponse: PartnerResponseData | null
}

/**
 * Review page with response comparison
 * 
 * Requirements:
 * - 5.3: Display review view when both have submitted
 * - 6.1: Display comparison view when both submitted
 * - 6.5: Show acknowledgment status for each response
 */
export function ReviewPage({
  promptId,
  promptText,
  promptOrder,
  status,
  myResponse,
  partnerResponse,
}: ReviewPageProps) {
  const bothAcknowledged =
    partnerResponse?.hasMyAcknowledgment && partnerResponse?.hasPartnerAcknowledgment

  return (
    <div className="space-y-6">
      {/* Header with prompt and status */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Prompt {promptOrder}
          </span>
          <StatusBadge status={status} />
        </div>
        <MarkdownRenderer content={promptText} className="text-xl font-semibold text-zinc-900 dark:text-zinc-100" />
      </div>

      {/* Overall status message */}
      {status === 'ready_for_review' && (
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg px-4 py-3">
          <p className="text-sm text-purple-700 dark:text-purple-300">
            {!partnerResponse?.hasMyAcknowledgment && !partnerResponse?.hasPartnerAcknowledgment && (
              <>Both of you need to acknowledge each other&apos;s responses to complete this prompt.</>
            )}
            {partnerResponse?.hasMyAcknowledgment && !partnerResponse?.hasPartnerAcknowledgment && (
              <>You&apos;ve acknowledged your partner&apos;s response. Waiting for them to acknowledge yours.</>
            )}
            {!partnerResponse?.hasMyAcknowledgment && partnerResponse?.hasPartnerAcknowledgment && (
              <>Your partner has acknowledged your response. Please acknowledge theirs to complete this prompt.</>
            )}
          </p>
        </div>
      )}

      {status === 'done' && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-3">
          <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
            <CheckIcon className="h-4 w-4" />
            Both of you have read and acknowledged each other&apos;s responses. This prompt is complete!
          </p>
        </div>
      )}

      {/* Review compound component */}
      <Review.Provider
        promptId={promptId}
        promptText={promptText}
        promptOrder={promptOrder}
        myResponse={myResponse}
        partnerResponse={partnerResponse}
      >
        <Review.Split>
          <Review.ResponsePanel type="mine" />
          <Review.ResponsePanel type="partner">
            <Review.AcknowledgeButton />
          </Review.ResponsePanel>
        </Review.Split>
      </Review.Provider>
    </div>
  )
}

function CheckIcon({ className }: { className?: string }) {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
