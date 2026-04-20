import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";

export default async function ChatPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <div className="flex flex-col">
        <p className="text-sm font-medium tracking-wider text-tertiary uppercase">Chat</p>
        <h1 className="text-2xl font-semibold text-primary mb-1">
          Logged in user: {session.user.name ?? session.user.email}
        </h1>
        <p className="text-sm text-tertiary">
          Placeholder for chat UI.
        </p>
      </div>
    </main>
  );
}
