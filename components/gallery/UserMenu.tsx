"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore, type AuthUser } from "@/lib/store/authStore";

interface UserMenuProps {
  user: AuthUser;
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);

  const initial = user.name.trim().charAt(0).toUpperCase() || "?";

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-surface-200 bg-surface-0 px-2.5 py-1.5 hover:bg-surface-50"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
          {initial}
        </span>
        <span className="text-sm font-medium text-surface-900">{user.name}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.14 }}
              className="absolute right-0 top-full z-40 mt-2 w-48 overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 py-1.5 shadow-soft-lg"
            >
              <div className="px-3.5 py-2 text-xs text-surface-900/50">{user.email}</div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-coral-500 hover:bg-surface-100"
              >
                🚪 Log out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
