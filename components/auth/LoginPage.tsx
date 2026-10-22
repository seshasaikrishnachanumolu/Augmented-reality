"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/lib/store/authStore";

export function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    const result = await login(email.trim(), password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/gallery");
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-b from-brand-50 via-surface-0 to-surface-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm rounded-3xl border border-surface-200 bg-surface-0 p-8 shadow-soft-lg"
      >
        <div className="mb-6 flex justify-center">
          <Logo href="/" />
        </div>

        <h1 className="text-center text-xl font-semibold text-surface-900">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-surface-900/50">
          Log in to access your CoSpaces.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-surface-900/70">Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-xl border border-surface-200 bg-surface-50 px-3.5 py-2.5 text-sm text-surface-900 focus:border-brand-300 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-surface-900/70">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-xl border border-surface-200 bg-surface-50 px-3.5 py-2.5 text-sm text-surface-900 focus:border-brand-300 focus:outline-none"
            />
          </label>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl bg-coral-500/10 px-3 py-2 text-xs text-coral-500"
            >
              {error}
            </motion.p>
          )}

          <Button type="submit" variant="primary" size="md" disabled={isLoading} className="w-full">
            {isLoading ? "Logging in…" : "Log In"}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-surface-900/50">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-brand-500 hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
