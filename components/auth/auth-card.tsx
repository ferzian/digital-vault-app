import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { HiArrowLeft } from "react-icons/hi2";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

export function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthCardProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors duration-200">
      {/* Top Bar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10 max-w-5xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
        >
          <HiArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[300px] bg-sky-500/15 dark:bg-sky-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 my-16">
        {/* Brand Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-3">
            <Logo size="lg" showTagline={false} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            {subtitle}
          </p>
        </div>

        {/* Card Container */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 p-7 sm:p-8 shadow-xl shadow-neutral-900/5 dark:shadow-black/40 backdrop-blur-xl">
          {children}

          {/* Footer Link */}
          <p className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
            {footerText}{" "}
            <Link
              href={footerLinkHref}
              className="font-bold text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 hover:underline transition-colors"
            >
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
