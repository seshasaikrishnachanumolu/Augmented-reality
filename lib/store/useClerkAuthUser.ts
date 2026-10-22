"use client";

import { useUser } from "@clerk/nextjs";
import type { AuthUser } from "@/lib/store/authStore";

/**
 * Temporary adapter so components built against the old
 * `useAuthStore((s) => s.user)` shape (`{id, email, name}`) can read the
 * same shape from Clerk instead, with a one-line import swap. See
 * lib/store/authStore.ts for the original custom-JWT version, kept in
 * place for rollback.
 */
export function useClerkAuthUser(): { user: AuthUser | null; isLoaded: boolean } {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) return { user: null, isLoaded };

  const email = user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? "";
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    user.username ||
    email ||
    "Mesha user";

  return { user: { id: user.id, email, name }, isLoaded: true };
}
