'use client'

// ============================================================================
// TIPTAP EDITOR
// ----------------------------------------------------------------------------
// Core Tiptap editor implementation with rich text formatting support.
// Requirements: 3.2, 3.3, 3.4
// ============================================================================

import { useEffect } from 'react'
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { cn } from '@/lib/utils'

interface TiptapEditorProps {
  content: string
  onUpdate: (content: string) => void
  editorRef: React.RefObject<Editor | null>
  disabled?: boolean
}

/**
 * Tiptap editor with rich text formatting support
 */
export function TiptapEditor({
  content,
  onUpdate,
  editorRef,
  disabled = false,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: {},
        orderedList: {},
        blockquote: {},
        codeBlock: {},
        code: {},
        bold: {},
        italic: {},
        strike: {},
        horizontalRule: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-rose-600 underline cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder: 'Share your thoughts...',
      }),
    ],
    content,
    editable: !disabled,
    immediatelyRender: false, // Prevent SSR hydration mismatch
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'tiptap-content min-h-[200px] outline-none',
      },
    },
  })

  // Store editor reference for toolbar access
  useEffect(() => {
    if (editor && editorRef) {
      (editorRef as React.MutableRefObject<Editor | null>).current = editor
    }
    return () => {
      if (editorRef) {
        (editorRef as React.MutableRefObject<Editor | null>).current = null
      }
    }
  }, [editor, editorRef])

  // Update editable state when disabled changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled)
    }
  }, [editor, disabled])

  // Sync content from external source (e.g., loading draft)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, []) // Only run on mount to set initial content

  return (
    <div
      className={cn(
        'rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4',
        'focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-500',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <EditorContent editor={editor} />
    </div>
  )
}
