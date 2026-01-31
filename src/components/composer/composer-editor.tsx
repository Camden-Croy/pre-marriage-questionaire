'use client'

// ============================================================================
// COMPOSER EDITOR
// ----------------------------------------------------------------------------
// Rich text editor using Tiptap with dynamic import for bundle optimization.
// Requirements: 3.2, 3.3, 3.4, 11.4
// ============================================================================

import { useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useComposer } from './composer-context'

// Dynamic import for Tiptap to optimize bundle size (Requirement 11.4)
const TiptapEditor = dynamic(
  () => import('./tiptap-editor').then((mod) => mod.TiptapEditor),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  }
)

/**
 * Composer Editor component with Tiptap rich text editing
 * 
 * Requirements:
 * - 3.2: Support bold text formatting
 * - 3.3: Support italic text formatting
 * - 3.4: Support bullet point lists
 * - 11.4: Dynamic import for bundle optimization
 */
export function ComposerEditor() {
  const { state, actions, meta } = useComposer()

  // If already submitted, show read-only content
  if (state.isSubmitted) {
    return (
      <div 
        className="min-h-[200px] rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: state.content }}
      />
    )
  }

  return (
    <Suspense fallback={<EditorSkeleton />}>
      <TiptapEditor
        content={state.content}
        onUpdate={actions.updateContent}
        editorRef={meta.editorRef}
        disabled={state.isSaving || state.isSubmitting}
      />
    </Suspense>
  )
}

/**
 * Loading skeleton for the editor
 */
function EditorSkeleton() {
  return (
    <div className="min-h-[200px] rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 animate-pulse">
      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4 mb-3" />
      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2 mb-3" />
      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-5/6" />
    </div>
  )
}
