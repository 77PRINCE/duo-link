import type { Metadata } from "next";

import Dashboard from "@/components/Dashboard";
import { listLinksForServer } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard | Duo Link",
  description: "Create and manage your Duo Link smart links.",
};

export default async function DashboardPage() {
  const result = await listLinksForServer();
  const initialLinks = result.status === "ok" ? result.links : [];
  const initialError = result.status === "error" ? result.message : null;

  return <Dashboard initialLinks={initialLinks} initialError={initialError} />;
}
