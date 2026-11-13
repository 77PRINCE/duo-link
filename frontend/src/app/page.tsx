import Image from "next/image";
import Link from "next/link";

import RiveBackgroundLoader from "@/components/RiveBackgroundLoader";
import ScrollReveal from "@/components/ScrollReveal";

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

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-2 2a5 5 0 0 0 7.07 7.07l1.15-1.15" />
    </svg>
  );
}

function RouteIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="6" cy="19" r="2" />
      <path d="M8 19h4a4 4 0 0 0 4-4V9" />
      <circle cx="18" cy="5" r="2" />
      <path d="M18 7v0" />
      <path d="M12 5h4" />
    </svg>
  );
}

function SlidersIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M4 6h10" />
      <path d="M18 6h2" />
      <circle cx="16" cy="6" r="2" />
      <path d="M4 12h2" />
      <path d="M10 12h10" />
      <circle cx="8" cy="12" r="2" />
      <path d="M4 18h10" />
      <path d="M18 18h2" />
      <circle cx="16" cy="18" r="2" />
    </svg>
  );
}

const features = [
  {
    title: "One link, two stores",
    description:
      "Share a single URL instead of juggling separate Android and iOS download links.",
    icon: LinkIcon,
  },
  {
    title: "Smart platform routing",
    description:
      "Duo Link reads the visitor's device and shows the right download page automatically.",
    icon: RouteIcon,
  },
  {
    title: "Simple link management",
    description:
      "Create, edit, copy, share and delete your smart links from one clean dashboard.",
    icon: SlidersIcon,
  },
];

const steps = [
  {
    number: "01",
    title: "Add both store links",
    description:
      "Paste your Google Play and App Store URLs and choose a custom slug.",
  },
  {
    number: "02",
    title: "Share one smart URL",
    description:
      "Send the single Duo Link anywhere your audience already finds you.",
  },
  {
    number: "03",
    title: "Visitors land in the right place",
    description:
      "Android and iOS visitors are routed to the matching store automatically.",
  },
];

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-col overflow-x-hidden bg-[#050b24] text-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/background.jpeg")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030817]/85 via-[#050b24]/90 to-[#050b24]" />
        <div className="animate-float-slow absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="animate-float-slower absolute -right-16 top-10 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="animate-glow-pulse absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-full flex-col">
        <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
          <div className="glass-nav mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 sm:px-5">
            <Link
              href="/"
              className="flex items-center"
              aria-label="Duo Link home"
            >
              <Image
                src="/logo.png"
                alt="Duo Link"
                width={533}
                height={122}
                priority
                className="h-9 w-32 object-contain sm:h-10 sm:w-40"
              />
            </Link>
            <nav className="flex items-center gap-1.5 sm:gap-3">
              <Link
                href="/login"
                className="rounded-full px-3 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-indigo-950/40 transition duration-300 hover:-translate-y-0.5 hover:bg-indigo-50"
              >
                Dashboard
                <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <section className="relative isolate">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
            >
              <RiveBackgroundLoader />
            </div>

            <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-20">
              <ScrollReveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 shadow-lg shadow-indigo-950/30 backdrop-blur-md">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  One link. The right destination.
                </span>

                <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Share one link for{" "}
                  <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-fuchsia-300 bg-clip-text text-transparent">
                    both app stores.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
                  Duo Link detects whether a visitor is on Android or iOS and
                  shows the correct download page. Simple on the outside,
                  intelligent on the inside.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/register"
                    className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-indigo-950/40 transition duration-300 hover:-translate-y-0.5 hover:bg-indigo-50"
                  >
                    Create your first link
                    <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/10"
                  >
                    View dashboard
                  </Link>
                </div>

                <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/60">
                  <li className="flex items-center gap-1.5">
                    <CheckIcon className="h-3.5 w-3.5 text-emerald-300" />
                    Android + iOS routing
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckIcon className="h-3.5 w-3.5 text-emerald-300" />
                    No visitor app required
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckIcon className="h-3.5 w-3.5 text-emerald-300" />
                    Set up in seconds
                  </li>
                </ul>
              </ScrollReveal>

              <ScrollReveal
                delay={150}
                className="mx-auto w-full max-w-sm lg:max-w-md"
              >
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="animate-glow-pulse absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-indigo-500/40 via-sky-500/20 to-fuchsia-500/30 blur-3xl"
                  />
                  <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6 sm:p-7">
                    <div
                      aria-hidden="true"
                      className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-400/20 blur-2xl"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-fuchsia-400/15 blur-2xl"
                    />

                    <div className="relative">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
                          Example preview
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-200">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
                          Smart routing
                        </span>
                      </div>

                      <div className="mx-auto mt-6 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-indigo-400 to-fuchsia-500 text-2xl font-bold text-white shadow-xl shadow-indigo-950/50">
                        G
                      </div>
                      <h2 className="mt-4 text-center text-xl font-semibold text-white">
                        Google Maps
                      </h2>
                      <p className="mt-1 text-center text-sm text-white/70">
                        Visitors see the store built for their device.
                      </p>

                      <div className="mt-6 space-y-3">
                        <a
                          href="https://play.google.com/store/apps/details?id=com.google.android.apps.maps"
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Get Google Maps on Google Play"
                          className="group flex items-center gap-3 rounded-xl border border-white/20 bg-white px-4 py-3 text-slate-950 shadow-lg shadow-slate-950/30 transition duration-300 hover:-translate-y-0.5 hover:bg-indigo-50"
                        >
                          <AndroidIcon className="h-5 w-5 fill-current" />
                          <span>
                            <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-500">
                              Get it on
                            </span>
                            <span className="block text-sm font-semibold">
                              Google Play
                            </span>
                          </span>
                          <ArrowIcon className="ml-auto h-4 w-4 text-slate-400 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </a>
                        <a
                          href="https://apps.apple.com/us/app/google-maps/id585027354"
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Download Google Maps from the App Store"
                          className="group flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white/15"
                        >
                          <AppleIcon className="h-5 w-5 fill-current" />
                          <span>
                            <span className="block text-[10px] font-medium uppercase tracking-wider text-white/55">
                              Download on the
                            </span>
                            <span className="block text-sm font-semibold">
                              App Store
                            </span>
                          </span>
                          <ArrowIcon className="ml-auto h-4 w-4 text-white/50 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </a>
                      </div>

                      <p className="mt-4 text-center text-[11px] leading-5 text-white/50">
                        A live preview of the page your visitors will see.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>

          <section className="relative border-t border-white/10 px-4 py-16 sm:px-6 lg:py-24">
            <div className="mx-auto max-w-6xl">
              <ScrollReveal className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-300">
                  Why Duo Link
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Built for effortless app distribution.
                </h2>
                <p className="mt-3 text-base leading-7 text-white/65">
                  Everything your audience needs, behind one polished,
                  device-aware link.
                </p>
              </ScrollReveal>

              <div className="mt-10 grid gap-5 md:grid-cols-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <ScrollReveal
                      key={feature.title}
                      delay={index * 100}
                      className="h-full"
                    >
                      <article className="glass-card group h-full rounded-2xl p-6 transition duration-500 hover:-translate-y-1.5 hover:border-white/30 hover:shadow-[0_36px_80px_-30px_rgba(2,6,23,0.95)]">
                        <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-gradient-to-br from-indigo-400/30 to-fuchsia-400/20 text-indigo-100 shadow-lg shadow-indigo-950/30 transition duration-500 group-hover:scale-110 group-hover:border-white/25">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="mt-5 text-base font-semibold text-white">
                          {feature.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-white/65">
                          {feature.description}
                        </p>
                        <div className="mt-5 h-px w-full bg-gradient-to-r from-white/20 via-white/5 to-transparent" />
                      </article>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="relative px-4 pb-16 sm:px-6 lg:pb-24">
            <div className="mx-auto max-w-6xl">
              <ScrollReveal className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-300">
                  How it works
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Three steps to one smart link.
                </h2>
              </ScrollReveal>

              <div className="mt-10 grid gap-5 md:grid-cols-3">
                {steps.map((step, index) => (
                  <ScrollReveal
                    key={step.number}
                    delay={index * 100}
                    className="h-full"
                  >
                    <article className="glass-card group relative h-full overflow-hidden rounded-2xl p-6 transition duration-500 hover:-translate-y-1.5 hover:border-white/30 hover:shadow-[0_36px_80px_-30px_rgba(2,6,23,0.95)]">
                      <span className="pointer-events-none absolute right-5 top-4 text-5xl font-bold leading-none text-white/10 transition duration-500 group-hover:text-white/20">
                        {step.number}
                      </span>
                      <h3 className="relative text-base font-semibold text-white">
                        {step.title}
                      </h3>
                      <p className="relative mt-2 text-sm leading-6 text-white/65">
                        {step.description}
                      </p>
                    </article>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          <section className="px-4 pb-20 sm:px-6">
            <ScrollReveal>
              <div className="glass-panel relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-12">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent_60%)]"
                />
                <div className="relative">
                  <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    Ready to share one link?
                  </h2>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
                    Create a smart link in seconds and send every visitor to the
                    right app store.
                  </p>
                  <div className="mt-7 flex flex-wrap justify-center gap-3">
                    <Link
                      href="/register"
                      className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-indigo-950/40 transition duration-300 hover:-translate-y-0.5 hover:bg-indigo-50"
                    >
                      Create your first link
                      <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/10"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </section>
        </main>

        <footer className="px-3 pb-4 pt-2 sm:px-6">
          <div className="glass-nav mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 rounded-2xl px-5 py-4 text-xs text-white/60 sm:flex-row">
            <p>
              Duo Link — smart link routing for mobile app distribution.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/login" className="transition hover:text-white">
                Sign in
              </Link>
              <Link href="/register" className="transition hover:text-white">
                Create account
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
