import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";

/**
 * Get the whitelist emails from environment variable
 * Called at runtime to ensure env var is available
 */
function getWhitelistEmails(): string[] {
  const emails = process.env.WHITELIST_EMAILS;
  if (!emails) {
    console.warn("WHITELIST_EMAILS not configured");
    return [];
  }
  return emails.split(",").map((e) => e.trim().toLowerCase());
}

/**
 * Check if an email is in the whitelist
 * @param email - The email to check
 * @returns true if the email is in the whitelist
 */
export function isEmailWhitelisted(email: string): boolean {
  const whitelist = getWhitelistEmails();
  const normalizedEmail = email.toLowerCase().trim();
  return whitelist.includes(normalizedEmail);
}

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
});

// Export auth types for use in other files
export type Session = typeof auth.$Infer.Session;
