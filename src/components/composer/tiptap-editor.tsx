'use client'

// ============================================================================
// TIPTAP EDITOR
// ----------------------------------------------------------------------------
// Core Tiptap editor implementation with bold, italic, and bullet list support.
// Requirements: 3.2, 3.3, 3.4
// ============================================================================

import { useEffect } from 'react'
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { cn } from '@/lib/utils'

interface TiptapEditorProps {
  content: string
  onUpdate: (content: string) => void
  editorRef: React.RefObject<Editor | null>
  disabled?: boolean
}

/**
 * Tiptap editor with formatting support
 * 
 * Requirements:
 * - 3.2: Bold text formatting (via StarterKit)
 * - 3.3: Italic text formatting (via StarterKit)
 * - 3.4: Bullet point lists (via StarterKit)
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
        // Enable bold, italic, and bullet list from StarterKit
        bold: {},
        italic: {},
        bulletList: {},
        // Disable features we don't need
        blockquote: false,
        codeBlock: false,
        heading: false,
        horizontalRule: false,
        orderedList: false,
        strike: false,
        code: false,
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
        class: cn(
          'min-h-[200px] outline-none prose prose-sm dark:prose-invert max-w-none',
          'prose-p:my-2 prose-ul:my-2 prose-li:my-0',
          '[&_.is-editor-empty:first-child::before]:text-zinc-400',
          '[&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
          '[&_.is-editor-empty:first-child::before]:float-left',
          '[&_.is-editor-empty:first-child::before]:h-0',
          '[&_.is-editor-empty:first-child::before]:pointer-events-none'
        ),
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
