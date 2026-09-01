"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  HiXMark,
  HiShieldCheck,
  HiKey,
  HiCube,
  HiCheckBadge,
  HiArrowRight,
  HiClipboardDocument,
  HiClipboardDocumentCheck,
} from "react-icons/hi2";

export interface ProductItem {
  id: string;
  title: string;
  slug?: string;
  description: string;
  category: string;
  price: number;
  currency?: string;
  format?: string;
  version?: string;
  badge?: string | null;
  licenseType?: string;
}

interface CheckoutModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ product, isOpen, onClose }: CheckoutModalProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("VAULT_DIRECT");
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    referenceId: string;
    licenseKey: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const handleCheckout = async () => {
    if (!session?.user) {
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.alreadyOwned) {
          setError("You already own this asset in your Vault. Head to your dashboard to access it.");
        } else {
          setError(data.error || "Failed to process transaction.");
        }
        return;
      }

      setSuccessData({
        referenceId: data.transaction.referenceId,
        licenseKey: data.vaultItem.licenseKey,
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  const copyLicense = () => {
    if (successData?.licenseKey) {
      navigator.clipboard.writeText(successData.licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccessData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-sky-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <HiXMark className="w-5 h-5" />
        </button>

        {successData ? (
          /* SUCCESS STATE */
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/30">
              <HiCheckBadge className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-500">
                Transaction Successful
              </span>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
                Asset Unlocked in Your Vault!
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                Reference: <span className="font-mono text-neutral-700 dark:text-neutral-300 font-semibold">{successData.referenceId}</span>
              </p>
            </div>

            {/* Generated License Box */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-left space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <HiKey className="w-4 h-4 text-sky-500" />
                  Cryptographic License Key
                </span>
                <span className="text-[10px] uppercase font-bold text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between bg-white dark:bg-neutral-900 px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <code className="font-mono text-xs sm:text-sm font-bold text-neutral-900 dark:text-white tracking-wider">
                  {successData.licenseKey}
                </code>
                <button
                  onClick={copyLicense}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-sky-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Copy License Key"
                >
                  {copied ? (
                    <HiClipboardDocumentCheck className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <HiClipboardDocument className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  handleClose();
                  router.push("/dashboard");
                }}
                className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Go to My Vault</span>
                <HiArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleClose}
                className="py-3 px-4 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM */
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  {product.category}
                </span>
                {product.badge && (
                  <span className="text-xs text-neutral-400 font-medium">{product.badge}</span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white">
                {product.title}
              </h3>
              <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                {product.description}
              </p>
            </div>

            {/* Product Summary Box */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2.5 text-xs">
              <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                <span>Format & Delivery</span>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {product.format || "ZIP + GitHub Access"}
                </span>
              </div>
              <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                <span>License Coverage</span>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {product.licenseType || "Commercial License"}
                </span>
              </div>
              <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                <span>Version</span>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {product.version || "v1.0.0"}
                </span>
              </div>
              <div className="pt-2.5 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                <span className="font-bold text-neutral-700 dark:text-neutral-300">Total Price</span>
                <span className="text-xl font-extrabold text-neutral-900 dark:text-white">
                  ${product.price} <span className="text-xs font-normal text-neutral-400">USD</span>
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Settlement Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("VAULT_DIRECT")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === "VAULT_DIRECT"
                      ? "border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold"
                      : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs">
                    <HiShieldCheck className="w-4 h-4" />
                    <span>Vault Instant Pay</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">Direct instant settlement</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("DEMO_CARD")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === "DEMO_CARD"
                      ? "border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold"
                      : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs">
                    <HiCube className="w-4 h-4" />
                    <span>Card / Sim Pay</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">Simulated test card</div>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="pt-2">
              <button
                type="button"
                disabled={loading}
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Unlock &amp; Add to Vault (${product.price})</span>
                    <HiArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="mt-2 text-[10px] text-center text-neutral-400">
                Instant delivery: generates your unique cryptographic license and adds item to your Vault.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
