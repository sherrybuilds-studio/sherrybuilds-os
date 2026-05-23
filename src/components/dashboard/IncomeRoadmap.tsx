const roadmap = [
  { month: "Month 1", date: "Jun 2025", target: 2500, status: "achieved", milestone: "Restaurant Bot launch" },
  { month: "Month 2", date: "Jul 2025", target: 4000, status: "on-track", milestone: "Montari integration" },
  { month: "Month 3", date: "Aug 2025", target: 6000, status: "projected", milestone: "Interior-Bot launch" },
  { month: "Month 4", date: "Sep 2025", target: 8000, status: "projected", milestone: "First enterprise deal" },
  { month: "Month 5", date: "Oct 2025", target: 10000, status: "projected", milestone: "Agency partnership" },
  { month: "Month 6", date: "Nov 2025", target: 15000, status: "projected", milestone: "Retainer model scale" },
];

const statusConfig: Record<string, { label: string; style: string }> = {
  achieved: { label: "Achieved", style: "text-green-400 bg-green-500/10 border-green-500/20" },
  "on-track": { label: "On Track", style: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  projected: { label: "Projected", style: "text-white/35 bg-white/[0.04] border-white/10" },
};

export default function IncomeRoadmap() {
  return (
    <section className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white">Income Roadmap</h2>
          <p className="text-[11px] text-white/30 mt-0.5">6-month plan to €15K/mo MRR</p>
        </div>
        <div className="text-right">
          <p className="text-base font-mono font-semibold text-white">€15,000</p>
          <p className="text-[10px] text-white/30">Month 6 target</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {["Month", "Date", "Target", "Milestone", "Status"].map((h) => (
                <th
                  key={h}
                  className={`text-[9px] uppercase tracking-widest text-white/30 pb-3 font-semibold ${
                    h === "Target" || h === "Status" ? "text-right" : "text-left"
                  } ${h === "Date" ? "hidden sm:table-cell" : ""} pr-4 last:pr-0`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roadmap.map((row) => {
              const cfg = statusConfig[row.status];
              return (
                <tr
                  key={row.month}
                  className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 pr-4">
                    <span className="text-[11px] font-mono text-white/60">{row.month}</span>
                  </td>
                  <td className="py-3 pr-4 hidden sm:table-cell">
                    <span className="text-[11px] text-white/30">{row.date}</span>
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <span className="text-sm font-mono font-semibold text-white">
                      €{row.target.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-[11px] text-white/50">{row.milestone}</span>
                  </td>
                  <td className="py-3 text-right">
                    <span
                      className={`text-[9px] font-semibold uppercase tracking-wide px-2 py-1 rounded border ${cfg.style}`}
                    >
                      {cfg.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
