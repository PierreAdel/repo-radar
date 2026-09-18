import { GitHubError } from "./types.js";
import type { RepoIdentifier, RepoStats, SearchResult } from "./types.js";

export interface BrowserClientOptions {
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}

async function request<T>(
  url: string,
  fetchImpl: typeof fetch,
  signal?: AbortSignal,
): Promise<T> {
  let response: Response;

  try {
    response = await fetchImpl(url, { signal });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === "AbortError") throw cause;
    throw new GitHubError("Network request failed", "network");
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { message?: string; kind?: string }
      | null;
    const kind = body?.kind === "rate_limited" ? "rate_limited" : "unknown";
    throw new GitHubError(body?.message ?? response.statusText, kind, response.status);
  }

  return (await response.json()) as T;
}

export function createBrowserClient(options: BrowserClientOptions = {}) {
  const baseUrl = options.baseUrl ?? "/api";
  const fetchImpl = options.fetchImpl ?? fetch;

  return {
    searchRepositories(query: string, signal?: AbortSignal): Promise<SearchResult> {
      const url = `${baseUrl}/search?q=${encodeURIComponent(query)}`;
      return request<SearchResult>(url, fetchImpl, signal);
    },

    getRepoStats(
      { owner, name }: RepoIdentifier,
      signal?: AbortSignal,
    ): Promise<RepoStats> {
      const url = `${baseUrl}/repo/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;
      return request<RepoStats>(url, fetchImpl, signal);
    },
  };
}

export type BrowserClient = ReturnType<typeof createBrowserClient>;
