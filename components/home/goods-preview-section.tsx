"use client";

import { useRouter } from "next/navigation";

export function GoodsPreviewSection() {
  const router = useRouter();

  const sampleGoods = [
    {
      tag: "Source Code",
      name: "Next.js SaaS Enterprise Boilerplate",
      price: "$49",
      format: "ZIP + GitHub Access",
      badge: "Best Seller",
    },
    {
      tag: "Design System",
      name: "Oceanic UI Pro - Tailwind & Figma Kit",
      price: "$29",
      format: "Figma + React Components",
      badge: "Trending",
    },
    {
      tag: "Developer Tool",
      name: "API Sentinel Pro - Security Suite",
      price: "$79",
      format: "License Key + Binaries",
      badge: "New",
    },
  ];

  return (
    <section id="goods" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <div className="text-xs uppercase font-bold tracking-widest text-sky-500 mb-2">
            Featured Catalog
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            Trending Digital Goods in Vault
          </h2>
        </div>
        <p className="mt-2 md:mt-0 text-sm text-neutral-500 dark:text-neutral-400 max-w-md">
          Instant fulfillment and encrypted vault storage after acquisition.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sampleGoods.map((item, idx) => (
          <div
            key={idx}
            className="relative group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-6 shadow-sm hover:shadow-xl hover:border-sky-500/40 dark:hover:border-sky-500/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  {item.tag}
                </span>
                <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
                  {item.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-sky-500 transition-colors">
                {item.name}
              </h3>
              <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                Format: {item.format}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-400">Price</span>
                <div className="text-xl font-bold text-neutral-900 dark:text-white">
                  {item.price}
                </div>
              </div>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-black group-hover:bg-sky-500 group-hover:text-white dark:group-hover:bg-sky-500 dark:group-hover:text-white transition-colors cursor-pointer"
              >
                View in Vault
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
