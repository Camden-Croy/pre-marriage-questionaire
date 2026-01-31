# Requirements Document

## Introduction

The Double-Blind Relationship Audit is a web application that enables two partners to independently answer pre-seeded relationship prompts without bias. The system enforces a strict "double-blind" protocol where neither partner can see the other's response until both have submitted their own answers. This prevents one partner from tailoring their response based on what the other wrote. After mutual submission, a structured "Read & Acknowledge" phase ensures both partners have genuinely reviewed each other's perspectives before marking a topic as complete.

The application is built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Shadcn UI, Better Auth (Google OAuth), Neon PostgreSQL, Prisma ORM, React Hook Form with Zod validation, Tiptap rich text editor, and TanStack Query for state management.

## Glossary

- **Audit_System**: The core application managing the double-blind relationship audit workflow
- **Partner**: One of the two authorized users of the system
- **Prompt**: A pre-seeded question or topic that both partners must answer
- **Response**: A partner's written answer to a specific prompt
- **Draft**: An unsaved or saved-but-not-submitted response
- **Submission**: The final, locked version of a response that cannot be edited
- **Acknowledgment**: A partner's confirmation that they have read the other's response
- **Review_Phase**: The stage where both partners can view and acknowledge each other's responses
- **Whitelist**: The strict list of two email addresses permitted to access the system
- **Dashboard**: The main view displaying all prompts and their statuses
- **RTE**: Rich Text Editor (Tiptap) component for composing responses
- **Server_Action**: Next.js server-side function for mutations with built-in authentication

## Requirements

### Requirement 1: Authentication and Access Control

**User Story:** As a partner, I want to securely sign in with my Google account, so that only my partner and I can access our private audit.

#### Acceptance Criteria

1. WHEN a user initiates login, THE Audit_System SHALL redirect to Google OAuth via Better Auth
2. WHEN a user successfully authenticates with Google, THE Audit_System SHALL verify the email against the whitelist of exactly two permitted email addresses
3. IF a user's email is not in the whitelist, THEN THE Audit_System SHALL reject the login and display an access denied message
4. IF a user's email is in the whitelist, THEN THE Audit_System SHALL create or retrieve the user session and redirect to the Dashboard
5. WHEN a user is authenticated, THE Audit_System SHALL maintain the session until explicit logout or session expiration
6. WHEN a user clicks logout, THE Audit_System SHALL terminate the session and redirect to the login page

### Requirement 2: Dashboard Display

**User Story:** As a partner, I want to see all prompts with clear status indicators, so that I can track our progress through the audit.

#### Acceptance Criteria

1. WHEN an authenticated user visits the Dashboard, THE Audit_System SHALL display a list of all pre-seeded prompts
2. WHEN displaying a prompt where the current user has not submitted a response, THE Audit_System SHALL show status "Incomplete"
3. WHEN displaying a prompt where the current user has submitted but the partner has not, THE Audit_System SHALL show status "Pending Partner"
4. WHEN displaying a prompt where the partner has submitted but the current user has not, THE Audit_System SHALL show status "Locked"
5. WHEN displaying a prompt where both partners have submitted but acknowledgments are incomplete, THE Audit_System SHALL show status "Ready for Review"
6. WHEN displaying a prompt where both partners have submitted and both have acknowledged, THE Audit_System SHALL show status "Done"
7. WHEN a user clicks on a prompt, THE Audit_System SHALL navigate to the appropriate view based on the prompt's status

### Requirement 3: Response Composition with Rich Text Editor

**User Story:** As a partner, I want to compose my responses with basic formatting options, so that I can express my thoughts clearly.

#### Acceptance Criteria

1. WHEN a user opens an incomplete prompt, THE Audit_System SHALL display the RTE with the prompt question
2. THE RTE SHALL support bold text formatting
3. THE RTE SHALL support italic text formatting
4. THE RTE SHALL support bullet point lists
5. WHEN a user types in the RTE, THE Audit_System SHALL store content locally until explicitly saved
6. WHEN a user clicks "Save Draft", THE Audit_System SHALL persist the response with isSubmitted set to false
7. WHEN a user has a saved draft and returns to the prompt, THE Audit_System SHALL load the draft content into the RTE
8. WHEN a user clicks "Final Submit", THE Audit_System SHALL persist the response with isSubmitted set to true and lock the response from further edits
9. IF a user attempts to edit a submitted response, THEN THE Audit_System SHALL prevent any modifications and display the response as read-only

### Requirement 4: Double-Blind Privacy Enforcement

**User Story:** As a partner, I want my response to remain hidden from my partner until they submit their own, so that we both answer honestly without influence.

#### Acceptance Criteria

1. WHEN the API receives a request for prompt data, THE Audit_System SHALL include the partner's response body only if the requesting user's response isSubmitted equals true
2. WHEN the current user has not submitted their response, THE Audit_System SHALL return only the existence status of the partner's response, not its content
3. WHEN both partners have submitted their responses, THE Audit_System SHALL allow both to view each other's response content
4. THE Audit_System SHALL enforce privacy filtering at the Server_Action layer with authentication checks inside each action
5. WHEN a user submits their response, THE Audit_System SHALL immediately unlock the partner's response for viewing if the partner has already submitted
6. THE Audit_System SHALL never rely solely on client-side filtering for privacy enforcement

### Requirement 5: Non-Linear Prompt Navigation

**User Story:** As a partner, I want to answer prompts in any order I choose, so that I can address topics when I feel ready.

#### Acceptance Criteria

1. WHEN viewing the Dashboard, THE Audit_System SHALL allow navigation to any prompt regardless of other prompts' completion status
2. WHEN a user selects an incomplete prompt, THE Audit_System SHALL display the composition view
3. WHEN a user selects a "Ready for Review" prompt, THE Audit_System SHALL display the review view
4. WHEN a user selects a "Done" prompt, THE Audit_System SHALL display the completed review view in read-only mode

### Requirement 6: Review and Comparison View

**User Story:** As a partner, I want to see both responses side-by-side after mutual submission, so that I can compare our perspectives.

#### Acceptance Criteria

1. WHEN both partners have submitted responses for a prompt, THE Audit_System SHALL display a comparison view
2. THE Audit_System SHALL present both responses in a split-screen or toggle layout
3. THE Audit_System SHALL clearly label which response belongs to which partner
4. THE Audit_System SHALL display the full formatted content of both responses
5. WHEN viewing the comparison, THE Audit_System SHALL show the acknowledgment status for each response

### Requirement 7: Mandatory Acknowledgment

**User Story:** As a partner, I want to confirm I've read my partner's response, so that we both know the topic has been genuinely reviewed.

#### Acceptance Criteria

1. WHEN viewing the partner's response in the review phase, THE Audit_System SHALL display an "I have read this" button
2. WHEN a user clicks "I have read this", THE Audit_System SHALL record the acknowledgment with a timestamp
3. IF a user has already acknowledged the partner's response, THEN THE Audit_System SHALL display the acknowledgment timestamp instead of the button
4. WHEN both partners have acknowledged each other's responses, THE Audit_System SHALL update the prompt status to "Done"
5. THE Audit_System SHALL prevent marking a prompt as "Done" until both acknowledgments are recorded

### Requirement 8: Data Persistence and Integrity

**User Story:** As a partner, I want my responses and progress to be reliably saved, so that I don't lose my work.

#### Acceptance Criteria

1. WHEN a user saves a draft, THE Audit_System SHALL persist the response to the Neon PostgreSQL database via Prisma
2. WHEN a user submits a response, THE Audit_System SHALL set isSubmitted to true and record the submission timestamp
3. THE Audit_System SHALL store response content as rich text (HTML) preserving all Tiptap formatting
4. WHEN loading a prompt, THE Audit_System SHALL retrieve the latest saved state from the database
5. IF a database operation fails, THEN THE Audit_System SHALL display an error message and preserve the user's input locally
6. THE Audit_System SHALL authenticate all Server_Actions by verifying the session inside each action before performing mutations

### Requirement 9: Form Validation

**User Story:** As a partner, I want clear feedback when my input is invalid, so that I can correct issues before submission.

#### Acceptance Criteria

1. WHEN a user attempts to submit an empty response, THE Audit_System SHALL prevent submission and display a validation error
2. THE Audit_System SHALL validate response content using Zod schemas with React Hook Form
3. WHEN validation fails, THE Audit_System SHALL display specific error messages near the relevant fields
4. THE Audit_System SHALL validate all form inputs on both client and server sides

### Requirement 10: Optimistic UI Updates

**User Story:** As a partner, I want the interface to feel responsive, so that I have a smooth experience while using the app.

#### Acceptance Criteria

1. WHEN a user saves a draft, THE Audit_System SHALL optimistically update the UI before server confirmation using TanStack Query
2. WHEN a user submits a response, THE Audit_System SHALL optimistically update the status indicators
3. IF an optimistic update fails server validation, THEN THE Audit_System SHALL revert the UI state and display an error
4. WHEN a user acknowledges a response, THE Audit_System SHALL optimistically update the acknowledgment status
5. THE Audit_System SHALL use TanStack Query mutations with onMutate, onError, and onSettled handlers for optimistic updates

### Requirement 11: Component Architecture

**User Story:** As a developer, I want well-structured components, so that the codebase is maintainable and extensible.

#### Acceptance Criteria

1. THE Audit_System SHALL use compound component patterns for complex UI elements like the RTE and review views
2. THE Audit_System SHALL decouple state management from UI using context providers
3. THE Audit_System SHALL use React 19 patterns including the use() hook instead of useContext()
4. THE Audit_System SHALL dynamically import heavy components like Tiptap to optimize bundle size
5. THE Audit_System SHALL use Suspense boundaries to stream content and show loading states
