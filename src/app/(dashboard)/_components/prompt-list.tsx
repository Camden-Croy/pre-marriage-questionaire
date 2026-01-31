import { getAllPromptsWithStatus } from "@/lib/queries";
import { PromptCard } from "./prompt-card";

/**
 * Server component that fetches and displays all prompts
 * 
 * Requirements: 2.1, 11.5
 * - Fetches all prompts with status
 * - Displays in responsive grid layout
 */
export async function PromptList() {
  const prompts = await getAllPromptsWithStatus();

  if (prompts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500 dark:text-zinc-400">
          No prompts available yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
}
