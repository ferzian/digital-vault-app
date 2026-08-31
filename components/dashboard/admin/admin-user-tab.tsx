"use client";

import { useState } from "react";
import { HiMagnifyingGlass, HiUserGroup } from "react-icons/hi2";

export function AdminUserTab() {
  const [searchUser, setSearchUser] = useState("");

  // Empty user list for now
  const usersList: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    banned: boolean;
    joined: string;
  }> = [];

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
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
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          Total: {filteredUsers.length} user records
        </div>
      </div>

      {filteredUsers.length === 0 ? (
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
        <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 font-semibold border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800/60">
              {/* Future dynamic user mapping */}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
