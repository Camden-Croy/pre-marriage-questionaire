'use client'

// ============================================================================
// COMPOSER PROVIDER
// ----------------------------------------------------------------------------
// State management provider for the Composer compound component.
// Requirements: 11.1, 11.2, 11.3
// ============================================================================

import { useState, useCallback, useRef, useMemo } from 'react'
import type { Editor } from '@tiptap/react'
import { ComposerContext, type ComposerState, type ComposerActions, type ComposerMeta } from './composer-context'
import { useSaveDraft, useSubmitResponse } from '@/lib/mutations'

interface ComposerProviderProps {
  promptId: string
  promptText: string
  initialContent?: string
  isSubmitted?: boolean
  children: React.ReactNode
}

/**
 * Provider component that manages Composer state
 * 
 * Requirements:
 * - 11.1: Compound component pattern for complex UI
 * - 11.2: Decouple state management from UI using context
 * - 11.3: React 19 patterns
 */
export function ComposerProvider({
  promptId,
  promptText,
  initialContent = '',
  isSubmitted = false,
  children,
}: ComposerProviderProps) {
  // State
  const [content, setContent] = useState(initialContent)
  const [isDirty, setIsDirty] = useState(false)
  
  // Editor ref for toolbar commands
  const editorRef = useRef<Editor | null>(null)
  
  // Mutations
  const saveDraftMutation = useSaveDraft(promptId)
  const submitMutation = useSubmitResponse(promptId)

  // Actions
  const updateContent = useCallback((newContent: string) => {
    setContent(newContent)
    setIsDirty(newContent !== initialContent)
  }, [initialContent])

  const saveDraft = useCallback(async () => {
    await saveDraftMutation.mutateAsync({ promptId, content })
    setIsDirty(false)
  }, [saveDraftMutation, promptId, content])

  const submit = useCallback(async () => {
    await submitMutation.mutateAsync({ promptId, content })
    setIsDirty(false)
  }, [submitMutation, promptId, content])

  // Build context value
  const state: ComposerState = useMemo(() => ({
    content,
    isDirty,
    isSaving: saveDraftMutation.isPending,
    isSubmitting: submitMutation.isPending,
    isSubmitted,
  }), [content, isDirty, saveDraftMutation.isPending, submitMutation.isPending, isSubmitted])

  const actions: ComposerActions = useMemo(() => ({
    updateContent,
    saveDraft,
    submit,
  }), [updateContent, saveDraft, submit])

  const meta: ComposerMeta = useMemo(() => ({
    promptId,
    promptText,
    editorRef,
  }), [promptId, promptText])

  const contextValue = useMemo(() => ({
    state,
    actions,
    meta,
  }), [state, actions, meta])

  return (
    <ComposerContext value={contextValue}>
      {children}
    </ComposerContext>
  )
}
