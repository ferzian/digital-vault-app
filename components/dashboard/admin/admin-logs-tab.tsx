interface AdminLogsTabProps {
  adminEmail?: string | null;
}

export function AdminLogsTab({ adminEmail }: AdminLogsTabProps) {
  return (
    <div className="p-6 space-y-3 font-mono text-xs text-neutral-600 dark:text-neutral-400">
      <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex justify-between">
        <span>[AUTH] Admin user &apos;{adminEmail || "Admin"}&apos; session active.</span>
        <span className="text-sky-500">LIVE</span>
      </div>
      <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex justify-between">
        <span>[DATABASE] PostgreSQL connection via Prisma 7 adapter ready.</span>
        <span className="text-neutral-400">NOMINAL</span>
      </div>
    </div>
  );
}
