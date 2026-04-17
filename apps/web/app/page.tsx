import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <div className="space-y-6">
        <p className="text-sm font-medium uppercase tracking-wider text-neutral-500">
          Alpine Forge
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Ask anything about our gear and policies.
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          A retrieval-augmented assistant grounded in our product catalog and support docs.
          Responses cite the exact source they come from.
        </p>
        <div className="flex gap-3 pt-4">
          <Link
            href="/login"
            className="inline-flex items-center rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
          >
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
