# SherryBuilds OS Dashboard

Next.js 16 + TypeScript + Tailwind + shadcn/ui (Nova theme) + Recharts

This is a personal mission control dashboard for a Berlin-based AI developer.
Shows: PM2 processes, Docker containers, eval scores, next steps, income roadmap.
Dark theme. Professional SaaS aesthetic.

## Second Brain: Obsidian Vault
**Path:** `/home/sherry/Documents/Obsidian Vault`
- Read `01-Projects/SherryBuilds-OS.md` for status + architecture
- Read `_auto/Active-Processes.md` for PM2 process details
- After changes, write a session log to `04-Operations/Logs/YYYY-MM-DD-slug.md` (project note is human-curated)
- tsconfig: exclude `public/service-worker.js`

## Session Rules (MANDATORY)
- **Before starting work**: Read `/home/sherry/Documents/Obsidian Vault/_auto/Claude-Context.md` for today's system state, priorities, and blockers
- **Before starting work**: Read the relevant `01-Projects/<name>.md` note from the Obsidian vault for project context
- **After finishing work**: Append a summary of what you changed to `/home/sherry/Documents/Obsidian Vault/Inbox.md`
- **After finishing work**: Write a session log to `04-Operations/Logs/YYYY-MM-DD-slug.md` — do NOT edit `01-Projects/*.md` (human-curated; machine digests live in `_auto/recent/`)
