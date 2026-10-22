"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";

const FEATURES: { icon: string; title: string; description: string }[] = [
  {
    icon: "🧱",
    title: "Drag-and-drop assets",
    description: "Populate your scene with characters, animals, buildings, and nature from a live 3D library.",
  },
  {
    icon: "🧩",
    title: "Block-based coding",
    description: "Script behavior visually — events, actions, and control blocks, no syntax required.",
  },
  {
    icon: "🕹️",
    title: "Move, rotate, scale",
    description: "Manipulate any object directly on the grid with intuitive transform gizmos.",
  },
  {
    icon: "📱",
    title: "Export to WebAR",
    description: "Share a link and QR code so anyone can view your creation in AR on their phone.",
  },
];

const STEPS: { step: string; title: string; description: string }[] = [
  { step: "01", title: "Build", description: "Drag 3D assets onto the stage and arrange your scene." },
  { step: "02", title: "Code", description: "Attach block-based logic so objects react to clicks and events." },
  { step: "03", title: "Play & Share", description: "Preview interactions, then export a WebAR link to share anywhere." },
];

export function LandingPage() {
  return (
    <div className="h-screen w-screen overflow-y-auto bg-gradient-to-b from-brand-50 via-surface-0 to-surface-50">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <Logo href="/" />
        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-surface-900/70 hover:text-surface-900 sm:block"
          >
            Log In
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-10 text-center sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-medium text-brand-600"
        >
          ✨ In-browser 3D &amp; Augmented Reality platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="text-4xl font-bold tracking-tight text-surface-900 sm:text-6xl"
        >
          Turn your ideas into{" "}
          <span className="bg-gradient-to-r from-brand-500 to-teal-500 bg-clip-text text-transparent">
            interactive 3D
          </span>{" "}
          &amp; AR experiences
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mx-auto mt-5 max-w-2xl text-base text-surface-900/60 sm:text-lg"
        >
          Build, code, and share interactive 3D spaces right in your browser. Drag in assets, script
          behavior with visual blocks, and export a shareable AR link — no downloads required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link href="/register">
            <Button variant="primary" size="md" className="px-6">
              🚀 Launch Studio
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="md" className="px-6">
              📂 Browse My CoSpaces
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-3xl border border-surface-200 bg-surface-0 shadow-soft-lg"
        >
          <div className="flex items-center gap-2 border-b border-surface-200 bg-surface-50 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-coral-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-teal-400" />
            <span className="ml-2 text-xs text-surface-900/40">meshastudio.app/editor</span>
          </div>
          <div className="grid grid-cols-4 gap-3 bg-gradient-to-br from-brand-50 to-teal-50 p-6">
            {["🧑‍🚀", "🦊", "🏠", "🌳"].map((emoji, i) => (
              <motion.div
                key={emoji}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.08, type: "spring" }}
                className="flex aspect-square items-center justify-center rounded-2xl bg-white text-3xl shadow-sm"
              >
                {emoji}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <section className="mx-auto max-w-5xl px-6 pb-24 sm:px-10">
        <h2 className="text-center text-2xl font-semibold text-surface-900 sm:text-3xl">
          Everything you need to bring a scene to life
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-surface-200 bg-surface-0 p-5 text-left shadow-sm hover:shadow-soft"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-2xl">
                {feature.icon}
              </div>
              <h3 className="text-sm font-semibold text-surface-900">{feature.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-surface-900/60">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24 sm:px-10">
        <h2 className="text-center text-2xl font-semibold text-surface-900 sm:text-3xl">
          From idea to AR in three steps
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border border-surface-200 bg-surface-0 p-6 text-center shadow-sm"
            >
              <span className="text-3xl font-bold text-brand-200">{s.step}</span>
              <h3 className="mt-2 text-base font-semibold text-surface-900">{s.title}</h3>
              <p className="mt-1.5 text-sm text-surface-900/60">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-28 text-center sm:px-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-br from-brand-500 to-teal-500 p-10 text-white shadow-soft-lg"
        >
          <h2 className="text-2xl font-semibold sm:text-3xl">Ready to build your first CoSpace?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
            It only takes a minute to create a scene and try Play Mode.
          </p>
          <Link href="/register" className="mt-6 inline-block">
            <Button variant="secondary" size="md" className="px-6 !text-brand-600">
              Start Creating — It&apos;s Free
            </Button>
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-surface-200 px-6 py-6 text-center text-xs text-surface-900/40 sm:px-10">
        Mesha Studio — a prototype 3D &amp; AR scene editor built with Next.js, React Three Fiber, and
        Framer Motion.
      </footer>
    </div>
  );
}
