'use client'

// ============================================================================
// REVIEW PROVIDER
// ----------------------------------------------------------------------------
// State management provider for the Review compound component.
// Requirements: 11.1, 11.2, 11.3
// ============================================================================

import { useCallback, useMemo } from 'react'
import {
  ReviewContext,
  type ReviewState,
  type ReviewActions,
  type ReviewMeta,
  type ResponseData,
  type PartnerResponseData,
} from './review-context'
import { useAcknowledge } from '@/lib/mutations'

interface ReviewProviderProps {
  promptId: string
  promptText: string
  promptOrder: number
  myResponse: ResponseData | null
  partnerResponse: PartnerResponseData | null
  children: React.ReactNode
}

/**
 * Provider component that manages Review state
 * 
 * Requirements:
 * - 11.1: Compound component pattern for complex UI
 * - 11.2: Decouple state management from UI using context
 * - 11.3: React 19 patterns
 */
export function ReviewProvider({
  promptId,
  promptText,
  promptOrder,
  myResponse,
  partnerResponse,
  children,
}: ReviewProviderProps) {
  // Mutations
  const acknowledgeMutation = useAcknowledge(promptId)

  // Actions
  const acknowledge = useCallback(async () => {
    if (!partnerResponse?.id) return
    await acknowledgeMutation.mutateAsync({ responseId: partnerResponse.id })
  }, [acknowledgeMutation, partnerResponse?.id])

  // Build context value
  const state: ReviewState = useMemo(
    () => ({
      myResponse,
      partnerResponse,
      isAcknowledging: acknowledgeMutation.isPending,
    }),
    [myResponse, partnerResponse, acknowledgeMutation.isPending]
  )

  const actions: ReviewActions = useMemo(
    () => ({
      acknowledge,
    }),
    [acknowledge]
  )

  const meta: ReviewMeta = useMemo(
    () => ({
      promptId,
      promptText,
      promptOrder,
    }),
    [promptId, promptText, promptOrder]
  )

  const contextValue = useMemo(
    () => ({
      state,
      actions,
      meta,
    }),
    [state, actions, meta]
  )

  return (
    <ReviewContext value={contextValue}>
      {children}
    </ReviewContext>
  )
}
