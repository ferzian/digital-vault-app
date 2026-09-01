"use client";

import { useState, useEffect } from "react";
import {
  HiMagnifyingGlass,
  HiUserGroup,
  HiShieldCheck,
  HiUser,
  HiNoSymbol,
  HiCheckCircle,
  HiArrowPath,
  HiXMark,
} from "react-icons/hi2";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  createdAt: string;
  _count?: {
    transactions: number;
    vaultItems: number;
    sessions: number;
  };
}

export function AdminUserTab() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState("");
  const [banningUser, setBanningUser] = useState<UserRecord | null>(null);
  const [banReason, setBanReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(searchUser)}`);
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchUser]);

  const handleRoleToggle = async (user: UserRecord) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    if (!confirm(`Are you sure you want to change ${user.email}'s role to ${newRole.toUpperCase()}?`)) {
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          role: newRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update role");
        return;
      }
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Failed to update role");
    }
  };

  const handleBanToggle = async (user: UserRecord) => {
    if (user.banned) {
      // Unban immediately
      try {
        const res = await fetch("/api/admin/users", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            banned: false,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || "Failed to unban user");
          return;
        }
        fetchUsers();
      } catch (err: any) {
        alert(err.message || "Failed to unban user");
      }
    } else {
      // Open ban modal with reason
      setBanningUser(user);
      setBanReason("Violation of terms of service");
    }
  };

  const confirmBan = async () => {
    if (!banningUser) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: banningUser.id,
          banned: true,
          banReason: banReason.trim() || "Administrative suspension",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to ban user");
        return;
      }
      setBanningUser(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Failed to ban user");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Search Bar & Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
              <HiMagnifyingGlass className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search user name or email..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="w-full rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 pl-9 pr-3 py-2 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-sky-500"
            />
          </div>
          <button
            onClick={fetchUsers}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors cursor-pointer"
            title="Reload Users"
          >
            <HiArrowPath className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          Total: <span className="font-semibold text-neutral-900 dark:text-white">{users.length}</span> registered users
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-neutral-400">Loading user database...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="py-14 px-4 text-center flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 dark:bg-sky-950/50 text-sky-500 flex items-center justify-center mb-3">
            <HiUserGroup className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
            Belum Ada Data Pengguna
          </h4>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 max-w-sm">
            Pengguna yang melakukan registrasi di sistem akan otomatis muncul di tabel manajemen ini.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 font-semibold border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Vault Holdings</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800/60">
              {users.map((u) => {
                const isAdmin = u.role === "admin";
                const isBanned = Boolean(u.banned);

                return (
                  <tr
                    key={u.id}
                    className="hover:bg-neutral-50/70 dark:hover:bg-neutral-900/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                          {u.name ? u.name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-neutral-900 dark:text-white">
                            {u.name || "Member"}
                          </div>
                          <div className="text-[11px] font-mono text-neutral-400">
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          isAdmin
                            ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30"
                            : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700"
                        }`}
                      >
                        {isAdmin ? (
                          <HiShieldCheck className="w-3.5 h-3.5" />
                        ) : (
                          <HiUser className="w-3.5 h-3.5" />
                        )}
                        {u.role || "user"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {isBanned ? (
                        <div className="flex flex-col">
                          <span className="inline-flex items-center gap-1 text-red-500 font-semibold text-[11px]">
                            <HiNoSymbol className="w-3.5 h-3.5" />
                            Banned
                          </span>
                          <span className="text-[10px] text-neutral-400 max-w-xs truncate">
                            {u.banReason || "Suspended"}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold text-[11px]">
                          <HiCheckCircle className="w-3.5 h-3.5" />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-neutral-600 dark:text-neutral-300">
                      <span className="font-mono font-bold text-sky-500">
                        {u._count?.vaultItems || 0}
                      </span>{" "}
                      vault assets ({u._count?.transactions || 0} orders)
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500 dark:text-neutral-400 font-mono text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRoleToggle(u)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
                          title="Switch Role"
                        >
                          {isAdmin ? "Demote to User" : "Promote to Admin"}
                        </button>
                        <button
                          onClick={() => handleBanToggle(u)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                            isBanned
                              ? "border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                              : "border-red-500/30 text-red-500 hover:bg-red-500/10"
                          }`}
                        >
                          {isBanned ? "Unban" : "Ban User"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* BAN USER MODAL */}
      {banningUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl">
            <button
              onClick={() => setBanningUser(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
            >
              <HiXMark className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-500 flex items-center justify-center mb-4">
              <HiNoSymbol className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Ban User Account
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Specify reason for suspending{" "}
              <span className="font-semibold text-neutral-900 dark:text-white">
                {banningUser.email}
              </span>
              .
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Ban Reason / Violation Description
              </label>
              <textarea
                rows={3}
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="e.g. Terms of service violation, fraudulent chargeback..."
                className="w-full rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setBanningUser(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={confirmBan}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {actionLoading ? "Suspending..." : "Confirm Ban"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
