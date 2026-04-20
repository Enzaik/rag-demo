"use client";

import type { UIMessage } from "ai";

import { Button } from "@/components/ui/button";
import { SafeMarkdown } from "@/lib/safe-markdown";
import { cn } from "@/lib/utils";
import type { Citation } from "@rag/shared";

import { CitationPanel } from "./citation-panel";

export function ChatBubble({
  id,
  role,
  content,
  citations,
  openCitation,
  onOpenCitationChange,
}: {
  id: string;
  role: UIMessage["role"];
  content: string;
  citations?: Citation[];
  openCitation: string | null;
  onOpenCitationChange: (key: string | null) => void;
}) {
  const activeCitation = citations?.find(
    (c) => openCitation === `${id}:${c.chunkId}`,
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        role === "user" ? "items-end" : "items-start",
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
          role === "user"
            ? "bg-brand-solid text-white"
            : role === "data"
              ? "bg-tertiary/15 text-secondary ring-1 ring-secondary ring-inset"
              : "bg-secondary text-primary ring-1 ring-secondary ring-inset",
        )}
      >
        <SafeMarkdown
          source={content}
          className={cn(
            "prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 first:prose-p:mt-0 last:prose-p:mb-0",
            role === "user"
              ? // prose applies its own body color; invert + explicit children for brand bubbles
                "prose-invert text-white [&_p]:text-white [&_li]:text-white [&_blockquote]:text-white/95 [&_a]:text-white/90 [&_code]:bg-white/15 [&_code]:text-white [&_strong]:text-white [&_em]:text-white"
              : role === "data"
                ? "text-secondary prose-headings:text-secondary [&_a]:text-brand-secondary [&_code]:bg-utility-gray-100"
                : "text-secondary prose-headings:text-secondary [&_a]:text-brand-secondary [&_code]:bg-utility-gray-100",
          )}
        />
      </div>
      {role === "assistant" && citations && citations.length > 0 && (
        <div className="flex w-full max-w-[85%] flex-col gap-2">
          <div className="flex flex-wrap gap-1.5">
            {citations.map((c, i) => {
              const key = `${id}:${c.chunkId}`;
              const active = openCitation === key;
              return (
                <Button
                  key={c.chunkId}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenCitationChange(active ? null : key)}
                  aria-expanded={active}
                  className={cn(
                    "inline-flex h-auto min-h-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset transition",
                    "cursor-pointer hover:bg-utility-gray-100",
                    active
                      ? "bg-utility-brand-50 text-utility-brand-700 ring-utility-brand-200 hover:bg-utility-brand-50"
                      : "bg-utility-gray-50 text-utility-gray-700 ring-utility-gray-200",
                  )}
                >
                  [{i + 1}] {c.documentTitle ?? c.sourceRef ?? "source"}
                </Button>
              );
            })}
          </div>
          {activeCitation && <CitationPanel citation={activeCitation} />}
        </div>
      )}
    </div>
  );
}
