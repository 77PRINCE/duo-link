"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import LinkCard from "@/components/LinkCard";
import LinkForm from "@/components/LinkForm";
import {
  ApiError,
  createLink,
  deleteLink,
  listLinks,
  updateLink,
  type LinkInput,
  type SmartLink,
} from "@/lib/api";

type DashboardProps = {
  initialLinks: SmartLink[];
  initialError: string | null;
};

function messageFor(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export default function Dashboard({
  initialLinks,
  initialError,
}: DashboardProps) {
  const [links, setLinks] = useState<SmartLink[]>(initialLinks);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(initialError);

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await listLinks();
      setLinks(data);
      setLoadError(null);
    } catch (error) {
      setLoadError(messageFor(error, "Unable to load your links."));
    } finally {
      setRefreshing(false);
    }
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    setLoadError(null);
    void load();
  }

  async function handleCreate(values: LinkInput) {
    setCreating(true);
    setCreateError(null);
    setActionError(null);
    setNotice(null);
    try {
      const created = await createLink(values);
      setLinks((current) => [created, ...current]);
      setNotice(`"${created.app_name}" is live at ${created.smart_url}`);
    } catch (error) {
      setCreateError(messageFor(error, "Could not create the link."));
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdate(id: number, values: LinkInput) {
    setSavingEdit(true);
    setEditError(null);
    setActionError(null);
    try {
      const updated = await updateLink(id, values);
      setLinks((current) =>
        current.map((link) => (link.id === id ? updated : link)),
      );
      setEditingId(null);
      setNotice(`"${updated.app_name}" was updated.`);
    } catch (error) {
      setEditError(messageFor(error, "Could not update the link."));
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDelete(link: SmartLink) {
    if (!window.confirm(`Delete "${link.app_name}"? This cannot be undone.`)) {
      return;
    }
    setDeletingId(link.id);
    setActionError(null);
    setNotice(null);
    try {
      await deleteLink(link.id);
      setLinks((current) => current.filter((item) => item.id !== link.id));
      if (editingId === link.id) {
        setEditingId(null);
      }
      setNotice(`"${link.app_name}" was deleted.`);
    } catch (error) {
      setActionError(messageFor(error, "Could not delete the link."));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              DL
            </span>
            <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Duo Link
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 sm:inline dark:bg-amber-950 dark:text-amber-300">
              Demo mode
            </span>
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              Sign out
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Your smart links
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              One link that sends Android visitors to Google Play and iOS
              visitors to the App Store.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-white disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {(notice || actionError) && (
          <div
            role="status"
            className={`mt-4 rounded-lg border px-3 py-2 text-sm ${
              actionError
                ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
                : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
            }`}
          >
            {actionError ?? notice}
          </div>
        )}

        {loadError && (
          <div
            role="alert"
            className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
          >
            <span>{loadError}</span>
            <button
              type="button"
              onClick={handleRefresh}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
            >
              Try again
            </button>
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
          <section className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Create a smart link
            </h2>
            <p className="mb-4 mt-1 text-sm text-slate-600 dark:text-slate-400">
              Add both store destinations and choose your custom slug.
            </p>
            <LinkForm
              mode="create"
              submitting={creating}
              error={createError}
              onSubmit={handleCreate}
            />
          </section>

          <section>
            {links.length === 0 ? (
              loadError ? null : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    No links yet
                  </h3>
                  <p className="mx-auto mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-400">
                    Create your first smart link with the form to start sharing
                    a single URL for both app stores.
                  </p>
                </div>
              )
            ) : (
              <div className="space-y-4">
                {links.map((link) =>
                  editingId === link.id ? (
                    <div
                      key={link.id}
                      className="rounded-xl border border-indigo-200 bg-white p-5 shadow-sm dark:border-indigo-900 dark:bg-slate-900"
                    >
                      <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">
                        Edit &ldquo;{link.app_name}&rdquo;
                      </h3>
                      <LinkForm
                        key={`edit-${link.id}`}
                        mode="edit"
                        initialValues={{
                          app_name: link.app_name,
                          android_url: link.android_url,
                          ios_url: link.ios_url,
                          slug: link.slug,
                        }}
                        submitting={savingEdit}
                        error={editError}
                        onSubmit={(values) => void handleUpdate(link.id, values)}
                        onCancel={() => {
                          setEditingId(null);
                          setEditError(null);
                        }}
                      />
                    </div>
                  ) : (
                    <LinkCard
                      key={link.id}
                      link={link}
                      deleting={deletingId === link.id}
                      onEdit={() => {
                        setEditingId(link.id);
                        setEditError(null);
                      }}
                      onDelete={() => void handleDelete(link)}
                    />
                  ),
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
