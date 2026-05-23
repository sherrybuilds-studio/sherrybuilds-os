const containers = [
  { name: "langfuse-server", image: "langfuse:latest", uptime: "2d 14h", status: "healthy" },
  { name: "langfuse-worker", image: "langfuse:latest", uptime: "2d 14h", status: "healthy" },
  { name: "langfuse-postgres", image: "postgres:15", uptime: "2d 14h", status: "healthy" },
  { name: "langfuse-redis", image: "redis:7-alpine", uptime: "2d 14h", status: "healthy" },
  { name: "langfuse-clickhouse", image: "clickhouse:24", uptime: "2d 14h", status: "healthy" },
  { name: "langfuse-minio", image: "minio:latest", uptime: "2d 14h", status: "healthy" },
];

export default function DockerHealth() {
  return (
    <section className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white">Docker Containers</h2>
          <p className="text-[11px] text-white/30 mt-0.5">Langfuse observability stack</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          All healthy
        </div>
      </div>
      <div className="space-y-1">
        {containers.map((c) => (
          <div
            key={c.name}
            className="flex items-center justify-between py-2 px-0 border-b border-white/[0.04] last:border-0"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-[11px] font-mono text-white/80">{c.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-white/25 hidden sm:block font-mono">{c.image}</span>
              <span className="text-[10px] font-mono text-white/40 w-12 text-right">{c.uptime}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
