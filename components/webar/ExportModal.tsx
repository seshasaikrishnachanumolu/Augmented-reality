"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEditorStore } from "@/lib/store/editorStore";
import { QRCodeCanvas } from "./QRCode";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";

export function ExportModal() {
  const isOpen = useEditorStore((s) => s.isExportModalOpen);
  const exportedId = useEditorStore((s) => s.exportedId);
  const closeExportModal = useEditorStore((s) => s.closeExportModal);
  const [copied, setCopied] = useState(false);

  const shareUrl = exportedId
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/ar/${exportedId}`
    : "";

  const handleClose = () => {
    setCopied(false);
    closeExportModal();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Export to WebAR"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="w-full max-w-md rounded-3xl bg-surface-0 p-6 shadow-soft-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-surface-900">Export to WebAR 📱</h2>
              <IconButton label="Close" onClick={handleClose}>
                ✕
              </IconButton>
            </div>

            <p className="mb-4 text-sm text-surface-900/60">
              Scan the QR code or share the link below to view this scene in AR on a phone.
            </p>

            <div className="mb-4 flex flex-col items-center gap-3 rounded-2xl bg-surface-50 p-4">
              <QRCodeCanvas value={shareUrl || "https://example.com"} />
              <span className="text-[11px] text-surface-900/40">Mock preview QR — for demo purposes</span>
            </div>

            <div className="mb-4 flex items-center gap-2">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 rounded-xl border border-surface-200 bg-surface-50 px-3 py-2 text-xs text-surface-900/80"
              />
              <Button size="sm" variant={copied ? "secondary" : "primary"} onClick={handleCopy}>
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>

            <Button variant="ghost" size="sm" onClick={handleClose} className="w-full">
              Done
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
