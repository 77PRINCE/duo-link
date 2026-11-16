"use client";

import { useMemo } from "react";

type Particle = {
  id: number;
  left: string;
  top: string;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  rotate: number;
  kind: "dot" | "ring" | "github" | "google";
};

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.31-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.53.12-3.18 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.65 1.65.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.62-2.81 5.63-5.49 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M12 10.2v3.9h5.45c-.24 1.25-.95 2.31-2.02 3.02l3.27 2.54c1.9-1.75 3-4.33 3-7.39 0-.71-.06-1.4-.18-2.07H12Z"
      />
      <path
        fill="currentColor"
        d="M12 22c2.7 0 4.97-.9 6.63-2.43l-3.27-2.54c-.9.6-2.05.96-3.36.96-2.58 0-4.77-1.74-5.55-4.08H3.07v2.57A10 10 0 0 0 12 22Z"
      />
      <path
        fill="currentColor"
        d="M6.45 13.91A6.01 6.01 0 0 1 6.13 12c0-.66.11-1.31.32-1.91V7.52H3.07A10 10 0 0 0 2 12c0 1.61.39 3.14 1.07 4.48l3.38-2.57Z"
      />
      <path
        fill="currentColor"
        d="M12 5.98c1.47 0 2.79.51 3.83 1.5l2.87-2.87C16.96 3.03 14.7 2 12 2A10 10 0 0 0 3.07 7.52l3.38 2.57c.78-2.34 2.97-4.11 5.55-4.11Z"
      />
    </svg>
  );
}

export function AnimatedBackground() {
  // Static, deterministic set of particles for subtle ambient motion
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const kinds: Particle["kind"][] = ["dot", "ring", "github", "google"];
        return {
          id: i,
          left: `${(i * 37) % 100}%`,
          top: `${(i * 53 + 11) % 100}%`,
          size: 14 + (i % 5) * 10,
          opacity: 0.05 + (i % 4) * 0.03,
          duration: 8 + (i % 8),
          delay: -(i * 0.7),
          rotate: (i * 24) % 360,
          kind: kinds[i % kinds.length],
        };
      }),
    []
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_top,_#1e1b4b_0%,_#0b1020_45%,_#05070f_100%)]"
    >
      {/* Soft radial glow behind the card area */}
      <div className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="absolute left-1/2 top-[45%] h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Floating low-opacity symbols (transform/opacity only for performance) */}
      <div className="absolute inset-0 motion-reduce:hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="ambient-float absolute text-white"
            style={{
              left: p.left,
              top: p.top,
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              transform: `rotate(${p.rotate}deg)`,
            }}
          >
            {p.kind === "dot" && (
              <span
                className="block rounded-full bg-white"
                style={{ width: p.size * 0.3, height: p.size * 0.3 }}
              />
            )}
            {p.kind === "ring" && (
              <span
                className="block rounded-full border border-white/60"
                style={{ width: p.size, height: p.size }}
              />
            )}
            {p.kind === "github" && (
              <GitHubMark className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
            {p.kind === "google" && (
              <GoogleMark className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
