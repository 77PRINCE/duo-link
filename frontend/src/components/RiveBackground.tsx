"use client";

import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas";

interface RiveBackgroundProps {
  stateMachine?: string;
}

function RiveCanvas({ stateMachine }: RiveBackgroundProps) {
  const { RiveComponent } = useRive({
    src: "/animations/hero-bg.riv",
    autoplay: true,
    stateMachines: stateMachine ? [stateMachine] : undefined,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  return <RiveComponent className="h-full min-h-[400px] w-full" />;
}

export default function RiveBackground({
  stateMachine,
}: RiveBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 flex h-full w-full items-center justify-center"
    >
      <RiveCanvas stateMachine={stateMachine} />
    </div>
  );
}