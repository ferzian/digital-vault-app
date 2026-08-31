"use client";

import { HiCube, HiKey, HiShieldCheck, HiLockClosed } from "react-icons/hi2";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";

interface UserViewProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
}

export function UserView({ user }: UserViewProps) {
  // Empty data state for now
  const vaultAssets: Array<{
    id: string;
    title: string;
    category: string;
    version: string;
    licenseKey: string;
    fileSize: string;
    format: string;
  }> = [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-48 bg-sky-500/10 dark:bg-sky-500/15 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10">
          <span className="text-xs uppercase font-bold tracking-widest text-sky-500">
            Personal Vault Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
            Welcome, {user.name || "Vault Member"}!
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Connected account:{" "}
            <span className="font-mono text-sky-500 font-semibold">{user.email}</span>
          </p>
        </div>
      </div>

      {/* User Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Vault Assets Owned"
          value={`${vaultAssets.length} Items`}
          subtext="No active downloads"
          icon={<HiCube className="w-5 h-5" />}
        />
        <StatCard
          label="Active License Keys"
          value="0 Keys"
          subtext="Ready for activations"
          icon={<HiKey className="w-5 h-5" />}
        />
        <StatCard
          label="Account Security"
          value="PROTECTED"
          subtext="Session token active"
          icon={<HiShieldCheck className="w-5 h-5" />}
          highlight={true}
        />
      </div>

      {/* My Digital Goods List / Empty State */}
      <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              My Secured Vault Assets
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Download source files and manage product license keys.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 w-fit">
            {vaultAssets.length} Available Items
          </span>
        </div>

        {vaultAssets.length === 0 ? (
          <EmptyState
            icon={<HiLockClosed className="w-7 h-7" />}
            title="Vault Anda Masih Kosong"
            description="Anda belum memiliki aset digital atau lisensi tersimpan di dalam akun ini."
            actionText="Jelajahi Produk Digital"
            actionHref="/"
          />
        ) : (
          <div className="space-y-4">
            {/* Future dynamic assets mapping */}
          </div>
        )}
      </div>
    </div>
  );
}
