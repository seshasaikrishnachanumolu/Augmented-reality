"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useProjectsStore } from "@/lib/store/projectsStore";

export function CreateProjectCard() {
  const router = useRouter();
  const createProject = useProjectsStore((s) => s.createProject);

  const handleCreate = async () => {
    const id = await createProject();
    if (id) router.push(`/editor/${id}`);
  };

  return (
    <motion.button
      onClick={handleCreate}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="flex h-full min-h-[188px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/50 text-brand-600 hover:bg-brand-50"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
        ➕
      </span>
      <span className="text-sm font-semibold">Create new CoSpace</span>
    </motion.button>
  );
}
