import { Suspense } from "react";
import Image from "next/image";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { AuthCard } from "@/components/AuthCard";
import { ShowcaseMarquee } from "@/components/ShowcaseMarquee";

export default function HomePage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-4 sm:px-6 sm:py-5">
      <AnimatedBackground />
      <div className="relative z-10 flex w-full max-w-xl flex-col items-center gap-3 sm:gap-4">
        <header className="flex flex-col items-center text-center">
          <Image
            src="/favicon.png"
            alt="Duo Link"
            width={128}
            height={128}
            priority
            className="h-14 w-14 rounded-2xl shadow-[0_0_34px_rgba(69,220,133,0.25)] sm:h-[4.5rem] sm:w-[4.5rem]"
          />
          <p className="brand-wordmark mt-1 text-3xl font-black leading-none tracking-tight sm:text-4xl">
            Duo Link
          </p>
          <h1 className="mt-2 text-lg font-semibold tracking-tight text-white sm:text-xl">
            One link. The right destination.
          </h1>
          <p className="mt-1 max-w-sm text-xs text-slate-300 sm:text-sm">
            Share your app everywhere. We’ll guide each visitor to the right store.
          </p>
        </header>
        <Suspense fallback={null}>
          <AuthCard />
        </Suspense>
        <p className="-mt-1 text-center text-xs text-slate-300 sm:text-sm">
          Your account stays private. We never post without your permission.
        </p>
        <section className="w-full" aria-label="App showcase examples">
          <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 sm:text-xs">
            One simple link for every app
          </p>
          <ShowcaseMarquee />
        </section>
      </div>
    </main>
  );
}
