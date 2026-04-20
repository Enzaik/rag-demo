"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Key01 } from "@untitledui/icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApiKey } from "@/hooks/use-api-key";

function maskKey(key: string) {
  if (key.length <= 10) return "•".repeat(key.length);
  return `${key.slice(0, 4)}…${key.slice(-4)}`;
}

export function SettingsForm({ userId }: { userId: string }) {
  const { key, hydrated, save, clear } = useApiKey(userId);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  useEffect(() => {
    setDraft("");
    setStatus("idle");
  }, [key]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!draft.trim()) return;
    save(draft);
    setStatus("saved");
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary ring-inset">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-primary">OpenAI API key</h2>
        <p className="text-sm text-tertiary">
          Used for embeddings and chat completion. Stored in your browser&apos;s local
          storage, scoped to your account on this device — never sent to our database.
        </p>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2 text-sm ring-1 ring-secondary ring-inset">
        <span className="text-tertiary">Current key</span>
        <span className="font-mono text-secondary">
          {!hydrated ? "…" : key ? maskKey(key) : "not set"}
        </span>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-secondary">
            {key ? "Replace key" : "Set key"}
          </span>
          <Input
            type="password"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="sk-…"
            autoComplete="off"
            icon={Key01}
          />
        </label>

        <div className="flex items-center gap-2">
          <Button type="submit" size="sm" disabled={!draft.trim()}>
            Save
          </Button>
          {key && (
            <Button type="button" size="sm" variant="secondary" onClick={clear}>
              Remove
            </Button>
          )}
          {status === "saved" && (
            <span className="text-xs text-success-primary">Saved.</span>
          )}
        </div>
      </form>
    </section>
  );
}
