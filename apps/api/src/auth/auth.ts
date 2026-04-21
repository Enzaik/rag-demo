import "../load-env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDb } from "@rag/db";

const isProd = process.env.NODE_ENV === "production";
const cookieDomain = process.env.COOKIE_DOMAIN;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env at the repo root and fill it in.",
  );
}

const secret = process.env.BETTER_AUTH_SECRET;
if (!secret) {
  throw new Error(
    "BETTER_AUTH_SECRET is not set. Copy .env.example to .env at the repo root and fill it in.",
  );
}

const { db } = createDb({ connectionString });

const webOrigin = process.env.WEB_ORIGIN!;

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  secret,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3001",
  trustedOrigins: [webOrigin],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: !!cookieDomain,
      domain: cookieDomain,
    },
    defaultCookieAttributes: {
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    },
  },
});

export type Auth = typeof auth;
