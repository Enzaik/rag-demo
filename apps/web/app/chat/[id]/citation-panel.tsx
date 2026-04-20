"use client";

import { SafeMarkdown } from "@/lib/safe-markdown";
import type { Citation } from "@rag/shared";

export function CitationPanel({ citation }: { citation: Citation }) {
  const title = citation.documentTitle ?? citation.sourceRef ?? "Source";
  const body = citation.content?.trim();

  return (
    <div className="rounded-lg bg-primary p-3 text-xs ring-1 ring-secondary ring-inset">
      <div className="mb-1 flex items-center justify-between gap-2 text-tertiary">
        <span className="truncate font-semibold text-secondary">{title}</span>
        <span className="shrink-0">
          {citation.source} · {citation.sourceRef} · score{" "}
          {citation.score.toFixed(3)}
        </span>
      </div>
      {body ? (
        <SafeMarkdown
          source={body}
          className="prose prose-sm max-w-none text-secondary prose-headings:text-secondary prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 [&_a]:text-brand-secondary"
        />
      ) : (
        <p className="whitespace-pre-wrap text-secondary">
          (passage unavailable — reindex to capture content)
        </p>
      )}
    </div>
  );
}
