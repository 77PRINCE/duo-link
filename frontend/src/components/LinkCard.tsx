"use client";

import { useState } from "react";

import type { SmartLink } from "@/lib/api";

type LinkCardProps = {
  link: SmartLink;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
};

async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the legacy approach.
    }
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}

export default function LinkCard({
  link,
  onEdit,
  onDelete,
  deleting,
}: LinkCardProps) {
  const [copied, setCopied] = useState(false);
  const [shareNote, setShareNote] = useState<string | null>(null);

  async function handleCopy() {
    const success = await copyToClipboard(link.smart_url);
    if (success) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      setShareNote("Copy failed. Select the link manually.");
    }
  }

  async function handleShare() {
    setShareNote(null);
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: link.app_name,
          text: `Download ${link.app_name}`,
          url: link.smart_url,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    const success = await copyToClipboard(link.smart_url);
    setShareNote(
      success
        ? "Sharing is not available here, so the link was copied instead."
        : "Sharing is not available in this browser.",
    );
  }

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {link.app_name}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Created {new Date(link.created_at).toLocaleString()}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          /r/{link.slug}
        </span>
      </div>

      <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-950">
        <p className="break-all font-mono text-sm text-indigo-700 dark:text-indigo-300">
          {link.smart_url}
        </p>
      </div>

      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Android
          </dt>
          <dd className="truncate text-slate-700 dark:text-slate-300">
            <a
              href={link.android_url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {link.android_url}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
            iOS
          </dt>
          <dd className="truncate text-slate-700 dark:text-slate-300">
            <a
              href={link.ios_url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {link.ios_url}
            </a>
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Share
        </button>
        <a
          href={link.smart_url}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Open page
        </a>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {shareNote && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          {shareNote}
        </p>
      )}
    </article>
  );
}
