"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Mail01, Lock01, User01 } from "@untitledui/icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { signUp } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    try {
      await signUp({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
      });
      router.push("/chat");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-up failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16">
      <div className="flex flex-col gap-6 rounded-xl bg-primary p-8 shadow-xs ring-1 ring-secondary ring-inset">
        <div className="flex flex-col gap-2">
          <h1 className="text-display-xs font-semibold text-primary">Create account</h1>
          <p className="text-sm text-tertiary">
            Start chatting with grounded answers from the catalog and docs.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Sign-up failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-secondary">Name</span>
            <Input
              type="text"
              name="name"
              required
              autoComplete="name"
              placeholder="Jane Doe"
              icon={User01}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-secondary">Email</span>
            <Input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              icon={Mail01}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-secondary">Password</span>
            <Input
              type="password"
              name="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              icon={Lock01}
            />
          </label>

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-tertiary">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand-secondary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
