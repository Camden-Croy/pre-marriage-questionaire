'use client'

// ============================================================================
// COMPOSER FRAME
// ----------------------------------------------------------------------------
// Layout wrapper for the Composer compound component.
// Requirements: 11.1
// ============================================================================

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
        <CardTitle className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
          {meta.promptText}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  )
}
