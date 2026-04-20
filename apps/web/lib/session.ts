import "server-only";

import { cookies } from "next/headers";

const API_INTERNAL_URL =
  process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type SessionUser = {
  id: string;
  email: string;
  name?: string;
};

export type Session = {
  user: SessionUser;
  session: { id: string; userId: string };
};

export async function getSession(): Promise<Session | null> {
  const cookieHeader = (await cookies())
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  if (!cookieHeader) return null;

  const res = await fetch(`${API_INTERNAL_URL}/api/auth/get-session`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = (await res.json()) as Session | null;
  if (!data?.user || !data.session) return null;
  return data;
}
