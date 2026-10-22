"use client";

import { useEffect } from "react";

/**
 * Automatically unregisters any leftover Service Workers and purges
 * stale caches registered on http://localhost:3000 by previous projects.
 */
export function ServiceWorkerCleaner() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().then((unregistered) => {
            if (unregistered) {
              console.log("[ServiceWorkerCleaner] Unregistered legacy service worker:", registration.scope);
            }
          });
        }
      });
    }

    if ("caches" in window) {
      caches.keys().then((keys) => {
        for (const key of keys) {
          caches.delete(key).then(() => {
            console.log("[ServiceWorkerCleaner] Deleted legacy cache:", key);
          });
        }
      });
    }
  }, []);

  return null;
}
