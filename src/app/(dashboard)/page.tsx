import { Suspense } from "react";
import { getSession } from "@/lib/auth-server";
import { PromptList } from "./_components/prompt-list";
import { PromptListSkeleton } from "./_components/prompt-list-skeleton";

/**
 * Dashboard page displaying all prompts with status
 * 
 * Requirements: 2.1, 11.5
 * - Displays list of all pre-seeded prompts
 * - Uses Suspense for loading state
 */
export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Welcome back, {session?.user?.name || "Partner"}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Select a prompt below to share your thoughts.
        </p>
      </div>

      <Suspense fallback={<PromptListSkeleton />}>
        <PromptList />
      </Suspense>
    </div>
  );
}
