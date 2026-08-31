"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { signUp, signIn } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";

const SignUpPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await signUp.email({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
    if (res.error) {
      setError(res.error.message || "Something went wrong.");
    } else {
      router.push("/dashboard");
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    const res = await signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
    if (res?.error) {
      setError(res.error.message || "Failed to sign in with Google.");
    }
  }

  return (
    <main className="max-w-md h-screen flex items-center justify-center flex-col mx-auto p-6 space-y-4 text-white">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      {error && <p className="text-red-500">{error}</p>}

      <div className="w-full space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="John Cena"
            required
            className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
          />
          <input
            name="email"
            type="email"
            placeholder="john@gmail.com"
            required
            className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
          />
          <input
            name="password"
            type="password"
            placeholder="********"
            required
            minLength={8}
            className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
          />
          <button
            type="submit"
            className="w-full bg-white text-black font-medium rounded-md px-4 py-2 hover:bg-gray-200"
          >
            Create Account
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="grow border-t border-neutral-700"></div>
          <span className="shrink mx-4 text-neutral-400 text-sm">atau</span>
          <div className="grow border-t border-neutral-700"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-700 text-white font-medium rounded-md px-4 py-2 hover:bg-neutral-800 transition"
        >
          <FcGoogle size={25} />
          Sign in with Google
        </button>
      </div>
    </main>
  );
};

export default SignUpPage;
