'use client'

// ============================================================================
// REVIEW COMPOUND COMPONENT
// ----------------------------------------------------------------------------
// Exports the Review compound component following Vercel composition patterns.
// Requirements: 11.1, 11.2, 11.3
// ============================================================================

import { ReviewProvider } from './review-provider'
import { ReviewSplit } from './review-split'
import { ResponsePanel } from './response-panel'
import { AcknowledgeButton } from './acknowledge-button'

// Re-export context hook for external use
export { useReview } from './review-context'
export type {
  ReviewState,
  ReviewActions,
  ReviewMeta,
  ResponseData,
  PartnerResponseData,
} from './review-context'

/**
 * Review compound component for viewing and acknowledging responses
 * 
 * Usage:
 * ```tsx
 * <Review.Provider
 *   promptId={id}
 *   promptText={text}
 *   promptOrder={order}
 *   myResponse={myResponse}
 *   partnerResponse={partnerResponse}
 * >
 *   <Review.Split>
 *     <Review.ResponsePanel type="mine" />
 *     <Review.ResponsePanel type="partner">
 *       <Review.AcknowledgeButton />
 *     </Review.ResponsePanel>
 *   </Review.Split>
 * </Review.Provider>
 * ```
 * 
 * Requirements:
 * - 11.1: Compound component pattern for complex UI
 * - 11.2: Decoupled state management via context
 * - 11.3: React 19 patterns with use() hook
 */
export const Review = {
  Provider: ReviewProvider,
  Split: ReviewSplit,
  ResponsePanel: ResponsePanel,
  AcknowledgeButton: AcknowledgeButton,
}

export default Review
