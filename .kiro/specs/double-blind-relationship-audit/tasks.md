# Implementation Plan: Double-Blind Relationship Audit

## Overview

This implementation plan breaks down the Double-Blind Relationship Audit feature into discrete coding tasks. The approach prioritizes core infrastructure first, then builds out the data layer, followed by UI components, and finally integration and testing. Each task builds incrementally on previous work.

## Tasks

- [-] 1. Project Setup and Configuration
  - [x] 1.1 Initialize Next.js 16 project with TypeScript and Tailwind CSS
    - Create Next.js app with App Router
    - Configure TypeScript strict mode
    - Set up Tailwind CSS with Shadcn UI
    - _Requirements: 11.1, 11.4_
  
  - [x] 1.2 Configure Prisma with Neon PostgreSQL
    - Install Prisma and initialize schema
    - Configure Neon database connection
    - Create initial migration
    - _Requirements: 8.1_
  
  - [x] 1.3 Set up Better Auth with Google OAuth
    - Install and configure Better Auth
    - Set up Google OAuth provider
    - Implement whitelist check in auth callback
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [ ]* 1.4 Write property test for whitelist authentication
    - **Property 1: Whitelist Authentication Enforcement**
    - **Validates: Requirements 1.2, 1.3**

- [x] 2. Database Schema and Data Layer
  - [x] 2.1 Create Prisma schema with all models
    - Define User, Account, Session models for auth
    - Define Prompt, Response, Acknowledgment models
    - Add indexes and unique constraints
    - _Requirements: 8.1, 8.2_
  
  - [x] 2.2 Create Zod validation schemas
    - Define responseSchema with content validation
    - Define acknowledgmentSchema
    - Export TypeScript types from schemas
    - _Requirements: 9.1, 9.2_
  
  - [x] 2.3 Implement TypeScript types and status computation
    - Define PromptStatus type
    - Define PromptWithStatus interface
    - Implement computePromptStatus function
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6_
  
  - [ ]* 2.4 Write property test for status computation
    - **Property 2: Prompt Status Computation**
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.5, 2.6, 7.4, 7.5**
  
  - [x] 2.5 Seed database with pre-defined prompts
    - Create seed script with relationship prompts
    - Run seed to populate Prompt table
    - _Requirements: 2.1_

- [x] 3. Server Actions with Privacy Enforcement
  - [x] 3.1 Implement saveDraft server action
    - Add authentication check inside action
    - Validate input with Zod schema
    - Upsert response with isSubmitted=false
    - _Requirements: 3.6, 8.1, 8.6_
  
  - [ ]* 3.2 Write property test for draft save state
    - **Property 3: Response State Transitions (draft)**
    - **Validates: Requirements 3.6**
  
  - [x] 3.3 Implement submitResponse server action
    - Add authentication check inside action
    - Validate input and check not already submitted
    - Set isSubmitted=true and submittedAt timestamp
    - _Requirements: 3.8, 8.2, 8.6_
  
  - [ ]* 3.4 Write property test for submit state and immutability
    - **Property 3: Response State Transitions (submit)**
    - **Property 5: Submitted Response Immutability**
    - **Validates: Requirements 3.8, 3.9, 8.2**
  
  - [x] 3.5 Implement privacy-enforcing data fetcher
    - Create getPromptWithResponses with React.cache
    - Filter partner content based on requester submission status
    - Return PromptWithStatus with computed status
    - _Requirements: 4.1, 4.2, 4.3, 4.5_
  
  - [ ]* 3.6 Write property test for privacy enforcement
    - **Property 6: Double-Blind Privacy Enforcement**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.5**
  
  - [x] 3.7 Implement acknowledgeResponse server action
    - Add authentication check inside action
    - Create acknowledgment record with timestamp
    - Handle idempotency (upsert pattern)
    - _Requirements: 7.2, 7.3, 8.6_
  
  - [ ]* 3.8 Write property tests for acknowledgment
    - **Property 7: Acknowledgment Recording**
    - **Property 8: Acknowledgment Idempotency**
    - **Validates: Requirements 7.2, 7.3**
  
  - [ ]* 3.9 Write property test for server action authentication
    - **Property 9: Server Action Authentication**
    - **Validates: Requirements 8.6**

- [x] 4. Checkpoint - Core Backend Complete
  - Ensure all property tests pass
  - Verify database migrations work
  - Test auth flow manually
  - Ask the user if questions arise

- [x] 5. TanStack Query Hooks with Optimistic Updates
  - [x] 5.1 Set up TanStack Query provider
    - Install @tanstack/react-query
    - Create QueryClientProvider wrapper
    - Configure default options
    - _Requirements: 10.5_
  
  - [x] 5.2 Implement useSaveDraft mutation hook
    - Add optimistic update in onMutate
    - Add rollback in onError
    - Invalidate queries in onSettled
    - _Requirements: 10.1, 10.3_
  
  - [x] 5.3 Implement useSubmitResponse mutation hook
    - Add optimistic status update
    - Handle rollback on error
    - Invalidate prompt and prompts queries
    - _Requirements: 10.2, 10.3_
  
  - [x] 5.4 Implement useAcknowledge mutation hook
    - Add optimistic acknowledgment update
    - Handle rollback on error
    - Invalidate related queries
    - _Requirements: 10.4, 10.3_

- [x] 6. Dashboard Components
  - [x] 6.1 Create Dashboard page with prompt list
    - Fetch all prompts with status
    - Display in responsive grid layout
    - Use Suspense for loading state
    - _Requirements: 2.1, 11.5_
  
  - [x] 6.2 Create PromptCard component with status badge
    - Display prompt text preview
    - Show status badge with appropriate color
    - Handle click navigation to appropriate view
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_
  
  - [x] 6.3 Create StatusBadge component
    - Implement all 5 status variants
    - Use Shadcn Badge component
    - Add appropriate icons and colors
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6_

- [-] 7. Composer Components (Rich Text Editor)
  - [x] 7.1 Create Composer compound component structure
    - Create ComposerContext with state/actions/meta
    - Create ComposerProvider with state management
    - Export compound component object
    - _Requirements: 11.1, 11.2, 11.3_
  
  - [x] 7.2 Implement ComposerEditor with Tiptap
    - Dynamically import Tiptap for bundle optimization
    - Configure bold, italic, bullet list extensions
    - Connect to context state
    - _Requirements: 3.2, 3.3, 3.4, 11.4_
  
  - [x] 7.3 Implement ComposerToolbar
    - Add formatting buttons (bold, italic, bullets)
    - Connect to Tiptap editor commands
    - Style with Shadcn Button components
    - _Requirements: 3.2, 3.3, 3.4_
  
  - [x] 7.4 Implement ComposerActions
    - Add Save Draft button with loading state
    - Add Final Submit button with confirmation
    - Disable actions when submitted
    - _Requirements: 3.6, 3.8_
  
  - [x] 7.5 Create Compose page with form validation
    - Integrate React Hook Form with Zod
    - Display validation errors
    - Handle submitted state (read-only)
    - _Requirements: 3.1, 3.5, 3.7, 3.9, 9.1, 9.3_
  
  - [ ]* 7.6 Write property test for content round-trip
    - **Property 4: Content Round-Trip Preservation**
    - **Validates: Requirements 3.7, 8.3**
  
  - [ ]* 7.7 Write property test for empty response validation
    - **Property 10: Empty Response Validation**
    - **Validates: Requirements 9.1**

- [x] 8. Review Components
  - [x] 8.1 Create Review compound component structure
    - Create ReviewContext with state/actions/meta
    - Create ReviewProvider with response data
    - Export compound component object
    - _Requirements: 11.1, 11.2, 11.3_
  
  - [x] 8.2 Implement ReviewSplit layout
    - Create side-by-side responsive layout
    - Handle mobile toggle view
    - Style with Tailwind CSS
    - _Requirements: 6.2_
  
  - [x] 8.3 Implement ResponsePanel component
    - Display formatted HTML content
    - Show author label
    - Display submission timestamp
    - _Requirements: 6.3, 6.4_
  
  - [x] 8.4 Implement AcknowledgeButton component
    - Show "I have read this" button when not acknowledged
    - Show acknowledgment timestamp when acknowledged
    - Connect to useAcknowledge mutation
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [x] 8.5 Create Review page
    - Gate access based on both submitted
    - Display both responses with acknowledgment UI
    - Show overall status
    - _Requirements: 5.3, 6.1, 6.5_

- [x] 9. Authentication UI
  - [x] 9.1 Create Login page
    - Display "Sign in with Google" button
    - Show app description
    - Handle access denied state
    - _Requirements: 1.1, 1.3_
  
  - [x] 9.2 Create auth layout with session check
    - Redirect unauthenticated users to login
    - Show loading state during session check
    - _Requirements: 1.5_
  
  - [x] 9.3 Add logout functionality
    - Add logout button to dashboard header
    - Clear session and redirect to login
    - _Requirements: 1.6_

- [ ] 10. Checkpoint - Full Feature Complete
  - Ensure all tests pass
  - Test complete user flow manually
  - Verify privacy enforcement works correctly
  - Ask the user if questions arise

- [x] 11. Error Handling and Polish
  - [x] 11.1 Implement error boundaries
    - Create error boundary components
    - Add fallback UI for errors
    - Log errors for debugging
    - _Requirements: 8.5_
  
  - [x] 11.2 Add toast notifications
    - Install and configure toast library
    - Show success/error toasts for mutations
    - Handle optimistic update failures
    - _Requirements: 10.3_
  
  - [x] 11.3 Add loading states and skeletons
    - Create skeleton components for cards
    - Add loading spinners for actions
    - Use Suspense boundaries appropriately
    - _Requirements: 11.5_

- [ ] 12. Final Checkpoint
  - Run all property tests and unit tests
  - Verify all requirements are met
  - Ensure all tests pass
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional property-based tests that can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design document
- Checkpoints ensure incremental validation before proceeding
- The implementation follows Vercel composition patterns and React 19 best practices
