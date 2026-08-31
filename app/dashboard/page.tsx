"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { UserView } from "@/components/dashboard/user-view";
import { AdminView } from "@/components/dashboard/admin-view";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 tracking-wide uppercase">
            Loading Vault Session...
          </p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100">
        <p className="text-xs font-semibold text-neutral-400">
          Redirecting to login...
        </p>
      </div>
    );
  }

  const { user } = session;
  const isAdmin = user.role === "admin";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <DashboardHeader user={user} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {isAdmin ? <AdminView user={user} /> : <UserView user={user} />}
      </main>
    </div>
  );
}
