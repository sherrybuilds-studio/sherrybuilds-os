import type { NextConfig } from "next";

// ── Deployment contract — keep this in lockstep with ecosystem.config.js ──────
//
// This app is served by PM2 running `next start` (the classic Next.js server),
// NOT the standalone server. Do NOT add `output: "standalone"` here on its own:
// standalone emits `.next/standalone/server.js` instead of a `next start`-servable
// build, and the 2026-06-12 EADDRINUSE restart loop ("sherrybuilds-portfolio:
// 187 restarts") was exactly that mismatch — PM2 launching a standalone server
// the build never produced, crash-looping and orphaning a next-server on :3000.
//
// If you ever switch to standalone output, you MUST also switch
// ecosystem.config.js to run `node .next/standalone/server.js` and copy
// `public/` + `.next/static/` into the standalone dir at build time. Change both
// files in the same commit, or neither.
const nextConfig: NextConfig = {
  output: undefined, // explicit: classic `next start` server (paired with PM2)
};

export default nextConfig;
