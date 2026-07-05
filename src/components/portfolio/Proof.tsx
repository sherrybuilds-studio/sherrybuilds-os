import Reveal from "./Reveal";

type Metric = {
  value: string;
  suffix?: string;
  caption: string;
  accent?: boolean;
  /** Desktop grid placement + baseline offset (asymmetric, not cards) */
  className: string;
};

const METRICS: Metric[] = [
  {
    value: "94.2",
    suffix: "%",
    caption: "Mean eval score, production",
    accent: true,
    className: "lg:col-span-5 lg:col-start-1",
  },
  {
    value: "100",
    suffix: "%",
    caption: "First-run eval, reservation system",
    className: "lg:col-span-4 lg:col-start-8 lg:mt-[var(--space-24)]",
  },
  {
    value: "38",
    suffix: "%",
    caption: "Token cost reduction, measured in Langfuse",
    className: "lg:col-span-4 lg:col-start-2 lg:mt-[var(--space-16)]",
  },
  {
    value: "78",
    suffix: "/day",
    caption: "Autonomous pipeline throughput",
    className: "lg:col-span-4 lg:col-start-8 lg:mt-[var(--space-32)]",
  },
];

export default function Proof() {
  return (
    <section
      id="proof"
      aria-labelledby="proof-heading"
      className="relative"
      style={{ paddingBlock: "clamp(6rem, 14vh, 10rem)" }}
    >
      <div className="mx-auto w-full max-w-[80rem] px-6 lg:px-10">
        {/* Section rule + index label */}
        <div
          className="flex items-baseline justify-between border-t"
          style={{ borderColor: "var(--border)", paddingTop: "var(--space-4)" }}
        >
          <span
            className="uppercase"
            style={{
              fontFamily: "var(--font-label)",
              fontSize: "var(--step--1)",
              letterSpacing: "0.08em",
              color: "var(--muted)",
            }}
          >
            01 — Proof
          </span>
        </div>

        <Reveal>
          <h2
            id="proof-heading"
            className="mt-[var(--space-12)] max-w-[24ch]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--step-6)",
              fontWeight: 480,
              lineHeight: 1.08,
              letterSpacing: "-0.015em",
            }}
          >
            The difference between a demo and a system is{" "}
            <em style={{ color: "var(--accent)", fontWeight: 440 }}>measurability</em>.
          </h2>
        </Reveal>

        {/* Editorial figures — asymmetric grid, one column on mobile */}
        <div className="mt-[var(--space-16)] grid grid-cols-1 gap-y-[var(--space-16)] lg:mt-[var(--space-24)] lg:grid-cols-12 lg:gap-y-0">
          {METRICS.map((m, i) => (
            <Reveal key={m.caption} delay={i * 0.06} className={m.className}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: m.accent ? "var(--display)" : "var(--step-6)",
                  fontWeight: 460,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  color: m.accent ? "var(--accent)" : "var(--text)",
                }}
              >
                {m.value}
                {m.suffix && (
                  <span style={{ fontSize: "0.45em", letterSpacing: "0" }}>{m.suffix}</span>
                )}
              </p>
              <p
                className="mt-[var(--space-3)] uppercase"
                style={{
                  fontFamily: "var(--font-label)",
                  fontSize: "var(--step--1)",
                  letterSpacing: "0.08em",
                  color: "var(--muted)",
                  maxWidth: "26ch",
                }}
              >
                {m.caption}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
