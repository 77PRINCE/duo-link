"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AuthFormProps = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isRegister = mode === "register";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/dashboard");
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900";

  return (
    <div className="flex min-h-full items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            DL
          </span>
          <span className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Duo Link
          </span>
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {isRegister ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {isRegister
              ? "Start sharing one link for both app stores."
              : "Sign in to manage your smart links."}
          </p>

          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
            Demo interface: authentication is not implemented yet. Submitting
            will take you straight to the dashboard.
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {isRegister && (
              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Name
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ada Lovelace"
                  className={inputClass}
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className={inputClass}
                autoComplete="email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className={inputClass}
                autoComplete={isRegister ? "new-password" : "current-password"}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              {isRegister ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-400">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                New to Duo Link?{" "}
                <Link
                  href="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  Create an account
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
