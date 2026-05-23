const steps = [
  {
    task: "Deploy Montari v2.1 with streaming support",
    priority: "HIGH" as const,
    isBlocker: true,
    category: "Deploy",
  },
  {
    task: "Fix webhook-server OOM crash — investigate memory leak",
    priority: "HIGH" as const,
    isBlocker: true,
    category: "Bug",
  },
  {
    task: "Integrate Interior-Bot evals with Langfuse traces",
    priority: "MEDIUM" as const,
    isBlocker: false,
    category: "Eval",
  },
  {
    task: "Write case study: Restaurant Bot achieves 100% eval score",
    priority: "MEDIUM" as const,
    isBlocker: false,
    category: "Content",
  },
  {
    task: "Set up Uptime Robot monitoring for all production bots",
    priority: "LOW" as const,
    isBlocker: false,
    category: "Infra",
  },
  {
    task: "Record demo video for Montari client onboarding",
    priority: "LOW" as const,
    isBlocker: false,
    category: "Marketing",
  },
];

const priorityStyle: Record<"HIGH" | "MEDIUM" | "LOW", string> = {
  HIGH: "text-red-400 bg-red-500/10 border-red-500/20",
  MEDIUM: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  LOW: "text-white/35 bg-white/[0.04] border-white/10",
};

const categoryStyle: Record<string, string> = {
  Deploy: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Bug: "text-red-300 bg-red-500/10 border-red-500/15",
  Eval: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  Content: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  Infra: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  Marketing: "text-pink-400 bg-pink-500/10 border-pink-500/20",
};

export default function NextSteps() {
  const highCount = steps.filter((s) => s.priority === "HIGH").length;

  return (
    <section className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white">Next Steps</h2>
          <p className="text-[11px] text-white/30 mt-0.5">
            {highCount} high priority · {steps.length} total
          </p>
        </div>
        <span className="text-[10px] font-mono text-white/30">
          {steps.filter((s) => s.isBlocker).length} blockers
        </span>
      </div>
      <div className="space-y-1.5">
        {steps.map((step, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-colors cursor-default"
          >
            <div className="w-3.5 h-3.5 rounded border border-white/15 flex-shrink-0" />
            <span className="text-[11px] text-white/65 flex-1 leading-relaxed">{step.task}</span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {step.isBlocker && (
                <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border text-orange-400 bg-orange-500/10 border-orange-500/20">
                  Blocker
                </span>
              )}
              <span
                className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border ${priorityStyle[step.priority]}`}
              >
                {step.priority}
              </span>
              <span
                className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${categoryStyle[step.category]}`}
              >
                {step.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
