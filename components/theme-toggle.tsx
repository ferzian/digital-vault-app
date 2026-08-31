"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { HiSun, HiMoon, HiComputerDesktop } from "react-icons/hi2";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
    );
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:text-sky-500 dark:hover:text-sky-400 hover:border-sky-500/50 dark:hover:border-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition-all shadow-sm"
        aria-label="Toggle theme"
      >
        {resolvedTheme === "dark" ? (
          <HiMoon className="w-5 h-5 text-sky-400" />
        ) : (
          <HiSun className="w-5 h-5 text-sky-600" />
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl focus:outline-none p-1.5 z-50 divide-y divide-neutral-100 dark:divide-neutral-800/60">
          <div className="space-y-0.5">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setTheme("light")}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    theme === "light"
                      ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold"
                      : active
                      ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                      : "text-neutral-600 dark:text-neutral-300"
                  }`}
                >
                  <HiSun className="w-4 h-4" />
                  <span>Light</span>
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setTheme("dark")}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    theme === "dark"
                      ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold"
                      : active
                      ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                      : "text-neutral-600 dark:text-neutral-300"
                  }`}
                >
                  <HiMoon className="w-4 h-4" />
                  <span>Dark</span>
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setTheme("system")}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    theme === "system"
                      ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold"
                      : active
                      ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                      : "text-neutral-600 dark:text-neutral-300"
                  }`}
                >
                  <HiComputerDesktop className="w-4 h-4" />
                  <span>System</span>
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
