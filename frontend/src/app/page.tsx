import { Suspense } from "react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { AuthCard } from "@/components/AuthCard";

export default function HomePage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-12">
      <AnimatedBackground />
      <div className="relative z-10 flex w-full flex-col items-center gap-8">
        <header className="text-center">
          <p className="text-sm font-medium tracking-wide text-indigo-200/80">
            Welcome
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Sign in to continue
          </h1>
        </header>
        <Suspense fallback={null}>
          <AuthCard />
        </Suspense>
      </div>
    </main>
  );
}
