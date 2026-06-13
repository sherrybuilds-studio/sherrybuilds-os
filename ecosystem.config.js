// PM2 definition for the public portfolio (sherrybuilds.com → localhost:3000).
// Checked-in source of truth — apply with:
//     pm2 delete sherrybuilds-portfolio 2>/dev/null; \
//     pm2 start ecosystem.config.js && pm2 save
//
// Why this file exists: the app definition previously lived only in PM2's
// runtime dump, which is how the 2026-06-12 crash loop ("187 restarts") crept
// in — a misconfigured script/interpreter respawning fast enough to orphan a
// next-server on :3000 → EADDRINUSE → more crashes. Two safeguards below
// prevent recurrence: (1) run Next's bin directly under node so PM2 signals the
// real process (not an npm wrapper that orphans its child), and (2) restart_delay
// + min_uptime + max_restarts so a crash can't tight-loop and race the kernel
// freeing the port.
//
// Pairs with next.config.ts: this runs `next start`, NOT the standalone server.
module.exports = {
  apps: [
    {
      name: "sherrybuilds-portfolio",
      cwd: "/home/sherry/frontend/sherrybuilds-os",
      // Run Next's CLI directly under node — NOT `npm run start`. Under npm,
      // PM2 signals the npm wrapper and next-server is orphaned holding :3000.
      interpreter: "node",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      // Give the kernel time to release :3000 before respawning (the EADDRINUSE
      // root cause). The fixed delay below was missing entirely before.
      restart_delay: 4000,
      // A crash within 10s doesn't count as a successful start; combined with
      // max_restarts this backs off instead of looping 187 times.
      min_uptime: 10000,
      max_restarts: 10,
      // Let next-server close its :3000 listener on SIGINT before SIGKILL.
      kill_timeout: 10000,
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
    },
  ],
};
