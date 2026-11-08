import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-slate-50 px-4 py-16 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          404
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          This link doesn&apos;t exist
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          The smart link may have been deleted, renamed, or the URL was typed
          incorrectly.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Go to Duo Link
        </Link>
      </div>
    </div>
  );
}
