import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { resolveLinkForVisitor } from "@/lib/api";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await resolveLinkForVisitor(slug, null);
  if (result.status === "found") {
    return {
      title: `Download ${result.data.app_name} | Duo Link`,
      description: `Get ${result.data.app_name} for Android or iOS.`,
    };
  }
  return { title: "Link not found | Duo Link" };
}

function AndroidIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
      <path d="M17.6 9.48l1.84-3.18a.4.4 0 0 0-.14-.54.4.4 0 0 0-.55.14l-1.86 3.22A11.4 11.4 0 0 0 12 8.2c-1.76 0-3.43.33-4.89.92L5.25 5.9a.4.4 0 0 0-.55-.14.4.4 0 0 0-.14.54l1.84 3.18A10.5 10.5 0 0 0 1 18h22a10.5 10.5 0 0 0-5.4-8.52zM7 15.25a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm10 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
      <path d="M16.36 12.76c-.02-2.2 1.8-3.26 1.88-3.31-1.02-1.5-2.61-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.54 2.67-.39 6.62 1.1 8.79.73 1.06 1.6 2.25 2.74 2.21 1.1-.04 1.52-.71 2.85-.71 1.33 0 1.7.71 2.86.69 1.18-.02 1.93-1.08 2.65-2.15.84-1.23 1.18-2.42 1.2-2.48-.03-.01-2.29-.88-2.31-3.54zM14.2 6.2c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.55 1.31-.56.65-1.05 1.69-.92 2.68.97.08 1.96-.49 2.57-1.23z" />
    </svg>
  );
}

function StoreButton({
  href,
  platform,
  appName,
}: {
  href: string;
  platform: "android" | "ios";
  appName: string;
}) {
  const isAndroid = platform === "android";
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex w-full items-center gap-3 rounded-xl bg-slate-900 px-5 py-3.5 text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
      aria-label={`Download ${appName} on ${isAndroid ? "Google Play" : "the App Store"}`}
    >
      {isAndroid ? <AndroidIcon /> : <AppleIcon />}
      <span className="text-left">
        <span className="block text-[10px] font-medium uppercase tracking-wider opacity-70">
          {isAndroid ? "Get it on" : "Download on the"}
        </span>
        <span className="block text-base font-semibold leading-tight">
          {isAndroid ? "Google Play" : "App Store"}
        </span>
      </span>
    </a>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 px-4 py-12 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
        {children}
      </div>
      <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
        Powered by{" "}
        <Link
          href="/"
          className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          Duo Link
        </Link>
      </p>
    </div>
  );
}

export default async function PublicLinkPage({ params }: PageProps) {
  const { slug } = await params;
  const headerList = await headers();
  const result = await resolveLinkForVisitor(slug, headerList.get("user-agent"));

  if (result.status === "not_found") {
    return notFound();
  }

  if (result.status === "error") {
    return (
      <Shell>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {result.message}
        </p>
        <Link
          href={`/r/${slug}`}
          className="mt-6 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Try again
        </Link>
      </Shell>
    );
  }

  const link = result.data;
  const isAndroid = link.platform === "android";
  const isIos = link.platform === "ios";
  const isOther = link.platform === "other";

  return (
    <Shell>
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-indigo-600 text-xl font-bold text-white">
        {link.app_name.trim().charAt(0).toUpperCase() || "D"}
      </div>

      <h1 className="mt-5 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        {link.app_name}
      </h1>

      {isAndroid && (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          You&apos;re on Android. Tap below to open Google Play and download the
          app.
        </p>
      )}
      {isIos && (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          You&apos;re on iPhone or iPad. Tap below to open the App Store and
          download the app.
        </p>
      )}
      {isOther && (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          We couldn&apos;t detect your device. Choose the store that matches your
          phone below.
        </p>
      )}

      <div className="mt-6 space-y-3">
        {(isAndroid || isOther) && (
          <StoreButton
            href={link.android_url}
            platform="android"
            appName={link.app_name}
          />
        )}
        {(isIos || isOther) && (
          <StoreButton
            href={link.ios_url}
            platform="ios"
            appName={link.app_name}
          />
        )}
      </div>

      {isAndroid && (
        <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
          On another device?{" "}
          <a
            href={link.ios_url}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Get the iOS version
          </a>
        </p>
      )}
      {isIos && (
        <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
          On another device?{" "}
          <a
            href={link.android_url}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Get the Android version
          </a>
        </p>
      )}
    </Shell>
  );
}
