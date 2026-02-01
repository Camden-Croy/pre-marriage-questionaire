# Implementation Plan: Prompt Title and Markdown Rendering

## Overview

This plan implements the addition of a `title` field to the Prompt model and markdown rendering for prompt text. Tasks are ordered to build incrementally: database changes first, then type updates, then UI components.

## Tasks

- [x] 1. Update Prisma schema and run migration
  - [x] 1.1 Add `title` field to Prompt model in `prisma/schema.prisma`
    - Add `title String` field after `id` field
    - Field is required (no `?` modifier)
    - _Requirements: 1.1, 1.4_
  - [x] 1.2 Update seed script with titles for all prompts
    - Add `title` property to each prompt object in `RELATIONSHIP_PROMPTS` array
    - Use the first line of each prompt text as the title (e.g., "Daily Logistics & Priorities")
    - _Requirements: 1.3_
  - [x] 1.3 Generate Prisma client and run migration
    - Run `npx prisma generate` to update generated client
    - Run `npx prisma migrate dev --name add-prompt-title` to create migration
    - Run `npx prisma db seed` to populate titles
    - _Requirements: 1.4_

- [x] 2. Update TypeScript types and queries
  - [x] 2.1 Add `title` field to `PromptWithStatus` interface in `src/types/index.ts`
    - Add `title: string` after `id` field
    - _Requirements: 2.1, 2.2_
  - [x] 2.2 Update queries to include title field
    - Update `getPromptWithResponses` in `src/lib/queries.ts` to select and return `title`
    - Update `getAllPromptsWithStatus` to include `title` in returned objects
    - _Requirements: 2.2_

- [x] 3. Checkpoint - Verify database and type changes
  - Ensure Prisma client generates without errors
  - Ensure TypeScript compiles without errors
  - Ask the user if questions arise

- [x] 4. Install react-markdown and create MarkdownRenderer component
  - [x] 4.1 Install react-markdown package
    - Run `npm install react-markdown`
    - _Requirements: 5.1_
  - [x] 4.2 Create MarkdownRenderer component at `src/components/ui/markdown-renderer.tsx`
    - Create a client component that accepts `content` and `className` props
    - Use `react-markdown` to render content
    - Apply Tailwind prose classes: `prose prose-sm dark:prose-invert`
    - Handle empty content gracefully
    - _Requirements: 4.1, 4.3, 4.5, 5.2, 5.3_
  - [ ]* 4.3 Write unit tests for MarkdownRenderer
    - Test heading rendering
    - Test bold/italic rendering
    - Test list rendering
    - Test plain text rendering
    - Test empty string handling
    - _Requirements: 4.3, 4.5_
  - [ ]* 4.4 Write property test for markdown rendering
    - **Property 3: Markdown Rendering Produces Valid Output**
    - **Validates: Requirements 4.1, 4.2**
  - [ ]* 4.5 Write property test for XSS sanitization
    - **Property 4: XSS Sanitization**
    - **Validates: Requirements 5.2**

- [x] 5. Update PromptCard to display title
  - [x] 5.1 Update PromptCard component in `src/app/(dashboard)/_components/prompt-card.tsx`
    - Change header to display `prompt.title` as primary text
    - Keep "Prompt {order}" as secondary label (smaller text above title)
    - Add `line-clamp-2` to title for truncation
    - _Requirements: 3.1, 3.2, 3.3_
  - [ ]* 5.2 Write property test for PromptCard rendering
    - **Property 2: PromptCard Renders Title and Order**
    - **Validates: Requirements 3.1, 3.2**

- [x] 6. Update ComposerFrame to render markdown
  - [x] 6.1 Update ComposerFrame in `src/components/composer/composer-frame.tsx`
    - Import MarkdownRenderer component
    - Replace `{meta.promptText}` with `<MarkdownRenderer content={meta.promptText} />`
    - Adjust CardTitle styling if needed for markdown content
    - _Requirements: 4.1_

- [x] 7. Update ReviewPage to render markdown
  - [x] 7.1 Update ReviewPage in `src/app/(dashboard)/prompt/[id]/review/_components/review-page.tsx`
    - Import MarkdownRenderer component
    - Replace `<h1>{promptText}</h1>` with `<MarkdownRenderer content={promptText} className="text-xl" />`
    - _Requirements: 4.2_

- [ ] 8. Final checkpoint - Verify all changes
  - Ensure all tests pass
  - Verify prompt cards display titles correctly
  - Verify markdown renders in composer and review pages
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The seed script already has descriptive first lines in each prompt that can be extracted as titles
- react-markdown sanitizes HTML by default, providing XSS protection without additional configuration
- Property tests validate universal correctness properties across many inputs
