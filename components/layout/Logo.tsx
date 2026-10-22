import Link from "next/link";
import clsx from "@/lib/utils/clsx";

interface LogoProps {
  href?: string;
  className?: string;
}

export function Logo({ href = "/", className }: LogoProps) {
  const content = (
    <span
      className={clsx(
        "flex items-center gap-2 rounded-2xl bg-surface-900 px-3 py-1.5 shadow-soft",
        className
      )}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-teal-400 text-base">
        🌀
      </span>
      <span className="text-lg font-semibold tracking-tight">
        <span className="text-coral-500">Mesha</span> <span className="text-white">Studio</span>
      </span>
    </span>
  );

  if (!href) return content;
  return <Link href={href}>{content}</Link>;
}
