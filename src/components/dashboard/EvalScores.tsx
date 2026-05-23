"use client";
import { motion } from "framer-motion";

const evals = [
  {
    name: "Restaurant Bot",
    score: 100,
    gradient: "from-green-500 to-emerald-400",
    label: "Perfect score",
  },
  {
    name: "Montari",
    score: 94.2,
    gradient: "from-blue-500 to-cyan-400",
    label: "94.2 / 100",
  },
  {
    name: "Interior-Bot",
    score: 94.2,
    gradient: "from-violet-500 to-blue-400",
    label: "94.2 / 100",
  },
];

export default function EvalScores() {
  const avg = evals.reduce((sum, e) => sum + e.score, 0) / evals.length;

  return (
    <section className="bg-[#111] border border-white/[0.06] rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white">Eval Scores</h2>
          <p className="text-[11px] text-white/30 mt-0.5">Latest run · Pass@1</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono font-semibold text-white">{avg.toFixed(1)}%</p>
          <p className="text-[10px] text-white/30">avg</p>
        </div>
      </div>
      <div className="space-y-6">
        {evals.map((ev, i) => (
          <div key={ev.name}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs font-medium text-white/80">{ev.name}</p>
                <p className="text-[10px] text-white/30 mt-0.5">{ev.label}</p>
              </div>
              <span className="text-base font-mono font-semibold text-white">{ev.score}%</span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${ev.gradient}`}
                initial={{ width: "0%" }}
                animate={{ width: `${ev.score}%` }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.9, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
