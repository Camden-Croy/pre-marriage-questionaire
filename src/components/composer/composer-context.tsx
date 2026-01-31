'use client'

// ============================================================================
// COMPOSER CONTEXT
// ----------------------------------------------------------------------------
// Context for the Composer compound component following state/actions/meta pattern.
// Requirements: 11.1, 11.2, 11.3
// ============================================================================

import { createContext, use } from 'react'
import type { Editor } from '@tiptap/react'

/**
 * Composer state - current values
 */
export interface ComposerState {
  content: string
  isDirty: boolean
  isSaving: boolean
  isSubmitting: boolean
  isSubmitted: boolean
}

/**
 * Composer actions - functions to modify state
 */
export interface ComposerActions {
  updateContent: (content: string) => void
  saveDraft: () => Promise<void>
  submit: () => Promise<void>
}

/**
 * Composer meta - static information and refs
 */
export interface ComposerMeta {
  promptId: string
  promptText: string
  editorRef: React.RefObject<Editor | null>
}

/**
 * Combined context value following Vercel composition patterns
 */
export interface ComposerContextValue {
  state: ComposerState
  actions: ComposerActions
  meta: ComposerMeta
}

/**
 * Context for Composer compound component
 * Uses React 19's use() hook pattern instead of useContext()
 */
export const ComposerContext = createContext<ComposerContextValue | null>(null)

/**
 * Hook to access Composer context using React 19's use() hook
 * Requirement 11.3: Use React 19 patterns including use() hook
 */
export function useComposer(): ComposerContextValue {
  const context = use(ComposerContext)
  if (!context) {
    throw new Error('useComposer must be used within a ComposerProvider')
  }
  return context
}
