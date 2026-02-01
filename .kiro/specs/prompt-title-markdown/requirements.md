# Requirements Document

## Introduction

This feature adds a `title` field to the Prompt model and implements markdown rendering for prompt text throughout the application. Currently, prompts are displayed with generic "Prompt {order}" headers and raw text. This enhancement will provide meaningful titles for each prompt and render the prompt text as properly formatted markdown.

## Glossary

- **Prompt**: A pre-seeded relationship question/topic stored in the database that users respond to
- **Prompt_Card**: The dashboard component that displays a prompt preview with status badge
- **Composer_Frame**: The layout wrapper component that displays the prompt text when composing a response
- **Review_Page**: The page component that displays both partners' responses for comparison
- **Markdown_Renderer**: A component that converts markdown text to formatted HTML using react-markdown

## Requirements

### Requirement 1: Add Title Field to Prompt Model

**User Story:** As a developer, I want prompts to have a dedicated title field, so that prompts can be displayed with meaningful headers instead of generic "Prompt {order}" labels.

#### Acceptance Criteria

1. THE Prompt model SHALL include a required `title` field of type String
2. WHEN a prompt is created, THE Database SHALL require a non-empty title value
3. THE Seed_Script SHALL populate the title field for all existing prompts with descriptive titles
4. WHEN the migration is applied, THE Database SHALL add the title column to the prompt table

### Requirement 2: Update Type Definitions

**User Story:** As a developer, I want the TypeScript types to reflect the new title field, so that type safety is maintained throughout the application.

#### Acceptance Criteria

1. THE PromptWithStatus interface SHALL include a `title` field of type string
2. WHEN accessing prompt data, THE Application SHALL have type-safe access to the title field

### Requirement 3: Display Prompt Titles in Dashboard

**User Story:** As a user, I want to see meaningful prompt titles on the dashboard, so that I can quickly identify what each prompt is about.

#### Acceptance Criteria

1. WHEN displaying a prompt card, THE Prompt_Card SHALL show the prompt title as the primary header
2. WHEN displaying a prompt card, THE Prompt_Card SHALL show "Prompt {order}" as a secondary label
3. THE Prompt_Card SHALL truncate long titles appropriately to maintain card layout

### Requirement 4: Render Prompt Text as Markdown

**User Story:** As a user, I want prompt text to be rendered as formatted markdown, so that I can read prompts with proper headings, lists, and emphasis.

#### Acceptance Criteria

1. WHEN displaying prompt text in the Composer_Frame, THE Markdown_Renderer SHALL convert markdown syntax to formatted HTML
2. WHEN displaying prompt text in the Review_Page header, THE Markdown_Renderer SHALL convert markdown syntax to formatted HTML
3. THE Markdown_Renderer SHALL support standard markdown elements including headings, bold, italic, lists, and paragraphs
4. THE Markdown_Renderer SHALL apply consistent styling that matches the application's design system
5. THE Markdown_Renderer SHALL handle prompt text that contains no markdown gracefully

### Requirement 5: Install and Configure Markdown Library

**User Story:** As a developer, I want to use a well-maintained markdown library, so that markdown rendering is reliable and secure.

#### Acceptance Criteria

1. THE Application SHALL use the react-markdown library for markdown rendering
2. THE Markdown_Renderer SHALL sanitize output to prevent XSS vulnerabilities
3. THE Markdown_Renderer SHALL be implemented as a reusable component
