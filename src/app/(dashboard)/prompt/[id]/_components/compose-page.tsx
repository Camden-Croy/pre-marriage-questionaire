'use client'

// ============================================================================
// COMPOSE PAGE CLIENT COMPONENT
// ----------------------------------------------------------------------------
// Client component integrating Composer with React Hook Form and Zod validation.
// Requirements: 3.1, 3.5, 3.7, 3.9, 9.1, 9.3
// ============================================================================

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Composer } from '@/components/composer'
import { StatusBadge } from '@/app/(dashboard)/_components/status-badge'
import type { PromptStatus } from '@/types'

// Validation schema for the compose form
const composeFormSchema = z.object({
  content: z
    .string()
    .min(1, 'Response cannot be empty')
    .refine(
      (val) => {
        // Strip HTML tags and check if there's actual content
        const textContent = val.replace(/<[^>]*>/g, '').trim()
        return textContent.length > 0
      },
      'Response cannot be empty or contain only whitespace'
    ),
})

type ComposeFormValues = z.infer<typeof composeFormSchema>

interface ComposePageProps {
  promptId: string
  promptText: string
  initialContent: string
  isSubmitted: boolean
  status: PromptStatus
}

/**
 * Compose page with form validation
 * 
 * Requirements:
 * - 3.1: Display RTE with prompt question
 * - 3.5: Store content locally until saved
 * - 3.7: Load draft content when returning
 * - 3.9: Display submitted response as read-only
 * - 9.1: Validate response content
 * - 9.3: Display validation errors
 */
export function ComposePage({
  promptId,
  promptText,
  initialContent,
  isSubmitted,
  status,
}: ComposePageProps) {
  const form = useForm<ComposeFormValues>({
    resolver: zodResolver(composeFormSchema),
    defaultValues: {
      content: initialContent,
    },
    mode: 'onChange',
  })

  return (
    <FormProvider {...form}>
      <div className="space-y-4">
        {/* Status indicator */}
        <div className="flex items-center justify-between">
          <StatusBadge status={status} />
          {status === 'locked' && (
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Your partner has submitted. Submit your response to see theirs.
            </p>
          )}
          {status === 'pending_partner' && (
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Waiting for your partner to submit their response.
            </p>
          )}
        </div>

        {/* Validation errors */}
        {form.formState.errors.content && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md">
            {form.formState.errors.content.message}
          </div>
        )}

        {/* Composer */}
        <Composer.Provider
          promptId={promptId}
          promptText={promptText}
          initialContent={initialContent}
          isSubmitted={isSubmitted}
        >
          <Composer.Frame>
            <Composer.Toolbar />
            <Composer.Editor />
            <Composer.Actions />
          </Composer.Frame>
        </Composer.Provider>
      </div>
    </FormProvider>
  )
}
