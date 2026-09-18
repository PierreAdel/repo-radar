import { GitHubError } from "../types.js";
import type { RateLimitInfo, RepoIdentifier, RepoStats, SearchResult } from "../types.js";
import { toSearchResult } from "../mappers.js";
import type { RawRepo, RawSearchResponse } from "../mappers.js";

const API_ROOT = "https://api.github.com";

export interface RestClientOptions {
  token?: string | undefined;
  fetchImpl?: typeof fetch;
}

function readRateLimit(headers: Headers): RateLimitInfo | undefined {
  const limit = headers.get("x-ratelimit-limit");
  const remaining = headers.get("x-ratelimit-remaining");
  const reset = headers.get("x-ratelimit-reset");
  if (limit === null || remaining === null || reset === null) return undefined;

  return {
    limit: Number(limit),
    remaining: Number(remaining),
    resetAt: new Date(Number(reset) * 1000).toISOString(),
  };
}

export function createRestClient(options: RestClientOptions = {}) {
  const fetchImpl = options.fetchImpl ?? fetch;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  async function call<T>(path: string): Promise<T> {
    const response = await fetchImpl(`${API_ROOT}${path}`, { headers });
    const rateLimit = readRateLimit(response.headers);

    if (response.status === 404) {
      throw new GitHubError("Repository not found", "not_found", 404, rateLimit);
    }

    if (response.status === 403 || response.status === 429) {
      if (rateLimit?.remaining === 0) {
        throw new GitHubError("GitHub rate limit exceeded", "rate_limited", response.status, rateLimit);
      }
    }

    if (!response.ok) {
      throw new GitHubError(response.statusText, "unknown", response.status, rateLimit);
    }

    return (await response.json()) as T;
  }

  return {
    async searchRepositories(query: string, perPage = 20): Promise<SearchResult> {
      const raw = await call<RawSearchResponse>(
        `/search/repositories?q=${encodeURIComponent(query)}&per_page=${perPage}`,
      );
      return toSearchResult(raw);
    },

    async getRepoStats({ owner, name }: RepoIdentifier): Promise<RepoStats> {
      const [repo, commits] = await Promise.all([
        call<RawRepo>(`/repos/${owner}/${name}`),
        call<Array<{ commit: { committer: { date: string } | null } }>>(
          `/repos/${owner}/${name}/commits?per_page=1`,
        ).catch(() => []),
      ]);

      const commitDate = commits[0]?.commit.committer?.date ?? repo.pushed_at;

      return {
        owner,
        name,
        stars: repo.stargazers_count,
        openIssues: repo.open_issues_count,
        lastCommitDate: commitDate,
        fetchedAt: new Date().toISOString(),
      };
    },
  };
}

export type RestClient = ReturnType<typeof createRestClient>;
