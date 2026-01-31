import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPromptWithResponses } from '@/lib/queries'
import { ComposePage } from './_components/compose-page'
import { Skeleton } from '@/components/ui/skeleton'

interface PromptPageProps {
  params: Promise<{ id: string }>
}

/**
 * Compose page for responding to a prompt
 * 
 * Requirements:
 * - 3.1: Display RTE with prompt question
 * - 3.5: Store content locally until saved
 * - 3.7: Load draft content when returning
 * - 3.9: Display submitted response as read-only
 * - 9.1: Validate response content
 * - 9.3: Display validation errors
 */
export default async function PromptPage({ params }: PromptPageProps) {
  const { id } = await params

  return (
    <div className="space-y-4">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <Suspense fallback={<ComposeSkeleton />}>
        <ComposeContent promptId={id} />
      </Suspense>
    </div>
  )
}

async function ComposeContent({ promptId }: { promptId: string }) {
  let promptData

  try {
    promptData = await getPromptWithResponses(promptId)
  } catch {
    notFound()
  }

  // If both have submitted, redirect to review
  if (promptData.status === 'ready_for_review' || promptData.status === 'done') {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          Both responses have been submitted.
        </p>
        <Link
          href={`/prompt/${promptId}/review`}
          className="text-rose-500 hover:text-rose-600 font-medium"
        >
          Go to Review →
        </Link>
      </div>
    )
  }

  return (
    <ComposePage
      promptId={promptData.id}
      promptText={promptData.text}
      initialContent={promptData.myResponse?.content ?? ''}
      isSubmitted={promptData.myResponse?.isSubmitted ?? false}
      status={promptData.status}
    />
  )
}

function ComposeSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-48 w-full" />
      <div className="flex justify-end gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-28" />
      </div>
    </div>
  )
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}
