"use client";

import { FcGoogle } from "react-icons/fc";

interface GoogleButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  text?: string;
}

export function GoogleButton({
  onClick,
  loading = false,
  disabled = false,
  text = "Sign in with Google",
}: GoogleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full flex items-center justify-center gap-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-xs sm:text-sm rounded-xl py-2.5 px-4 hover:border-sky-500/40 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
    >
      <FcGoogle className="w-5 h-5 shrink-0" />
      <span>{loading ? "Connecting Google..." : text}</span>
    </button>
  );
}
