"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { HiArrowRight, HiUser } from "react-icons/hi2";

export function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Logo size="md" showTagline={true} />

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          <Link
            href="/#features"
            className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#goods"
            className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
          >
            Digital Goods
          </Link>
          <Link
            href="/#security"
            className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
          >
            Security
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white shadow-sm shadow-sky-500/25 transition-all hover:scale-[1.02]"
            >
              <HiUser className="w-3.5 h-3.5" />
              <span>Dashboard</span>
              {user.role === "admin" && (
                <span className="text-[10px] bg-sky-900/60 text-sky-200 border border-sky-300/30 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                  Admin
                </span>
              )}
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="px-3.5 py-2 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white shadow-sm shadow-sky-500/25 transition-all hover:scale-[1.02]"
              >
                <span>Get Started</span>
                <HiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
