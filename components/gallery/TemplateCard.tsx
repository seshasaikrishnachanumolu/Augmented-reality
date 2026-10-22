"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { ProjectTemplate } from "@/lib/templates";
import { useProjectsStore } from "@/lib/store/projectsStore";

interface TemplateCardProps {
  template: ProjectTemplate;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const router = useRouter();
  const createProjectFromScenes = useProjectsStore((s) => s.createProjectFromScenes);

  const handleUseTemplate = async () => {
    const id = await createProjectFromScenes(template.scenes, template.name);
    if (id) router.push(`/editor/${id}`);
  };

  return (
    <motion.button
      onClick={handleUseTemplate}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="flex flex-col overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 text-left shadow-sm hover:shadow-soft"
    >
      <div
        className="flex h-24 items-center justify-center text-3xl"
        style={{ background: `linear-gradient(135deg, ${template.color}33, ${template.color}11)` }}
      >
        <span
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl text-white shadow-soft"
          style={{ backgroundColor: template.color }}
        >
          {template.icon}
        </span>
      </div>
      <div className="p-3.5">
        <h3 className="text-sm font-semibold text-surface-900">{template.name}</h3>
        <p className="mt-1 text-xs leading-relaxed text-surface-900/50">{template.description}</p>
        <p className="mt-2 text-[11px] font-medium text-brand-500">
          {template.scenes.length} scene{template.scenes.length > 1 ? "s" : ""} · Use template →
        </p>
      </div>
    </motion.button>
  );
}
