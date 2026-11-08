"use client";

import { FormEvent, useState } from "react";

import type { LinkInput } from "@/lib/api";

type LinkFormProps = {
  mode: "create" | "edit";
  initialValues?: Partial<LinkInput>;
  submitting: boolean;
  error: string | null;
  onSubmit: (values: LinkInput) => void;
  onCancel?: () => void;
};

type FieldErrors = Partial<Record<keyof LinkInput, string>>;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validate(values: LinkInput): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.app_name.trim()) {
    errors.app_name = "Enter the application name.";
  } else if (values.app_name.trim().length > 120) {
    errors.app_name = "Application name must be 120 characters or fewer.";
  }

  if (!isHttpUrl(values.android_url.trim())) {
    errors.android_url = "Enter a valid http(s) Google Play URL.";
  }

  if (!isHttpUrl(values.ios_url.trim())) {
    errors.ios_url = "Enter a valid http(s) App Store URL.";
  }

  const slug = values.slug.trim();
  if (slug.length < 3 || slug.length > 60) {
    errors.slug = "Slug must be between 3 and 60 characters.";
  } else if (!SLUG_PATTERN.test(slug)) {
    errors.slug =
      "Use lowercase letters, numbers and single hyphens only (no leading or trailing hyphen).";
  }

  return errors;
}

export default function LinkForm({
  mode,
  initialValues,
  submitting,
  error,
  onSubmit,
  onCancel,
}: LinkFormProps) {
  const [values, setValues] = useState<LinkInput>({
    app_name: initialValues?.app_name ?? "",
    android_url: initialValues?.android_url ?? "",
    ios_url: initialValues?.ios_url ?? "",
    slug: initialValues?.slug ?? "",
  });
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function update(field: keyof LinkInput, value: string) {
    setValues((current) => {
      const next = { ...current, [field]: value };
      if (field === "app_name" && !slugTouched) {
        next.slug = slugify(value);
      }
      return next;
    });
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed: LinkInput = {
      app_name: values.app_name.trim(),
      android_url: values.android_url.trim(),
      ios_url: values.ios_url.trim(),
      slug: values.slug.trim().toLowerCase(),
    };
    const errors = validate(trimmed);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    onSubmit(trimmed);
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor="app_name"
          className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Application name
        </label>
        <input
          id="app_name"
          value={values.app_name}
          onChange={(event) => update("app_name", event.target.value)}
          placeholder="Example App"
          className={inputClass}
          aria-invalid={Boolean(fieldErrors.app_name)}
        />
        {fieldErrors.app_name && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.app_name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="android_url"
          className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Android (Google Play) URL
        </label>
        <input
          id="android_url"
          type="url"
          value={values.android_url}
          onChange={(event) => update("android_url", event.target.value)}
          placeholder="https://play.google.com/store/apps/details?id=com.example"
          className={inputClass}
          aria-invalid={Boolean(fieldErrors.android_url)}
        />
        {fieldErrors.android_url && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.android_url}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="ios_url"
          className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          iOS (App Store) URL
        </label>
        <input
          id="ios_url"
          type="url"
          value={values.ios_url}
          onChange={(event) => update("ios_url", event.target.value)}
          placeholder="https://apps.apple.com/app/example/id123456789"
          className={inputClass}
          aria-invalid={Boolean(fieldErrors.ios_url)}
        />
        {fieldErrors.ios_url && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.ios_url}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="slug"
          className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Custom slug
        </label>
        <div className="flex items-center rounded-lg border border-slate-300 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-indigo-400 dark:focus-within:ring-indigo-900">
          <span className="pl-3 text-sm text-slate-400">/r/</span>
          <input
            id="slug"
            value={values.slug}
            onChange={(event) => {
              setSlugTouched(true);
              update("slug", event.target.value);
            }}
            placeholder="example-app"
            className="w-full rounded-lg bg-transparent px-1 py-2 text-sm text-slate-900 outline-none dark:text-slate-100"
            aria-invalid={Boolean(fieldErrors.slug)}
          />
        </div>
        {fieldErrors.slug && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.slug}</p>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        >
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
              ? "Create smart link"
              : "Save changes"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
