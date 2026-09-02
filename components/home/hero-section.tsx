"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { HiSparkles, HiArrowRight, HiCheckBadge } from "react-icons/hi2";

export function HeroSection() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36 border-b border-neutral-200/70 dark:border-neutral-800/70">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-137.5 h-87.5 bg-sky-500/15 dark:bg-sky-500/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-75 h-62.5 bg-sky-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 text-xs font-semibold mb-6 shadow-sm">
          <span>Digital Assets &amp; Vault Management 2.0</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white max-w-4xl mx-auto leading-tight md:leading-tight">
          The Secure Vault for Your{" "}
          <span className="bg-linear-to-r from-sky-500 via-sky-400 to-sky-600 bg-clip-text text-transparent">
            Digital Goods
          </span>{" "}
          &amp; Licenses.
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          Store, manage, and download your premium digital products, source codes, and license keys in a secure, unified environment.
        </p>

        {/* Action Buttons */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02]"
            >
              <span>Go to My Vault Dashboard</span>
              <HiArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/sign-up"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02]"
              >
                <span>Open Free Vault</span>
                <HiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/sign-in"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900/80 text-neutral-800 dark:text-neutral-200 hover:border-sky-500/50 hover:text-sky-500 transition-all"
              >
                <span>Sign In</span>
              </Link>
            </>
          )}
        </div>

        {/* Security Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="flex items-center gap-1.5">
            <HiCheckBadge className="w-4 h-4 text-sky-500" />
            BetterAuth Protected
          </span>
          <span className="flex items-center gap-1.5">
            <HiCheckBadge className="w-4 h-4 text-sky-500" />
            PostgreSQL &amp; Prisma 7
          </span>
          <span className="flex items-center gap-1.5">
            <HiCheckBadge className="w-4 h-4 text-sky-500" />
            Role-Based Access Control
          </span>
        </div>
      </div>
    </section>
  );
}
