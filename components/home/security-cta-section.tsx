import Link from "next/link";
import { HiShieldCheck, HiArrowRight } from "react-icons/hi2";

export function SecurityCtaSection() {
  return (
    <section id="security" className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="relative rounded-3xl border border-sky-500/30 bg-linear-to-b from-sky-500/10 via-neutral-900/5 to-transparent p-10 md:p-14 overflow-hidden">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-6">
          <HiShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white">
          Ready to Protect Your Digital Assets?
        </h2>
        <p className="mt-4 text-sm md:text-base text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto">
          Join developers, designers, and creators who trust FS-Digital Vault for verified asset delivery.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-sky-500 hover:bg-sky-600 text-white shadow-xl shadow-sky-500/30 hover:scale-[1.02] transition-all"
          >
            <span>Get Started Now</span>
            <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
