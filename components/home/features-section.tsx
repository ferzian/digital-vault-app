import { HiLockClosed, HiKey, HiCloudArrowDown, HiCube } from "react-icons/hi2";

export function FeaturesSection() {
  const features = [
    {
      icon: <HiLockClosed className="w-6 h-6 text-sky-500" />,
      title: "Encrypted Vault Security",
      description:
        "Every digital good, license key, and asset file is stored behind role-verified encryption and strict download quotas.",
    },
    {
      icon: <HiKey className="w-6 h-6 text-sky-500" />,
      title: "Instant License Keys",
      description:
        "Automatic generation and storage of software licenses, product keys, and purchase verifications on purchase.",
    },
    {
      icon: <HiCloudArrowDown className="w-6 h-6 text-sky-500" />,
      title: "Lifetime Vault Access",
      description:
        "Access your purchased digital goods anytime with secure time-limited expiring download URLs.",
    },
    {
      icon: <HiCube className="w-6 h-6 text-sky-500" />,
      title: "Curated Digital Goods",
      description:
        "High-performance source code repositories, UI kits, design templates, and premium developer tools.",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 bg-neutral-100/60 dark:bg-neutral-950/60 border-y border-neutral-200/70 dark:border-neutral-800/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs uppercase font-bold tracking-widest text-sky-500 mb-2">
            Architecture &amp; Protection
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            Built with Enterprise-Grade Vault Security
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/80 p-6 shadow-sm hover:border-sky-500/40 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 dark:bg-sky-950/50 border border-sky-500/20 flex items-center justify-center mb-5">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2">
                {f.title}
              </h3>
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
