export interface RepoIdentifier {
  owner: string;
  name: string;
}

export interface RepoSummary extends RepoIdentifier {
  id: number;
  fullName: string;
  description: string | null;
  stars: number;
  language: string | null;
  ownerAvatarUrl: string;
  htmlUrl: string;
}

export interface RepoStats extends RepoIdentifier {
  stars: number;
  openIssues: number;
  lastCommitDate: string | null;
  fetchedAt: string;
}

export interface SearchResult {
  totalCount: number;
  items: RepoSummary[];
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetAt: string;
}

export type GitHubErrorKind = "rate_limited" | "not_found" | "network" | "unknown";

export class GitHubError extends Error {
  readonly kind: GitHubErrorKind;
  readonly status: number | undefined;
  readonly rateLimit: RateLimitInfo | undefined;

  constructor(
    message: string,
    kind: GitHubErrorKind,
    status?: number,
    rateLimit?: RateLimitInfo,
  ) {
    super(message);
    this.name = "GitHubError";
    this.kind = kind;
    this.status = status;
    this.rateLimit = rateLimit;
  }
}
