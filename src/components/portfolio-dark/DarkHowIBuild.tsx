"use client";

import { useRef } from "react";
import Reveal from "@/components/portfolio/Reveal";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const STEPS = [
  {
    title: "Understand",
    description:
      "Map the real problem and what “working” means, in measurable terms.",
  },
  {
    title: "Architect",
    description:
      "Design the pipeline: retrieval, agents, data flow, failure modes.",
  },
  {
    title: "Build & evaluate",
    description:
      "Ship it with an eval suite, so quality is provable — not claimed.",
  },
  {
    title: "Observe & iterate",
    description: "Full tracing in production, tuned on real usage.",
  },
];

const mono: React.CSSProperties = {
  fontFamily: "var(--font-label)",
  fontSize: "var(--step--1)",
  letterSpacing: "0.08em",
  color: "var(--muted)",
};

export default function DarkHowIBuild() {
  const scope = useRef<HTMLElement>(null);

  // Focus-fade: opacity literally mapped to each step's distance from the
  // viewport center — 1.0 centered, dimming to 0.35 at the edges. Measured
  // per scroll frame rather than via scrub windows, which get clamped and
  // misbehave for steps near the end of the page.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const steps = gsap.utils.toArray<HTMLElement>(".hib-step");
        const update = () => {
          const mid = window.innerHeight / 2;
          for (const step of steps) {
            const r = step.getBoundingClientRect();
            const d = Math.min(1, Math.abs(r.top + r.height / 2 - mid) / mid);
            step.style.opacity = (1 - d * 0.65).toFixed(3);
          }
        };
        update();
        const st = ScrollTrigger.create({
          trigger: scope.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: update,
        });
        ScrollTrigger.addEventListener("refresh", update);
        return () => {
          ScrollTrigger.removeEventListener("refresh", update);
          st.kill();
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".hib-step", { opacity: 1 });
      });
    },
    { scope }
  );

  return (
    <section
      id="how"
      ref={scope}
      aria-labelledby="how-heading"
      data-chapter=""
      className="relative overflow-hidden"
      style={{ paddingBlock: "clamp(6rem, 14vh, 10rem)" }}
    >
      <div data-chapter-inner="" className="mx-auto w-full max-w-[80rem] px-6 lg:px-10">
        {/* Headline block — centered, scrim keeps it crisp over the fluid */}
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
              03 — How I Build
            </p>
            <h2
              id="how-heading"
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
              How I build systems that{" "}
              <em style={{ color: "var(--accent)", fontWeight: 440 }}>ship</em>.
            </h2>
          </Reveal>
        </div>

        {/* Process — vertical sequence, no cards; focus-fade carries emphasis */}
        <div className="relative mx-auto mt-[var(--space-16)] max-w-[46rem] lg:mt-[var(--space-24)]">
          {/* soft scrim column behind the steps for crispness over the fluid */}
          <div
            aria-hidden="true"
            className="absolute -z-10"
            style={{
              inset: "-8% -30%",
              background:
                "radial-gradient(ellipse 70% 62% at 50% 50%, rgba(10, 14, 26, 0.88) 0%, rgba(10, 14, 26, 0.55) 55%, transparent 80%)",
            }}
          />
          <ol className="flex flex-col gap-[var(--space-16)] lg:gap-[var(--space-24)]">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                className="hib-step grid grid-cols-[auto_1fr] items-baseline gap-x-[var(--space-6)] lg:gap-x-[var(--space-8)]"
              >
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-label)",
                    fontSize: "var(--step-3)",
                    color: "var(--accent-ink)",
                    opacity: 0.55,
                    letterSpacing: "0.04em",
                  }}
                >
                  0{i + 1}
                </span>
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--step-4)",
                      fontWeight: 480,
                      lineHeight: 1.15,
                      letterSpacing: "-0.015em",
                      color: "var(--text)",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="mt-[var(--space-3)]"
                    style={{
                      fontSize: "var(--step-0)",
                      lineHeight: 1.65,
                      color: "var(--muted)",
                      maxWidth: "52ch",
                    }}
                  >
                    {s.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
