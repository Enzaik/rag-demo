"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PREFIX = "rag:openai-api-key:";

function storageKeyFor(userId: string) {
  return `${PREFIX}${userId}`;
}

/**
 * Per-user OpenAI API key stored in localStorage. Scoped by userId so a shared
 * browser doesn't leak one user's key to another account.
 *
 * Returns a synchronous snapshot of the key (null until mount has read storage).
 */
export function useApiKey(userId: string) {
  const [key, setKey] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const latestRef = useRef<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKeyFor(userId));
    setKey(stored);
    latestRef.current = stored;
    setHydrated(true);
  }, [userId]);

  const save = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) {
        window.localStorage.removeItem(storageKeyFor(userId));
        setKey(null);
        latestRef.current = null;
        return;
      }
      window.localStorage.setItem(storageKeyFor(userId), trimmed);
      setKey(trimmed);
      latestRef.current = trimmed;
    },
    [userId],
  );

  const clear = useCallback(() => {
    window.localStorage.removeItem(storageKeyFor(userId));
    setKey(null);
    latestRef.current = null;
  }, [userId]);

  /** Read the latest value without re-rendering (for submit-time reads). */
  const read = useCallback(() => latestRef.current, []);

  return { key, hydrated, save, clear, read };
}
