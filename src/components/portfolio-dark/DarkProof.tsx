"use client";

import { useRef } from "react";
import { gsap, EASE } from "@/lib/gsap";
import Reveal from "@/components/portfolio/Reveal";

type Metric = {
  value: string; // final display value, also the SSR/reduced-motion state
  suffix?: string;
  caption: string;
  accent?: boolean;
};

const METRICS: Metric[] = [
  {
    value: "94.2",
    suffix: "%",
    caption: "Mean evaluation score, production RAG",
    accent: true,
  },
  {
    value: "100",
    suffix: "%",
    caption: "Eval pass rate, reservation system",
  },
  {
    value: "38",
    suffix: "%",
    caption: "Token cost reduction (Langfuse-measured)",
  },
  {
    value: "4",
    caption: "Production AI systems, live & monitored",
  },
];

const mono: React.CSSProperties = {
  fontFamily: "var(--font-label)",
  fontSize: "var(--step--1)",
  letterSpacing: "0.08em",
  color: "var(--muted)",
};

export default function DarkProof() {
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Count-up synced to THE Reveal via its onRevealStart hook — no second
  // scroll trigger. Markup ships the final value, so reduced-motion and
  // no-JS render it instantly; the count only ever runs once per load.
  const startCount = (i: number) => {
    const el = numberRefs.current[i];
    if (!el) return;
    const target = parseFloat(METRICS[i].value);
    const decimals = METRICS[i].value.includes(".") ? 1 : 0;
    const state = { v: 0 };
    gsap.to(state, {
      v: target,
      duration: 1.4,
      ease: EASE,
      onUpdate: () => {
        el.textContent = state.v.toFixed(decimals);
      },
    });
  };

  return (
    <section
      id="proof"
      aria-labelledby="proof-heading"
      className="relative overflow-hidden"
      style={{ paddingBlock: "clamp(6rem, 14vh, 10rem)" }}
    >
      <div className="mx-auto w-full max-w-[80rem] px-6 lg:px-10">
        {/* Headline block — centered, matching the hero's rhythm */}
        <div className="relative mx-auto max-w-[56rem] text-center">
          {/* soft scrim so the statement stays crisp over the fluid */}
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
              01 — Proof
            </p>
            <h2
              id="proof-heading"
              className="mx-auto mt-[var(--space-6)] max-w-[24ch]"
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
              The difference between a demo and a system is{" "}
              <em style={{ color: "var(--accent)", fontWeight: 440 }}>measurability</em>.
            </h2>
          </Reveal>
        </div>

        {/* Figures — ONE liquid-glass panel, clean aligned 2×2 */}
        <div
          className="glass-liquid mx-auto mt-[var(--space-16)] max-w-[64rem] rounded-3xl lg:mt-[var(--space-24)]"
          style={{ padding: "clamp(2.5rem, 6vw, 4.5rem)" }}
        >
          <div className="grid grid-cols-1 items-start gap-y-[var(--space-12)] md:grid-cols-2 md:gap-x-[var(--space-16)] md:gap-y-[var(--space-16)]">
            {METRICS.map((m, i) => (
              <Reveal key={m.caption} delay={i * 0.08} onRevealStart={() => startCount(i)}>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: m.accent ? "var(--display)" : "var(--step-6)",
                    fontWeight: 460,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    color: m.accent ? "var(--accent)" : "var(--text)",
                    fontVariantNumeric: "tabular-nums", // steady width while counting
                  }}
                >
                  <span
                    ref={(el) => {
                      numberRefs.current[i] = el;
                    }}
                  >
                    {m.value}
                  </span>
                  {m.suffix && (
                    <span style={{ fontSize: "0.45em", letterSpacing: "0" }}>{m.suffix}</span>
                  )}
                </p>
                <p
                  className="mt-[var(--space-3)] uppercase"
                  style={{ ...mono, maxWidth: "30ch", lineHeight: 1.7 }}
                >
                  {m.caption}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
