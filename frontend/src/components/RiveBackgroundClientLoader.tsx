"use client";

import dynamic from "next/dynamic";

const RiveBackground = dynamic(() => import("./RiveBackground"), {
  ssr: false,
  loading: () => <div aria-hidden="true" className="absolute inset-0" />,
});

interface RiveBackgroundClientLoaderProps {
  stateMachine?: string;
}

export default function RiveBackgroundClientLoader({
  stateMachine,
}: RiveBackgroundClientLoaderProps) {
  return <RiveBackground stateMachine={stateMachine} />;
}