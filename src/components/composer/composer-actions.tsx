'use client'

// ============================================================================
// COMPOSER ACTIONS
// ----------------------------------------------------------------------------
// Save Draft and Final Submit buttons with loading states and confirmation.
// Requirements: 3.6, 3.8
// ============================================================================

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useComposer } from './composer-context'

/**
 * Action buttons for saving draft and submitting response
 * 
 * Requirements:
 * - 3.6: Save Draft button with loading state
 * - 3.8: Final Submit button with confirmation
 */
export function ComposerActions() {
  const { state, actions } = useComposer()
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Don't show actions if already submitted
  if (state.isSubmitted) {
    return (
      <div className="flex justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <CheckIcon className="h-4 w-4 text-green-500" />
          Response submitted
        </div>
      </div>
    )
  }

  const handleSaveDraft = async () => {
    setError(null)
    try {
      await actions.saveDraft()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save draft')
    }
  }

  const handleSubmit = async () => {
    setError(null)
    try {
      await actions.submit()
      setShowConfirm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit response')
    }
  }

  const isDisabled = state.isSaving || state.isSubmitting
  const hasContent = state.content.trim().length > 0 && state.content !== '<p></p>'

  return (
    <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
      {error && (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md">
          {error}
        </div>
      )}

      {showConfirm ? (
        <SubmitConfirmation
          onConfirm={handleSubmit}
          onCancel={() => setShowConfirm(false)}
          isSubmitting={state.isSubmitting}
        />
      ) : (
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isDisabled || !state.isDirty}
          >
            {state.isSaving ? (
              <>
                <LoadingSpinner />
                Saving...
              </>
            ) : (
              'Save Draft'
            )}
          </Button>

          <Button
            type="button"
            onClick={() => setShowConfirm(true)}
            disabled={isDisabled || !hasContent}
            className="bg-rose-500 hover:bg-rose-600 text-white"
          >
            Final Submit
          </Button>
        </div>
      )}
    </div>
  )
}

interface SubmitConfirmationProps {
  onConfirm: () => void
  onCancel: () => void
  isSubmitting: boolean
}

function SubmitConfirmation({ onConfirm, onCancel, isSubmitting }: SubmitConfirmationProps) {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-4">
      <div className="flex items-start gap-3">
        <WarningIcon className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-amber-800 dark:text-amber-200">
            Are you sure you want to submit?
          </h4>
          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
            Once submitted, your response cannot be edited. Your partner will be able to see it after they submit their own response.
          </p>
          <div className="flex gap-2 mt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner />
                  Submitting...
                </>
              ) : (
                'Yes, Submit'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
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

function WarningIcon({ className }: { className?: string }) {
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
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}
