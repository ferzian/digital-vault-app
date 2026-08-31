"use client";

import { useState } from "react";
import { HiUsers, HiCube, HiFingerPrint, HiShieldCheck, HiAdjustmentsHorizontal } from "react-icons/hi2";
import { StatCard } from "@/components/dashboard/stat-card";
import { AdminUserTab } from "@/components/dashboard/admin/admin-user-tab";
import { AdminGoodsTab } from "@/components/dashboard/admin/admin-goods-tab";
import { AdminLogsTab } from "@/components/dashboard/admin/admin-logs-tab";

interface AdminViewProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
}

export function AdminView({ user }: AdminViewProps) {
  const [adminTab, setAdminTab] = useState<"users" | "goods" | "logs">("users");

  return (
    <div className="space-y-8">
      {/* Welcome Admin Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-48 bg-sky-500/10 dark:bg-sky-500/15 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10">
          <span className="text-xs uppercase font-bold tracking-widest text-sky-500">
            Administrator Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
            Control Center &amp; Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Logged in as Admin:{" "}
            <span className="font-mono text-sky-500 font-semibold">{user.email}</span>
          </p>
        </div>
      </div>

      {/* Admin Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Registered Users"
          value={0}
          subtext="Ready for real users"
          icon={<HiUsers className="w-5 h-5" />}
        />
        <StatCard
          label="Digital Goods in Catalog"
          value={0}
          subtext="0 active categories"
          icon={<HiCube className="w-5 h-5" />}
        />
        <StatCard
          label="Active Vault Sessions"
          value="1 Session"
          subtext="Admin token verified"
          icon={<HiFingerPrint className="w-5 h-5" />}
        />
        <StatCard
          label="System Security Level"
          value="OPTIMAL"
          subtext="Prisma & BetterAuth Active"
          icon={<HiShieldCheck className="w-5 h-5" />}
          highlight={true}
        />
      </div>

      {/* Admin Management Tabs */}
      <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 shadow-sm overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 px-6 pt-4 gap-6">
          <button
            onClick={() => setAdminTab("users")}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
              adminTab === "users"
                ? "text-sky-500"
                : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            }`}
          >
            <span className="flex items-center gap-2">
              <HiUsers className="w-4 h-4" />
              User &amp; Role Management
            </span>
            {adminTab === "users" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setAdminTab("goods")}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
              adminTab === "goods"
                ? "text-sky-500"
                : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            }`}
          >
            <span className="flex items-center gap-2">
              <HiCube className="w-4 h-4" />
              Digital Goods Registry
            </span>
            {adminTab === "goods" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setAdminTab("logs")}
            className={`pb-3 text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
              adminTab === "logs"
                ? "text-sky-500"
                : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            }`}
          >
            <span className="flex items-center gap-2">
              <HiAdjustmentsHorizontal className="w-4 h-4" />
              Security Audit Logs
            </span>
            {adminTab === "logs" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {adminTab === "users" && <AdminUserTab />}
        {adminTab === "goods" && <AdminGoodsTab />}
        {adminTab === "logs" && <AdminLogsTab adminEmail={user.email} />}
      </div>
    </div>
  );
}
