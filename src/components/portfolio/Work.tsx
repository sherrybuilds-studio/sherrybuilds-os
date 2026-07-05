import Reveal from "./Reveal";

type CaseStudy = {
  index: string;
  title: string;
  meta: string;
  description: string;
  metric: string;
  metricAccent: boolean;
  stack: string[];
  link?: { label: string; href: string };
};

const CASES: CaseStudy[] = [
  {
    index: "01",
    title: "Multilingual RAG Commerce Agent",
    meta: "Private client · Commerce",
    description:
      "A WhatsApp sales agent that answers in the customer's own language, retrieves product knowledge through RAG, and semantically caches repeat questions. Every response is traced end-to-end in Langfuse.",
    metric: "94.2% eval · 38% token cost reduction",
    metricAccent: true,
    stack: ["Python", "FastAPI", "ChromaDB", "Claude", "Langfuse"],
  },
  {
    index: "02",
    title: "Reservation System",
    meta: "Hospitality · Booking platform",
    description:
      "A WhatsApp booking and waitlist platform with a reservation and analytics pipeline behind it. Evaluated before launch — it passed on the first run.",
    metric: "100% first-run eval",
    metricAccent: true,
    stack: ["Python", "FastAPI", "Supabase", "WhatsApp Cloud API"],
  },
  {
    index: "03",
    title: "Autonomous Agent Pipeline",
    meta: "Self-built · Automation",
    description:
      "A self-running opportunity pipeline: scrape, score, generate, track, notify. It wakes on schedule, finishes without supervision, and reports what it did.",
    metric: "Runs daily · zero human input",
    metricAccent: true,
    stack: ["Python", "Claude", "Supabase", "cron"],
  },
  {
    index: "04",
    title: "Open-Source RAG Reference",
    meta: "Public · Reference architecture",
    description:
      "An anonymized reference architecture of the commerce agent — the same retrieval, caching and eval patterns, published as a public repository.",
    metric: "94.2% eval · public repo",
    metricAccent: false, // the row's single accent is the outbound link
    stack: ["Python", "ChromaDB", "FastAPI"],
    link: { label: "GitHub", href: "https://github.com/sherrybuilds-studio" },
  },
];

const mono: React.CSSProperties = {
  fontFamily: "var(--font-label)",
  fontSize: "var(--step--1)",
  letterSpacing: "0.08em",
  color: "var(--muted)",
};

export default function Work() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      style={{ paddingBlock: "clamp(6rem, 14vh, 10rem)" }}
    >
      <div className="mx-auto w-full max-w-[80rem] px-6 lg:px-10">
        <div
          className="border-t"
          style={{ borderColor: "var(--border)", paddingTop: "var(--space-4)" }}
        >
          <span className="uppercase" style={mono}>
            02 — Selected Work
          </span>
        </div>
        <h2 id="work-heading" className="sr-only">
          Selected Work
        </h2>

        <div className="mt-[var(--space-16)]">
          {CASES.map((c, i) => {
            const right = i % 2 === 1;
            return (
              <Reveal
                key={c.index}
                as="article"
                className={`border-t py-[var(--space-16)] lg:py-[var(--space-24)] ${
                  i === 0 ? "!border-t-0 !pt-0" : ""
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div
                    className={`col-span-1 lg:col-span-7 ${
                      right ? "lg:col-start-6" : "lg:col-start-1"
                    }`}
                  >
                    <span style={mono}>{c.index}</span>
                    <h3
                      className="mt-[var(--space-3)]"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--step-5)",
                        fontWeight: 480,
                        lineHeight: 1.1,
                        letterSpacing: "-0.015em",
                        textWrap: "balance",
                      }}
                    >
                      {c.title}
                    </h3>
                    <p className="mt-[var(--space-2)] uppercase" style={mono}>
                      {c.meta}
                    </p>
                    <p
                      className="mt-[var(--space-6)] max-w-[52ch]"
                      style={{
                        fontSize: "var(--step-0)",
                        lineHeight: 1.65,
                        color: "var(--muted)",
                      }}
                    >
                      {c.description}
                    </p>

                    {/* metric + stack row */}
                    <div className="mt-[var(--space-6)] flex flex-wrap items-baseline gap-x-[var(--space-8)] gap-y-[var(--space-3)]">
                      <span
                        style={{
                          ...mono,
                          color: c.metricAccent ? "var(--accent-ink)" : "var(--text)",
                        }}
                      >
                        {c.metric}
                      </span>
                      <span style={mono}>{c.stack.join(" · ")}</span>
                      {c.link && (
                        <a
                          href={c.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pf-underline"
                          style={{ ...mono, color: "var(--accent-ink)", letterSpacing: "0.08em" }}
                        >
                          {c.link.label} <span aria-hidden="true">→</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
