// ============================================================================
// TYPESCRIPT TYPES FOR DOUBLE-BLIND RELATIONSHIP AUDIT
// ----------------------------------------------------------------------------
// Core domain types and status computation logic
// Requirements: 2.2, 2.3, 2.4, 2.5, 2.6
// ============================================================================

/**
 * Prompt status representing the current state in the workflow
 * 
 * State Machine:
 * - incomplete: Neither partner has submitted
 * - pending_partner: Current user submitted, partner has not
 * - locked: Partner submitted, current user has not
 * - ready_for_review: Both submitted, acknowledgments incomplete
 * - done: Both submitted and both acknowledged
 */
export type PromptStatus =
  | "incomplete" // User has not submitted (Requirement 2.2)
  | "pending_partner" // User submitted, partner has not (Requirement 2.3)
  | "locked" // Partner submitted, user has not (Requirement 2.4)
  | "ready_for_review" // Both submitted, acknowledgments incomplete (Requirement 2.5)
  | "done"; // Both submitted and acknowledged (Requirement 2.6)

/**
 * Response state for status computation
 */
export interface ResponseState {
  isSubmitted: boolean;
}

/**
 * Partner response state including acknowledgment info
 */
export interface PartnerResponseState {
  isSubmitted: boolean;
  hasMyAcknowledgment: boolean;
  hasPartnerAcknowledgment: boolean;
}

/**
 * Full prompt data with computed status
 */
export interface PromptWithStatus {
  id: string;
  title: string;
  text: string;
  order: number;
  status: PromptStatus;
  myResponse: {
    id: string;
    content: string;
    isSubmitted: boolean;
    submittedAt: string | null;
  } | null;
  partnerResponse: {
    id: string;
    isSubmitted: boolean;
    submittedAt: string | null;
    content: string | null; // null if privacy-filtered
    hasMyAcknowledgment: boolean;
    hasPartnerAcknowledgment: boolean;
  } | null;
}

/**
 * Compute the status of a prompt based on response and acknowledgment states
 * 
 * @param myResponse - Current user's response state (null if no response)
 * @param partnerResponse - Partner's response state with acknowledgment info (null if no response)
 * @returns The computed PromptStatus
 * 
 * Requirements validated:
 * - 2.2: "Incomplete" when user has not submitted
 * - 2.3: "Pending Partner" when user submitted but partner has not
 * - 2.4: "Locked" when partner submitted but user has not
 * - 2.5: "Ready for Review" when both submitted but acknowledgments incomplete
 * - 2.6: "Done" when both submitted and both acknowledged
 */
export function computePromptStatus(
  myResponse: ResponseState | null,
  partnerResponse: PartnerResponseState | null
): PromptStatus {
  const mySubmitted = myResponse?.isSubmitted ?? false;
  const partnerSubmitted = partnerResponse?.isSubmitted ?? false;

  // Neither has submitted
  if (!mySubmitted && !partnerSubmitted) {
    return "incomplete";
  }

  // Only I have submitted
  if (mySubmitted && !partnerSubmitted) {
    return "pending_partner";
  }

  // Only partner has submitted
  if (!mySubmitted && partnerSubmitted) {
    return "locked";
  }

  // Both have submitted - check acknowledgments
  const bothAcknowledged =
    (partnerResponse?.hasMyAcknowledgment ?? false) &&
    (partnerResponse?.hasPartnerAcknowledgment ?? false);

  return bothAcknowledged ? "done" : "ready_for_review";
}
