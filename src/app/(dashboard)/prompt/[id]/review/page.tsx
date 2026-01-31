import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getPromptWithResponses } from '@/lib/queries'
import { ReviewPage } from './_components/review-page'
import { Skeleton } from '@/components/ui/skeleton'

interface ReviewPageProps {
  params: Promise<{ id: string }>
}

/**
 * Review page for comparing and acknowledging responses
 * 
 * Requirements:
 * - 5.3: Display review view when both have submitted
 * - 6.1: Display comparison view when both submitted
 * - 6.5: Show acknowledgment status for each response
 */
export default async function ReviewRoute({ params }: ReviewPageProps) {
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

      <Suspense fallback={<ReviewSkeleton />}>
        <ReviewContent promptId={id} />
      </Suspense>
    </div>
  )
}

async function ReviewContent({ promptId }: { promptId: string }) {
  let promptData

  try {
    promptData = await getPromptWithResponses(promptId)
  } catch {
    notFound()
  }

  // Gate access: Both must have submitted to view review
  // Requirement 5.3: Display review view when both have submitted
  if (promptData.status === 'incomplete' || promptData.status === 'locked') {
    // User hasn't submitted yet - redirect to compose
    redirect(`/prompt/${promptId}`)
  }

  if (promptData.status === 'pending_partner') {
    // Partner hasn't submitted yet - show waiting message
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
          <ClockIcon className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          Waiting for Partner
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          Your partner hasn&apos;t submitted their response yet.
          <br />
          You&apos;ll be able to compare responses once they submit.
        </p>
        <Link
          href={`/prompt/${promptId}`}
          className="text-rose-500 hover:text-rose-600 font-medium"
        >
          ← View Your Response
        </Link>
      </div>
    )
  }

  // Both have submitted - show review
  return (
    <ReviewPage
      promptId={promptData.id}
      promptText={promptData.text}
      promptOrder={promptData.order}
      status={promptData.status}
      myResponse={promptData.myResponse}
      partnerResponse={promptData.partnerResponse}
    />
  )
}

function ReviewSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
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

function ClockIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
