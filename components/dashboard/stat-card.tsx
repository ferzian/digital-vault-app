import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

export function StatCard({
  label,
  value,
  subtext,
  icon,
  highlight = false,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          {label}
        </span>
        <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div
        className={`text-2xl font-bold ${
          highlight ? "text-sky-500" : "text-neutral-900 dark:text-white"
        }`}
      >
        {value}
      </div>
      {subtext && (
        <p className="text-[11px] text-neutral-400 mt-1 font-medium">{subtext}</p>
      )}
    </div>
  );
}
