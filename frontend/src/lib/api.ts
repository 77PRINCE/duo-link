export type SmartLink = {
  id: number;
  app_name: string;
  android_url: string;
  ios_url: string;
  slug: string;
  smart_url: string;
  created_at: string;
  updated_at: string;
};

export type LinkInput = {
  app_name: string;
  android_url: string;
  ios_url: string;
  slug: string;
};

export type Platform = "android" | "ios" | "other";

export type ResolvedLink = {
  app_name: string;
  slug: string;
  platform: Platform;
  target_url: string | null;
  android_url: string;
  ios_url: string;
};

export type ResolveResult =
  | { status: "found"; data: ResolvedLink }
  | { status: "not_found" }
  | { status: "error"; message: string };

const PUBLIC_API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

const SERVER_API_BASE_URL = (
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ValidationIssue = { msg?: string };

function extractMessage(data: unknown): string | null {
  if (typeof data !== "object" || data === null) {
    return null;
  }
  const detail = (data as { detail?: unknown }).detail;
  if (typeof detail === "string") {
    return detail;
  }
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) =>
        typeof item === "object" && item !== null
          ? (item as ValidationIssue).msg
          : undefined,
      )
      .filter((message): message is string => typeof message === "string");
    if (messages.length > 0) {
      return messages.join(", ");
    }
  }
  return null;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${PUBLIC_API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      "Could not reach the Duo Link API. Make sure the backend is running.",
      0,
    );
  }

  if (!response.ok) {
    let message = "Something went wrong. Please try again.";
    try {
      message = extractMessage(await response.json()) ?? message;
    } catch {
      // Keep the default message when the body is not JSON.
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function listLinks(): Promise<SmartLink[]> {
  return request<SmartLink[]>("/api/v1/links");
}

export type ServerListResult =
  | { status: "ok"; links: SmartLink[] }
  | { status: "error"; message: string };

export async function listLinksForServer(): Promise<ServerListResult> {
  try {
    const response = await fetch(`${SERVER_API_BASE_URL}/api/v1/links`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return {
        status: "error",
        message: "The Duo Link API returned an unexpected response.",
      };
    }
    return { status: "ok", links: (await response.json()) as SmartLink[] };
  } catch {
    return {
      status: "error",
      message:
        "Could not reach the Duo Link API. Make sure the backend is running.",
    };
  }
}

export function createLink(input: LinkInput): Promise<SmartLink> {
  return request<SmartLink>("/api/v1/links", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateLink(
  id: number,
  input: Partial<LinkInput>,
): Promise<SmartLink> {
  return request<SmartLink>(`/api/v1/links/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteLink(id: number): Promise<void> {
  return request<void>(`/api/v1/links/${id}`, { method: "DELETE" });
}

export async function resolveLinkForVisitor(
  slug: string,
  userAgent: string | null,
): Promise<ResolveResult> {
  let response: Response;
  try {
    response = await fetch(
      `${SERVER_API_BASE_URL}/api/v1/links/resolve/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
        headers: userAgent ? { "User-Agent": userAgent } : undefined,
      },
    );
  } catch {
    return {
      status: "error",
      message: "Could not reach the Duo Link API. Please try again later.",
    };
  }

  if (response.status === 404) {
    return { status: "not_found" };
  }

  if (!response.ok) {
    return {
      status: "error",
      message: "We could not load this link right now. Please try again later.",
    };
  }

  return { status: "found", data: (await response.json()) as ResolvedLink };
}
