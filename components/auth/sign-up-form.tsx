"use client";

import { signUp, signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FormInput } from "./form-input";
import { GoogleButton } from "./google-button";
import { HiUser, HiEnvelope, HiLockClosed } from "react-icons/hi2";

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await signUp.email({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      });

      if (res.error) {
        setError(res.error.message || "Failed to create account. Please try again.");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setGoogleLoading(true);
    try {
      const res = await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
      if (res?.error) {
        setError(res.error.message || "Failed to sign up with Google.");
      }
    } catch {
      setError("Google authentication failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-5 p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs leading-relaxed flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Full Name"
          name="name"
          type="text"
          placeholder="John Doe"
          required
          icon={<HiUser className="w-4 h-4" />}
        />

        <FormInput
          label="Email Address"
          name="email"
          type="email"
          placeholder="name@example.com"
          required
          icon={<HiEnvelope className="w-4 h-4" />}
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          required
          minLength={8}
          icon={<HiLockClosed className="w-4 h-4" />}
        />

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full mt-2 py-2.5 px-4 rounded-xl font-semibold text-sm bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white shadow-md shadow-sky-500/25 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Creating Vault..." : "Create Account"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6 flex items-center">
        <div className="grow border-t border-neutral-200 dark:border-neutral-800"></div>
        <span className="shrink mx-4 text-neutral-400 dark:text-neutral-500 text-xs font-medium uppercase tracking-wider">
          or continue with
        </span>
        <div className="grow border-t border-neutral-200 dark:border-neutral-800"></div>
      </div>

      {/* Google Button */}
      <GoogleButton
        onClick={handleGoogleSignIn}
        loading={googleLoading}
        disabled={loading}
        text="Sign up with Google"
      />
    </div>
  );
}
