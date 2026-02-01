'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { suggestionSchema } from '@/schemas/suggestion'

export async function submitSuggestion(data: unknown) {
  const validated = suggestionSchema.safeParse(data)
  if (!validated.success) {
    const firstIssue = validated.error.issues[0]
    throw new Error(firstIssue?.message ?? 'Invalid input')
  }

  const { name, content } = validated.data

  const suggestion = await db.suggestion.create({
    data: {
      name,
      content,
    },
  })

  revalidatePath('/topics')

  return suggestion
}
