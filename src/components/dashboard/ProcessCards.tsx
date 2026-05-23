"use client";
import { motion } from "framer-motion";

type Status = "online" | "errored" | "stopped";

const processes: {
  name: string;
  status: Status;
  uptime: string;
  memory: string;
  pid: number | null;
}[] = [
  { name: "restaurant-bot", status: "online", uptime: "2d 14h", memory: "142 MB", pid: 1247 },
  { name: "montari-api", status: "online", uptime: "2d 14h", memory: "98 MB", pid: 1248 },
  { name: "interior-bot", status: "online", uptime: "1d 6h", memory: "156 MB", pid: 1249 },
  { name: "eval-runner", status: "online", uptime: "4h 22m", memory: "67 MB", pid: 1250 },
  { name: "webhook-server", status: "errored", uptime: "—", memory: "—", pid: null },
  { name: "scraper", status: "stopped", uptime: "—", memory: "—", pid: null },
];

const statusConfig: Record<Status, { dot: string; badge: string; label: string }> = {
  online: {
    dot: "bg-green-500",
    badge: "text-green-400 bg-green-500/10 border-green-500/20",
    label: "online",
  },
  errored: {
    dot: "bg-red-500",
    badge: "text-red-400 bg-red-500/10 border-red-500/20",
    label: "errored",
  },
  stopped: {
    dot: "bg-amber-500",
    badge: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    label: "stopped",
  },
};

export default function ProcessCards() {
  const onlineCount = processes.filter((p) => p.status === "online").length;

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
          PM2 Processes
        </h2>
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-[10px] font-mono text-white/30">
          {onlineCount}/{processes.length} online
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {processes.map((proc, i) => {
          const cfg = statusConfig[proc.status];
          return (
            <motion.div
              key={proc.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="bg-[#111] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-3 hover:border-white/[0.1] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${
                    proc.status === "online" ? "animate-pulse" : ""
                  }`}
                />
                <span
                  className={`text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded border ${cfg.badge}`}
                >
                  {cfg.label}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-white leading-tight truncate">{proc.name}</p>
                <p className="text-[10px] text-white/30 font-mono mt-0.5">
                  {proc.pid ? `PID ${proc.pid}` : "no process"}
                </p>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-white/30">uptime</span>
                  <span className="font-mono text-white/50">{proc.uptime}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-white/30">mem</span>
                  <span className="font-mono text-white/50">{proc.memory}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
