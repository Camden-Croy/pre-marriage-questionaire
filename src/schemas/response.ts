// ============================================================================
// ZOD VALIDATION SCHEMAS FOR DOUBLE-BLIND RELATIONSHIP AUDIT
// ----------------------------------------------------------------------------
// These schemas validate form inputs on both client and server sides.
// Requirements: 9.1, 9.2
// ============================================================================

import { z } from "zod";

/**
 * Schema for validating response content
 * - Content must not be empty (Requirement 9.1)
 * - Content has a maximum length to prevent abuse
 */
export const responseSchema = z.object({
  promptId: z.string().cuid({ message: "Invalid prompt ID" }),
  content: z
    .string()
    .min(1, "Response cannot be empty")
    .max(50000, "Response exceeds maximum length (50,000 characters)")
    .refine(
      (val) => val.trim().length > 0,
      "Response cannot be empty or contain only whitespace"
    ),
});

/**
 * Schema for validating acknowledgment requests
 */
export const acknowledgmentSchema = z.object({
  responseId: z.cuid({ message: "Invalid response ID" }),
});

// ============================================================================
// EXPORTED TYPESCRIPT TYPES
// ============================================================================

export type ResponseInput = z.infer<typeof responseSchema>;
export type AcknowledgmentInput = z.infer<typeof acknowledgmentSchema>;
