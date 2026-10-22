import { SignIn } from "@clerk/nextjs";

/**
 * Temporary swap-in for the previous custom LoginPage (components/auth/LoginPage.tsx,
 * kept in place for easy rollback) — Clerk's prebuilt <SignIn> handles the
 * whole flow (validation, errors, redirect) on its own.
 */
export default function Login() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-b from-brand-50 via-surface-0 to-surface-50 px-4">
      <SignIn signUpUrl="/register" fallbackRedirectUrl="/gallery" />
    </div>
  );
}
