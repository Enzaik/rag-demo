import { redirect } from "next/navigation";

import { getSession } from "@/lib/session";

import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-display-xs font-semibold text-primary">Settings</h1>
        <p className="text-sm text-tertiary">
          Signed in as <span className="font-medium text-secondary">{session.user.email}</span>
        </p>
      </header>

      <SettingsForm userId={session.user.id} />
    </div>
  );
}
