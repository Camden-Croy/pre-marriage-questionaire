"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { StatusBadge } from "./status-badge";
import type { PromptWithStatus } from "@/types";

interface PromptCardProps {
  prompt: PromptWithStatus;
}

/**
 * Prompt card component for dashboard display
 * 
 * Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 3.1, 3.2, 3.3
 * - Displays prompt title as primary header
 * - Shows "Prompt {order}" as secondary label
 * - Shows status badge with appropriate color
 * - Navigates to appropriate view based on status
 */
export function PromptCard({ prompt }: PromptCardProps) {
  const href = getPromptHref(prompt);

  return (
    <Link href={href} className="block">
      <Card className="h-full transition-all hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Prompt {prompt.order}
              </span>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2">
                {prompt.title}
              </h3>
            </div>
            <StatusBadge status={prompt.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-3">
            <MarkdownRenderer content={prompt.text} className="prose-sm" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * Determine the appropriate URL based on prompt status
 * 
 * Requirement 2.7: Navigate to appropriate view based on status
 * - incomplete/locked: Compose view
 * - pending_partner: Compose view (read-only)
 * - ready_for_review/done: Review view
 */
function getPromptHref(prompt: PromptWithStatus): string {
  switch (prompt.status) {
    case "incomplete":
    case "locked":
    case "pending_partner":
      return `/prompt/${prompt.id}`;
    case "ready_for_review":
    case "done":
      return `/prompt/${prompt.id}/review`;
    default:
      return `/prompt/${prompt.id}`;
  }
}
