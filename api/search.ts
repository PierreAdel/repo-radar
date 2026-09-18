import type { VercelRequest, VercelResponse } from "@vercel/node";
import { rest } from "./_lib/client.js";
import { sendError } from "./_lib/respond.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";

  if (q.length === 0) {
    res.status(200).json({ totalCount: 0, items: [] });
    return;
  }

  try {
    const result = await rest.searchRepositories(q);
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    res.status(200).json(result);
  } catch (error) {
    sendError(res, error);
  }
}
