// ============================================================================
// PRIVACY-ENFORCING DATA FETCHERS
// ----------------------------------------------------------------------------
// Server-side data fetchers with double-blind privacy enforcement.
// Uses React.cache for request deduplication.
// Requirements: 4.1, 4.2, 4.3, 4.5
// ============================================================================

import { cache } from 'react'
import { getSession } from '@/lib/auth-server'
import { db } from '@/lib/db'
import { computePromptStatus, PromptWithStatus } from '@/types'

/**
 * Get a prompt with responses, enforcing double-blind privacy
 * 
 * Privacy Rules (Requirements 4.1, 4.2, 4.3):
 * - Partner content is ONLY returned if the requesting user has submitted
 * - If requester hasn't submitted, only return existence status of partner's response
 * 
 * @param promptId - The ID of the prompt to fetch
 * @returns PromptWithStatus with privacy-filtered partner content
 */
export const getPromptWithResponses = cache(async (promptId: string): Promise<PromptWithStatus> => {
  // 1. Authenticate (Requirement 4.5 - server-side enforcement)
  const session = await getSession()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const currentUserId = session.user.id

  // 2. Fetch prompt with all responses and acknowledgments
  const prompt = await db.prompt.findUnique({
    where: { id: promptId },
    include: {
      responses: {
        include: {
          acknowledgments: true,
        },
      },
    },
  })

  if (!prompt) {
    throw new Error('Prompt not found')
  }

  // 3. Separate my response from partner's response
  const myResponse = prompt.responses.find((r) => r.userId === currentUserId)
  const partnerResponse = prompt.responses.find((r) => r.userId !== currentUserId)

  // 4. Build partner response with privacy filtering
  let partnerResponseData: PromptWithStatus['partnerResponse'] = null

  if (partnerResponse) {
    // Check if I have acknowledged partner's response
    const myAcknowledgment = partnerResponse.acknowledgments.find(
      (a) => a.userId === currentUserId
    )
    
    // Check if partner has acknowledged my response (if I have one)
    let partnerAcknowledgedMine = false
    if (myResponse) {
      const partnerAck = myResponse.acknowledgments?.find(
        (a) => a.userId !== currentUserId
      )
      partnerAcknowledgedMine = !!partnerAck
    }

    partnerResponseData = {
      id: partnerResponse.id,
      isSubmitted: partnerResponse.isSubmitted,
      submittedAt: partnerResponse.submittedAt?.toISOString() ?? null,
      // CRITICAL PRIVACY ENFORCEMENT (Requirements 4.1, 4.2):
      // Only include content if current user has submitted
      content: myResponse?.isSubmitted ? partnerResponse.content : null,
      hasMyAcknowledgment: !!myAcknowledgment,
      hasPartnerAcknowledgment: partnerAcknowledgedMine,
    }
  }

  // 5. Compute status
  const status = computePromptStatus(
    myResponse ? { isSubmitted: myResponse.isSubmitted } : null,
    partnerResponseData
  )

  // 6. Return PromptWithStatus
  return {
    id: prompt.id,
    text: prompt.text,
    order: prompt.order,
    status,
    myResponse: myResponse
      ? {
          id: myResponse.id,
          content: myResponse.content,
          isSubmitted: myResponse.isSubmitted,
          submittedAt: myResponse.submittedAt?.toISOString() ?? null,
        }
      : null,
    partnerResponse: partnerResponseData,
  }
})

/**
 * Get all prompts with status for the dashboard
 * 
 * @returns Array of prompts with computed status
 */
export const getAllPromptsWithStatus = cache(async (): Promise<PromptWithStatus[]> => {
  // 1. Authenticate
  const session = await getSession()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const currentUserId = session.user.id

  // 2. Fetch all prompts with responses
  const prompts = await db.prompt.findMany({
    orderBy: { order: 'asc' },
    include: {
      responses: {
        include: {
          acknowledgments: true,
        },
      },
    },
  })

  // 3. Map to PromptWithStatus with privacy filtering
  return prompts.map((prompt) => {
    const myResponse = prompt.responses.find((r) => r.userId === currentUserId)
    const partnerResponse = prompt.responses.find((r) => r.userId !== currentUserId)

    let partnerResponseData: PromptWithStatus['partnerResponse'] = null

    if (partnerResponse) {
      const myAcknowledgment = partnerResponse.acknowledgments.find(
        (a) => a.userId === currentUserId
      )
      
      let partnerAcknowledgedMine = false
      if (myResponse) {
        const partnerAck = myResponse.acknowledgments?.find(
          (a) => a.userId !== currentUserId
        )
        partnerAcknowledgedMine = !!partnerAck
      }

      partnerResponseData = {
        id: partnerResponse.id,
        isSubmitted: partnerResponse.isSubmitted,
        submittedAt: partnerResponse.submittedAt?.toISOString() ?? null,
        // Privacy filtering: only show content if I submitted
        content: myResponse?.isSubmitted ? partnerResponse.content : null,
        hasMyAcknowledgment: !!myAcknowledgment,
        hasPartnerAcknowledgment: partnerAcknowledgedMine,
      }
    }

    const status = computePromptStatus(
      myResponse ? { isSubmitted: myResponse.isSubmitted } : null,
      partnerResponseData
    )

    return {
      id: prompt.id,
      text: prompt.text,
      order: prompt.order,
      status,
      myResponse: myResponse
        ? {
            id: myResponse.id,
            content: myResponse.content,
            isSubmitted: myResponse.isSubmitted,
            submittedAt: myResponse.submittedAt?.toISOString() ?? null,
          }
        : null,
      partnerResponse: partnerResponseData,
    }
  })
})
