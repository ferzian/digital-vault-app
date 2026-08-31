import React from "react";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="py-14 px-4 text-center flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40">
      <div className="w-14 h-14 rounded-2xl bg-sky-500/10 dark:bg-sky-950/50 text-sky-500 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-base font-bold text-neutral-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 max-w-sm">
        {description}
      </p>
      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white shadow-sm shadow-sky-500/20 transition-all hover:scale-[1.02]"
        >
          <span>{actionText}</span>
          <HiArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}
