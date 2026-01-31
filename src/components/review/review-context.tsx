'use client'

// ============================================================================
// REVIEW CONTEXT
// ----------------------------------------------------------------------------
// Context for the Review compound component following state/actions/meta pattern.
// Requirements: 11.1, 11.2, 11.3
// ============================================================================

import { createContext, use } from 'react'

/**
 * Response data for display
 */
export interface ResponseData {
  id: string
  content: string
  isSubmitted: boolean
  submittedAt: string | null
}

/**
 * Partner response data with acknowledgment info
 */
export interface PartnerResponseData {
  id: string
  content: string | null
  isSubmitted: boolean
  submittedAt: string | null
  hasMyAcknowledgment: boolean
  hasPartnerAcknowledgment: boolean
}

/**
 * Review state - current values
 */
export interface ReviewState {
  myResponse: ResponseData | null
  partnerResponse: PartnerResponseData | null
  isAcknowledging: boolean
}

/**
 * Review actions - functions to modify state
 */
export interface ReviewActions {
  acknowledge: () => Promise<void>
}

/**
 * Review meta - static information
 */
export interface ReviewMeta {
  promptId: string
  promptText: string
  promptOrder: number
}

/**
 * Combined context value following Vercel composition patterns
 */
export interface ReviewContextValue {
  state: ReviewState
  actions: ReviewActions
  meta: ReviewMeta
}

/**
 * Context for Review compound component
 * Uses React 19's use() hook pattern instead of useContext()
 */
export const ReviewContext = createContext<ReviewContextValue | null>(null)

/**
 * Hook to access Review context using React 19's use() hook
 * Requirement 11.3: Use React 19 patterns including use() hook
 */
export function useReview(): ReviewContextValue {
  const context = use(ReviewContext)
  if (!context) {
    throw new Error('useReview must be used within a ReviewProvider')
  }
  return context
}
