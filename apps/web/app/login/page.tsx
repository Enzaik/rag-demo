"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Mail01, Lock01 } from "@untitledui/icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    try {
      await signIn({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
      });
      router.push("/chat");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16">
      <div className="flex flex-col gap-6 rounded-xl bg-primary p-8 shadow-xs ring-1 ring-secondary ring-inset">
        <div className="flex flex-col gap-2">
          <h1 className="text-display-xs font-semibold text-primary">Sign in</h1>
          <p className="text-sm text-tertiary">
            Welcome back. Continue where you left off.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Sign-in failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
              autoComplete="current-password"
              placeholder="••••••••"
              icon={Lock01}
            />
          </label>

          <Checkbox name="remember" label="Remember me" />

          <Button disabled={pending} className="w-full" variant="default">
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-tertiary">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-brand-secondary hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
