import type { RepoSummary, SearchResult } from "./types.js";

interface RawRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  open_issues_count: number;
  pushed_at: string | null;
  language: string | null;
  html_url: string;
  owner: { login: string; avatar_url: string };
}

interface RawSearchResponse {
  total_count: number;
  items: RawRepo[];
}

export function toRepoSummary(raw: RawRepo): RepoSummary {
  return {
    id: raw.id,
    owner: raw.owner.login,
    name: raw.name,
    fullName: raw.full_name,
    description: raw.description,
    stars: raw.stargazers_count,
    language: raw.language,
    ownerAvatarUrl: raw.owner.avatar_url,
    htmlUrl: raw.html_url,
  };
}

export function toSearchResult(raw: RawSearchResponse): SearchResult {
  return {
    totalCount: raw.total_count,
    items: raw.items.map(toRepoSummary),
  };
}

export type { RawRepo, RawSearchResponse };
