import { SignUp } from "@clerk/nextjs";

/**
 * Temporary swap-in for the previous custom RegisterPage (components/auth/RegisterPage.tsx,
 * kept in place for easy rollback) — Clerk's prebuilt <SignUp> handles the
 * whole flow (validation, errors, redirect) on its own.
 */
export default function Register() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-b from-brand-50 via-surface-0 to-surface-50 px-4">
      <SignUp signInUrl="/login" fallbackRedirectUrl="/gallery" />
    </div>
  );
}
