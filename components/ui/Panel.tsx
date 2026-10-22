import { HTMLAttributes } from "react";
import clsx from "@/lib/utils/clsx";

export function Panel({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-surface-200 bg-surface-0/90 backdrop-blur-sm shadow-soft",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
