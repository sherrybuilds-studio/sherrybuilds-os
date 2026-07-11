import Reveal from "@/components/portfolio/Reveal";

const GROUPS = [
  {
    label: "Languages & frameworks",
    tools: ["Python", "FastAPI", "TypeScript", "Next.js"],
  },
  {
    label: "AI & RAG",
    tools: ["Claude", "ChromaDB", "semantic caching", "RAG pipelines"],
  },
  {
    label: "Data & infra",
    tools: ["Supabase", "PostgreSQL", "Docker", "PM2", "Cloudflare"],
  },
  {
    label: "Observability",
    tools: ["Langfuse", "evaluation suites"],
  },
  {
    label: "Automation",
    tools: ["n8n", "WhatsApp Cloud API", "cron"],
  },
];

const mono: React.CSSProperties = {
  fontFamily: "var(--font-label)",
  fontSize: "var(--step--1)",
  letterSpacing: "0.08em",
  color: "var(--muted)",
};

export default function DarkStack() {
  return (
    <section
      id="stack"
      aria-labelledby="stack-heading"
      data-chapter=""
      className="relative overflow-hidden"
      style={{ paddingBlock: "clamp(6rem, 14vh, 10rem)" }}
    >
      <div data-chapter-inner="" className="mx-auto w-full max-w-[80rem] px-6 lg:px-10">
        {/* Headline — centered, house scrim for crispness over the fluid */}
        <div className="relative mx-auto max-w-[56rem] text-center">
          <div
            aria-hidden="true"
            className="absolute -z-10"
            style={{
              inset: "-12% -25%",
              background:
                "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(10, 14, 26, 0.85) 0%, rgba(10, 14, 26, 0.5) 50%, transparent 75%)",
            }}
          />
          <Reveal>
            <p className="uppercase" style={mono}>
              04 — Stack
            </p>
            <h2
              id="stack-heading"
              className="mx-auto mt-[var(--space-6)]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--step-6)",
                fontWeight: 480,
                lineHeight: 1.08,
                letterSpacing: "-0.015em",
                color: "var(--text)",
              }}
            >
              The tools I reach for.
            </h2>
          </Reveal>
        </div>

        {/* Categories — clean text rows in one restrained glass panel */}
        <div
          className="glass mx-auto mt-[var(--space-16)] max-w-[64rem] rounded-3xl lg:mt-[var(--space-24)]"
          style={{ padding: "clamp(1.5rem, 4vw, 3rem)" }}
        >
          {GROUPS.map((g, i) => (
            <Reveal key={g.label} delay={i * 0.06} className={i > 0 ? "border-t" : ""}>
              <div className="grid grid-cols-1 gap-y-[var(--space-2)] py-[var(--space-6)] md:grid-cols-12 md:items-baseline md:gap-x-[var(--space-8)]">
                <span className="uppercase md:col-span-4" style={mono}>
                  {g.label}
                </span>
                <p
                  className="md:col-span-8"
                  style={{
                    fontSize: "var(--step-1)",
                    lineHeight: 1.6,
                    color: "var(--text)",
                    fontWeight: 450,
                  }}
                >
                  {g.tools.map((t, j) => (
                    <span key={t}>
                      {t}
                      {j < g.tools.length - 1 && (
                        <span aria-hidden="true" style={{ color: "var(--muted)" }}>
                          {" · "}
                        </span>
                      )}
                    </span>
                  ))}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
