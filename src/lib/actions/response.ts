'use server'

// ============================================================================
// RESPONSE SERVER ACTIONS
// ----------------------------------------------------------------------------
// Server actions for saving drafts and submitting responses.
// Each action authenticates inside the function per Vercel security guidelines.
// Requirements: 3.6, 3.8, 8.1, 8.2, 8.6
// ============================================================================

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth-server'
import { db } from '@/lib/db'
import { responseSchema } from '@/schemas/response'

/**
 * Save a draft response (not submitted)
 * 
 * Requirements:
 * - 3.6: Save draft with isSubmitted=false
 * - 8.1: Persist to database via Prisma
 * - 8.6: Authenticate inside the action
 * 
 * @param data - The response data to save
 * @returns The saved response or an error
 */
export async function saveDraft(data: unknown) {
  // 1. Authenticate inside the action (Requirement 8.6)
  const session = await getSession()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  // 2. Validate input with Zod schema
  const validated = responseSchema.safeParse(data)
  if (!validated.success) {
    const firstIssue = validated.error.issues[0]
    throw new Error(firstIssue?.message ?? 'Invalid input')
  }

  const { promptId, content } = validated.data
  const userId = session.user.id

  // 3. Check if response exists and is already submitted
  const existing = await db.response.findUnique({
    where: {
      promptId_userId: {
        promptId,
        userId,
      },
    },
  })

  if (existing?.isSubmitted) {
    throw new Error('Cannot modify submitted response')
  }

  // 4. Upsert response with isSubmitted=false (Requirement 3.6)
  const response = await db.response.upsert({
    where: {
      promptId_userId: {
        promptId,
        userId,
      },
    },
    create: {
      promptId,
      userId,
      content,
      isSubmitted: false,
    },
    update: {
      content,
      updatedAt: new Date(),
    },
  })

  // 5. Revalidate the prompt page
  revalidatePath(`/prompt/${promptId}`)

  return response
}

/**
 * Submit a response (final, locked)
 * 
 * Requirements:
 * - 3.8: Set isSubmitted=true and submittedAt timestamp
 * - 8.2: Record submission timestamp
 * - 8.6: Authenticate inside the action
 * 
 * @param data - The response data to submit
 * @returns The submitted response or an error
 */
export async function submitResponse(data: unknown) {
  // 1. Authenticate inside the action (Requirement 8.6)
  const session = await getSession()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  // 2. Validate input with Zod schema
  const validated = responseSchema.safeParse(data)
  if (!validated.success) {
    const firstIssue = validated.error.issues[0]
    throw new Error(firstIssue?.message ?? 'Invalid input')
  }

  const { promptId, content } = validated.data
  const userId = session.user.id

  // 3. Check if response is already submitted
  const existing = await db.response.findUnique({
    where: {
      promptId_userId: {
        promptId,
        userId,
      },
    },
  })

  if (existing?.isSubmitted) {
    throw new Error('Already submitted')
  }

  // 4. Upsert response with isSubmitted=true and submittedAt (Requirements 3.8, 8.2)
  const response = await db.response.upsert({
    where: {
      promptId_userId: {
        promptId,
        userId,
      },
    },
    create: {
      promptId,
      userId,
      content,
      isSubmitted: true,
      submittedAt: new Date(),
    },
    update: {
      content,
      isSubmitted: true,
      submittedAt: new Date(),
    },
  })

  // 5. Revalidate paths
  revalidatePath(`/prompt/${promptId}`)
  revalidatePath('/') // Dashboard

  return response
}
