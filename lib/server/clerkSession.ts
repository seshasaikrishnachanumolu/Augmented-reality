import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/server/prisma";
import type { SessionPayload } from "@/lib/server/auth";

/**
 * Temporary Clerk-backed replacement for lib/server/auth.ts's getSession().
 * Returns the same {userId, email, name} shape so every existing API route
 * (/api/projects, /api/projects/[id], /api/auth/me) keeps working without
 * changes beyond swapping the import.
 *
 * Project/CallInvite rows are keyed by a Prisma User.id string, but Clerk
 * has its own user ID format — so on first sight of a given Clerk user,
 * this upserts a matching Prisma User row (using the Clerk user id as the
 * primary key directly) and returns that id. This keeps every existing
 * foreign key relationship working unchanged.
 *
 * To roll back to the original custom-JWT auth: revert proxy.ts,
 * app/layout.tsx, app/login & app/register pages, and swap these
 * `getClerkSession` imports back to `getSession` from lib/server/auth.
 */
export async function getClerkSession(): Promise<SessionPayload | null> {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return null;

  const user = await currentUser();
  if (!user) return null;

  const email = user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? "";
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    user.username ||
    email ||
    "Mesha user";

  // Upsert so this row always reflects the latest Clerk profile info
  // (name/email can change in Clerk's dashboard) without needing a
  // webhook — this runs on every authenticated request, which is cheap
  // for a single indexed upsert against SQLite.
  await prisma.user.upsert({
    where: { id: clerkUserId },
    update: { email, name },
    create: {
      id: clerkUserId,
      email,
      name,
      // Clerk owns the real password; this column is unused for
      // Clerk-managed accounts but still required by the existing schema.
      passwordHash: "clerk-managed",
    },
  });

  return { userId: clerkUserId, email, name };
}
