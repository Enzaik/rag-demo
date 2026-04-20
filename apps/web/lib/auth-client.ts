const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type AuthError = { message: string };

async function post(path: string, body: unknown): Promise<void> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as AuthError;
    throw new Error(err.message || `Request failed (${res.status})`);
  }
}

export function signUp(input: { email: string; password: string; name: string }) {
  return post("/api/auth/sign-up/email", input);
}

export function signIn(input: { email: string; password: string }) {
  return post("/api/auth/sign-in/email", input);
}

export function signOut() {
  return post("/api/auth/sign-out", {});
}
