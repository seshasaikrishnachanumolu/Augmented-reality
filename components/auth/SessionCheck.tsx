"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";

/**
 * Fires once on app load to populate the client-side auth store from the
 * server session cookie. Renders nothing — this is purely a side-effect
 * component so `useAuthStore().user` is available anywhere without each
 * page having to re-fetch /api/auth/me itself.
 */
export function SessionCheck() {
  const checkSession = useAuthStore((s) => s.checkSession);

  useEffect(() => {
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
