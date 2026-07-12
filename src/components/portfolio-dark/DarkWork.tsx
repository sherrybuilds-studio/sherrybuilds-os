"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/portfolio/Reveal";
import { gsap, ScrollTrigger, useGSAP, EASE, prefersReducedMotion } from "@/lib/gsap";

type CaseStudy = {
  index: string;
  title: string;
  meta: string;
  description: string;
  metric: string;
  metricAccent: boolean;
  stack: string[];
  demo: string; // basename under public/demos/
  link?: { label: string; href: string };
};

// Vault-approved copy (2026-07-12): defensible facts, generic names.
const CASES: CaseStudy[] = [
  {
    index: "01",
    title: "Multilingual RAG Commerce Agent",
    meta: "Client pilot · Commerce",
    description:
      "A WhatsApp sales agent on FastAPI with an HMAC-verified webhook, answering over a product catalog through RAG. A semantic cache (95% cosine, 7-day TTL + LRU) cuts repeat cost, every response is cost-traced in Langfuse, and it ships behind eval gates in CI.",
    metric: "10/10 offline eval · Langfuse-traced",
    metricAccent: true,
    stack: ["Python", "FastAPI", "ChromaDB", "Claude", "Langfuse"],
    demo: "rag-commerce-agent",
  },
  {
    index: "02",
    title: "Reservation System",
    meta: "Client pilot · Hospitality",
    description:
      "A booking agent running live under PM2 — RAG with a semantic cache and conversation memory, grounded in the actual menu so it never invents dishes. It takes reservations and runs a waitlist end to end.",
    metric: "10/10 offline eval · 0.646 avg retrieval",
    metricAccent: true,
    stack: ["Python", "FastAPI", "Supabase", "WhatsApp Cloud API"],
    demo: "reservation-system",
  },
  {
    index: "03",
    title: "Autonomous Agent Pipeline",
    meta: "Self-built · Automation",
    description:
      "A five-stage pipeline that runs itself every morning: scrape sources (Adzuna, Arbeitnow, Firecrawl), score by weighted fit, draft cover letters with Claude, dedupe in Supabase, and send a Telegram digest — on cron, with graceful degradation when a source is down.",
    metric: "Runs daily · zero human input",
    metricAccent: true,
    stack: ["Python", "Claude", "Supabase", "Firecrawl", "cron"],
    demo: "agent-pipeline",
  },
  {
    index: "04",
    title: "Platform & Shared Core",
    meta: "Solo build · Monorepo",
    description:
      "The platform underneath the pilots: a solo monorepo with a shared core — retrieval, caching, and eval gates — reused across agents, guarded by CI on every push (lint, tests, eval gates, gitleaks).",
    metric: "38% token cost reduction · ~7.7k LOC Python, solo",
    metricAccent: false, // this row's single accent is the outbound link
    stack: ["Python", "FastAPI", "ChromaDB", "GitHub Actions"],
    demo: "rag-reference",
    link: { label: "GitHub", href: "https://github.com/sherrybuilds-studio" },
  },
];

const mono: React.CSSProperties = {
  fontFamily: "var(--font-label)",
  fontSize: "var(--step--1)",
  letterSpacing: "0.08em",
  color: "var(--muted)",
};

/* ────────────────────────────────────────────────────────────────────
   DEMO FOOTAGE SWAP POINT
   Drop each recording at  public/demos/<name>.mp4  (H.264, muted-safe)
   and optionally a poster at  public/demos/<name>.jpg .
   Names expected: rag-commerce-agent, reservation-system,
   agent-pipeline, rag-reference.
   Behavior: lazy (preload=none), autoplays muted+looped only while in
   view, pauses offscreen, poster/placeholder under reduced motion or
   until footage exists. No code changes needed when files land.
   ──────────────────────────────────────────────────────────────────── */
function DemoVideo({ name, index, title }: { name: string; index: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false); // real footage loaded

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // NOTE: the <video> always renders (conditional DOM here caused an SSR
    // hydration mismatch under reduced motion) — playback alone is gated,
    // checked LIVE so an OS toggle takes effect without reload.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !prefersReducedMotion()) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className="glass relative aspect-video w-full overflow-hidden rounded-2xl"
      aria-label={`Demo preview: ${title}`}
    >
      {/* placeholder art — visible until real footage loads (or always
          under reduced motion) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex flex-col items-center justify-center gap-4"
        style={{
          background:
            "radial-gradient(80% 90% at 70% 20%, rgba(59, 130, 246, 0.16), transparent 65%), radial-gradient(70% 80% at 25% 85%, rgba(34, 211, 238, 0.10), transparent 70%), linear-gradient(160deg, #0d1322 0%, #0a0e1a 100%)",
        }}
      >
        <span
          className="glass flex h-14 w-14 items-center justify-center rounded-full"
          style={{ color: "var(--accent)" }}
        >
          <svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor" aria-hidden="true">
            <path d="M0 0 L16 9 L0 18 Z" />
          </svg>
        </span>
        <span className="uppercase" style={{ ...mono, fontSize: "0.7rem" }}>
          {index} · demo preview
        </span>
      </div>

      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover transition-opacity"
        style={{ opacity: ready ? 1 : 0, transitionDuration: "var(--dur-ui)" }}
        src={`/demos/${name}.mp4`}
        poster={`/demos/${name}.jpg`}
        muted
        loop
        playsInline
        preload="none"
        onLoadedData={() => setReady(true)}
      />
    </div>
  );
}

export default function DarkWork() {
  const scope = useRef<HTMLElement>(null);

  // Card entrances: alternate slide direction (odd from left, even from
  // right), gentle 40px + fade, then heading -> meta -> body -> metrics
  // stagger inside. Plays once per card. Reduced motion: no transforms,
  // everything simply visible.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".work-card").forEach((card, i) => {
          const items = card.querySelectorAll(".work-stagger");
          gsap.set(card, { autoAlpha: 0, x: i % 2 === 0 ? -40 : 40 });
          gsap.set(items, { autoAlpha: 0, y: 14 });
          ScrollTrigger.create({
            trigger: card,
            start: "clamp(top 80%)",
            once: true,
            onEnter: () =>
              gsap
                .timeline()
                .to(card, { autoAlpha: 1, x: 0, duration: 0.6, ease: EASE })
                .to(
                  items,
                  { autoAlpha: 1, y: 0, duration: 0.45, ease: EASE, stagger: 0.1 },
                  "-=0.35"
                ),
          });
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".work-card", ".work-stagger"], { autoAlpha: 1, x: 0, y: 0 });
      });
    },
    { scope }
  );

  return (
    <section
      id="work"
      ref={scope}
      aria-labelledby="work-heading"
      data-chapter=""
      className="relative overflow-hidden"
      style={{ paddingBlock: "clamp(6rem, 14vh, 10rem)" }}
    >
      <div data-chapter-inner="" className="mx-auto w-full max-w-[80rem] px-6 lg:px-10">
        <Reveal className="text-center">
          <p className="uppercase" style={mono}>
            02 — Selected Work
          </p>
        </Reveal>
        <h2 id="work-heading" className="sr-only">
          Selected Work
        </h2>

        <div className="mt-[var(--space-16)] flex flex-col gap-[var(--space-16)] lg:gap-[var(--space-24)]">
          {CASES.map((c, i) => {
            const flipped = i % 2 === 1;
            return (
              <article
                key={c.index}
                className="work-card glass glass-glow rounded-3xl"
                data-reveal=""
              >
                <div
                  className="grid grid-cols-1 items-center gap-[var(--space-12)] lg:grid-cols-12 lg:gap-[var(--space-12)]"
                  style={{ padding: "clamp(2rem, 6vw, 3rem)" }}
                >
                  {/* text */}
                  <div className={`lg:col-span-6 ${flipped ? "lg:order-2" : ""}`}>
                    <span style={mono}>{c.index}</span>
                    <h3
                      className="work-stagger mt-[var(--space-3)]"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--step-4)",
                        fontWeight: 480,
                        lineHeight: 1.12,
                        letterSpacing: "-0.015em",
                        color: "var(--text)",
                        textWrap: "balance",
                      }}
                    >
                      {c.title}
                    </h3>
                    <p className="work-stagger mt-[var(--space-2)] uppercase" style={mono}>
                      {c.meta}
                    </p>
                    <p
                      className="work-stagger mt-[var(--space-6)]"
                      style={{
                        fontSize: "var(--step-0)",
                        lineHeight: 1.65,
                        color: "var(--muted)",
                        maxWidth: "48ch",
                      }}
                    >
                      {c.description}
                    </p>
                    <div className="work-stagger mt-[var(--space-6)] flex flex-wrap items-baseline gap-x-[var(--space-8)] gap-y-[var(--space-3)]">
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
                          style={{ ...mono, color: "var(--accent-ink)" }}
                        >
                          {c.link.label} <span aria-hidden="true">→</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* demo video slot */}
                  <div className={`lg:col-span-6 ${flipped ? "lg:order-1" : ""}`}>
                    <DemoVideo name={c.demo} index={c.index} title={c.title} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
