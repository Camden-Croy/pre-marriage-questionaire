import { z } from "zod";

export const suggestionSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name is too long"),
  content: z
    .string()
    .min(10, "Suggestion must be at least 10 characters")
    .max(2000, "Suggestion is too long (max 2000 characters)"),
});

export type SuggestionInput = z.infer<typeof suggestionSchema>;
