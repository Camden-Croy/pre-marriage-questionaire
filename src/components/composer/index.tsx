'use client'

// ============================================================================
// COMPOSER COMPOUND COMPONENT
// ----------------------------------------------------------------------------
// Exports the Composer compound component following Vercel composition patterns.
// Requirements: 11.1, 11.2, 11.3
// ============================================================================

import { ComposerProvider } from './composer-provider'
import { ComposerFrame } from './composer-frame'
import { ComposerEditor } from './composer-editor'
import { ComposerToolbar } from './composer-toolbar'
import { ComposerActions } from './composer-actions'

// Re-export context hook for external use
export { useComposer } from './composer-context'
export type { ComposerState, ComposerActions as ComposerActionsType, ComposerMeta } from './composer-context'

/**
 * Composer compound component for rich text response editing
 * 
 * Usage:
 * ```tsx
 * <Composer.Provider promptId={id} promptText={text} initialContent={draft}>
 *   <Composer.Frame>
 *     <Composer.Toolbar />
 *     <Composer.Editor />
 *     <Composer.Actions />
 *   </Composer.Frame>
 * </Composer.Provider>
 * ```
 * 
 * Requirements:
 * - 11.1: Compound component pattern for complex UI
 * - 11.2: Decoupled state management via context
 * - 11.3: React 19 patterns with use() hook
 */
export const Composer = {
  Provider: ComposerProvider,
  Frame: ComposerFrame,
  Editor: ComposerEditor,
  Toolbar: ComposerToolbar,
  Actions: ComposerActions,
}

export default Composer
