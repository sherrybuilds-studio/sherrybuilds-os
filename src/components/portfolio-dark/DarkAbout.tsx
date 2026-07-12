import Reveal from "@/components/portfolio/Reveal";

const CURRENTLY = [
  { label: "Age", value: "22" },
  { label: "Location", value: "Berlin" },
  { label: "Focus", value: "Production LLM systems" },
  { label: "Open to", value: "Werkstudent roles" },
];

const mono: React.CSSProperties = {
  fontFamily: "var(--font-label)",
  fontSize: "var(--step--1)",
  letterSpacing: "0.08em",
  color: "var(--muted)",
};

export default function DarkAbout() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      data-chapter=""
      className="relative overflow-hidden"
      style={{ paddingBlock: "clamp(6rem, 14vh, 10rem)" }}
    >
      <div data-chapter-inner="" className="mx-auto w-full max-w-[80rem] px-6 lg:px-10">
        {/* Headline — centered, house scrim */}
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
              05 — About
            </p>
            <h2
              id="about-heading"
              className="mx-auto mt-[var(--space-6)] max-w-[20ch]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--step-6)",
                fontWeight: 480,
                lineHeight: 1.08,
                letterSpacing: "-0.015em",
                color: "var(--text)",
                textWrap: "balance",
              }}
            >
              The person behind the{" "}
              <em style={{ color: "var(--accent)", fontWeight: 440 }}>systems</em>.
            </h2>
          </Reveal>
        </div>

        {/* Bio card — glass, traveling glow, bio left / currently right,
            giant faint monogram bleeding off the top-right corner */}
        <Reveal
          className="glass glass-glow relative mx-auto mt-[var(--space-16)] max-w-[64rem] overflow-hidden rounded-3xl lg:mt-[var(--space-24)]"
        >
          {/* the one visual touch: Fraunces "S." — echoes the wordmark */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute select-none"
            style={{
              top: "-0.22em",
              right: "-0.04em",
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "clamp(10rem, 24vw, 17rem)",
              lineHeight: 1,
              color: "rgba(140, 160, 200, 0.07)",
              zIndex: 0,
            }}
          >
            S<span style={{ color: "rgba(34, 211, 238, 0.13)" }}>.</span>
          </span>
          <div
            className="relative z-[1] grid grid-cols-1 gap-[var(--space-8)] lg:grid-cols-12 lg:gap-[var(--space-12)]"
            style={{ padding: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            <div className="lg:col-span-7">
              <p
                style={{
                  fontSize: "var(--step-1)",
                  lineHeight: 1.7,
                  color: "var(--text)",
                  fontWeight: 420,
                }}
              >
                I&apos;m Shehryar, a 22-year-old AI Automation Engineer in
                Berlin. I build LLM systems for production — retrieval that
                returns the right thing, agents that run unattended, and the
                observability to keep them accountable.
              </p>
              <p
                className="mt-[var(--space-6)]"
                style={{ fontSize: "var(--step-1)", lineHeight: 1.7, color: "var(--muted)" }}
              >
                My focus is the parts that separate a demo from a real system:
                evaluation, tracing, and cost. I&apos;m currently open to
                Werkstudent roles in Berlin.
              </p>
            </div>

            {/* currently — quiet mono facts */}
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="uppercase" style={mono}>
                Currently
              </p>
              <dl className="mt-[var(--space-4)]">
                {CURRENTLY.map((c, i) => (
                  <div
                    key={c.label}
                    className={`py-[var(--space-4)] ${i > 0 ? "border-t" : ""}`}
                  >
                    <dt className="uppercase" style={{ ...mono, fontSize: "0.7rem" }}>
                      {c.label}
                    </dt>
                    <dd
                      className="mt-[var(--space-1)]"
                      style={{ fontSize: "var(--step-0)", color: "var(--text)", fontWeight: 450 }}
                    >
                      {c.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
