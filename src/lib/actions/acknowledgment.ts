'use server'

// ============================================================================
// ACKNOWLEDGMENT SERVER ACTIONS
// ----------------------------------------------------------------------------
// Server actions for recording acknowledgments.
// Each action authenticates inside the function per Vercel security guidelines.
// Requirements: 7.2, 7.3, 8.6
// ============================================================================

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth-server'
import { db } from '@/lib/db'
import { acknowledgmentSchema } from '@/schemas/response'

/**
 * Acknowledge that the current user has read a partner's response
 * 
 * Requirements:
 * - 7.2: Record acknowledgment with timestamp
 * - 7.3: Handle idempotency (upsert pattern - no duplicates)
 * - 8.6: Authenticate inside the action
 * 
 * @param data - The acknowledgment data containing responseId
 * @returns The acknowledgment record or an error
 */
export async function acknowledgeResponse(data: unknown) {
  // 1. Authenticate inside the action (Requirement 8.6)
  const session = await getSession()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  // 2. Validate input with Zod schema
  const validated = acknowledgmentSchema.safeParse(data)
  if (!validated.success) {
    const firstIssue = validated.error.issues[0]
    throw new Error(firstIssue?.message ?? 'Invalid input')
  }

  const { responseId } = validated.data
  const userId = session.user.id

  // 3. Verify the response exists and belongs to the partner (not self)
  const response = await db.response.findUnique({
    where: { id: responseId },
    include: { prompt: true },
  })

  if (!response) {
    throw new Error('Response not found')
  }

  // Cannot acknowledge your own response
  if (response.userId === userId) {
    throw new Error('Cannot acknowledge your own response')
  }

  // Response must be submitted to be acknowledged
  if (!response.isSubmitted) {
    throw new Error('Cannot acknowledge an unsubmitted response')
  }

  // 4. Check if the current user has submitted their response for this prompt
  // (Required to view partner's response per double-blind rules)
  const myResponse = await db.response.findUnique({
    where: {
      promptId_userId: {
        promptId: response.promptId,
        userId,
      },
    },
  })

  if (!myResponse?.isSubmitted) {
    throw new Error('You must submit your response before acknowledging')
  }

  // 5. Upsert acknowledgment (idempotent - Requirement 7.3)
  const acknowledgment = await db.acknowledgment.upsert({
    where: {
      responseId_userId: {
        responseId,
        userId,
      },
    },
    create: {
      responseId,
      userId,
      acknowledgedAt: new Date(),
    },
    update: {
      // No update needed - idempotent operation
      // The original acknowledgedAt is preserved
    },
  })

  // 6. Revalidate paths
  revalidatePath(`/prompt/${response.promptId}`)
  revalidatePath(`/prompt/${response.promptId}/review`)
  revalidatePath('/') // Dashboard

  return acknowledgment
}
