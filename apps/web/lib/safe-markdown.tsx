"use client";

import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

type Props = {
  /** Markdown source (untrusted). Sanitized before rendering. */
  source: string;
  className?: string;
};

/**
 * GitHub-flavored markdown rendered to React. `rehype-sanitize` strips
 * scripts, event handlers, and dangerous URLs; output is safe for model text.
 */
export function SafeMarkdown({ source, className }: Props) {
  return (
    <div className={cn("min-w-0", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          a: ({ node: _n, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
