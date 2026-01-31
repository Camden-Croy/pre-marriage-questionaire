'use client'

// ============================================================================
// TANSTACK QUERY MUTATION HOOKS
// ----------------------------------------------------------------------------
// Client-side mutation hooks with optimistic updates for responsive UI.
// Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
// ============================================================================

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { saveDraft, submitResponse } from '@/lib/actions/response'
import { acknowledgeResponse } from '@/lib/actions/acknowledgment'
import { PromptWithStatus } from '@/types'

// ============================================================================
// QUERY KEYS
// ============================================================================

export const queryKeys = {
  prompts: ['prompts'] as const,
  prompt: (id: string) => ['prompt', id] as const,
}

// ============================================================================
// useSaveDraft MUTATION HOOK
// ----------------------------------------------------------------------------
// Saves a draft response with optimistic UI updates.
// Requirements: 10.1, 10.3
// ============================================================================

interface SaveDraftInput {
  promptId: string
  content: string
}

/**
 * Hook for saving draft responses with optimistic updates.
 * 
 * @param promptId - The ID of the prompt being edited
 * @returns TanStack Query mutation object
 * 
 * Requirements:
 * - 10.1: Optimistically update UI before server confirmation
 * - 10.3: Revert UI state on error, invalidate queries on settle
 */
export function useSaveDraft(promptId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SaveDraftInput) => saveDraft(data),
    
    // Optimistic update (Requirement 10.1)
    onMutate: async (newData) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.prompt(promptId) })

      // Snapshot the previous value for rollback
      const previousPrompt = queryClient.getQueryData<PromptWithStatus>(
        queryKeys.prompt(promptId)
      )

      // Optimistically update the cache
      queryClient.setQueryData<PromptWithStatus>(
        queryKeys.prompt(promptId),
        (old) => {
          if (!old) return old
          return {
            ...old,
            myResponse: old.myResponse
              ? {
                  ...old.myResponse,
                  content: newData.content,
                }
              : {
                  id: 'optimistic-' + Date.now(),
                  content: newData.content,
                  isSubmitted: false,
                  submittedAt: null,
                },
          }
        }
      )

      // Return context with previous value for rollback
      return { previousPrompt }
    },

    // Rollback on error (Requirement 10.3)
    onError: (_err, _newData, context) => {
      if (context?.previousPrompt) {
        queryClient.setQueryData(
          queryKeys.prompt(promptId),
          context.previousPrompt
        )
      }
      // Show error toast (Requirement 10.3)
      toast.error('Failed to save draft', {
        description: 'Your changes are preserved locally. Please try again.',
      })
    },

    // Show success toast and invalidate queries after mutation settles (Requirement 10.3)
    onSuccess: () => {
      toast.success('Draft saved')
    },

    // Invalidate queries after mutation settles (Requirement 10.3)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompt(promptId) })
    },
  })
}


// ============================================================================
// useSubmitResponse MUTATION HOOK
// ----------------------------------------------------------------------------
// Submits a response with optimistic status updates.
// Requirements: 10.2, 10.3
// ============================================================================

interface SubmitResponseInput {
  promptId: string
  content: string
}

/**
 * Hook for submitting responses with optimistic updates.
 * 
 * @param promptId - The ID of the prompt being submitted
 * @returns TanStack Query mutation object
 * 
 * Requirements:
 * - 10.2: Optimistically update status indicators
 * - 10.3: Revert UI state on error, invalidate queries on settle
 */
export function useSubmitResponse(promptId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SubmitResponseInput) => submitResponse(data),

    // Optimistic update (Requirement 10.2)
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.prompt(promptId) })
      await queryClient.cancelQueries({ queryKey: queryKeys.prompts })

      // Snapshot previous values for rollback
      const previousPrompt = queryClient.getQueryData<PromptWithStatus>(
        queryKeys.prompt(promptId)
      )
      const previousPrompts = queryClient.getQueryData<PromptWithStatus[]>(
        queryKeys.prompts
      )

      const now = new Date().toISOString()

      // Optimistically update the single prompt cache
      queryClient.setQueryData<PromptWithStatus>(
        queryKeys.prompt(promptId),
        (old) => {
          if (!old) return old
          
          // Determine new status based on partner's submission state
          const partnerSubmitted = old.partnerResponse?.isSubmitted ?? false
          const newStatus = partnerSubmitted ? 'ready_for_review' : 'pending_partner'

          return {
            ...old,
            status: newStatus,
            myResponse: {
              id: old.myResponse?.id ?? 'optimistic-' + Date.now(),
              content: newData.content,
              isSubmitted: true,
              submittedAt: now,
            },
            // If partner has submitted, we can now see their content
            partnerResponse: old.partnerResponse
              ? {
                  ...old.partnerResponse,
                  // Content will be revealed after server confirms
                }
              : null,
          }
        }
      )

      // Optimistically update the prompts list cache
      queryClient.setQueryData<PromptWithStatus[]>(
        queryKeys.prompts,
        (old) => {
          if (!old) return old
          return old.map((prompt) => {
            if (prompt.id !== promptId) return prompt
            
            const partnerSubmitted = prompt.partnerResponse?.isSubmitted ?? false
            const newStatus = partnerSubmitted ? 'ready_for_review' : 'pending_partner'

            return {
              ...prompt,
              status: newStatus,
              myResponse: {
                id: prompt.myResponse?.id ?? 'optimistic-' + Date.now(),
                content: newData.content,
                isSubmitted: true,
                submittedAt: now,
              },
            }
          })
        }
      )

      return { previousPrompt, previousPrompts }
    },

    // Rollback on error (Requirement 10.3)
    onError: (_err, _newData, context) => {
      if (context?.previousPrompt) {
        queryClient.setQueryData(
          queryKeys.prompt(promptId),
          context.previousPrompt
        )
      }
      if (context?.previousPrompts) {
        queryClient.setQueryData(queryKeys.prompts, context.previousPrompts)
      }
      // Show error toast (Requirement 10.3)
      toast.error('Failed to submit response', {
        description: 'Please try again.',
      })
    },

    // Show success toast (Requirement 10.3)
    onSuccess: () => {
      toast.success('Response submitted', {
        description: 'Your response has been locked and cannot be edited.',
      })
    },

    // Invalidate queries after mutation settles (Requirement 10.3)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompt(promptId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts })
    },
  })
}


// ============================================================================
// useAcknowledge MUTATION HOOK
// ----------------------------------------------------------------------------
// Records acknowledgment with optimistic updates.
// Requirements: 10.4, 10.3
// ============================================================================

interface AcknowledgeInput {
  responseId: string
}

/**
 * Hook for acknowledging partner responses with optimistic updates.
 * 
 * @param promptId - The ID of the prompt containing the response
 * @returns TanStack Query mutation object
 * 
 * Requirements:
 * - 10.4: Optimistically update acknowledgment status
 * - 10.3: Revert UI state on error, invalidate queries on settle
 */
export function useAcknowledge(promptId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AcknowledgeInput) => acknowledgeResponse(data),

    // Optimistic update (Requirement 10.4)
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.prompt(promptId) })
      await queryClient.cancelQueries({ queryKey: queryKeys.prompts })

      // Snapshot previous values for rollback
      const previousPrompt = queryClient.getQueryData<PromptWithStatus>(
        queryKeys.prompt(promptId)
      )
      const previousPrompts = queryClient.getQueryData<PromptWithStatus[]>(
        queryKeys.prompts
      )

      // Optimistically update the single prompt cache
      queryClient.setQueryData<PromptWithStatus>(
        queryKeys.prompt(promptId),
        (old) => {
          if (!old || !old.partnerResponse) return old

          // Update acknowledgment status
          const newPartnerResponse = {
            ...old.partnerResponse,
            hasMyAcknowledgment: true,
          }

          // Determine if status should change to 'done'
          const bothAcknowledged =
            newPartnerResponse.hasMyAcknowledgment &&
            newPartnerResponse.hasPartnerAcknowledgment

          return {
            ...old,
            status: bothAcknowledged ? 'done' : old.status,
            partnerResponse: newPartnerResponse,
          }
        }
      )

      // Optimistically update the prompts list cache
      queryClient.setQueryData<PromptWithStatus[]>(
        queryKeys.prompts,
        (old) => {
          if (!old) return old
          return old.map((prompt) => {
            if (prompt.id !== promptId || !prompt.partnerResponse) return prompt

            const newPartnerResponse = {
              ...prompt.partnerResponse,
              hasMyAcknowledgment: true,
            }

            const bothAcknowledged =
              newPartnerResponse.hasMyAcknowledgment &&
              newPartnerResponse.hasPartnerAcknowledgment

            return {
              ...prompt,
              status: bothAcknowledged ? 'done' : prompt.status,
              partnerResponse: newPartnerResponse,
            }
          })
        }
      )

      return { previousPrompt, previousPrompts }
    },

    // Rollback on error (Requirement 10.3)
    onError: (_err, _data, context) => {
      if (context?.previousPrompt) {
        queryClient.setQueryData(
          queryKeys.prompt(promptId),
          context.previousPrompt
        )
      }
      if (context?.previousPrompts) {
        queryClient.setQueryData(queryKeys.prompts, context.previousPrompts)
      }
      // Show error toast (Requirement 10.3)
      toast.error('Failed to record acknowledgment', {
        description: 'Please try again.',
      })
    },

    // Show success toast (Requirement 10.3)
    onSuccess: () => {
      toast.success('Response acknowledged')
    },

    // Invalidate queries after mutation settles (Requirement 10.3)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompt(promptId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts })
    },
  })
}
