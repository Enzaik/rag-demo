import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <div className="flex flex-col gap-6">
        <p className="text-sm font-medium tracking-wider text-tertiary uppercase">Alpine Forge</p>
        <h1 className="text-display-md font-semibold tracking-tight text-primary">
          Ask anything about our gear and policies.
        </h1>
        <p className="text-lg text-tertiary">
          A retrieval-augmented assistant grounded in our product catalog and support docs.
          Responses cite the exact source they come from.
        </p>
        <div className="flex gap-3 pt-4">
          <Button asChild size="lg">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/register">Create account</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
