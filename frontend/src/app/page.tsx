import Link from "next/link";

function AndroidIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M17.6 9.48l1.84-3.18a.4.4 0 0 0-.14-.54.4.4 0 0 0-.55.14l-1.86 3.22A11.4 11.4 0 0 0 12 8.2c-1.76 0-3.43.33-4.89.92L5.25 5.9a.4.4 0 0 0-.55-.14.4.4 0 0 0-.14.54l1.84 3.18A10.5 10.5 0 0 0 1 18h22a10.5 10.5 0 0 0-5.4-8.52zM7 15.25a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm10 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M16.36 12.76c-.02-2.2 1.8-3.26 1.88-3.31-1.02-1.5-2.61-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.54 2.67-.39 6.62 1.1 8.79.73 1.06 1.6 2.25 2.74 2.21 1.1-.04 1.52-.71 2.85-.71 1.33 0 1.7.71 2.86.69 1.18-.02 1.93-1.08 2.65-2.15.84-1.23 1.18-2.42 1.2-2.48-.03-.01-2.29-.88-2.31-3.54zM14.2 6.2c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.55 1.31-.56.65-1.05 1.69-.92 2.68.97.08 1.96-.49 2.57-1.23z" />
    </svg>
  );
}

const features = [
  {
    title: "One link, two stores",
    description:
      "Share a single URL instead of juggling separate Android and iOS download links.",
  },
  {
    title: "Smart platform routing",
    description:
      "Duo Link reads the visitor's device and shows the right download page automatically.",
  },
  {
    title: "Simple link management",
    description:
      "Create, edit, copy, share and delete your smart links from one clean dashboard.",
  },
];

export default function Home() {
  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              DL
            </span>
            <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Duo Link
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
              One link. The right destination.
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-100">
              Share one link for both app stores.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400">
              Duo Link detects whether a visitor is on Android or iOS and shows
              the correct download page. Simple on the outside, intelligent on
              the inside.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Create your first link
              </Link>
              <Link
                href="/dashboard"
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                View dashboard
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              Local demo. No real authentication or production deployment yet.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-6 rounded-[2rem] bg-indigo-200/40 blur-2xl dark:bg-indigo-900/30" />
            <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-indigo-600 text-xl font-bold text-white">
                E
              </div>
              <h2 className="mt-4 text-center text-xl font-semibold text-slate-900 dark:text-slate-100">
                Example App
              </h2>
              <p className="mt-1 text-center text-sm text-slate-600 dark:text-slate-400">
                You&apos;re on Android. Tap below to download.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-white dark:bg-white dark:text-slate-900">
                  <AndroidIcon className="h-5 w-5 fill-current" />
                  <span>
                    <span className="block text-[10px] uppercase tracking-wider opacity-70">
                      Get it on
                    </span>
                    <span className="block text-sm font-semibold">
                      Google Play
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3 text-slate-700 dark:border-slate-700 dark:text-slate-300">
                  <AppleIcon className="h-5 w-5 fill-current" />
                  <span>
                    <span className="block text-[10px] uppercase tracking-wider opacity-70">
                      Download on the
                    </span>
                    <span className="block text-sm font-semibold">
                      App Store
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950"
              >
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-6 dark:border-slate-800">
        <p className="mx-auto max-w-6xl px-4 text-center text-xs text-slate-500 sm:px-6 dark:text-slate-400">
          Duo Link — smart link routing for mobile app distribution.
        </p>
      </footer>
    </div>
  );
}
