'use client'

// ============================================================================
// COMPOSER FRAME
// ----------------------------------------------------------------------------
// Layout wrapper for the Composer compound component.
// Requirements: 11.1, 4.1
// ============================================================================

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { useComposer } from './composer-context'

interface ComposerFrameProps {
  children: React.ReactNode
}

/**
 * Frame component providing layout structure for the Composer
 */
export function ComposerFrame({ children }: ComposerFrameProps) {
  const { meta } = useComposer()

  return (
    <Card className="w-full">
      <CardHeader>
        <MarkdownRenderer 
          content={meta.promptText} 
          className="text-lg font-medium text-zinc-900 dark:text-zinc-100"
        />
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  )
}
