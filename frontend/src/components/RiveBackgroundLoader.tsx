import { existsSync } from "node:fs";
import { join } from "node:path";

import RiveBackgroundClientLoader from "./RiveBackgroundClientLoader";

interface RiveBackgroundLoaderProps {
  stateMachine?: string;
}

export default function RiveBackgroundLoader({
  stateMachine,
}: RiveBackgroundLoaderProps) {
  const assetPath = join(process.cwd(), "public", "animations", "hero-bg.riv");

  if (!existsSync(assetPath)) {
    return null;
  }

  return <RiveBackgroundClientLoader stateMachine={stateMachine} />;
}