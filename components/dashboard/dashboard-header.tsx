"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/theme-toggle";
import { HiShieldCheck, HiArrowRightOnRectangle } from "react-icons/hi2";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();
  const isAdmin = user.role === "admin";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-sky-500 to-sky-700 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <HiShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm sm:text-base tracking-tight text-neutral-900 dark:text-white">
            FS-DIGITAL<span className="text-sky-500">VAULT</span>
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Role Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isAdmin
                ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30"
                : "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isAdmin ? "bg-sky-500 animate-pulse" : "bg-neutral-400"
              }`}
            />
            <span>{user.role || "user"}</span>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() =>
              signOut({
                fetchOptions: { onSuccess: () => router.push("/sign-in") },
              })
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/40 transition-colors cursor-pointer"
          >
            <HiArrowRightOnRectangle className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
