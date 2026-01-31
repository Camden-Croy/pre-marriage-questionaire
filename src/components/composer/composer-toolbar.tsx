'use client'

// ============================================================================
// COMPOSER TOOLBAR
// ----------------------------------------------------------------------------
// Formatting toolbar with bold, italic, and bullet list buttons.
// Requirements: 3.2, 3.3, 3.4
// ============================================================================

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useComposer } from './composer-context'

/**
 * Toolbar component with formatting buttons
 * 
 * Requirements:
 * - 3.2: Bold text formatting button
 * - 3.3: Italic text formatting button
 * - 3.4: Bullet point list button
 */
export function ComposerToolbar() {
  const { state, meta } = useComposer()
  const editor = meta.editorRef.current

  // Don't show toolbar if submitted (read-only mode)
  if (state.isSubmitted) {
    return null
  }

  const isDisabled = state.isSaving || state.isSubmitting || !editor

  return (
    <div className="flex gap-1 p-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleBold().run()}
        isActive={editor?.isActive('bold') ?? false}
        disabled={isDisabled}
        title="Bold (Ctrl+B)"
      >
        <BoldIcon className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        isActive={editor?.isActive('italic') ?? false}
        disabled={isDisabled}
        title="Italic (Ctrl+I)"
      >
        <ItalicIcon className="h-4 w-4" />
      </ToolbarButton>

      <div className="w-px bg-zinc-200 dark:bg-zinc-700 mx-1" />

      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        isActive={editor?.isActive('bulletList') ?? false}
        disabled={isDisabled}
        title="Bullet List"
      >
        <ListIcon className="h-4 w-4" />
      </ToolbarButton>
    </div>
  )
}

interface ToolbarButtonProps {
  onClick: () => void
  isActive: boolean
  disabled: boolean
  title: string
  children: React.ReactNode
}

function ToolbarButton({ onClick, isActive, disabled, title, children }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'h-8 w-8',
        isActive && 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
      )}
    >
      {children}
    </Button>
  )
}

// Icon components
function BoldIcon({ className }: { className?: string }) {
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
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    </svg>
  )
}

function ItalicIcon({ className }: { className?: string }) {
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
      <line x1="19" x2="10" y1="4" y2="4" />
      <line x1="14" x2="5" y1="20" y2="20" />
      <line x1="15" x2="9" y1="4" y2="20" />
    </svg>
  )
}

function ListIcon({ className }: { className?: string }) {
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
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  )
}
