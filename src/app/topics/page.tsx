'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { suggestionSchema, type SuggestionInput } from '@/schemas/suggestion'
import { submitSuggestion } from '@/lib/actions/suggestion'

type Prompt = {
  id: string
  title: string
  text: string
  order: number
}

export default function TopicsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SuggestionInput>({
    resolver: zodResolver(suggestionSchema),
  })

  useEffect(() => {
    fetch('/topics/api')
      .then((res) => res.json())
      .then((data) => {
        setPrompts(data.prompts)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const onSubmit = async (data: SuggestionInput) => {
    try {
      setError(null)
      await submitSuggestion(data)
      setSubmitted(true)
      reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/20">
              <HeartIcon className="h-5 w-5 text-rose-500" />
            </div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              Topics We&apos;re Discussing
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 space-y-8">
        {/* Suggestion Form */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Suggest a Topic</CardTitle>
              <CardDescription>
                Have an idea for something we should discuss? Let us know!
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-4">
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    Thanks for your suggestion! 💚
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-2"
                    onClick={() => setSubmitted(false)}
                  >
                    Submit another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      placeholder="e.g., Mom, Uncle Joe"
                      {...register('name')}
                      className="mt-1"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="content" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Your Suggestion
                    </label>
                    <textarea
                      id="content"
                      rows={4}
                      placeholder="What topic should we discuss?"
                      {...register('content')}
                      className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
                    />
                    {errors.content && (
                      <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
                    )}
                  </div>
                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Prompts List */}
        <section>
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">
            Current Topics
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              ))}
            </div>
          ) : prompts.length === 0 ? (
            <p className="text-zinc-500">No topics yet.</p>
          ) : (
            <div className="space-y-3">
              {prompts.map((prompt) => (
                <Card key={prompt.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{prompt.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MarkdownRenderer 
                      content={prompt.text} 
                      className="text-sm text-zinc-600 dark:text-zinc-400"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  )
}
