import type { VercelResponse } from "@vercel/node";
import { GitHubError } from "@repo-radar/github";

const STATUS: Record<string, number> = {
  rate_limited: 429,
  not_found: 404,
  network: 502,
  unknown: 500,
};

export function sendError(res: VercelResponse, error: unknown): void {
  if (error instanceof GitHubError) {
    res.status(STATUS[error.kind] ?? 500).json({
      kind: error.kind,
      message: error.message,
      rateLimit: error.rateLimit ?? null,
    });
    return;
  }

  res.status(500).json({ kind: "unknown", message: "Unexpected server error" });
}
