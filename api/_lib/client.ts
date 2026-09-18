import { createRestClient } from "@repo-radar/github/server";

export const rest = createRestClient({ token: process.env.GITHUB_TOKEN });
