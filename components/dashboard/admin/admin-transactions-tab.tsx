"use client";

import { useState, useEffect } from "react";
import {
  HiMagnifyingGlass,
  HiCurrencyDollar,
  HiCheckCircle,
  HiClock,
  HiXCircle,
  HiArrowPath,
  HiClipboardDocument,
  HiClipboardDocumentCheck,
  HiReceiptRefund,
} from "react-icons/hi2";

interface TransactionRecord {
  id: string;
  referenceId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  licenseKey: string | null;
  notes: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  product: {
    id: string;
    title: string;
    category: string;
    price: number;
  };
}

export function AdminTransactionsTab() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const url =
        selectedStatus === "ALL"
          ? `/api/admin/transactions?search=${encodeURIComponent(search)}`
          : `/api/admin/transactions?status=${encodeURIComponent(
              selectedStatus
            )}&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.transactions) {
        setTransactions(data.transactions);
      }
    } catch (err) {
      console.error("Failed to load transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [selectedStatus, search]);

  const handleStatusChange = async (transactionId: string, newStatus: string) => {
    if (
      !confirm(
        `Are you sure you want to change transaction status to ${newStatus}? (Changing to REFUNDED will revoke user vault access).`
      )
    ) {
      return;
    }

    setUpdatingId(transactionId);
    try {
      const res = await fetch("/api/admin/transactions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId,
          status: newStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update transaction status.");
        return;
      }
      fetchTransactions();
    } catch (err: any) {
      alert(err.message || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const copyLicense = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const totalRevenue = transactions
    .filter((t) => t.status === "SUCCESS")
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  const successCount = transactions.filter((t) => t.status === "SUCCESS").length;

  return (
    <div className="p-6 space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Total Revenue (Success)
          </span>
          <div className="text-xl font-extrabold text-neutral-900 dark:text-white mt-1">
            ${totalRevenue.toFixed(2)} <span className="text-xs font-normal text-neutral-400">USD</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Settled Transactions
          </span>
          <div className="text-xl font-extrabold text-emerald-500 mt-1">
            {successCount} <span className="text-xs font-normal text-neutral-400">orders</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Total Orders Logged
          </span>
          <div className="text-xl font-extrabold text-neutral-900 dark:text-white mt-1">
            {transactions.length} <span className="text-xs font-normal text-neutral-400">records</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
              <HiMagnifyingGlass className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search reference, buyer email, product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 pl-9 pr-3 py-2 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            onClick={fetchTransactions}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors cursor-pointer"
            title="Reload Transactions"
          >
            <HiArrowPath className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2">
          {["ALL", "SUCCESS", "PENDING", "REFUNDED", "FAILED"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedStatus === st
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold"
                  : "bg-neutral-100 dark:bg-neutral-950 text-neutral-500 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-neutral-400">Loading transaction ledger...</span>
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-14 px-4 text-center flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 dark:bg-sky-950/50 text-sky-500 flex items-center justify-center mb-3">
            <HiCurrencyDollar className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
            No Transactions Found
          </h4>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 max-w-sm">
            Orders generated by user purchases in the digital catalog will appear in this ledger.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 font-semibold border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3.5 px-4">Reference &amp; Date</th>
                <th className="py-3.5 px-4">Buyer Info</th>
                <th className="py-3.5 px-4">Product Purchased</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Issued License Key</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800/60">
              {transactions.map((t) => {
                const isSuccess = t.status === "SUCCESS";
                const isRefunded = t.status === "REFUNDED";

                return (
                  <tr
                    key={t.id}
                    className="hover:bg-neutral-50/70 dark:hover:bg-neutral-900/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-neutral-900 dark:text-white">
                        {t.referenceId}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {new Date(t.createdAt).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {t.user.name || "Vault Member"}
                      </div>
                      <div className="text-[11px] font-mono text-neutral-400">
                        {t.user.email}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-900 dark:text-white line-clamp-1">
                        {t.product.title}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {t.product.category}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-neutral-900 dark:text-white">
                        ${t.amount.toFixed(2)}
                      </div>
                      <div className="text-[10px] uppercase text-neutral-400 font-semibold">
                        {t.paymentMethod}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {t.licenseKey ? (
                        <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-950 px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 w-fit">
                          <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">
                            {t.licenseKey}
                          </span>
                          <button
                            onClick={() => copyLicense(t.licenseKey!)}
                            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white cursor-pointer"
                            title="Copy Key"
                          >
                            {copiedKey === t.licenseKey ? (
                              <HiClipboardDocumentCheck className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <HiClipboardDocument className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-neutral-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          isSuccess
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                            : isRefunded
                            ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30"
                            : "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30"
                        }`}
                      >
                        {isSuccess ? (
                          <HiCheckCircle className="w-3 h-3" />
                        ) : isRefunded ? (
                          <HiReceiptRefund className="w-3 h-3" />
                        ) : (
                          <HiXCircle className="w-3 h-3" />
                        )}
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {updatingId === t.id ? (
                        <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin ml-auto" />
                      ) : (
                        <select
                          value={t.status}
                          onChange={(e) => handleStatusChange(t.id, e.target.value)}
                          className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg px-2 py-1 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 focus:outline-none focus:border-sky-500 cursor-pointer"
                        >
                          <option value="SUCCESS">SUCCESS</option>
                          <option value="REFUNDED">REFUNDED</option>
                          <option value="PENDING">PENDING</option>
                          <option value="FAILED">FAILED</option>
                        </select>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
