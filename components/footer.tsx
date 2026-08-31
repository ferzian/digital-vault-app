import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-200 dark:border-neutral-800/80 py-8 bg-white dark:bg-neutral-950 text-xs text-neutral-500 dark:text-neutral-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Same logo matching navbar */}
        <Logo showTagline={false} size="sm" />
        <p>&copy; {new Date().getFullYear()} FS-Digital Vault. All rights reserved.</p>
      </div>
    </footer>
  );
}
