import type { VercelRequest, VercelResponse } from "@vercel/node";
import { rest } from "../../_lib/client.js";
import { sendError } from "../../_lib/respond.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const owner = typeof req.query.owner === "string" ? req.query.owner : "";
  const name = typeof req.query.name === "string" ? req.query.name : "";

  if (!owner || !name) {
    res.status(400).json({ kind: "unknown", message: "owner and name are required" });
    return;
  }

  try {
    const stats = await rest.getRepoStats({ owner, name });
    res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=120");
    res.status(200).json(stats);
  } catch (error) {
    sendError(res, error);
  }
}
