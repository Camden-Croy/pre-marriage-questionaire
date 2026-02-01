"use client"

import ReactMarkdown from "react-markdown"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  if (!content) {
    return null
  }

  return (
    <div className={cn("markdown-content", className)}>
      <ReactMarkdown 
        remarkPlugins={[remarkBreaks, remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
